
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  properties: '@gdi/properties',
  payments: '@gdi/payments',
};

export async function loadProperties() {
  const raw = await AsyncStorage.getItem(KEYS.properties);
  return raw ? JSON.parse(raw) : [];
}

export async function saveProperties(items) {
  await AsyncStorage.setItem(KEYS.properties, JSON.stringify(items));
}

export async function loadPayments() {
  const raw = await AsyncStorage.getItem(KEYS.payments);
  return raw ? JSON.parse(raw) : [];
}

export async function savePayments(items) {
  await AsyncStorage.setItem(KEYS.payments, JSON.stringify(items));
}
