const React = require('react');
const { View, Text, StyleSheet } = require('react-native');

const AMENITY_LABELS = {
  wifi: { label: 'Free Wi-Fi', icon: '📶' },
  parking: { label: 'Valet Parking', icon: '🅿️' },
  ac: { label: 'Air Conditioned', icon: '❄️' },
  kids_area: { label: 'Kids Play Zone', icon: '🧸' },
  refreshments: { label: 'Complimentary Drinks', icon: '☕' },
  prayer_room: { label: 'Prayer Room', icon: '🕌' },
  female_only: { label: 'Female Only Section', icon: '🧕' },
};

const AmenityBadge = ({ amenity }) => {
  const info = AMENITY_LABELS[amenity] || { label: amenity, icon: '✨' };

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>{info.icon}</Text>
      <Text style={styles.text}>{info.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  icon: {
    fontSize: 12,
    marginRight: 5,
  },
  text: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
});

module.exports = AmenityBadge;
