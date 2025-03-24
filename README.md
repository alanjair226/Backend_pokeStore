# Pokémon E-commerce Backend

## Description
This is the backend for the Pokémon e-commerce application built using **NestJS**. It provides functionality for user registration, login, managing shopping carts, and processing orders. The backend is integrated with **PokéAPI** to fetch Pokémon data and allows users to purchase Pokémon with different types of Pokéballs. The application uses **JWT** for authentication and **PostgreSQL** for data storage.

## Technologies Used
- **Backend Framework:**
  - NestJS
  - TypeORM (with PostgreSQL)
  - JWT (for authentication)
  - Axios (for making HTTP requests to the PokéAPI)
  - Bcryptjs (for password hashing)
- **Database:**
  - PostgreSQL
- **Other Tools:**
  - dotenv (for managing environment variables)

## Installation and Setup

### 1. Clone the repository:
```bash
git clone https://github.com/alanjair226/Backend_pokeStore.git
cd Backend_pokeStore
```
### 2. Install dependencies:
```bash
yarn install
```
### 3. Create .env file:
```env
JWT_SECRET=""
DB_HOST=""
DB_NAME=""
DB_USER=""
DB_PASS=""
```
### 4. Set up the database with Docker:
```bash
cd PikaStoreDB
docker compose up -d
```

### 5. Run the seeders:

#### 1. Register a new user:
To register a user, send a POST request to localhost:3000/api/v1/auth/register with the following example
```json
{
  "username": "Monserrat",
  "email": "monse@monse.com",
  "password": "123456"
}
```
#### 2. Login:
To log in as the user, send a POST request to localhost:3000/api/v1/auth/login with the following body:
```json
{
  "email": "monse@monse.com",
  "password": "123456"
}
```

#### 3. Execute the seeders:
After logging, use the POST requests to populate the database with data. Use the token from the login response for authentication.

Pokéballs Seeder: Send a POST request to localhost:3000/api/v1/seeders/pokeballs.

Pokémon Seeder: Send a POST request to localhost:3000/api/v1/seeders/pokemons.
