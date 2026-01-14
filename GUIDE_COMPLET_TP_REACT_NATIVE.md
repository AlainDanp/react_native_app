# 🚀 Guide Complet - Application Mobile React Native & Expo

## 📋 Table des Matières
1. [Introduction](#introduction)
2. [Configuration de l'Environnement](#configuration-de-lenvironnement)
3. [Création du Projet](#création-du-projet)
4. [Structure du Projet](#structure-du-projet)
5. [Installation des Dépendances](#installation-des-dépendances)
6. [Configuration des APIs](#configuration-des-apis)
7. [Développement - Module Explorateur](#développement---module-explorateur)
8. [Développement - Module Météo & Gastronomie](#développement---module-météo--gastronomie)
9. [Navigation](#navigation)
10. [Tests et Débogage](#tests-et-débogage)
11. [Fonctionnalités Bonus](#fonctionnalités-bonus)
12. [Livrables Finaux](#livrables-finaux)

---

## 1. Introduction

### 🎯 Objectif du Projet
Développer une application mobile multiplateforme avec :
- **Module 1** : Explorateur de données (API REST avec pagination)
- **Module 2** : Météo & Gastronomie (géolocalisation + suggestions)

### 📱 Technologies Utilisées
- React Native
- Expo (Managed Workflow)
- TypeScript
- React Navigation
- Expo Location
- APIs REST

---

## 2. Configuration de l'Environnement

### Prérequis
```bash
# Vérifier Node.js (version 18+)
node --version

# Installer Expo CLI globalement (optionnel)
npm install -g expo-cli
```

### Installation de l'Application Expo Go
- **iOS** : Télécharger "Expo Go" depuis l'App Store
- **Android** : Télécharger "Expo Go" depuis Google Play Store

---

## 3. Création du Projet

### Étape 1 : Initialiser le Projet
```bash
# Créer le projet avec template TypeScript
npx create-expo-app@latest MonAppMeteoExplorer --template blank-typescript

# Accéder au dossier
cd MonAppMeteoExplorer
```

### Étape 2 : Lancer le Projet
```bash
npx expo start
```
**Scanner le QR code** avec Expo Go sur votre téléphone.

---

## 4. Structure du Projet

### Architecture Complète
```
MonAppMeteoExplorer/
├── App.tsx                          # Point d'entrée
├── app.json                         # Configuration Expo
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
├── src/
│   ├── navigation/
│   │   ├── MainNavigator.tsx        # Navigation principale
│   │   └── ExplorerNavigator.tsx    # Stack pour explorateur
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Écran d'accueil
│   │   ├── Explorer/
│   │   │   ├── ExplorerListScreen.tsx    # Liste paginée
│   │   │   └── ExplorerDetailScreen.tsx  # Détails d'un élément
│   │   └── Weather/
│   │       └── WeatherRecipeScreen.tsx   # Météo + Recette
│   ├── components/
│   │   ├── PokemonCard.tsx          # Carte pour liste
│   │   ├── LoadingSpinner.tsx       # Indicateur de chargement
│   │   └── ErrorMessage.tsx         # Message d'erreur
│   ├── services/
│   │   ├── pokemonApi.ts            # Service Pokemon
│   │   ├── weatherApi.ts            # Service Météo
│   │   └── recipeApi.ts             # Service Recettes
│   ├── types/
│   │   └── index.ts                 # Types TypeScript
│   ├── utils/
│   │   └── constants.ts             # Constantes
│   └── styles/
│       └── theme.ts                 # Thème global
└── assets/
    ├── images/
    └── fonts/
```

---

## 5. Installation des Dépendances

### Commandes d'Installation
```bash
# Navigation
npx expo install @react-navigation/native
npx expo install @react-navigation/bottom-tabs
npx expo install @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# Géolocalisation
npx expo install expo-location

# Icônes
npx expo install @expo/vector-icons

# Utilitaires (optionnel)
npm install axios
```

---

## 6. Configuration des APIs

### 6.1 PokeAPI (Gratuit, sans clé)
- **URL** : https://pokeapi.co/api/v2/pokemon
- **Documentation** : https://pokeapi.co/docs/v2

### 6.2 OpenWeatherMap (Inscription requise)
1. Créer un compte sur https://openweathermap.org/api
2. Récupérer votre **API Key** gratuite
3. **URL** : `https://api.openweathermap.org/data/2.5/weather`

### 6.3 TheMealDB (Gratuit)
- **URL** : https://www.themealdb.com/api.php
- **API Key** : `1` (pour version gratuite)

### 6.4 Créer le fichier de configuration
```bash
# Créer un fichier .env (optionnel avec expo-constants)
touch .env
```

**Contenu de `.env`** :
```env
WEATHER_API_KEY=VOTRE_CLE_OPENWEATHER_ICI
```

**OU** créer un fichier `src/utils/constants.ts` :
```typescript
export const API_KEYS = {
  WEATHER: 'VOTRE_CLE_API_OPENWEATHER',
};

export const API_URLS = {
  POKEMON: 'https://pokeapi.co/api/v2/pokemon',
  WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
  MEAL: 'https://www.themealdb.com/api/json/v1/1',
};
```

---

## 7. Développement - Module Explorateur

### 7.1 Créer les Types TypeScript

**Fichier : `src/types/index.ts`**
```typescript
// Types pour Pokemon
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

// Types pour Météo
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

// Types pour Recettes
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
```

---

### 7.2 Service API Pokemon

**Fichier : `src/services/pokemonApi.ts`**
```typescript
import { Pokemon, PokemonListResponse, PokemonDetail } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const pokemonApi = {
  // Récupérer une liste de Pokemon avec pagination
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

  // Récupérer les détails d'un Pokemon
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

  // Récupérer les détails par ID
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
```

---

### 7.3 Composant Carte Pokemon

**Fichier : `src/components/PokemonCard.tsx`**
```typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
}

export default function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  // Extraire l'ID depuis l'URL
  const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.id}>#{pokemonId?.padStart(3, '0')}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  id: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#333',
  },
});
```

---

### 7.4 Écran Liste des Pokemon

**Fichier : `src/screens/Explorer/ExplorerListScreen.tsx`**
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import PokemonCard from '../../components/PokemonCard';
import { pokemonApi } from '../../services/pokemonApi';
import { Pokemon } from '../../types';

type ExplorerStackParamList = {
  ExplorerList: undefined;
  ExplorerDetail: { url: string };
};

type NavigationProp = StackNavigationProp<ExplorerStackParamList, 'ExplorerList'>;

export default function ExplorerListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  // Charger les données initiales
  useEffect(() => {
    loadPokemons();
  }, []);

  // Fonction pour charger les Pokemon
  const loadPokemons = async (isRefresh: boolean = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
        setOffset(0);
      } else {
        setLoading(true);
      }

      const currentOffset = isRefresh ? 0 : offset;
      const data = await pokemonApi.getPokemons(LIMIT, currentOffset);

      if (isRefresh) {
        setPokemons(data.results);
        setOffset(LIMIT);
      } else {
        setPokemons([...pokemons, ...data.results]);
        setOffset(currentOffset + LIMIT);
      }

      setHasMore(data.next !== null);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les Pokémon');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh manuel
  const onRefresh = useCallback(() => {
    loadPokemons(true);
  }, []);

  // Charger plus de données (infinite scroll)
  const loadMore = () => {
    if (!loading && hasMore) {
      loadPokemons();
    }
  };

  // Naviguer vers les détails
  const handlePokemonPress = (pokemon: Pokemon) => {
    navigation.navigate('ExplorerDetail', { url: pokemon.url });
  };

  // Rendu d'un item
  const renderItem = ({ item }: { item: Pokemon }) => (
    <PokemonCard 
      pokemon={item} 
      onPress={() => handlePokemonPress(item)} 
    />
  );

  // Footer avec loading
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  };

  // Liste vide
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Aucun Pokémon trouvé</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
          />
        }
        contentContainerStyle={pokemons.length === 0 && styles.emptyContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  emptyContainer: {
    flexGrow: 1,
  },
});
```

---

### 7.5 Écran Détails du Pokemon

**Fichier : `src/screens/Explorer/ExplorerDetailScreen.tsx`**
```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { pokemonApi } from '../../services/pokemonApi';
import { PokemonDetail } from '../../types';

type ExplorerStackParamList = {
  ExplorerDetail: { url: string };
};

type DetailScreenRouteProp = RouteProp<ExplorerStackParamList, 'ExplorerDetail'>;

const { width } = Dimensions.get('window');

// Couleurs par type
const TYPE_COLORS: { [key: string]: string } = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export default function ExplorerDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const { url } = route.params;
  
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokemonDetail();
  }, [url]);

  const loadPokemonDetail = async () => {
    try {
      setLoading(true);
      const data = await pokemonApi.getPokemonDetail(url);
      setPokemon(data);
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pokémon introuvable</Text>
      </View>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = TYPE_COLORS[mainType] || '#A8A878';

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec image */}
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
        <Image
          source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((typeInfo, index) => (
            <View
              key={index}
              style={[
                styles.typeBadge,
                { backgroundColor: TYPE_COLORS[typeInfo.type.name] || '#777' }
              ]}
            >
              <Text style={styles.typeText}>{typeInfo.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Informations physiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Taille</Text>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Poids</Text>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
          </View>
        </View>
      </View>

      {/* Statistiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        {pokemon.stats.map((statInfo, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statName}>
              {statInfo.stat.name.replace('-', ' ')}
            </Text>
            <View style={styles.statBarContainer}>
              <View
                style={[
                  styles.statBar,
                  { 
                    width: `${(statInfo.base_stat / 255) * 100}%`,
                    backgroundColor: backgroundColor 
                  }
                ]}
              />
            </View>
            <Text style={styles.statValue}>{statInfo.base_stat}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  id: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 120,
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
});
```

---

## 8. Développement - Module Météo & Gastronomie

### 8.1 Services API

**Fichier : `src/services/weatherApi.ts`**
```typescript
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
```

**Fichier : `src/services/recipeApi.ts`**
```typescript
import { Meal, MealListResponse } from '../types';
import { API_URLS } from '../utils/constants';

export const recipeApi = {
  // Récupérer des recettes par catégorie
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
```

---

### 8.2 Écran Météo & Recette

**Fichier : `src/screens/Weather/WeatherRecipeScreen.tsx`**
```typescript
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

            {/* Bouton YouTube si disponible */}
            {recipe.strYoutube && (
              <Pressable
                style={styles.youtubeButton}
                onPress={() => openYouTube(recipe.strYoutube)}
              >
                <Ionicons name="logo-youtube" size={24} color="white" />
                <Text style={styles.youtubeButtonText}>
                  Voir la vidéo
                </Text>
              </Pressable>
            )}
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
```

---

## 9. Navigation

### 9.1 Stack Navigator pour Explorer

**Fichier : `src/navigation/ExplorerNavigator.tsx`**
```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExplorerListScreen from '../screens/Explorer/ExplorerListScreen';
import ExplorerDetailScreen from '../screens/Explorer/ExplorerDetailScreen';

export type ExplorerStackParamList = {
  ExplorerList: undefined;
  ExplorerDetail: { url: string };
};

const Stack = createStackNavigator<ExplorerStackParamList>();

export default function ExplorerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ExplorerList"
        component={ExplorerListScreen}
        options={{ title: 'Pokédex' }}
      />
      <Stack.Screen
        name="ExplorerDetail"
        component={ExplorerDetailScreen}
        options={{ title: 'Détails' }}
      />
    </Stack.Navigator>
  );
}
```

---

### 9.2 Navigation Principale avec Tabs

**Fichier : `src/navigation/MainNavigator.tsx`**
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ExplorerNavigator from './ExplorerNavigator';
import WeatherRecipeScreen from '../screens/Weather/WeatherRecipeScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'Explorer') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Météo & Recettes') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else {
              iconName = 'help';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen
          name="Explorer"
          component={ExplorerNavigator}
          options={{
            headerShown: false,
            title: 'Pokédex',
          }}
        />
        <Tab.Screen
          name="Météo & Recettes"
          component={WeatherRecipeScreen}
          options={{
            headerStyle: {
              backgroundColor: '#FF6B6B',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

### 9.3 Fichier App.tsx

**Fichier : `App.tsx`**
```typescript
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <MainNavigator />
    </>
  );
}
```

---

## 10. Tests et Débogage

### 10.1 Lancer l'Application

```bash
# Démarrer le serveur de développement
npx expo start

# Ouvrir sur iOS Simulator (Mac uniquement)
# Appuyer sur 'i' dans le terminal

# Ouvrir sur Android Emulator
# Appuyer sur 'a' dans le terminal

# Scanner le QR code avec Expo Go
```

### 10.2 Tester les Fonctionnalités

#### Module Explorateur
- [ ] La liste des Pokemon s'affiche
- [ ] Le scroll infini fonctionne (charge plus de données)
- [ ] Le pull-to-refresh fonctionne
- [ ] Cliquer sur un Pokemon ouvre la page détail
- [ ] Les détails affichent : image, types, stats, taille, poids

#### Module Météo & Recettes
- [ ] Le bouton demande la permission de localisation
- [ ] La météo s'affiche avec la température
- [ ] Une recette adaptée est suggérée
- [ ] L'image de la recette s'affiche
- [ ] Les instructions sont visibles

### 10.3 Gestion des Erreurs à Tester

```bash
# Tester sans connexion internet
# Activer le mode avion sur votre téléphone

# Tester le refus de géolocalisation
# Refuser la permission quand demandé

# Tester avec une mauvaise clé API
# Modifier API_KEYS.WEATHER dans constants.ts
```

---

## 11. Fonctionnalités Bonus

### 11.1 Ajouter une Carte (react-native-maps)

```bash
npx expo install react-native-maps
```

**Exemple d'utilisation :**
```typescript
import MapView, { Marker } from 'react-native-maps';

// Dans votre composant
{location && (
  <MapView
    style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 16 }}
    initialRegion={{
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
  >
    <Marker
      coordinate={{
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }}
      title="Vous êtes ici"
    />
  </MapView>
)}
```

### 11.2 Partage de Recette

```typescript
import { Share } from 'react-native';

const shareRecipe = async () => {
  try {
    await Share.share({
      message: `Découvrez cette recette : ${recipe.strMeal}\n${recipe.strMealThumb}`,
      title: recipe.strMeal,
    });
  } catch (error) {
    console.error(error);
  }
};

// Ajouter un bouton
<Pressable style={styles.shareButton} onPress={shareRecipe}>
  <Ionicons name="share-social" size={24} color="white" />
  <Text style={styles.shareButtonText}>Partager</Text>
</Pressable>
```

### 11.3 Splash Screen Personnalisé

**Fichier : `app.json`**
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FF6B6B"
    }
  }
}
```

---

## 12. Livrables Finaux

### 12.1 Créer le README.md

**Fichier : `README.md`**
```markdown
# Application Mobile React Native - Météo & Pokédex

Application mobile multiplateforme développée avec React Native et Expo.

## 📱 Fonctionnalités

### Module Explorateur (Pokédex)
- Liste de tous les Pokémon avec pagination
- Vue détaillée avec statistiques complètes
- Pull-to-refresh et infinite scroll

### Module Météo & Recettes
- Géolocalisation de l'utilisateur
- Météo en temps réel
- Suggestions de recettes adaptées à la météo

## 🚀 Installation

### Prérequis
- Node.js 18+
- Expo Go installé sur votre smartphone

### Étapes

1. Cloner le projet
```bash
git clone <votre-repo>
cd MonAppMeteoExplorer
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les clés API
Créer un fichier `src/utils/constants.ts` :
```typescript
export const API_KEYS = {
  WEATHER: 'VOTRE_CLE_OPENWEATHERMAP',
};
```

4. Lancer l'application
```bash
npx expo start
```

## 🔑 APIs Utilisées

- **PokeAPI** : https://pokeapi.co (gratuit, sans clé)
- **OpenWeatherMap** : https://openweathermap.org/api (inscription gratuite)
- **TheMealDB** : https://www.themealdb.com/api.php (gratuit)

## 📸 Captures d'Écran

[Ajouter vos captures d'écran ici]

## 👨‍💻 Développeur

Votre Nom - [votre-email@example.com]

## 📄 Licence

Ce projet a été réalisé dans le cadre d'un TP académique.
```

### 12.2 Préparer le Dépôt Git

```bash
# Initialiser Git
git init

# Créer .gitignore
echo "node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.DS_Store" > .gitignore

# Premier commit
git add .
git commit -m "Initial commit - Application React Native"

# Créer un repo sur GitHub et pousser
git remote add origin <votre-url-github>
git branch -M main
git push -u origin main
```

### 12.3 Prendre des Captures d'Écran

**Sur iOS Simulator :**
- `Cmd + S` pour capturer l'écran

**Sur Android Emulator :**
- Icône de caméra dans la barre latérale

**Sur Téléphone Réel :**
- Bouton Power + Volume Bas (Android)
- Bouton Power + Home/Volume Haut (iOS)

**Écrans à capturer :**
1. Liste des Pokémon
2. Détails d'un Pokémon
3. Écran météo avec recette
4. Navigation (onglets)

---

## 13. Checklist Finale

### ✅ Fonctionnalités Obligatoires
- [ ] Application créée avec Expo + TypeScript
- [ ] Navigation par onglets fonctionnelle
- [ ] Module Explorateur :
  - [ ] Liste avec FlatList
  - [ ] Pagination (infinite scroll)
  - [ ] Vue détaillée
- [ ] Module Météo & Recettes :
  - [ ] Permission de géolocalisation
  - [ ] Récupération GPS
  - [ ] API météo
  - [ ] Suggestion de recette
- [ ] Gestion des erreurs
- [ ] Design responsive
- [ ] Code source sur Git
- [ ] README.md complet
- [ ] Captures d'écran

### 🌟 Fonctionnalités Bonus (Optionnel)
- [ ] Carte avec position
- [ ] StatusBar personnalisée
- [ ] Splash Screen
- [ ] Partage de recette
- [ ] Autres capteurs

---

## 14. Conseils et Astuces

### 🎯 Conseils de Développement

1. **Commencer Simple** : Développez d'abord le module Explorateur, puis le module Météo
2. **Tester Souvent** : Testez sur votre téléphone régulièrement
3. **Gérer les Erreurs** : Utilisez des try-catch partout
4. **Console.log** : Utilisez-le pour déboguer

### 🐛 Problèmes Courants

**Problème** : L'app ne démarre pas
**Solution** : 
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

**Problème** : Les images ne s'affichent pas
**Solution** : Vérifier les URLs et la connexion internet

**Problème** : Permission refusée (géolocalisation)
**Solution** : Aller dans Paramètres > Apps > Expo Go > Autorisations

### 📚 Ressources Utiles

- Documentation Expo : https://docs.expo.dev/
- React Navigation : https://reactnavigation.org/
- TypeScript : https://www.typescriptlang.org/
- PokeAPI : https://pokeapi.co/docs/v2

---

## 🎉 Félicitations !

Vous avez maintenant un guide complet pour développer votre application React Native !

**Prochaines étapes :**
1. Suivre ce guide étape par étape
2. Tester chaque fonctionnalité
3. Personnaliser le design
4. Ajouter des fonctionnalités bonus
5. Préparer vos livrables

**Bon courage et bon développement ! 🚀**
