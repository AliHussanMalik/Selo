const React = require('react');
const { NavigationContainer } = require('@react-navigation/native');
const { StatusBar } = require('expo-status-bar');
const AppNavigator = require('./src/navigation/AppNavigator');

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
