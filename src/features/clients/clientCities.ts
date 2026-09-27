export const CLIENT_CITY_TBILISI = "თბილისი";
export const CLIENT_CITY_BATUMI = "ბათუმი";
export const CLIENT_CITY_KUTAISI = "ქუთაისი";
export const CLIENT_CITY_TBILISI_SUBURBS = "თბილისის შემოგარენი";

export const CLIENT_CITY_VALUES = [
  CLIENT_CITY_TBILISI,
  CLIENT_CITY_BATUMI,
  CLIENT_CITY_KUTAISI,
  CLIENT_CITY_TBILISI_SUBURBS,
] as const;

export type ClientCity = (typeof CLIENT_CITY_VALUES)[number];

export const CLIENT_CITY_OPTIONS: ReadonlyArray<{ value: ClientCity; label: string }> = [
  { value: CLIENT_CITY_TBILISI, label: CLIENT_CITY_TBILISI },
  { value: CLIENT_CITY_BATUMI, label: CLIENT_CITY_BATUMI },
  { value: CLIENT_CITY_KUTAISI, label: CLIENT_CITY_KUTAISI },
  { value: CLIENT_CITY_TBILISI_SUBURBS, label: CLIENT_CITY_TBILISI_SUBURBS },
];

const NON_TBILISI_CITY_VALUE_SET = new Set<string>([
  CLIENT_CITY_BATUMI,
  CLIENT_CITY_KUTAISI,
  CLIENT_CITY_TBILISI_SUBURBS,
]);

export function isClientCity(value: string): value is ClientCity {
  return (CLIENT_CITY_VALUES as readonly string[]).includes(value);
}

export function shouldShowTbilisiNeighborhoods(city: string): boolean {
  return city.trim() === CLIENT_CITY_TBILISI;
}

export function inferClientCityFromDistricts(districts: readonly string[]): ClientCity {
  const trimmedDistricts = districts
    .map((districtName) => districtName.trim())
    .filter((districtName) => districtName !== "");

  if (trimmedDistricts.length === 1) {
    const onlyDistrict = trimmedDistricts[0];
    if (onlyDistrict && NON_TBILISI_CITY_VALUE_SET.has(onlyDistrict) && isClientCity(onlyDistrict)) {
      return onlyDistrict;
    }
  }

  return CLIENT_CITY_TBILISI;
}

export function districtsFormValueForCity(
  city: ClientCity,
  savedDistricts: readonly string[],
): string[] {
  if (!shouldShowTbilisiNeighborhoods(city)) {
    return [];
  }
  return savedDistricts
    .map((districtName) => districtName.trim())
    .filter((districtName) => districtName !== "");
}

export function districtsPayloadValueForCity(
  city: ClientCity,
  selectedNeighborhoods: readonly string[],
): string[] {
  if (shouldShowTbilisiNeighborhoods(city)) {
    return selectedNeighborhoods
      .map((neighborhoodName) => neighborhoodName.trim())
      .filter((neighborhoodName) => neighborhoodName !== "");
  }
  return [city];
}
