import { createTranslator } from 'next-intl';
import mx from '../../messages/mx.json';
import us from '../../messages/us.json';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export function generateRandomCharacters(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const isLetter = Math.random() < 0.5;
    if (isLetter) {
      const isUpperCase = Math.random() < 0.5;
      const charCode = isUpperCase
        ? Math.floor(Math.random() * 26) + 65
        : Math.floor(Math.random() * 26) + 97;
      result += String.fromCharCode(charCode);
    } else {
      const digit = Math.floor(Math.random() * 10);
      result += digit.toString();
    }
  }
  return result;
}

export function generateSlug(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const randomStr = generateRandomCharacters(6);
  return `${slug}-${randomStr}`;
}

export function generateOrderNumber(): string {
  const datePart = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 12);
  const randomPart = generateRandomCharacters(4);
  return `${datePart}-${randomPart}`;
}

export function generateShortId(): string {
  const number = generateRandomCharacters(7).toUpperCase();
  const date = new Date().getMilliseconds();
  return `${number}-${date}`;
}

export function generateRandomPassword(length = 10): string {
  const getRandomChar = (min: number, max: number) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min);

  let password = '';

  for (let i = 0; i < length; i++) {
    const charType = Math.floor(Math.random() * 3);
    if (charType === 0) {
      password += getRandomChar(65, 90);
    } else if (charType === 1) {
      password += getRandomChar(97, 122);
    } else {
      password += getRandomChar(48, 57);
    }
  }

  return password;
}

function getMessagesByRegion(region: string) {
  switch (region.toLowerCase()) {
    case 'mx':
    case 'es':
      return { locale: 'es', messages: mx };
    case 'us':
    case 'en':
    default:
      return { locale: 'en', messages: us };
  }
}

export function translateForRegion(region: string, namespace: string) {
  const { locale, messages } = getMessagesByRegion(region);

  // Pasar el namespace específico para el contexto de correo de confirmación
  return createTranslator({
    locale,
    messages,
    // @ts-expect-error // This is a workaround for the type error
    namespace,
  });
}

/**
 * Extracts two numbers separated by a hyphen inside square brackets from a string.
 * @param input - The input string, e.g. "Pants jogger gray sports – G [54-11]".
 * @returns A tuple [firstNumber, secondNumber] or null if there's no match.
 */
export function extractNumbersFromBrackets(input: string): [number, number] | [null, null] {
  const regex = /\[(\d+)-(\d+)\]/;
  const match = input.match(regex);
  if (!match) return [null, null];

  // match[1] and match[2] are the captured number strings
  const firstNumber = parseInt(match[1], 10);
  const secondNumber = parseInt(match[2], 10);

  return [firstNumber, secondNumber];
}
