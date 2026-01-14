import { WeatherData } from '../types';
import { API_KEYS, API_URLS } from '../utils/constants';

export const weatherApi = {
    getWeatherByCoords: async (latitude: number, longitude: number): Promise<WeatherData> => {
        try {
            const url = `${API_URLS.WEATHER}?lat=${latitude}&lon=${longitude}&appid=${API_KEYS.WEATHER}&units=metric&lang=fr`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Erreur lors de la récupération de la météo');

            const data: WeatherData = await response.json();
            return data;
        } catch (error) {
            console.error('Erreur weatherApi:', error);
            throw error;
        }
    },
};