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