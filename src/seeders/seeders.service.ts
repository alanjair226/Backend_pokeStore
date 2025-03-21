import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokeball } from 'src/pokeballs/entities/pokeball.entity';
import { Repository } from 'typeorm';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import axios from 'axios';

const urlPokeAPI = 'https://pokeapi.co/api/v2/'

@Injectable()
export class SeedersService {

  constructor(
    @InjectRepository(Pokeball)
    private readonly pokeballRepository: Repository<Pokeball>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ) {}

  async pokeballSeeder() {
    const response = await axios.get(`${urlPokeAPI}item-category/34/`);
    const items = response.data.items;

    const multipliers: { [key: string]: number } = {
        "master-ball": 20.0, "ultra-ball": 2.0, "great-ball": 1.5, "poke-ball": 1.0,
        "safari-ball": 1.5, "park-ball": 20.0, "sport-ball": 1.5, "lastrange-ball": 1.2,
        "lapoke-ball": 1.2, "lagreat-ball": 1.5, "laultra-ball": 2.0, 
        "laheavy-ball": 3.0, "laleaden-ball": 4.0, "lagigaton-ball": 5.0,
        "lafeather-ball": 2.5, "lawing-ball": 3.0, "lajet-ball": 3.5,
        "laorigin-ball": 20.0
    };

    for (const item of items) {
        const details = await axios.get(item.url);
        const data = details.data;

        const catchRateMultiplier = multipliers[data.name] || 1.0;

        // Check if the Pokéball already exists
        const existingPokeball = await this.pokeballRepository.findOne({ where: { name: data.name } });

        if (existingPokeball) {
            // If the catch_rate_multiplier is different, update it
            if (existingPokeball.catch_rate_multiplier !== catchRateMultiplier) {
                await this.pokeballRepository.update(existingPokeball.id, { catch_rate_multiplier: catchRateMultiplier });
                console.log(`✔️ Updated: ${data.name} -> New Multiplier: ${catchRateMultiplier}`);
            } else {
                console.log(`✅ No Changes: ${data.name} already has the correct multiplier.`);
            }
        } else {
            // If it doesn't exist, insert the new Pokéball
            const pokeball = this.pokeballRepository.create({
                name: data.name,
                sprite: data.sprites.default,
                catch_rate_multiplier: catchRateMultiplier
            });

            await this.pokeballRepository.save(pokeball);
            console.log(`🆕 Inserted: ${data.name} -> Multiplier: ${catchRateMultiplier}`);
        }
    }

    return { message: 'Pokeballs Inserted' };
  }

  async pokemonSeeder(batchSize: number = 10) {
    const response = await axios.get(`${urlPokeAPI}pokemon?limit=100000`); // Get all Pokemons in one request
    const pokemonList = response.data.results;

    console.log(`📥 It will import ${pokemonList.length} Pokemons in batches of ${batchSize}...`);

    // Split Pokémon into batches of `batchSize`
    for (let i = 0; i < pokemonList.length; i += batchSize) {
        const batch = pokemonList.slice(i, i + batchSize);

        console.log(`🔄 Processing Batch ${i} - ${i + batchSize}...`);

        // Make all requests in parallel for the current batch
        const batchRequests = batch.map(pokemon => axios.get(pokemon.url));
        const batchResponses = await Promise.allSettled(batchRequests);

        for (const result of batchResponses) {
            if (result.status === 'fulfilled') {
                await this.processPokemon(result.value.data);
            } else {
                console.error(`❌ Error batch request`, result.reason);
            }
        }
    }

    console.log(`✅ Import Completed!`);
    return { message: 'Pokemons Inserted / Updated' };
  }

  private async processPokemon(details) {
    try {
        const speciesUrl = details.species.url;
        const speciesDetails = await axios.get(speciesUrl);

        const baseExperience = details.base_experience || 50;
        const statsTotal = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const isLegendary = speciesDetails.data.is_legendary;
        const isMythical = speciesDetails.data.is_mythical;

        // Define Category
        let category = "normal";
        if (isLegendary) category = "legendary";
        if (isMythical) category = "mythical";

        // Price Calculation
        let price = (baseExperience * 0.1) + (statsTotal / 10);

        // Adjust price for Legendary and Mythical Pokémon
        if (isLegendary) {
            price += 100;  // Slightly higher increase for Legendary Pokémon
        }
        if (isMythical) {
            price += 200;  // Higher increase for Mythical Pokémon
        }

        // Adjust price for normal Pokémon
        if (category === "normal") {
            price -= 20;  // Decrease $20 for normal Pokémon
            price = Math.max(price, 10);  // Ensure the price doesn't go below $10
        }

        // Cap the maximum price increase for legendary/mythical Pokémon
        if (isLegendary || isMythical) price = Math.min(price, 500); // Limit maximum price for legendary/mythical Pokémon to $500

        // Verify Pokémon
        const existingPokemon = await this.pokemonRepository.findOne({ where: { name: details.name } });

        if (existingPokemon) {
            // Check if the price is different and update if necessary
            if (existingPokemon.base_price !== price) {
                await this.pokemonRepository.update(existingPokemon.id, { base_price: parseFloat(price.toFixed(2)) });
                console.log(`✔️ Updated: ${details.name} -> New Price: $${price.toFixed(2)} USD`);
            } else {
                console.log(`✅ No Changes: ${details.name} already has the correct price.`);
            }
            return;
        }

        // If the Pokémon doesn't exist, insert it as new
        const newPokemon = this.pokemonRepository.create({
            name: details.name,
            sprite: details.sprites.front_default,
            types: details.types.map(t => t.type.name),
            base_price: parseFloat(price.toFixed(2)),
            category
        });

        await this.pokemonRepository.save(newPokemon);
        console.log(`🆕 Inserted: ${details.name} -> Category: ${category} -> Price: $${price.toFixed(2)} USD`);

    } catch (error) {
        console.error(`❌ Error processing ${details.name}:`, error.message);
    }
}


}
