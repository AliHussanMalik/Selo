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

const { useSafeAreaInsets } = require('react-native-safe-area-context');

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
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          paddingBottom: bottomInset,
          paddingTop: 8,
          height: 60 + bottomInset,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🔍';
          if (route.name === 'Explore') icon = '💈';
          if (route.name === 'FlashResale') icon = '⚡';
          if (route.name === 'MyBookings') icon = '🎫';
          return <Text style={{ fontSize: 20 }}>{icon}</Text>;
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
