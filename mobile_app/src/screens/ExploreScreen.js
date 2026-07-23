const React = require('react');
const { useState, useEffect } = React;
const {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} = require('react-native');
const SalonCard = require('../components/SalonCard');

const CITIES = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];
const AMENITIES = ['All', 'female_only', 'wifi', 'parking', 'ac', 'prayer_room'];

const ExploreScreen = ({ navigation }) => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedAmenity, setSelectedAmenity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSalons();
  }, [selectedCity, selectedAmenity]);

  const fetchSalons = async () => {
    setLoading(true);
    try {
      // Mock data fallback if backend is offline during preview
      const mockSalons = [
        {
          id: '1',
          name: 'Royal Cut & Styling Studio',
          address: 'Block MM Alam Road, Gulberg III',
          city: 'Lahore',
          cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'refreshments'],
        },
        {
          id: '2',
          name: 'Glamour Lounge & Spa',
          address: 'F-7 Markaz, Main Boulevard',
          city: 'Islamabad',
          cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f',
          is_verified: true,
          amenities: ['female_only', 'prayer_room', 'wifi', 'ac'],
        },
      ];

      setSalons(mockSalons);
    } catch (err) {
      console.error('Failed to load salons', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSalons = salons.filter((s) => {
    const matchesCity = selectedCity === 'All' || s.city === selectedCity;
    const matchesAmenity =
      selectedAmenity === 'All' || (s.amenities && s.amenities.includes(selectedAmenity));
    const matchesSearch =
      searchQuery === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesAmenity && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💈 Discover Salons</Text>
        <Text style={styles.subtitle}>Book instantly or grab flash resale slots</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search salons, services, or locations..."
        placeholderTextColor="#64748B"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* City Filters */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CITIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedCity === item && styles.activeChip,
              ]}
              onPress={() => setSelectedCity(item)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCity === item && styles.activeChipText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Salon List */}
      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredSalons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <SalonCard
              salon={item}
              onPress={() => navigation.navigate('SalonDetail', { salonId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No salons match your search filter.</Text>
            </View>
          }
        />
      )}
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
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  activeChip: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
});

module.exports = ExploreScreen;
