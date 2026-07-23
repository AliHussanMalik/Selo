const { useEffect } = React;
const {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} = require('react-native');
const AmenityBadge = require('../components/AmenityBadge');
const TimeSlotPicker = require('../components/TimeSlotPicker');
const { salonApi, bookingApi, authApi } = require('../api/client');

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
  const salonId = route.params?.salonId || '1';
  const [salon, setSalon] = useState(MOCK_SALON);
  const [slots, setSlots] = useState(MOCK_SLOTS);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('12:00:00');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchSalonData();
  }, [salonId]);

  const fetchSalonData = async () => {
    setLoading(true);
    try {
      const res = await salonApi.getSalonById(salonId);
      if (res && res.salon) {
        setSalon(res.salon);
        if (res.salon.services && res.salon.services.length > 0) {
          setSelectedService(res.salon.services[0]);
        }
      }
      const slotsRes = await salonApi.getAvailableSlots(salonId, today);
      if (slotsRes && slotsRes.slots && slotsRes.slots.length > 0) {
        setSlots(slotsRes.slots);
      }
    } catch (err) {
      console.log('Using preview salon fallback:', err.message);
      setSalon(MOCK_SALON);
      setSelectedService(MOCK_SALON.services[0]);
      setSlots(MOCK_SLOTS);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedTimeSlot) {
      Alert.alert('Selection Required', 'Please select a service and time slot.');
      return;
    }

    // Auth & Role check
    let currentUser = null;
    try {
      const meRes = await authApi.getMe();
      currentUser = meRes.user;
    } catch (err) {
      currentUser = null;
    }

    if (!currentUser) {
      Alert.alert(
        '🔑 Client Login Required',
        'You must sign in as a Customer to book an appointment.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In Now', onPress: () => navigation.navigate('Account') },
        ]
      );
      return;
    }

    if (currentUser.role === 'salon_owner') {
      Alert.alert(
        '🚫 Salon Owner Account',
        'Service booking is reserved for Customer accounts. Your Salon Owner account is for store & service management in the Admin Portal.',
        [
          { text: 'OK' },
          { text: 'Switch Account', onPress: () => navigation.navigate('Account') },
        ]
      );
      return;
    }

    setBookingLoading(true);
    try {
      const startMins = parseInt(selectedTimeSlot.split(':')[0], 10) * 60 + parseInt(selectedTimeSlot.split(':')[1], 10);
      const endMins = startMins + (selectedService.duration_minutes || 30);
      const formatTime = (m) => `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:00`;

      await bookingApi.createBooking({
        salon_id: salon.id,
        service_id: selectedService.id,
        scheduled_date: today,
        start_time: selectedTimeSlot.length === 5 ? `${selectedTimeSlot}:00` : selectedTimeSlot,
        end_time: formatTime(endMins),
        total_price: parseFloat(selectedService.price),
      });

      Alert.alert(
        '🎉 Booking Confirmed!',
        `Salon: ${salon.name}\nService: ${selectedService.name}\nTime: ${selectedTimeSlot.slice(0, 5)}\nTotal: PKR ${selectedService.price}`,
        [
          {
            text: 'View My Bookings',
            onPress: () => navigation.navigate('MyBookings'),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Booking Error', err.message || 'Failed to create booking in database.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Image source={{ uri: salon.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035' }} style={styles.coverImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{salon.name}</Text>
        <Text style={styles.address}>📍 {salon.address}, {salon.city}</Text>
        <Text style={styles.description}>{salon.description}</Text>

        {/* Amenities */}
        {salon.amenities && salon.amenities.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>✨ Salon Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {salon.amenities.map((a, idx) => (
                <AmenityBadge key={idx} amenity={a} />
              ))}
            </View>
          </>
        )}

        {/* Services Selection */}
        <Text style={styles.sectionTitle}>✂️ Select Service</Text>
        {salon.services && salon.services.map((service) => {
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
          slots={slots}
          selectedSlot={selectedTimeSlot}
          onSelectSlot={setSelectedTimeSlot}
        />

        {/* Confirm Booking CTA */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking} disabled={bookingLoading}>
          {bookingLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmBtnText}>
              Confirm Booking — PKR {selectedService ? selectedService.price : 0}
            </Text>
          )}
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
