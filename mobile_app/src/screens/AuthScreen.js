const React = require('react');
const { useState, useEffect } = React;
const {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} = require('react-native');
const { useSafeAreaInsets } = require('react-native-safe-area-context');
const { authApi, setAuthToken } = require('../api/client');

const AuthScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login(email, password);
        setAuthToken(res.token);
        setUser(res.user);
        Alert.alert('🎉 Welcome Back!', `Logged in as ${res.user.full_name} (${res.user.role})`);
      } else {
        if (!fullName) {
          Alert.alert('Error', 'Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await authApi.register({
          full_name: fullName,
          email,
          phone,
          password,
          role,
        });
        setAuthToken(res.token);
        setUser(res.user);
        Alert.alert('🎉 Welcome to Selo!', `Account created for ${res.user.full_name}`);
      }
    } catch (err) {
      Alert.alert('Authentication Failed', err.message || 'Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          setAuthToken(null);
          setUser(null);
          setEmail('');
          setPassword('');
          Alert.alert('Logged Out', 'Your session has ended.');
        },
      },
    ]);
  };

  const setPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  if (user) {
    return (
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>👤 Account Profile</Text>
          <Text style={styles.subtitle}>Active session details</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.full_name ? user.full_name[0] : 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user.role.replace('_', ' ').toUpperCase()}</Text>
          </View>

          {user.phone && <Text style={styles.userPhone}>📱 {user.phone}</Text>}

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 20) + 10, paddingBottom: insets.bottom + 100 }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>💈 Sign In & Register</Text>
        <Text style={styles.subtitle}>Access your appointments, tickets, or manage salon store</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isLogin && styles.activeTab]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isLogin && styles.activeTab]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.formCard}>
        {!isLogin && (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sara Khan"
              placeholderTextColor="#64748B"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+923001234567"
              placeholderTextColor="#64748B"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Account Role</Text>
            <View style={styles.rolePickerRow}>
              <TouchableOpacity
                style={[styles.roleChip, role === 'customer' && styles.activeRoleChip]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleChipText, role === 'customer' && styles.activeRoleChipText]}>
                  Client / Customer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleChip, role === 'salon_owner' && styles.activeRoleChip]}
                onPress={() => setRole('salon_owner')}
              >
                <Text style={[styles.roleChipText, role === 'salon_owner' && styles.activeRoleChipText]}>
                  Salon Owner
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor="#64748B"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#64748B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Quick Demo Credentials */}
        <View style={styles.presetSection}>
          <Text style={styles.presetHeader}>Quick Demo Login Presets:</Text>
          <View style={styles.presetButtonsRow}>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('sara@selo.com', 'password123')}>
              <Text style={styles.presetText}>Customer (Sara)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('owner@selo.com', 'password123')}>
              <Text style={styles.presetText}>Salon Owner (Tariq)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.presetChip} onPress={() => setPreset('admin@selo.com', 'password123')}>
              <Text style={styles.presetText}>Super Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
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
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 14,
  },
  rolePickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  roleChip: {
    flex: 1,
    backgroundColor: '#090D16',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  activeRoleChip: {
    backgroundColor: '#1E1B4B',
    borderColor: '#6366F1',
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeRoleChipText: {
    color: '#A5B4FC',
  },
  presetSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  presetHeader: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presetText: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginTop: 10,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  userEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    marginTop: 10,
  },
  roleBadgeText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

module.exports = AuthScreen;
