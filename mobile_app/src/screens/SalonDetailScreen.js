const React = require('react');
const { useState } = React;
const {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} = require('react-native');
const AmenityBadge = require('../components/AmenityBadge');
const TimeSlotPicker = require('../components/TimeSlotPicker');

const MOCK_SALON = {
  id: '1',
  name: 'Royal Cut & Styling Studio',
  description: 'Premium luxury grooming and hair salon in the heart of Gulberg, Lahore.',
  address: 'Block MM Alam Road, Gulberg III',
  city: 'Lahore',
  cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
  is_verified: true,
  amenities: ['wifi', 'parking', 'ac', 'refreshments'],
  services: [
    { id: 's1', name: 'Signature Haircut & Beard Sculpting', duration_minutes: 45, price: 2500 },
    { id: 's2', name: 'Charcoal Facial Treatment', duration_minutes: 60, price: 4500 },
    { id: 's3', name: 'Hair Color & Highlights', duration_minutes: 90, price: 8000 },
  ],
};

const MOCK_SLOTS = [
  { start_time: '10:00:00', end_time: '10:45:00', is_available: true },
  { start_time: '11:00:00', end_time: '11:45:00', is_available: false },
  { start_time: '12:00:00', end_time: '12:45:00', is_available: true },
  { start_time: '14:00:00', end_time: '14:45:00', is_available: true },
  { start_time: '15:00:00', end_time: '15:45:00', is_available: false },
  { start_time: '16:00:00', end_time: '16:45:00', is_available: true },
];

const SalonDetailScreen = ({ route, navigation }) => {
  const [selectedService, setSelectedService] = useState(MOCK_SALON.services[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('12:00:00');

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedTimeSlot) {
      Alert.alert('Selection Required', 'Please select a service and time slot.');
      return;
    }

    Alert.alert(
      '🎉 Booking Confirmed!',
      `Salon: ${MOCK_SALON.name}\nService: ${selectedService.name}\nTime: ${selectedTimeSlot.slice(0, 5)}\nTotal: PKR ${selectedService.price}`,
      [
        {
          text: 'View My Bookings',
          onPress: () => navigation.navigate('MyBookings'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image source={{ uri: MOCK_SALON.cover_image_url }} style={styles.coverImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{MOCK_SALON.name}</Text>
        <Text style={styles.address}>📍 {MOCK_SALON.address}, {MOCK_SALON.city}</Text>
        <Text style={styles.description}>{MOCK_SALON.description}</Text>

        {/* Amenities */}
        <Text style={styles.sectionTitle}>✨ Salon Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {MOCK_SALON.amenities.map((a, idx) => (
            <AmenityBadge key={idx} amenity={a} />
          ))}
        </View>

        {/* Services Selection */}
        <Text style={styles.sectionTitle}>✂️ Select Service</Text>
        {MOCK_SALON.services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected && styles.selectedServiceCard]}
              onPress={() => setSelectedService(service)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.serviceName, isSelected && styles.selectedServiceText]}>
                  {service.name}
                </Text>
                <Text style={styles.serviceMeta}>⏳ {service.duration_minutes} mins</Text>
              </View>
              <Text style={styles.servicePrice}>PKR {service.price}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Time Slot Picker */}
        <TimeSlotPicker
          slots={MOCK_SLOTS}
          selectedSlot={selectedTimeSlot}
          onSelectSlot={setSelectedTimeSlot}
        />

        {/* Confirm Booking CTA */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
          <Text style={styles.confirmBtnText}>
            Confirm Booking — PKR {selectedService ? selectedService.price : 0}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  coverImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#1E293B',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  address: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#CBD5E1',
    marginVertical: 12,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 16,
    marginBottom: 10,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceCard: {
    backgroundColor: '#0F172A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  selectedServiceCard: {
    backgroundColor: '#1E1B4B',
    borderColor: '#6366F1',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  selectedServiceText: {
    color: '#A5B4FC',
  },
  serviceMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38BDF8',
  },
  confirmBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

module.exports = SalonDetailScreen;
