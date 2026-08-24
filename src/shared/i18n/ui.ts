export const ui = {
  appName: "უძრავი ქონება",
  save: "შენახვა",
  saving: "ინახება…",
  cancel: "გაუქმება",
  edit: "რედაქტირება",
  delete: "წაშლა",
  back: "უკან",
  previous: "წინა",
  next: "შემდეგი",
  close: "დახურვა",
  search: "ძიება",
  loading: "იტვირთება…",
  notSpecified: "არ არის მითითებული",
  unspecified: "არ არის მითითებული",
  toBeVerified: "გადასამოწმებელია",
  any: "ნებისმიერი",
  yes: "კი",
  no: "არა",
  from: "დან",
  to: "მდე",
  min: "მინ.",
  max: "მაქს.",
  all: "ყველა",
  actions: "მოქმედებები",
  details: "დეტალები",
  status: "სტატუსი",
  type: "ტიპი",
  name: "სახელი",
  phone: "ტელეფონი",
  email: "ელფოსტა",
  note: "შენიშვნა",
  created: "შექმნილია",
  hardLock: "აუცილებელი პირობა",
  frozen: "გაყინული",
  match: "შესაბამისია",
  mismatch: "არ შეესაბამება",
  matchFit: "შესაბამისობა",
  matchedCount: "შესაბამისი",
  mismatchedCount: "შეუსაბამო",
  openListing: "განცხადების გახსნა",
  openClient: "კლიენტის გახსნა",
  allListings: "ყველა განცხადება",
  myListings: "ჩემი განცხადებები",
  allClients: "ყველა კლიენტი",
  myClients: "ჩემი კლიენტები",
  matchAll: "ყველას შესაბამისობა",
  matchMine: "ჩემის შესაბამისობა",
  matchingProperties: "შესაბამისი განცხადებები",
  matchingClients: "შესაბამისი კლიენტები",
  noMatchingProperties: "შესაბამისი განცხადებები ვერ მოიძებნა.",
  noMatchingClients: "შესაბამისი კლიენტები ვერ მოიძებნა.",
  temporaryHardLocks: "დროებითი მკაცრი პირობები",
  temporaryHardLocksHint:
    "მოქმედებს მხოლოდ მიმდინარე სესიაში და კლიენტზე ან განცხადებაზე არ ინახება.",
  detailsCompleteness: "ინფორმაციის შევსება",
  lightMode: "ღია რეჟიმი",
  darkMode: "მუქი რეჟიმი",
} as const;

export function formatShowingCount(shown: number, total: number): string {
  return `ნაჩვენებია ${shown} / ${total}`;
}

export function formatPageOf(page: number, totalPages: number): string {
  return `გვერდი ${page} / ${totalPages}`;
}

export function formatPageOfWithTotal(
  page: number,
  totalPages: number,
  total: number,
): string {
  return `გვერდი ${page} / ${totalPages} • სულ ${total}`;
}

export function formatListingsPerPage(count: number): string {
  return `${count} განცხადება`;
}

export function formatCriteriaMatchSummary(
  matchedCount: number,
  scoredCount: number,
): string {
  return `${scoredCount}-დან ${matchedCount} კრიტერიუმი ემთხვევა`;
}

export function requiredFieldMessage(label: string): string {
  return `${label} სავალდებულოა.`;
}

export function invalidNumberMessage(label: string): string {
  return `${label} უნდა იყოს სწორი რიცხვი.`;
}

export function wholeNumberMessage(label: string): string {
  return `${label} უნდა იყოს მთელი რიცხვი.`;
}

export function atLeastOneMessage(label: string): string {
  return `${label} უნდა იყოს მინიმუმ 1.`;
}

export function atLeastZeroMessage(label: string): string {
  return `${label} უნდა იყოს მინიმუმ 0.`;
}

export function wholeNumberOfMonthsMessage(label: string): string {
  return `${label} უნდა იყოს მთელი რიცხვი თვეებში.`;
}

export function atLeastOneMonthMessage(label: string): string {
  return `${label} უნდა იყოს მინიმუმ 1 თვე.`;
}

export function wholeNumberAtLeastOneMessage(label: string): string {
  return `${label} უნდა იყოს მთელი რიცხვი და მინიმუმ 1.`;
}
