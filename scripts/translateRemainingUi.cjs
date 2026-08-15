const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

const multilineReplacements = [
  [
    "You can schedule several notifications for this listing. Each row is saved as its own\n          reminder.",
    "ამ განცხადებაზე შეგიძლიათ რამდენიმე შეტყობინება დაგეგმოთ. თითოეული სტრიქონი ცალკე შეხსენებად ინახება.",
  ],
  [
    "View listing information. Use Edit listing to change fields you are allowed to\n          update.",
    "ნახეთ განცხადების ინფორმაცია. დასაშვები ველების შესაცვლელად გამოიყენეთ რედაქტირება.",
  ],
  [
    "Notes, internal price, and some workflow fields are hidden because you are not\n            the listing agent. Administrators always see the full record.",
    "შენიშვნები, შიდა ფასი და ზოგი სამუშაო ველი დამალულია, რადგან თქვენ არ ხართ ამ განცხადების აგენტი. ადმინისტრატორებს სრული ჩანაწერი ყოველთვის ჩანს.",
  ],
  [
    "Notes, internal price, and some workflow fields are hidden because you are not the\n          listing agent. Administrators always see the full record.",
    "შენიშვნები, შიდა ფასი და ზოგი სამუშაო ველი დამალულია, რადგან თქვენ არ ხართ ამ განცხადების აგენტი. ადმინისტრატორებს სრული ჩანაწერი ყოველთვის ჩანს.",
  ],
  [
    "Change listing status and set reminders from the catalog card menu (three dots on the\n          listing image).",
    "განცხადების სტატუსი და შეხსენებები იცვლება კატალოგის ბარათის მენიუდან (სამი წერტილი ფოტოზე).",
  ],
  [
    "Drag files from your computer, WhatsApp, or folders. PNG, JPG, and WebP images are\n                supported.",
    "გადმოიტანეთ ფაილები კომპიუტერიდან, WhatsApp-იდან ან საქაღალდიდან. მხარდაჭერილია PNG, JPG და WebP.",
  ],
  [
    "Comments and internal notes are only visible to the listing agent and\n            administrators.",
    "კომენტარები და შიდა შენიშვნები მხოლოდ განცხადების აგენტსა და ადმინისტრატორებს ეჩვენებათ.",
  ],
];

const phrases = [
  [
    "Create shareable links so clients can submit property requirements without signing in.",
    "შექმენით გასაზიარებელი ბმულები, რომ კლიენტებმა მოთხოვნები სისტემაში შესვლის გარეშე გააგზავნონ.",
  ],
  [
    "This invite link is not valid. Check the URL or ask your agent for a new link.",
    "ეს მოწვევის ბმული არასწორია. შეამოწმეთ მისამართი ან სთხოვეთ აგენტს ახალი ბმული.",
  ],
  [
    "You do not have permission to create invite links.",
    "მოწვევის ბმულების შექმნის უფლება არ გაქვთ.",
  ],
  [
    "You do not have permission to view invite links.",
    "მოწვევის ბმულების ნახვის უფლება არ გაქვთ.",
  ],
  [
    "You do not have permission to create clients.",
    "კლიენტების შექმნის უფლება არ გაქვთ.",
  ],
  [
    "This link was just used. Refresh the page or ask for a new link.",
    "ეს ბმული ახლახან გამოიყენეს. განაახლეთ გვერდი ან სთხოვეთ ახალი ბმული.",
  ],
  [
    "Fill in the details below to add a new agent.",
    "შეავსეთ ქვემოთ მოცემული ველები ახალი აგენტის დასამატებლად.",
  ],
  [
    "Update your agent's information or remove them from your list.",
    "განაახლეთ აგენტის ინფორმაცია ან წაშალეთ სიიდან.",
  ],
  [
    "Update listing information. Agents can only edit their own properties.",
    "განაახლეთ განცხადების ინფორმაცია. აგენტებს მხოლოდ საკუთარი განცხადებების რედაქტირება შეუძლიათ.",
  ],
  [
    "Your details were submitted successfully. Reference:",
    "თქვენი მონაცემები წარმატებით გაიგზავნა. ნომერი:",
  ],
  [
    "Results use the backend match percentage. Order is preserved from the API.",
    "შედეგები იყენებს სერვერის შესაბამისობის პროცენტს. თანმიმდევრობა API-დან უცვლელია.",
  ],
  [
    "MINE uses your own clients, not the listing owner. Cards show public match fields only.",
    "ჩემი კლიენტები ნიშნავს თქვენს კლიენტებს და არა განცხადების მფლობელისას. ბარათებში მხოლოდ საჯარო ველები ჩანს.",
  ],
  [
    "Session-only. These are not saved on the client or property.",
    "მოქმედებს მხოლოდ ამ სესიაში და კლიენტზე ან განცხადებაზე არ ინახება.",
  ],
  [
    "Drop files here to add them after the current sequence",
    "ჩააგდეთ ფაილები აქ, რომ დაემატოს არსებული თანმიმდევრობის შემდეგ",
  ],
  [
    "Drop images here or click to browse",
    "ჩააგდეთ ფოტოები აქ ან დააჭირეთ ასარჩევად",
  ],
  [
    "You don't have permission to edit this property.",
    "ამ განცხადების რედაქტირების უფლება არ გაქვთ.",
  ],
  [
    "Rental period (required if you change any of these)",
    "ქირის პერიოდი (სავალდებულოა, თუ რომელიმე ამ ველს შეცვლით)",
  ],
  [
    "Projects to exclude (one per line)",
    "გამოსარიცხი პროექტები (თითო სტრიქონზე ერთი)",
  ],
  ["Min rental period (months)", "მინიმალური ქირის ვადა (თვე)"],
  ["Apartment Min Rental Period (months)", "ბინის მინიმალური ქირის ვადა (თვე)"],
  ["Commercial Min Rental Period (months)", "კომერციულის მინიმალური ქირის ვადა (თვე)"],
  ["Districts & neighborhoods", "უბნები და უბნის ნაწილები"],
  ["Listing (view only)", "განცხადება (მხოლოდ ნახვა)"],
  ["Listing metadata", "განცხადების მონაცემები"],
  ["Notes & attachments", "შენიშვნები და დანართები"],
  ["Apartment details", "ბინის დეტალები"],
  ["Listing lifecycle", "განცხადების ციკლი"],
  ["Verification reminder:", "გადამოწმების შეხსენება:"],
  ["Comment for myself", "კომენტარი ჩემთვის"],
  ["Owner phone", "მესაკუთრის ტელეფონი"],
  ["Building condition", "შენობის მდგომარეობა"],
  ["District group", "უბნის ჯგუფი"],
  ["Choose files", "ფაილების არჩევა"],
  ["Private house", "კერძო სახლი"],
  ["Land plot", "მიწის ნაკვეთი"],
  ["Property details", "განცხადების დეტალები"],
  ["Client details", "კლიენტის დეტალები"],
  ["Property not found.", "განცხადება ვერ მოიძებნა."],
  ["Listing photo", "განცხადების ფოტო"],
  ["Duration (months)", "ხანგრძლივობა (თვე)"],
  ["Period start", "პერიოდის დასაწყისი"],
  ["Period end", "პერიოდის დასასრული"],
  ["Note (optional)", "შენიშვნა (არასავალდებულო)"],
  ["Color tags", "ფერადი ლეიბლები"],
  ["Old IDs", "ძველი ID-ები"],
  ["Deal type", "გარიგების ტიპი"],
  ["Full name", "სრული სახელი"],
];

const shortPhrases = [
  ["Neighborhood", "უბანი"],
  ["Commercial", "კომერციული"],
  ["Apartment", "ბინა"],
  ["Photos", "ფოტოები"],
  ["Phones", "ტელეფონები"],
  ["Districts", "უბნები"],
  ["Addresses", "მისამართები"],
  ["Description", "აღწერა"],
  ["Comment", "კომენტარი"],
  ["Properties", "განცხადებები"],
  ["Agents", "აგენტები"],
  ["Reminder", "შეხსენება"],
  ["Frozen", "გაყინული"],
  ["Snooze", "გადადება"],
  ["Retry", "ხელახლა"],
  ["When", "როდის"],
  ["Email", "ელფოსტა"],
  ["Phone", "ტელეფონი"],
  ["Edit", "რედაქტირება"],
  ["Delete", "წაშლა"],
  ["Add", "დამატება"],
];

function replaceQuotedAndJsx(text, from, to) {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`"${escaped}"`, "g"),
    new RegExp(`'${escaped}'`, "g"),
    new RegExp(`(>\\s*)${escaped}(\\s*<)`, "g"),
  ];
  let next = text.replace(patterns[0], `"${to}"`);
  next = next.replace(patterns[1], `'${to}'`);
  next = next.replace(patterns[2], `$1${to}$2`);
  return next;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

let changedFiles = 0;
for (const file of walk(root)) {
  let text = fs.readFileSync(file, "utf8");
  const original = text;

  for (const [from, to] of multilineReplacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
    }
  }

  for (const [from, to] of phrases) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
    }
  }

  for (const [from, to] of shortPhrases) {
    text = replaceQuotedAndJsx(text, from, to);
  }

  if (text !== original) {
    fs.writeFileSync(file, text);
    changedFiles += 1;
    console.log(path.relative(root, file));
  }
}
console.log(`Updated ${changedFiles} files`);
