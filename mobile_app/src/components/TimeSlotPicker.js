const React = require('react');
const { View, Text, TouchableOpacity, ScrollView, StyleSheet } = require('react-native');

const TimeSlotPicker = ({ slots, selectedSlot, onSelectSlot }) => {
  if (!slots || slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No slots available for selected date.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>⏰ Available Time Slots</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {slots.map((slot, index) => {
          const isSelected = selectedSlot === slot.start_time;
          const isAvailable = slot.is_available;

          return (
            <TouchableOpacity
              key={index}
              disabled={!isAvailable}
              style={[
                styles.slotChip,
                !isAvailable && styles.disabledSlot,
                isSelected && styles.selectedSlot,
              ]}
              onPress={() => onSelectSlot(slot.start_time)}
            >
              <Text
                style={[
                  styles.slotText,
                  !isAvailable && styles.disabledText,
                  isSelected && styles.selectedText,
                ]}
              >
                {slot.start_time.slice(0, 5)}
              </Text>
              <Text
                style={[
                  styles.statusText,
                  !isAvailable && styles.disabledStatusText,
                  isSelected && styles.selectedStatusText,
                ]}
              >
                {isAvailable ? 'Available' : 'Booked'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 10,
  },
  slotChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 80,
  },
  selectedSlot: {
    backgroundColor: '#6366F1',
    borderColor: '#818CF8',
  },
  disabledSlot: {
    backgroundColor: '#0F172A',
    borderColor: '#1E293B',
    opacity: 0.5,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#475569',
  },
  statusText: {
    fontSize: 10,
    color: '#10B981',
    marginTop: 2,
  },
  selectedStatusText: {
    color: '#E0E7FF',
  },
  disabledStatusText: {
    color: '#EF4444',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },
});

module.exports = TimeSlotPicker;
