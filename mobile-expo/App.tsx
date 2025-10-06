import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Database from './src/database/database';
import { syncService } from './src/services/syncService';

// Import global CSS for NativeWind
import './global.css';

export default function App() {
  // Initialize database and sync service for offline support
  React.useEffect(() => {
    const initializeApp = async () => {
      await Database.init();
      await syncService.init();
      console.log('🚀 App initialized with offline support');
    };
    
    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <StatusBar style="dark" backgroundColor="#ffffff" />
            <AppNavigator />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
