import { registerRootComponent } from 'expo';

import App from '../../App';


export interface Pokemon {
    name: string;
    url: string;
}
export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    stats: Array<{
        base_stat: number;
        stat: {
            name: string;
        };
    }>;
}

export interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    name: string;
}

export interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions: string;
}

export interface MealListResponse {
    meals: Array<{
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
    }>;
}
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
