export const DEAL_TYPE_LABELS = {
  SALE: "იყიდება",
  RENT: "ქირავდება",
  DAILY_RENT: "დღიურად ქირავდება",
} as const;

export const CLIENT_STATUS_LABELS = {
  ACTIVE: "აქტიურია",
  INACTIVE: "არ არის აქტიური",
  NEEDS_VERIFICATION: "გადასამოწმებელია",
  IN_PROGRESS: "პროცესში",
  ARCHIVED: "არქივში",
} as const;

export const CLIENT_PREFERENCE_LABELS = {
  YES: "კი",
  NO: "არა",
  DOES_NOT_MATTER: "არ აქვს მნიშვნელობა",
  NOT_SET: "არ არის მითითებული",
} as const;

export const RENOVATION_LABELS = {
  NEW_RENOVATED: "ახალი გარემონტებული",
  RENOVATED: "გარემონტებული",
  OLD_RENOVATED: "ძველი გარემონტებული",
  NEEDS_RENOVATION: "საჭიროებს რემონტს",
  GREEN_FRAME: "მწვანე კარკასი",
  WHITE_FRAME: "თეთრი კარკასი",
  BLACK_FRAME: "შავი კარკასი",
} as const;

export const BUILDING_CONDITION_LABELS = {
  OLD: "ძველი",
  NEW: "ახალი",
  UNDER_CONSTRUCTION: "მშენებარე",
} as const;

export const BUILDING_AGE_TYPE_LABELS = {
  NEW: "ახალი",
  OLD: "ძველი",
} as const;

export const BUILDING_AGE_TYPE_FIELD_LABEL = "კორპუსის ტიპი";

export const KITCHEN_TYPE_LABELS = {
  SEPARATE: "გამოყოფილი",
  STUDIO: "სტუდიო",
} as const;

export const PROPERTY_TYPE_LABELS = {
  APARTMENT: "ბინა",
  PRIVATE_HOUSE: "კერძო სახლი",
  LAND_PLOT: "მიწის ნაკვეთი",
  COMMERCIAL: "კომერციული",
  COTTAGE: "აგარაკი",
  HOTEL: "სასტუმრო",
} as const;

export const HOTEL_SCOPE_LABELS = {
  WHOLE_HOTEL: "მთელი სასტუმრო",
  HOTEL_ROOM: "სასტუმროს ნომერი",
} as const;

export const LAND_CATEGORY_LABELS = {
  AGRICULTURAL: "სასოფლო-სამეურნეო",
  NON_AGRICULTURAL: "არასასოფლო-სამეურნეო",
} as const;

export const COMMERCIAL_STATUS_LABELS = {
  UNIVERSAL: "უნივერსალური",
  OFFICE: "ოფისი",
  RETAIL: "სავაჭრო",
  WAREHOUSE: "საწყობი",
  INDUSTRIAL: "სამრეწველო",
  FOOD_FACILITY: "კვების ობიექტი",
  GARAGE: "ავტოფარეხი",
  BASEMENT: "სარდაფი",
  SEMI_BASEMENT: "ნახევარსარდაფი",
  WHOLE_BUILDING: "მთელი შენობა",
  CAR_WASH: "ავტოსამრეცხაო",
  CAR_SERVICE: "ავტოსერვისი",
} as const;

export const PROPERTY_STATUS_LABELS = {
  FOR_RENT: "ქირავდება",
  FOR_SALE: "იყიდება",
  AVAILABLE_SOON: "მალე ხელმისაწვდომი",
  RENTED: "გაქირავებულია",
  SOLD: "გაიყიდა",
  NEEDS_VERIFICATION: "გადასამოწმებელია",
  ARCHIVED: "არქივში",
} as const;

export const CLIENT_INVITE_LINK_STATUS_LABELS = {
  ACTIVE: "აქტიური",
  USED: "გამოყენებული",
  EXPIRED: "ვადაგასული",
} as const;

export const CRITERION_RESULT_LABELS = {
  MATCH: "შესაბამისია",
  MISMATCH: "არ შეესაბამება",
  SKIP: "გადასამოწმებელია",
} as const;

export const USER_ROLE_LABELS = {
  ADMIN: "ადმინი",
  AGENT: "აგენტი",
} as const;

export const BOOLEAN_DISPLAY_LABELS = {
  yes: "კი",
  no: "არა",
} as const;

export const LABEL_TYPE_LABELS = {
  STREET: "ქუჩა",
  CUSTOM: "საკუთარი",
} as const;

export function lookupEnumLabel(
  labels: Record<string, string>,
  value: string | null | undefined,
): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return labels[value] ?? value;
}
