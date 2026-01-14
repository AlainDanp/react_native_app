import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Pokemon } from '../types';

interface PokemonCardProps {
    pokemon: Pokemon;
    onPress: () => void;
}

export default function  PokemonCard({pokemon, onPress}:
    PokemonCardProps) {
    const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

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
      opacity: 0.75,
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
    id:{
      fontSize: 14,
        color: '#888',
        fontWeight: 600,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform : 'capitalize',
        color: '#333',
    },
});