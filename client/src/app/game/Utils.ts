export function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export const randomEnumValue = (enumeration) => {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
};
