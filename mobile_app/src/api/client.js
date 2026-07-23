import Constants from 'expo-constants';

const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.developer?.inputs?.['host-type'];
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) return `http://${ip}:5000/api`;
  }
  return 'http://192.168.1.6:5000/api';
};

const BASE_URL = getBaseUrl();

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data;
};

// API Services
export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (payload) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => apiFetch('/auth/me'),
};

export const salonApi = {
  getSalons: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/salons${query ? `?${query}` : ''}`);
  },
  getSalonById: (id) => apiFetch(`/salons/${id}`),
  getAvailableSlots: (id, date, duration) =>
    apiFetch(`/salons/${id}/slots?date=${date}&duration_minutes=${duration || 30}`),
};

export const bookingApi = {
  createBooking: (payload) =>
    apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMyBookings: () => apiFetch('/bookings/my'),
  getBookingById: (id) => apiFetch(`/bookings/${id}`),
  cancelBooking: (id) =>
    apiFetch(`/bookings/${id}/cancel`, { method: 'PATCH' }),
};

export const resaleApi = {
  getFlashListings: () => apiFetch('/resale/flash'),
  listForResale: (booking_id, listing_price) =>
    apiFetch('/resale/list', {
      method: 'POST',
      body: JSON.stringify({ booking_id, listing_price }),
    }),
  purchaseResale: (id) =>
    apiFetch(`/resale/purchase/${id}`, { method: 'POST' }),
  cancelResale: (id) =>
    apiFetch(`/resale/${id}/cancel`, { method: 'PATCH' }),
};
