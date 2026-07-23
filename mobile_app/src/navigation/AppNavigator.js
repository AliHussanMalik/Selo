const React = require('react');
const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
const { createNativeStackNavigator } = require('@react-navigation/native-stack');
const { Text } = require('react-native');

const ExploreScreen = require('../screens/ExploreScreen');
const SalonDetailScreen = require('../screens/SalonDetailScreen');
const ResaleMarketplaceScreen = require('../screens/ResaleMarketplaceScreen');
const MyBookingsScreen = require('../screens/MyBookingsScreen');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ExploreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#090D16' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SalonDetail"
        component={SalonDetailScreen}
        options={{ title: 'Salon Profile' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ focused }) => {
          let icon = '🔍';
          if (route.name === 'Explore') icon = '💈';
          if (route.name === 'FlashResale') icon = '⚡';
          if (route.name === 'MyBookings') icon = '🎫';
          return <Text style={{ fontSize: 18 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreStack} options={{ title: 'Explore' }} />
      <Tab.Screen name="FlashResale" component={ResaleMarketplaceScreen} options={{ title: 'Flash Resale' }} />
      <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'My Tickets' }} />
    </Tab.Navigator>
  );
};

module.exports = AppNavigator;
