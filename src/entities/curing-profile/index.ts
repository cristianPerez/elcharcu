export {
  COUNTRIES,
  EXPERIENCE_LEVELS,
  CURING_PRODUCTS,
  countryName,
  experienceLevelName,
  curingProductName,
  isCountryCode,
  isExperienceLevel,
  isCuringProductId,
} from './model/options';
export type { CountryCode, ExperienceLevel, CuringProductId } from './model/options';
export type { CuringProfile } from './model/profile.types';
export { loadProfile, saveProfile, clearProfile } from './lib/profileStorage';
