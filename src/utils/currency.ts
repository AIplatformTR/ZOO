import i18n from 'i18next';

// Approximate exchange rates relative to RUB
// In a real app, these would be fetched from an API
const EXCHANGE_RATES: Record<string, number> = {
  ru: 1,      // Base currency is RUB
  tr: 0.35,   // 1 RUB = 0.35 TRY (approximate)
  en: 0.011,  // 1 RUB = 0.011 USD (approximate)
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  ru: '₽',
  tr: '₺',
  en: '$',
};

/**
 * Formats a price based on the current language
 * @param priceInRub The price in Rubles
 * @returns Formatted price string with symbol
 */
export const formatPrice = (priceInRub: number): string => {
  const lang = i18n.language.split('-')[0];
  const rate = EXCHANGE_RATES[lang] || 1;
  const symbol = CURRENCY_SYMBOLS[lang] || '₽';
  
  const convertedPrice = priceInRub * rate;
  
  // For RUB we usually don't show decimals if they are .00
  // For TRY and USD we might want 2 decimals
  const fractionDigits = lang === 'ru' ? 0 : 2;
  
  return `${convertedPrice.toLocaleString(lang, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })} ${symbol}`;
};

/**
 * Returns the numeric converted price
 */
export const getConvertedPrice = (priceInRub: number): number => {
  const lang = i18n.language.split('-')[0];
  const rate = EXCHANGE_RATES[lang] || 1;
  return priceInRub * rate;
};

/**
 * Returns the currency symbol for the current language
 */
export const getCurrencySymbol = (): string => {
  const lang = i18n.language.split('-')[0];
  return CURRENCY_SYMBOLS[lang] || '₽';
};
