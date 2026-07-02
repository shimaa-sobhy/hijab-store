export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone) {
  return /^[0-9+\s]{8,15}$/.test(phone);
}

export function isValidEgyptianPhone(phone) {
  return /^01[0-2,5]{1}[0-9]{8}$/.test(phone.replace(/\s/g, ''));
}

export function isNotEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export const EGYPTIAN_GOVERNORATES = [
  'Alexandria', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef', 'Cairo', 'Dakahlia',
  'Damietta', 'Faiyum', 'Gharbia', 'Giza', 'Ismailia', 'Kafr El Sheikh',
  'Luxor', 'Matruh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
  'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia', 'Sohag',
  'South Sinai', 'Suez',
];