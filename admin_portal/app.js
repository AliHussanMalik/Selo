const API_BASE = 'http://localhost:5000/api';

let currentUser = null;
let authToken = localStorage.getItem('selo_token') || null;
let activeSalonId = null;

// DOM Elements
const authModal = document.getElementById('authModal');
const registerSalonModal = document.getElementById('registerSalonModal');
const addServiceModal = document.getElementById('addServiceModal');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerSalonForm = document.getElementById('registerSalonForm');
const addServiceForm = document.getElementById('addServiceForm');

const userInfo = document.getElementById('userInfo');
const guestControls = document.getElementById('guestControls');
const userBadge = document.getElementById('userBadge');
const userName = document.getElementById('userName');

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  if (authToken) {
    await fetchCurrentUser();
  }
  loadSalonOwnerView();
  loadSuperAdminView();
});

// Event Listeners
function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
      
      const targetBtn = e.currentTarget;
      targetBtn.classList.add('active');
      const viewId = targetBtn.dataset.view;
      document.getElementById(viewId).classList.add('active');

      if (viewId === 'super-admin-view') {
        loadSuperAdminView();
      } else {
        loadSalonOwnerView();
      }
    });
  });

  // Modal Open/Close
  document.getElementById('openLoginBtn').addEventListener('click', () => showModal(authModal));
  document.getElementById('openRegisterSalonModalBtn').addEventListener('click', () => {
    if (!currentUser) {
      alert('Please sign in as a Salon Owner to register your store.');
      showModal(authModal);
      return;
    }
    showModal(registerSalonModal);
  });

  document.getElementById('openAddServiceModalBtn').addEventListener('click', () => {
    if (!activeSalonId) {
      alert('Please select a salon first.');
      return;
    }
    showModal(addServiceModal);
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      hideModal(modal);
    });
  });

  // Auth Tabs inside Modal
  document.getElementById('tabLogin').addEventListener('click', () => {
    document.getElementById('tabLogin').classList.add('active');
    document.getElementById('tabRegister').classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });

  document.getElementById('tabRegister').addEventListener('click', () => {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('tabLogin').classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  // Form Submissions
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  registerSalonForm.addEventListener('submit', handleRegisterSalon);
  addServiceForm.addEventListener('submit', handleAddService);

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('quickLoginAdminBtn').addEventListener('click', () => fillAndSubmitAdmin());
}

// Global Auth Quick Helper
window.fillAuth = function(email, password) {
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = password;
};

async function fillAndSubmitAdmin() {
  fillAuth('admin@selo.com', 'password123');
  showModal(authModal);
}

// API Helper
async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// User Authentication
async function fetchCurrentUser() {
  try {
    const data = await apiFetch('/auth/me');
    currentUser = data.user;
    updateUserUI();
  } catch (err) {
    console.warn('Failed to fetch user:', err.message);
    handleLogout();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('selo_token', authToken);

    updateUserUI();
    hideModal(authModal);
    
    if (currentUser.role === 'admin') {
      alert(`👑 Welcome Super Admin, ${currentUser.full_name}!`);
      document.querySelector('[data-view="super-admin-view"]').click();
      loadSuperAdminView();
    } else if (currentUser.role === 'salon_owner') {
      alert(`💈 Welcome Partner, ${currentUser.full_name}!`);
      document.querySelector('[data-view="salon-owner-view"]').click();
      loadSalonOwnerView();
    } else {
      alert(`👤 Logged in as Customer (${currentUser.full_name}).\nNote: Web portal is for Salon Owners & Admins. For client appointment bookings, please use the Selo Mobile App!`);
      document.querySelector('[data-view="salon-owner-view"]').click();
      loadSalonOwnerView();
    }
  } catch (err) {
    alert(`Login failed: ${err.message}`);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const full_name = document.getElementById('regFullName').value;
  const email = document.getElementById('regEmail').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;

  try {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name,
        email,
        phone,
        password,
        role: 'salon_owner',
      }),
    });

    authToken = data.token;
    currentUser = data.user;
    localStorage.setItem('selo_token', authToken);

    updateUserUI();
    hideModal(authModal);
    alert(`Account created successfully! Welcome ${currentUser.full_name}`);
    loadSalonOwnerView();
  } catch (err) {
    alert(`Registration failed: ${err.message}`);
  }
}

function handleLogout() {
  authToken = null;
  currentUser = null;
  activeSalonId = null;
  localStorage.removeItem('selo_token');
  
  updateUserUI();

  const detailsSection = document.getElementById('selectedSalonDetails');
  if (detailsSection) detailsSection.classList.add('hidden');

  const defaultNavBtn = document.querySelector('[data-view="salon-owner-view"]');
  if (defaultNavBtn) defaultNavBtn.click();

  alert('👋 You have logged out successfully.');
}

function updateUserUI() {
  if (currentUser) {
    userInfo.classList.remove('hidden');
    guestControls.classList.add('hidden');
    userName.textContent = currentUser.full_name;
    userBadge.textContent = currentUser.role.replace('_', ' ');
  } else {
    userInfo.classList.add('hidden');
    guestControls.classList.remove('hidden');
  }
}

// Salon Partner Portal Logic
async function loadSalonOwnerView() {
  const container = document.getElementById('ownerSalonsContainer');
  container.innerHTML = '<p class="text-muted">Loading registered salons...</p>';

  try {
    const data = await apiFetch('/salons');
    const salons = data.salons || [];

    if (salons.length === 0) {
      container.innerHTML = `
        <div class="section-card flex-1">
          <p class="text-muted">No registered salons found. Click <strong>"Register New Salon Store"</strong> above to register your beauty parlor or haircut studio.</p>
        </div>`;
      document.getElementById('selectedSalonDetails').classList.add('hidden');
      return;
    }

    container.innerHTML = salons.map((salon, idx) => `
      <div class="salon-card-item ${idx === 0 ? 'selected' : ''}" onclick="selectSalon('${salon.id}')">
        <img src="${salon.cover_image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035'}" class="salon-cover" alt="${salon.name}">
        <div class="salon-card-body">
          <h3 class="salon-card-title">${salon.name}</h3>
          <p class="salon-card-location">📍 ${salon.address}, ${salon.city}</p>
          <span class="badge ${salon.is_verified ? 'badge-success' : 'badge-warning'}">
            ${salon.is_verified ? 'Verified Partner' : 'Pending Verification'}
          </span>
        </div>
      </div>
    `).join('');

    // Auto select first salon
    if (salons.length > 0) {
      selectSalon(salons[0].id);
    }
  } catch (err) {
    console.error('Failed to fetch salons:', err.message);
    container.innerHTML = `<p class="text-danger">Failed to load salons: ${err.message}</p>`;
  }
}

async function selectSalon(salonId) {
  activeSalonId = salonId;
  document.querySelectorAll('.salon-card-item').forEach(c => c.classList.remove('selected'));
  
  try {
    const data = await apiFetch(`/salons/${salonId}`);
    const salon = data.salon;

    document.getElementById('activeSalonName').textContent = salon.name;
    document.getElementById('activeSalonAddress').textContent = `📍 ${salon.address}, ${salon.city}`;
    document.getElementById('selectedSalonDetails').classList.remove('hidden');

    const services = salon.services || [];
    const tbody = document.getElementById('servicesTableBody');

    if (services.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-muted">No services added yet. Click "Add New Service" above.</td></tr>';
    } else {
      tbody.innerHTML = services.map(s => `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge badge-success">${s.category || 'haircut'}</span></td>
          <td>⏳ ${s.duration_minutes} mins</td>
          <td><strong>PKR ${s.price}</strong></td>
          <td><span class="badge badge-success">Active</span></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    alert(`Failed to load salon details: ${err.message}`);
  }
}

async function handleRegisterSalon(e) {
  e.preventDefault();
  if (!currentUser) {
    alert('Please login as a Salon Owner to create a store.');
    showModal(authModal);
    return;
  }

  const name = document.getElementById('salonName').value;
  const city = document.getElementById('salonCity').value;
  const address = document.getElementById('salonAddress').value;
  const description = document.getElementById('salonDescription').value;
  const cover_image_url = document.getElementById('salonCoverImage').value;

  const checkedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => cb.value);

  try {
    const data = await apiFetch('/salons', {
      method: 'POST',
      body: JSON.stringify({
        name,
        city,
        address,
        description,
        cover_image_url,
        amenities: checkedAmenities,
      }),
    });

    alert(`🎉 Store "${data.salon.name}" registered successfully!`);
    hideModal(registerSalonModal);
    registerSalonForm.reset();
    loadSalonOwnerView();
  } catch (err) {
    alert(`Store registration failed: ${err.message}`);
  }
}

async function handleAddService(e) {
  e.preventDefault();
  if (!activeSalonId) return;

  const name = document.getElementById('serviceName').value;
  const category = document.getElementById('serviceCategory').value;
  const duration_minutes = parseInt(document.getElementById('serviceDuration').value, 10);
  const price = parseFloat(document.getElementById('servicePrice').value);

  try {
    await apiFetch(`/salons/${activeSalonId}/services`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        category,
        duration_minutes,
        price,
      }),
    });

    alert('✂️ Service added successfully!');
    hideModal(addServiceModal);
    addServiceForm.reset();
    selectSalon(activeSalonId);
  } catch (err) {
    alert(`Failed to add service: ${err.message}`);
  }
}

// Super Admin Console Logic
async function loadSuperAdminView() {
  if (!currentUser || currentUser.role !== 'admin') {
    document.getElementById('adminSalonsTableBody').innerHTML = '<tr><td colspan="5" class="text-muted">Requires Super Admin login. Use "Quick Auth as Super Admin" above.</td></tr>';
    document.getElementById('adminUsersTableBody').innerHTML = '<tr><td colspan="5" class="text-muted">Requires Super Admin login.</td></tr>';
    return;
  }

  try {
    // 1. Fetch Stats
    const statsData = await apiFetch('/admin/stats');
    const s = statsData.stats;
    document.getElementById('metricSalons').textContent = s.salons;
    document.getElementById('metricUsers').textContent = s.users;
    document.getElementById('metricResales').textContent = s.activeResales;
    document.getElementById('metricRevenue').textContent = `PKR ${s.totalRevenue}`;

    // 2. Fetch All Salons
    const salonsData = await apiFetch('/admin/salons');
    const salons = salonsData.salons || [];
    document.getElementById('adminSalonsTableBody').innerHTML = salons.map(salon => `
      <tr>
        <td><strong>${salon.name}</strong></td>
        <td>📍 ${salon.address}, ${salon.city}</td>
        <td>${salon.owner_email || 'N/A'}</td>
        <td>
          <span class="badge ${salon.is_verified ? 'badge-success' : 'badge-warning'}">
            ${salon.is_verified ? 'Verified' : 'Unverified'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm ${salon.is_verified ? 'btn-danger' : 'btn-success'}" onclick="toggleVerify('${salon.id}')">
            ${salon.is_verified ? 'Unverify' : 'Verify Salon'}
          </button>
        </td>
      </tr>
    `).join('');

    // 3. Fetch All Users
    const usersData = await apiFetch('/admin/users');
    const users = usersData.users || [];
    document.getElementById('adminUsersTableBody').innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.full_name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || 'N/A'}</td>
        <td><span class="badge badge-success">${u.role}</span></td>
        <td>${new Date(u.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Super Admin load error:', err.message);
  }
}

window.toggleVerify = async function(salonId) {
  try {
    const data = await apiFetch(`/admin/salons/${salonId}/verify`, { method: 'PATCH' });
    alert(data.message);
    loadSuperAdminView();
    loadSalonOwnerView();
  } catch (err) {
    alert(`Verification failed: ${err.message}`);
  }
};

// Modal Utility Helpers
function showModal(modal) {
  modal.classList.remove('hidden');
}

function hideModal(modal) {
  modal.classList.add('hidden');
}
