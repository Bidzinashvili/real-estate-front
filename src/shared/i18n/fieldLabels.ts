import type {
  MatchCriterionKey,
  TemporaryLockKey,
} from "@/features/matching/matchingEnums";

export const MATCH_CRITERION_LABELS: Record<MatchCriterionKey, string> = {
  street: "ქუჩა",
  price: "ფასი",
  rooms: "ოთახები",
  bedrooms: "საძინებლები",
  floor: "სართული",
  excludeLastFloor: "ბოლო სართულის გამორიცხვა",
  renovation: "რემონტი",
  buildingCondition: "შენობის მდგომარეობა",
  projectExclude: "პროექტი",
  area: "ფართობი",
  hasBalcony: "აივანი",
  balconyArea: "აივნის ფართობი",
  goodView: "კარგი ხედი",
  elevator: "ლიფტი",
  centralHeating: "ცენტრალური გათბობა",
  airConditioner: "კონდიციონერი",
  kitchenType: "სამზარეულოს ტიპი",
  furnished: "ავეჯი",
  parking: "პარკინგი",
  pet: "შინაური ცხოველი",
  minRentalPeriod: "მინიმალური ქირავნობის პერიოდი",
  bathrooms: "სველი წერტილები",
};

export const TEMPORARY_LOCK_LABELS: Record<TemporaryLockKey, string> = {
  addresses: "მისამართები",
  street: "ქუჩა",
  budgetMin: "მინ. ბიუჯეტი",
  budgetMax: "მაქს. ბიუჯეტი",
  price: "ფასი",
  minRooms: "მინ. ოთახები",
  maxRooms: "მაქს. ოთახები",
  rooms: "ოთახები",
  minBedrooms: "მინ. საძინებლები",
  maxBedrooms: "მაქს. საძინებლები",
  bedrooms: "საძინებლები",
  minFloor: "მინ. სართული",
  maxFloor: "მაქს. სართული",
  floor: "სართული",
  excludeLastFloor: "ბოლო სართულის გამოკლებით",
  renovations: "რემონტი",
  renovation: "რემონტი",
  buildingCondition: "შენობის მდგომარეობა",
  projectExclude: "გამორიცხული პროექტები",
  project: "პროექტი",
  minArea: "მინ. ფართობი",
  maxArea: "მაქს. ფართობი",
  area: "ფართობი",
  hasBalcony: "აივანი",
  balconyAreaMin: "აივნის მინ. ფართობი",
  balconyAreaMax: "აივნის მაქს. ფართობი",
  balconyArea: "აივნის ფართობი",
  goodView: "კარგი ხედი",
  elevator: "ლიფტი",
  centralHeating: "ცენტრალური გათბობა",
  airConditioner: "კონდიციონერი",
  kitchenType: "სამზარეულოს ტიპი",
  furnished: "ავეჯით",
  parking: "პარკინგი",
  pet: "შინაური ცხოველები",
  petsAllowed: "ცხოველები დაიშვება",
  minRentalPeriod: "მინიმალური ქირის ვადა",
  minBathrooms: "მინ. სველი წერტილები",
  maxBathrooms: "მაქს. სველი წერტილები",
  bathrooms: "სველი წერტილები",
};

export function formatCriterionLabel(key: string): string {
  if (key in MATCH_CRITERION_LABELS) {
    return MATCH_CRITERION_LABELS[key as MatchCriterionKey];
  }
  return key;
}
