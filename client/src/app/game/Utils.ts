import { AU } from './constants/game.constants';

export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export const randomEnumValue = (enumeration) => {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
};

/**
 * Convert Au (Astronomical Unit) to Game Unit.
 * 1 AU = 100 GU
 * @param au
 */
export function auToGu(au: number) {
  return (au / 0.00465047) * 400;
}

export function guToAu(gu: number) {
  return gu / 400;
}

