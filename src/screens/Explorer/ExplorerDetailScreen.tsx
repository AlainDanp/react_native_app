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