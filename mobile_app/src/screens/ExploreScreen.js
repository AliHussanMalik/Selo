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
const { useSafeAreaInsets } = require('react-native-safe-area-context');
const SalonCard = require('../components/SalonCard');
const { salonApi } = require('../api/client');

const CITIES = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];
const AMENITIES = ['All', 'female_only', 'wifi', 'parking', 'ac', 'prayer_room'];

const ExploreScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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
      const params = {};
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedAmenity !== 'All') params.amenity = selectedAmenity;
      
      const response = await salonApi.getSalons(params);
      if (response && response.salons && response.salons.length > 0) {
        setSalons(response.salons);
      } else {
        throw new Error('Empty database list, fallback to preview mock');
      }
    } catch (err) {
      console.log('Backend API offline or empty, displaying preview mock:', err.message);
      const mockSalons = [
        {
          id: '1',
          name: 'Royal Cut & Styling Studio',
          address: 'Block MM Alam Road, Gulberg III',
          city: 'Lahore',
          cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'refreshments'],
        },
        {
          id: '2',
          name: 'Glamour Lounge & Spa',
          address: 'F-7 Markaz, Main Boulevard',
          city: 'Islamabad',
          cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
          is_verified: true,
          amenities: ['female_only', 'prayer_room', 'wifi', 'ac'],
        },
        {
          id: '3',
          name: 'The Gentleman Barbershop',
          address: 'Lane 4, Zamzama Boulevard, DHA Phase 5',
          city: 'Karachi',
          cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'refreshments', 'parking'],
        },
        {
          id: '4',
          name: 'En Vogue Hair & Beauty Bar',
          address: 'Shop 12, Y-Block Commercial, DHA Phase 3',
          city: 'Lahore',
          cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'female_only'],
        },
        {
          id: '5',
          name: 'Crown & Blade Barber Co.',
          address: 'Civic Center, Phase 4, Bahria Town',
          city: 'Rawalpindi',
          cover_image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'refreshments'],
        },
        {
          id: '6',
          name: 'Luxe Locks Studio',
          address: 'Block 4, Marine Promenade, Clifton',
          city: 'Karachi',
          cover_image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'female_only', 'prayer_room'],
        },
        {
          id: '7',
          name: 'Urban Fade Barber Lab',
          address: 'Main Boulevard, Allama Iqbal Town',
          city: 'Lahore',
          cover_image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'refreshments'],
        },
        {
          id: '8',
          name: 'The Velvet Room Beauty & Spa',
          address: 'Beverly Center, Blue Area',
          city: 'Islamabad',
          cover_image_url: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'female_only', 'prayer_room'],
        },
        {
          id: '9',
          name: 'Edge & Texture Hair Crafters',
          address: 'Block 2, PECHS Commercial',
          city: 'Karachi',
          cover_image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'parking'],
        },
        {
          id: '10',
          name: 'Bella Donna Salon & Lounge',
          address: 'Sector F-10/3, Street 18',
          city: 'Islamabad',
          cover_image_url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'female_only', 'kids_area'],
        },
        {
          id: '11',
          name: 'Sultan Traditional Hammam & Cuts',
          address: 'Mall Road, Saddar',
          city: 'Rawalpindi',
          cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'prayer_room', 'parking'],
        },
        {
          id: '12',
          name: 'Silk & Sheen Hair Boutique',
          address: 'Chenab Club Road, Civil Lines',
          city: 'Faisalabad',
          cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'female_only'],
        },
        {
          id: '13',
          name: 'Maverick Male Grooming Club',
          address: 'Z-Block, DHA Phase 3',
          city: 'Lahore',
          cover_image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'refreshments'],
        },
        {
          id: '14',
          name: 'Aura Aesthetics & Hair Lounge',
          address: 'Tipu Sultan Road, KDA Scheme 1',
          city: 'Karachi',
          cover_image_url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'female_only'],
        },
        {
          id: '15',
          name: 'Scissorhands Creative Barbers',
          address: 'University Road, Tahkal',
          city: 'Peshawar',
          cover_image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'refreshments'],
        },
        {
          id: '16',
          name: 'Oasis Wellness & Beauty Studio',
          address: 'Sector E-11/2, Multi Gardens',
          city: 'Islamabad',
          cover_image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'female_only', 'prayer_room'],
        },
        {
          id: '17',
          name: 'The Grand Barber & Co.',
          address: 'Bosan Road, Gulgasht Colony',
          city: 'Multan',
          cover_image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'parking', 'prayer_room'],
        },
        {
          id: '18',
          name: 'Refined Cuts & Grooming',
          address: 'Commercial Market, Satellite Town',
          city: 'Rawalpindi',
          cover_image_url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'refreshments'],
        },
        {
          id: '19',
          name: 'Mirage Bridal & Hair Studio',
          address: 'Kohinoor City, Jaranwala Road',
          city: 'Faisalabad',
          cover_image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
          is_verified: true,
          amenities: ['wifi', 'ac', 'female_only', 'kids_area'],
        },
        {
          id: '20',
          name: 'Studio Noir Elite Hair Lab',
          address: 'Khayaban-e-Seher, DHA Phase 6',
          city: 'Karachi',
          cover_image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
          is_verified: true,
          amenities: ['wifi', 'parking', 'ac', 'refreshments', 'prayer_room'],
        },
      ];
      setSalons(mockSalons);
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
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
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
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
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
