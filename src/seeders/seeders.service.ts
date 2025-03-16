import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pokeball } from 'src/pokeballs/entities/pokeball.entity';
import { Repository } from 'typeorm';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import axios from 'axios';
import { url } from 'inspector';

const urlPokeAPI = 'https://pokeapi.co/api/v2/'

@Injectable()
export class SeedersService {

  constructor(
    @InjectRepository(Pokeball)
    private readonly pokeballRepository: Repository<Pokeball>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>
  ){}


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

        // Buscar si la Pokébola ya existe
        const existingPokeball = await this.pokeballRepository.findOne({ where: { name: data.name } });

        if (existingPokeball) {
            // Si el catch_rate_multiplier es diferente, lo actualizamos
            if (existingPokeball.catch_rate_multiplier !== catchRateMultiplier) {
                await this.pokeballRepository.update(existingPokeball.id, { catch_rate_multiplier: catchRateMultiplier });
                console.log(`✔️ Actualizado: ${data.name} -> Nuevo multiplicador: ${catchRateMultiplier}`);
            } else {
                console.log(`✅ Sin cambios: ${data.name} ya tiene el multiplicador correcto.`);
            }
        } else {
            // Si no existe, insertamos la nueva Pokébola
            const pokeball = this.pokeballRepository.create({
                name: data.name,
                sprite: data.sprites.default,
                catch_rate_multiplier: catchRateMultiplier
            });

            await this.pokeballRepository.save(pokeball);
            console.log(`🆕 Insertado: ${data.name} -> Multiplicador: ${catchRateMultiplier}`);
        }
    }

    return { message: 'Pokébolas insertadas/actualizadas correctamente.' };
  }

  async pokemonSeeder(batchSize: number = 50) {
    const response = await axios.get(`${urlPokeAPI}pokemon?limit=100000`); // Obtener todos los Pokémon en una sola petición
    const pokemonList = response.data.results;

    console.log(`📥 Se importarán ${pokemonList.length} Pokémon en lotes de ${batchSize}...`);

    // Dividimos los Pokémon en lotes de `batchSize`
    for (let i = 0; i < pokemonList.length; i += batchSize) {
        const batch = pokemonList.slice(i, i + batchSize);

        console.log(`🔄 Procesando lote: ${i} - ${i + batchSize}...`);

        // Hacemos todas las peticiones en paralelo para el lote actual
        const batchRequests = batch.map(pokemon => axios.get(pokemon.url));
        const batchResponses = await Promise.allSettled(batchRequests);

        for (const result of batchResponses) {
            if (result.status === 'fulfilled') {
                await this.processPokemon(result.value.data);
            } else {
                console.error(`❌ Error en una petición del lote:`, result.reason);
            }
        }
    }

    console.log(`✅ ¡Importación completada!`);
    return { message: 'Todos los Pokémon fueron insertados/actualizados correctamente.' };
}

private async processPokemon(details) {
    try {
        const speciesUrl = details.species.url;
        const speciesDetails = await axios.get(speciesUrl);

        const baseExperience = details.base_experience || 50;
        const statsTotal = details.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        const isLegendary = speciesDetails.data.is_legendary;
        const isMythical = speciesDetails.data.is_mythical;

        // Definir categoría
        let category = "normal";
        if (isLegendary) category = "legendary";
        if (isMythical) category = "mythical";

        // Cálculo del precio basado en factores
        let price = (baseExperience * 0.1) + (statsTotal / 10);
        if (isLegendary || isMythical) price += 200;

        // Verificar si el Pokémon ya existe
        const existingPokemon = await this.pokemonRepository.findOne({ where: { name: details.name } });

        if (existingPokemon) {
            console.log(`✅ ${details.name} ya está en la BD, saltando...`);
            return;
        }

        const newPokemon = this.pokemonRepository.create({
            name: details.name,
            sprite: details.sprites.front_default,
            types: details.types.map(t => t.type.name),
            base_price: parseFloat(price.toFixed(2)),
            category
        });

        await this.pokemonRepository.save(newPokemon);
        console.log(`🆕 Insertado: ${details.name} -> Categoría: ${category} -> Precio: $${price.toFixed(2)} USD`);

    } catch (error) {
        console.error(`❌ Error procesando ${details.name}:`, error.message);
    }
}
}
