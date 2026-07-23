const React = require('react');
const { View, Text, TouchableOpacity, StyleSheet } = require('react-native');

const BookingCard = ({ booking, onResale, onCancel }) => {
  const isResellable = booking.status === 'confirmed';

  return (
    <View style={styles.ticket}>
      <View style={styles.ticketHeader}>
        <View>
          <Text style={styles.salonName}>{booking.salon_name}</Text>
          <Text style={styles.serviceName}>{booking.service_name}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            booking.status === 'confirmed' && styles.statusConfirmed,
            booking.status === 'resold' && styles.statusResold,
            booking.status === 'cancelled' && styles.statusCancelled,
          ]}
        >
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>DATE</Text>
          <Text style={styles.value}>{booking.scheduled_date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>TIME</Text>
          <Text style={styles.value}>{booking.start_time.slice(0, 5)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>PRICE</Text>
          <Text style={styles.value}>PKR {booking.total_price}</Text>
        </View>
      </View>

      {isResellable && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.resaleBtn}
            onPress={() => onResale(booking)}
          >
            <Text style={styles.resaleBtnText}>⚡ Sell Slot on Resale</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onCancel(booking.id)}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ticket: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  salonName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  serviceName: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusResold: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
  },
  value: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  resaleBtn: {
    flex: 1,
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  resaleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});

module.exports = BookingCard;
