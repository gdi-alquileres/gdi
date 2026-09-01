
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = '@gdi/token';

export async function saveToken(token) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) {
    const msg = data?.detail || data?.message || 'Error de conexión';
    throw new Error(msg);
  }
  return data;
}

export async function registerUser({ name, email, password }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  await saveToken(data.access_token);
  return data;
}

export async function loginUser({ email, password }) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await saveToken(data.access_token);
  return data;
}

export async function getMe() {
  return request('/me');
}

export async function logoutUser() {
  await saveToken(null);
}

export async function listProperties() {
  return request('/properties');
}

export async function createProperty(payload) {
  return request('/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function listTenants() {
  return request('/tenants');
}

export async function createTenant(payload) {
  return request('/tenants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createLease(payload) {
  return request('/leases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getAccountStatement(leaseId) {
  return request(`/leases/${leaseId}/account-statement`);
}

export async function registerManualPayment(payload) {
  return request('/payments/manual', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createMercadoPagoOrder(payload) {
  return request('/payments/mercadopago/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


export async function listGuarantors() {
  return request('/guarantors');
}

export async function createGuarantor(payload) {
  return request('/guarantors', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
