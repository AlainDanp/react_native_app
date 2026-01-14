import { Meal, MealListResponse } from '../types';
import { API_URLS } from '../utils/constants';

export const recipeApi = {
    getMealsByCategory: async (category: string): Promise<MealListResponse> => {
        try {
            const url = `${API_URLS.MEAL}/filter.php?c=${category}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Erreur lors de la récupération des recettes');

            const data: MealListResponse = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur recipeApi.getMealsByCategory:', error);
            throw error;
        }
    },

    // Récupérer les détails d'une recette
    getMealDetails: async (mealId: string): Promise<Meal> => {
        try {
            const url = `${API_URLS.MEAL}/lookup.php?i=${mealId}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Erreur lors de la récupération des détails');

            const data = await response.json();
            return data.meals[0];
        } catch (error) {
            console.error('Erreur recipeApi.getMealDetails:', error);
            throw error;
        }
    },

    // Récupérer une recette aléatoire
    getRandomMeal: async (): Promise<Meal> => {
        try {
            const url = `${API_URLS.MEAL}/random.php`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Erreur lors de la récupération de la recette');

            const data = await response.json();
            return data.meals[0];
        } catch (error) {
            console.error('Erreur recipeApi.getRandomMeal:', error);
            throw error;
        }
    },
};