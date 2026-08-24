import { Language } from './types';
import { en } from './locales/en';
import { id } from './locales/id';

const translations = { en, id };

export type Translation = typeof en;

export function getTranslation(lang: Language) {
  return translations[lang];
}
