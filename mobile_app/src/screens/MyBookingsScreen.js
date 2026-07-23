const React = require('react');
const { useState } = React;
const {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} = require('react-native');
const BookingCard = require('../components/BookingCard');

const MOCK_BOOKINGS = [
  {
    id: 'b101',
    salon_name: 'Royal Cut & Styling Studio',
    service_name: 'Signature Haircut & Beard Sculpting',
    scheduled_date: '2026-07-28',
    start_time: '15:30:00',
    total_price: 2500,
    status: 'confirmed',
  },
  {
    id: 'b102',
    salon_name: 'Glamour Lounge & Spa',
    service_name: 'Charcoal Facial Treatment',
    scheduled_date: '2026-07-20',
    start_time: '12:00:00',
    total_price: 4500,
    status: 'completed',
  },
];

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const handleResale = (booking) => {
    Alert.prompt(
      '⚡ List Slot on Resale',
      `Original Price: PKR ${booking.total_price}\nEnter your listing price (PKR):`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'List for Sale',
          onPress: (price) => {
            Alert.alert(
              '🎉 Listed on Flash Marketplace!',
              `Your ${booking.service_name} slot is now live for sale at PKR ${price || booking.total_price}.`
            );
          },
        },
      ],
      'plain-text',
      `${Math.round(booking.total_price * 0.8)}`
    );
  };

  const handleCancel = (bookingId) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
          );
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎫 My Bookings & Tickets</Text>
        <Text style={styles.subtitle}>Manage active appointments or list slots for resale</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onResale={handleResale}
            onCancel={handleCancel}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no active or past bookings.</Text>
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

module.exports = MyBookingsScreen;
