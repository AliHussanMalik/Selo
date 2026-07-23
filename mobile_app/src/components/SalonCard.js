const React = require('react');
const { View, Text, Image, TouchableOpacity, StyleSheet } = require('react-native');
const AmenityBadge = require('./AmenityBadge');

const SalonCard = ({ salon, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <Image
        source={{
          uri:
            salon.cover_image_url ||
            'https://images.unsplash.com/photo-1560066984-138dadb4c035',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{salon.name}</Text>
          {salon.is_verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.address}>
          📍 {salon.address}, {salon.city}
        </Text>

        {salon.amenities && salon.amenities.length > 0 && (
          <View style={styles.amenitiesRow}>
            {salon.amenities.slice(0, 3).map((amenity, idx) => (
              <AmenityBadge key={idx} amenity={amenity} />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#1E293B',
  },
  content: {
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  address: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 10,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

module.exports = SalonCard;
