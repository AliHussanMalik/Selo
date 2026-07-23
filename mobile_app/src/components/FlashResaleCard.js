const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');

const FlashResaleCard = ({ resale, onBuy }) => {
  const discountPercent = Math.round(
    ((resale.original_price - resale.listing_price) / resale.original_price) * 100
  );

  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.flashBadge}>
          <Text style={styles.flashText}>⚡ FLASH RESALE</Text>
        </View>
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        )}
      </View>

      <Text style={styles.salonName}>{resale.salon_name}</Text>
      <Text style={styles.serviceName}>{resale.service_name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📅 {resale.scheduled_date}</Text>
        <Text style={styles.infoText}>⏰ {resale.start_time.slice(0, 5)}</Text>
      </View>

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.originalPrice}>PKR {resale.original_price}</Text>
          <Text style={styles.listingPrice}>PKR {resale.listing_price}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton} onPress={() => onBuy(resale)}>
          <Text style={styles.buyButtonText}>Buy Slot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1B4B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#4338CA',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flashBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  flashText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  discountBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  salonName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  serviceName: {
    fontSize: 14,
    color: '#A5B4FC',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    color: '#E0E7FF',
    fontSize: 13,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originalPrice: {
    color: '#94A3B8',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  listingPrice: {
    color: '#38BDF8',
    fontSize: 20,
    fontWeight: '800',
  },
  buyButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

module.exports = FlashResaleCard;
