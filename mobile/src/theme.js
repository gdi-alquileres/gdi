
export const colors = {
  primary: '#66776D',
  primaryDark: '#4E5E55',
  background: '#F4F5F3',
  card: '#FFFFFF',
  text: '#222B27',
  muted: '#6B746F',
  border: '#D9DEDA',
  success: '#2E7D32',
  warning: '#A86800',
  danger: '#B3261E',
};

export const money = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
