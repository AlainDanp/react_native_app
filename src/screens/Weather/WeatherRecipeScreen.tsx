import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    Image,
    Alert,
    Pressable,
    Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { weatherApi } from '../../services/weatherApi';
import { recipeApi } from '../../services/recipeApi';
import { WeatherData, Meal } from '../../types';

export default function WeatherRecipeScreen() {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [recipe, setRecipe] = useState<Meal | null>(null);

    // Fonction principale
    const handleGetSuggestion = async () => {
        setLoading(true);
        setWeather(null);
        setRecipe(null);

        try {
            // 1. Demander la permission de géolocalisation
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permission refusée',
                    'L\'accès à la localisation est nécessaire pour obtenir la météo.'
                );
                setLoading(false);
                return;
            }

            // 2. Récupérer la position actuelle
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setLocation(currentLocation);

            // 3. Récupérer la météo
            const weatherData = await weatherApi.getWeatherByCoords(
                currentLocation.coords.latitude,
                currentLocation.coords.longitude
            );
            setWeather(weatherData);

            // 4. Déterminer la catégorie de recette selon la météo
            const temp = weatherData.main.temp;
            let category = '';

            if (temp < 10) {
                category = 'Soup'; // Très froid -> Soupe
            } else if (temp < 20) {
                category = 'Beef'; // Froid -> Plat chaud
            } else if (temp < 25) {
                category = 'Chicken'; // Doux -> Plat normal
            } else if (temp < 30) {
                category = 'Seafood'; // Chaud -> Fruits de mer
            } else {
                category = 'Dessert'; // Très chaud -> Dessert frais
            }

            // 5. Récupérer les recettes de la catégorie
            const mealsData = await recipeApi.getMealsByCategory(category);

            if (!mealsData.meals || mealsData.meals.length === 0) {
                throw new Error('Aucune recette trouvée pour cette catégorie');
            }

            // 6. Sélectionner une recette aléatoire
            const randomIndex = Math.floor(Math.random() * mealsData.meals.length);
            const selectedMeal = mealsData.meals[randomIndex];

            // 7. Récupérer les détails complets de la recette
            const mealDetails = await recipeApi.getMealDetails(selectedMeal.idMeal);
            setRecipe(mealDetails);

        } catch (error) {
            console.error('Erreur:', error);
            Alert.alert(
                'Erreur',
                'Impossible de récupérer les données. Vérifiez votre connexion internet.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Ouvrir un lien YouTube
    const openYouTube = (url: string) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Bouton principal */}
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={handleGetSuggestion}
                    disabled={loading}
                >
                    <Ionicons name="restaurant" size={24} color="white" />
                    <Text style={styles.buttonText}>
                        {loading ? 'Chargement...' : 'Obtenir une suggestion'}
                    </Text>
                </Pressable>

                {/* Indicateur de chargement */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF6B6B" />
                        <Text style={styles.loadingText}>
                            Recherche en cours...
                        </Text>
                    </View>
                )}

                {/* Carte Météo */}
                {weather && !loading && (
                    <View style={styles.weatherCard}>
                        <View style={styles.weatherHeader}>
                            <Ionicons name="location" size={20} color="#666" />
                            <Text style={styles.weatherLocation}>{weather.name}</Text>
                        </View>

                        <View style={styles.weatherMain}>
                            <Text style={styles.weatherTemp}>
                                {Math.round(weather.main.temp)}°C
                            </Text>
                            <Image
                                source={{
                                    uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
                                }}
                                style={styles.weatherIcon}
                            />
                        </View>

                        <Text style={styles.weatherDescription}>
                            {weather.weather[0].description}
                        </Text>

                        <View style={styles.weatherDetails}>
                            <View style={styles.weatherDetailItem}>
                                <Ionicons name="thermometer" size={20} color="#666" />
                                <Text style={styles.weatherDetailText}>
                                    Ressenti: {Math.round(weather.main.feels_like)}°C
                                </Text>
                            </View>
                            <View style={styles.weatherDetailItem}>
                                <Ionicons name="water" size={20} color="#666" />
                                <Text style={styles.weatherDetailText}>
                                    Humidité: {weather.main.humidity}%
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Carte Recette */}
                {recipe && !loading && (
                    <View style={styles.recipeCard}>
                        <Text style={styles.recipeTitle}>Recette suggérée</Text>

                        <Image
                            source={{ uri: recipe.strMealThumb }}
                            style={styles.recipeImage}
                        />

                        <Text style={styles.recipeName}>{recipe.strMeal}</Text>

                        <View style={styles.recipeTags}>
                            <View style={styles.tag}>
                                <Ionicons name="flag" size={16} color="#FF6B6B" />
                                <Text style={styles.tagText}>{recipe.strArea}</Text>
                            </View>
                            <View style={styles.tag}>
                                <Ionicons name="list" size={16} color="#FF6B6B" />
                                <Text style={styles.tagText}>{recipe.strCategory}</Text>
                            </View>
                        </View>

                        <View style={styles.recipeSection}>
                            <Text style={styles.recipeSectionTitle}>Instructions</Text>
                            <Text style={styles.recipeInstructions}>
                                {recipe.strInstructions}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    button: {
        backgroundColor: '#FF6B6B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        gap: 10,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    weatherCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    weatherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    weatherLocation: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    weatherMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    weatherTemp: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
    weatherDescription: {
        fontSize: 18,
        textAlign: 'center',
        textTransform: 'capitalize',
        color: '#666',
        marginBottom: 16,
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    weatherDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    weatherDetailText: {
        fontSize: 14,
        color: '#666',
    },
    recipeCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    recipeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    recipeImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 16,
    },
    recipeName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    recipeTags: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFE5E5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        color: '#FF6B6B',
        fontWeight: '600',
    },
    recipeSection: {
        marginTop: 16,
    },
    recipeSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    recipeInstructions: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
    },
    youtubeButton: {
        backgroundColor: '#FF0000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
    },
    youtubeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});