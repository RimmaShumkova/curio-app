// Константы приложения
export const APP_NAME = 'Читаем с Кьюрио';
export const APP_VERSION = '1.0.0';

// Ключи для хранилища
export const STORAGE_KEYS = {
  CHILD_NAME: 'childName',
  CHILD_GENDER: 'childGender',
  USER_ID: 'userId',
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
  SOCIAL_PROVIDER: 'socialProvider'
} as const;

// Транзакции для навигации
export const TRANSITIONS = {
  slide: { name: 'slide', duration: 300, curve: 'ease' },
  fade: { name: 'fade', duration: 300 },
  none: { duration: 0 }
};