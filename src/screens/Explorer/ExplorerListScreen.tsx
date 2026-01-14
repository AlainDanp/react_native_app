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

    useEffect(() => {
        loadPokemons();
    }, []);

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

    const onRefresh = useCallback(() => {
        loadPokemons(true);
    }, []);

    const loadMore = () => {
        if (!loading && hasMore) {
            loadPokemons();
        }
    };

    const handlePokemonPress = (pokemon: Pokemon) => {
        navigation.navigate('ExplorerDetail', { url: pokemon.url });
    };

    const renderItem = ({ item }: { item: Pokemon }) => (
        <PokemonCard
            pokemon={item}
            onPress={() => handlePokemonPress(item)}
        />
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    };

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