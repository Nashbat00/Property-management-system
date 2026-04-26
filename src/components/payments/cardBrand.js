// Detect the card brand from the (partial) PAN.
// Patterns sourced from the official BIN ranges published by each network.
const PATTERNS = [
  { brand: 'visa', regex: /^4/ },
  { brand: 'mastercard', regex: /^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/ },
  { brand: 'amex', regex: /^3[47]/ },
  { brand: 'discover', regex: /^(6011|65|64[4-9]|622)/ },
  { brand: 'jcb', regex: /^35(2[89]|[3-8])/ },
  { brand: 'diners', regex: /^(36|30[0-5]|3095|38|39)/ },
];

export const BRAND_LENGTHS = {
  visa: 16,
  mastercard: 16,
  amex: 15,
  discover: 16,
  jcb: 16,
  diners: 14,
};

export const BRAND_CVC_LENGTH = {
  visa: 3,
  mastercard: 3,
  amex: 4,
  discover: 3,
  jcb: 3,
  diners: 3,
};

export function detectBrand(cardNumber) {
  const digits = (cardNumber || '').replace(/\D/g, '');
  if (!digits) return null;
  for (const { brand, regex } of PATTERNS) {
    if (regex.test(digits)) return brand;
  }
  return null;
}

export function formatCardNumber(input, brand) {
  const digits = (input || '').replace(/\D/g, '');
  const max = BRAND_LENGTHS[brand] || 19;
  const trimmed = digits.slice(0, max);

  // Amex: 4-6-5 grouping. Others: 4-4-4-4
  if (brand === 'amex') {
    return trimmed
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5})$/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))
      .trim();
  }
  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function passesLuhn(cardNumber) {
  const digits = (cardNumber || '').replace(/\D/g, '');
  if (digits.length < 12) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}
