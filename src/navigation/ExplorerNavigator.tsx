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