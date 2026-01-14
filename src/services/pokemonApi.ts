import {Pokemon, PokemonListResponse, PokemonDetail} from "../types";

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const pokemonApi = {
    getPokemons: async (limit: number = 20, offset: number = 0): Promise<PokemonListResponse> => {
        try {
            const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des Pokémon');
            const data: PokemonListResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur pokemonApi.getPokemons:', error);
            throw error;
        }
    },
    getPokemonDetail: async (url: string): Promise<PokemonDetail> => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
            const data: PokemonDetail = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur pokemonApi.getPokemonDetail:', error);
            throw error;
        }
    },
    getPokemonById: async (id: number): Promise<PokemonDetail> => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Erreur lors de la récupération du Pokémon');
            const data: PokemonDetail = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur pokemonApi.getPokemonById:', error);
            throw error;
        }
    },
};
