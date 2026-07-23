const React = require('react');
const { useState } = React;
const {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} = require('react-native');
const FlashResaleCard = require('../components/FlashResaleCard');

const MOCK_RESALES = [
  {
    id: 'res1',
    booking_id: 'b1',
    salon_name: 'Royal Cut & Styling Studio',
    service_name: 'Signature Haircut & Beard Sculpting',
    scheduled_date: '2026-07-25',
    start_time: '14:00:00',
    end_time: '14:45:00',
    original_price: 2500,
    listing_price: 1800,
    seller_name: 'Sara Khan',
    expires_at: '2026-07-25T14:00:00Z',
  },
  {
    id: 'res2',
    booking_id: 'b2',
    salon_name: 'Glamour Lounge & Spa',
    service_name: 'Bridal Spa & Glow Polish',
    scheduled_date: '2026-07-26',
    start_time: '11:00:00',
    end_time: '12:30:00',
    original_price: 12000,
    listing_price: 9500,
    seller_name: 'Ayesha Omer',
    expires_at: '2026-07-26T11:00:00Z',
  },
];

const ResaleMarketplaceScreen = ({ navigation }) => {
  const [resales, setResales] = useState(MOCK_RESALES);

  const handleBuySlot = (resale) => {
    Alert.alert(
      '⚡ Confirm Slot Transfer',
      `Buy appointment at ${resale.salon_name} for PKR ${resale.listing_price}?\n(Original: PKR ${resale.original_price})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy & Claim Ticket',
          onPress: () => {
            setResales((prev) => prev.filter((r) => r.id !== resale.id));
            Alert.alert('🎉 Ticket Transferred!', 'This appointment is now in your active bookings.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Flash Resale Marketplace</Text>
        <Text style={styles.subtitle}>
          Snag discounted last-minute appointment slots directly from other users.
        </Text>
      </View>

      <FlatList
        data={resales}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FlashResaleCard resale={item} onBuy={handleBuySlot} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No flash resale slots available right now.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
});

module.exports = ResaleMarketplaceScreen;
