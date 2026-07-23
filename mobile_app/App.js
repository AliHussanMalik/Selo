const React = require('react');
const { NavigationContainer } = require('@react-navigation/native');
const { SafeAreaProvider } = require('react-native-safe-area-context');
const { StatusBar } = require('expo-status-bar');
const AppNavigator = require('./src/navigation/AppNavigator');

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
