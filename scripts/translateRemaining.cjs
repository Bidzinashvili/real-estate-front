const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

const pairs = [
  ["Fill in required details and the matching property subtype section.", "შეავსეთ სავალდებულო ველები და შესაბამისი ქონების ტიპის სექცია."],
  ["Manage your CRM leads, track deal progress, and follow up with clients.", "მართეთ კლიენტები, თვალი ადევნეთ გარიგებებს და განაგრძეთ კომუნიკაცია."],
  ["Quickly search, filter, and jump into agent details. Keep your team and pipeline up to date.", "მოძებნეთ და გაფილტრეთ აგენტები და სწრაფად გადადით დეტალებზე."],
  ["Add new homes, update details, and keep everything tidy in one place.", "დაამატეთ ახალი განცხადებები და განაახლეთ დეტალები ერთ სივრცეში."],
  ["Invite new agents and keep track of who is working on what.", "მოიწვიეთ ახალი აგენტები და აკონტროლეთ სამუშაო."],
  ["This will remove the agent from your list. You can always add them again later.", "აგენტი წაიშლება სიიდან. საჭიროების შემთხვევაში მოგვიანებით კვლავ შეგიძლიათ დამატება."],
  ["This will soft-delete the client record. You can contact support to restore it.", "კლიენტი დაარქივდება. აღსადგენად დაუკავშირდით მხარდაჭერას."],
  ["This clears the verification follow-up on the listing. You can set a new one from the property card menu.", "განცხადების გადამოწმების შეხსენება წაიშლება. ახლის დაყენება შეგიძლიათ განცხადების მენიუდან."],
  ["This clears the follow-up reminder on the client record.", "კლიენტის შეხსენება წაიშლება."],
  ["This removes the scheduled reminder row.", "დაგეგმილი შეხსენება წაიშლება."],
  ["Share what you are looking for. Fields marked with * are required.", "აღწერეთ, რას ეძებთ. ვარსკვლავით (*) მონიშნული ველები სავალდებულოა."],
  ["Your details were submitted successfully. Reference:", "თქვენი მონაცემები წარმატებით გაიგზავნა. საიდენტიფიკაციო კოდი:"],
  ["This link has expired or has already been used.", "ეს ბმული ვადაგასულია ან უკვე გამოყენებულია."],
  ["This invite link was not found.", "მოწვევის ბმული ვერ მოიძებნა."],
  ["Too many requests. Please wait a few minutes and try again.", "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ."],
  ["Too many requests. Please wait and try again.", "ძალიან ბევრი მოთხოვნაა. გთხოვთ, ცოტა ხანში სცადოთ."],
  ["You don't have any properties yet.", "განცხადებები ჯერ არ გაქვთ."],
  ["You don&apos;t have any properties yet.", "განცხადებები ჯერ არ გაქვთ."],
  ["You don't have any agents yet.", "აგენტები ჯერ არ გაქვთ."],
  ["You don&apos;t have any agents yet.", "აგენტები ჯერ არ გაქვთ."],
  ["Sign in to your account", "ანგარიშში შესვლა"],
  ["Sign in with Google to get started", "გასაგრძელებლად შედით Google-ით"],
  ["Signing you in...", "შესვლა მიმდინარეობს..."],
  ["Good to see you again", "კეთილი იყოს თქვენი მობრძანება"],
  ["What would you like to do?", "რისი გაკეთება გსურთ?"],
  ["See and manage all properties", "განცხადებების ნახვა და მართვა"],
  ["Look after your team", "გუნდის მართვა"],
  ["Your agents, at a glance", "თქვენი აგენტები"],
  ["Clients & Leads", "კლიენტები და ლიდები"],
  ["Clients &amp; Leads", "კლიენტები და ლიდები"],
  ["Find matching properties", "შესაბამისი განცხადებების ძიება"],
  ["Find matching clients", "შესაბამისი კლიენტების ძიება"],
  ["to see only your listings.", "მხოლოდ თქვენი განცხადებების სანახავად."],
  ["Min Rental Period (months)", "მინიმალური ქირის ვადა (თვე)"],
  ["Total balcony area (m²)", "აივნის ჯამური ფართობი (მ²)"],
  ["Rental duration (months)", "ქირის ხანგრძლივობა (თვე)"],
  ["Verification reminder", "გადამოწმების შეხსენება"],
  ["Rented to (client)", "გაქირავებულია (კლიენტზე)"],
  ["Could not load property matches right now.", "შესაბამისი განცხადებების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load client matches right now.", "შესაბამისი კლიენტების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load label suggestions right now.", "ლეიბლების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load street suggestions right now.", "ქუჩების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load the USD equivalent right now.", "დოლარის ეკვივალენტის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load the official USD rate right now.", "ოფიციალური კურსის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load this invite form right now.", "მოწვევის ფორმის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not submit your details right now.", "მონაცემების გაგზავნა ვერ მოხერხდა."],
  ["Could not create this invite link right now.", "მოწვევის ბმულის შექმნა ვერ მოხერხდა."],
  ["Could not load invite links right now.", "მოწვევის ბმულების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load properties right now.", "განცხადებების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not save property changes right now.", "განცხადების ცვლილებების შენახვა ვერ მოხერხდა."],
  ["Could not delete this image right now.", "ფოტოს წაშლა ვერ მოხერხდა."],
  ["Could not create this property right now.", "განცხადების შექმნა ვერ მოხერხდა."],
  ["Could not load clients right now.", "კლიენტების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load this client right now.", "კლიენტის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not create this client right now.", "კლიენტის შექმნა ვერ მოხერხდა."],
  ["Could not save client changes right now.", "კლიენტის ცვლილებების შენახვა ვერ მოხერხდა."],
  ["Could not delete this client right now.", "კლიენტის წაშლა ვერ მოხერხდა."],
  ["Could not post comment right now.", "კომენტარის გაგზავნა ვერ მოხერხდა."],
  ["Could not post internal comment right now.", "შიდა კომენტარის გაგზავნა ვერ მოხერხდა."],
  ["Could not delete this comment right now.", "კომენტარის წაშლა ვერ მოხერხდა."],
  ["Could not load reminders right now.", "შეხსენებების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not schedule this reminder right now.", "შეხსენების დაყენება ვერ მოხერხდა."],
  ["Could not update this reminder right now.", "შეხსენების განახლება ვერ მოხერხდა."],
  ["Could not remove this reminder right now.", "შეხსენების წაშლა ვერ მოხერხდა."],
  ["Could not dismiss this reminder right now.", "შეხსენების დახურვა ვერ მოხერხდა."],
  ["Could not snooze this reminder right now.", "შეხსენების გადადება ვერ მოხერხდა."],
  ["Could not load agents right now.", "აგენტების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not load this agent right now.", "აგენტის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not create agent right now.", "აგენტის შექმნა ვერ მოხერხდა."],
  ["Could not save changes for this agent.", "აგენტის ცვლილებების შენახვა ვერ მოხერხდა."],
  ["Could not delete this agent right now.", "აგენტის წაშლა ვერ მოხერხდა."],
  ["Could not load agents. Please try again later.", "აგენტების ჩატვირთვა ვერ მოხერხდა. სცადეთ მოგვიანებით."],
  ["Could not create this agent.", "აგენტის შექმნა ვერ მოხერხდა."],
  ["Could not delete this agent.", "აგენტის წაშლა ვერ მოხერხდა."],
  ["Could not load this agent.", "აგენტის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not create this property.", "განცხადების შექმნა ვერ მოხერხდა."],
  ["Could not save changes.", "ცვლილებების შენახვა ვერ მოხერხდა."],
  ["Could not load property details.", "განცხადების დეტალების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not archive property.", "განცხადების დაარქივება ვერ მოხერხდა."],
  ["Could not remove this image.", "ფოტოს წაშლა ვერ მოხერხდა."],
  ["Could not save reminders.", "შეხსენებების შენახვა ვერ მოხერხდა."],
  ["Could not load clients.", "კლიენტების ჩატვირთვა ვერ მოხერხდა."],
  ["Could not remove this reminder.", "შეხსენების წაშლა ვერ მოხერხდა."],
  ["Could not update this reminder.", "შეხსენების განახლება ვერ მოხერხდა."],
  ["Could not load USD price.", "დოლარის ფასის ჩატვირთვა ვერ მოხერხდა."],
  ["Could not convert this amount right now.", "თანხის კონვერტაცია ვერ მოხერხდა."],
  ["We could not find this property.", "განცხადება ვერ მოიძებნა."],
  ["We could not find this agent.", "აგენტი ვერ მოიძებნა."],
  ["Client not found.", "კლიენტი ვერ მოიძებნა."],
  ["Failed to load districts.", "უბნების ჩატვირთვა ვერ მოხერხდა."],
  ["Failed to load districts: network error", "უბნების ჩატვირთვა ვერ მოხერხდა: ქსელის შეცდომა"],
  ["Failed to fetch user", "მომხმარებლის ჩატვირთვა ვერ მოხერხდა"],
  ["Please check form values and try again.", "შეამოწმეთ ფორმის ველები და სცადეთ ხელახლა."],
  ["Please check the form and try again.", "შეამოწმეთ ფორმა და სცადეთ ხელახლა."],
  ["Please enter a valid email address", "შეიყვანეთ სწორი ელფოსტა"],
  ["Please enter a phone number", "შეიყვანეთ ტელეფონის ნომერი"],
  ["You can only edit labels on your own properties.", "ლეიბლების რედაქტირება მხოლოდ საკუთარ განცხადებებზე შეგიძლიათ."],
  ["AVAILABLE_SOON status is only allowed for rental properties", "სტატუსი „მალე ხელმისაწვდომი“ მხოლოდ ქირავნობის განცხადებებზეა დაშვებული"],
  ["Enter a whole number of rental months (at least 1).", "შეიყვანეთ ქირის თვეების მთელი რიცხვი (მინიმუმ 1)."],
  ["Enter a valid date and time for the reminder.", "შეიყვანეთ შეხსენების სწორი თარიღი და დრო."],
  ["This reminder cannot be edited here.", "ამ შეხსენების რედაქტირება აქ შეუძლებელია."],
  ["Rental ending reminders need duration (months) and both period start and end.", "ქირის დასრულების შეხსენებას სჭირდება ხანგრძლივობა (თვეები) და პერიოდის დასაწყისი/დასასრული."],
  ["You are not authenticated.", "ავტორიზაცია საჭიროა."],
  ["You do not have access to this client", "ამ კლიენტზე წვდომა არ გაქვთ"],
  ["You do not have permission to run this match.", "ამ შესაბამისობის გაშვების უფლება არ გაქვთ."],
  ["You do not have permission to create properties.", "განცხადების შექმნის უფლება არ გაქვთ."],
  ["This external property ID is already used.", "ეს გარე ID უკვე გამოყენებულია."],
  ["Your session expired. Sign in again.", "სესია ამოიწურა. შედით ხელახლა."],
  ["Network error. Check your connection and try again.", "ქსელის შეცდომა. შეამოწმეთ კავშირი და სცადეთ ხელახლა."],
  ["Official exchange rates are temporarily unavailable. Try again shortly.", "ოფიციალური კურსები დროებით მიუწვდომელია. სცადეთ ცოტა ხანში."],
  ["Choose two different currencies.", "აირჩიეთ ორი განსხვავებული ვალუტა."],
  ["Check the date and try again.", "შეამოწმეთ თარიღი და სცადეთ ხელახლა."],
  ["Check the amount, currencies, and date, then try again.", "შეამოწმეთ თანხა, ვალუტები და თარიღი, შემდეგ სცადეთ ხელახლა."],
  ["This price cannot be converted.", "ამ ფასის კონვერტაცია შეუძლებელია."],
  ["Invalid search. Try a different query.", "არასწორი ძიება. სცადეთ სხვა მოთხოვნა."],
  ["Google auth failed: network error", "Google ავტორიზაცია ვერ მოხერხდა: ქსელის შეცდომა"],
  ["Min rental period is only valid for Rent or Daily rent", "მინიმალური ქირის ვადა მხოლოდ ქირავნობისთვისაა"],
  ["Property saved successfully.", "განცხადება შენახულია."],
  ["Loading agent details…", "აგენტის დეტალები იტვირთება…"],
  ["Loading form…", "ფორმა იტვირთება…"],
  ["USD equivalent…", "დოლარის ეკვივალენტი…"],
  ["Agent details", "აგენტის დეტალები"],
  ["Cadastral code", "საკადასტრო კოდი"],
  ["Hotel scope", "სასტუმროს ტიპი"],
  ["External site id", "გარე საიტის ID"],
  ["MyHome id", "MyHome ID"],
  ["SSGe id", "SS.ge ID"],
  ["Created at", "შექმნის თარიღი"],
  ["Updated at", "განახლების თარიღი"],
  ["Upload text", "ატვირთვის ტექსტი"],
  ["Assigned agent", "მიმაგრებული აგენტი"],
  ["Building number", "კორპუსის ნომერი"],
  ["Total floors", "სართულიანობა"],
  ["Ceiling height", "ჭერის სიმაღლე"],
  ["Balcony area", "აივნის ფართობი"],
  ["Parking spaces", "პარკინგის ადგილები"],
  ["Pets allowed", "ცხოველები დაიშვება"],
  ["Total area", "საერთო ფართობი"],
  ["Fruit trees", "ხეხილი"],
  ["Land category", "მიწის კატეგორია"],
  ["Land usage", "მიწის დანიშნულება"],
  ["For investment", "საინვესტიციო"],
  ["Approved project", "დამტკიცებული პროექტი"],
  ["Can be divided", "იყოფა"],
  ["Common lengths", "ხშირი ვადები"],
  ["Min rooms", "მინ. ოთახები"],
  ["Max rooms", "მაქს. ოთახები"],
  ["Min bedrooms", "მინ. საძინებლები"],
  ["Max bedrooms", "მაქს. საძინებლები"],
  ["Min bathrooms", "მინ. სველი წერტილები"],
  ["Max bathrooms", "მაქს. სველი წერტილები"],
  ["Min floor", "მინ. სართული"],
  ["Max floor", "მაქს. სართული"],
  ["Min area", "მინ. ფართობი"],
  ["Max area", "მაქს. ფართობი"],
  ["Balcony min (m²)", "აივნის მინ. ფართობი (მ²)"],
  ["Balcony max (m²)", "აივნის მაქს. ფართობი (მ²)"],
  ["Listing verification", "განცხადების გადამოწმება"],
  ["Client follow-up", "კლიენტის შეხსენება"],
  ["Scheduled (rental ending)", "დაგეგმილი (ქირის დასრულება)"],
  ["Apartment total floors", "ბინის სართულიანობა"],
  ["Apartment ceiling height", "ბინის ჭერის სიმაღლე"],
  ["Apartment balcony area", "ბინის აივნის ფართობი"],
  ["Apartment parking spaces", "ბინის პარკინგის ადგილები"],
  ["Apartment bathrooms", "ბინის სველი წერტილები"],
  ["Apartment total area", "ბინის საერთო ფართობი"],
  ["Apartment bedrooms", "ბინის საძინებლები"],
  ["Apartment rooms", "ბინის ოთახები"],
  ["Apartment floor", "ბინის სართული"],
  ["Private house bedrooms", "კერძო სახლის საძინებლები"],
  ["Private house balcony area", "კერძო სახლის აივნის ფართობი"],
  ["Private house parking spaces", "კერძო სახლის პარკინგის ადგილები"],
  ["Private house rooms", "კერძო სახლის ოთახები"],
  ["Private house Min Rental Period (months)", "კერძო სახლის მინიმალური ქირის ვადა (თვე)"],
  ["Land plot Min Rental Period (months)", "მიწის ნაკვეთის მინიმალური ქირის ვადა (თვე)"],
  ["Commercial total floors", "კომერციული სართულიანობა"],
  ["Commercial ceiling height", "კომერციული ჭერის სიმაღლე"],
  ["Commercial parking spaces", "კომერციული პარკინგის ადგილები"],
  ["Commercial floor", "კომერციული სართული"],
  ["Commercial area", "კომერციული ფართობი"],
  ["House area", "სახლის ფართობი"],
  ["Yard area", "ეზოს ფართობი"],
  ["Land area", "მიწის ფართობი"],
  ["Change status", "სტატუსის შეცვლა"],
  ["Set reminders", "შეხსენებების დაყენება"],
  ["Listing status", "განცხადების სტატუსი"],
  ["Add property", "განცხადების დამატება"],
  ["Add agent", "აგენტის დამატება"],
  ["More filters", "მეტი ფილტრი"],
  ["Show results", "შედეგების ჩვენება"],
  ["Clear all", "ყველას გასუფთავება"],
  ["All clients", "ყველა კლიენტი"],
  ["My Properties", "ჩემი განცხადებები"],
  ["Open listing", "განცხადების გახსნა"],
  ["Open client", "კლიენტის გახსნა"],
  ["No photo", "ფოტო არ არის"],
  ["Sound on", "ხმა ჩართულია"],
  ["Sound off", "ხმა გამორთულია"],
  ["Dismissing…", "იხურება…"],
  ["Working…", "მუშავდება…"],
  ["Archiving...", "არქივდება..."],
  ["Posting…", "იგზავნება…"],
  ["Loading…", "იტვირთება…"],
  ["District…", "უბანი…"],
  ["Electricity", "ელექტროენერგია"],
  ["Sewage", "კანალიზაცია"],
  ["Project", "პროექტი"],
  ["Scheduled", "დაგეგმილი"],
  ["Archive", "დაარქივება"],
  ["Filters", "ფილტრები"],
  ["Previous", "წინა"],
  ["Dismiss", "დახურვა"],
  ["Remove", "წაშლა"],
  ["Cancel", "გაუქმება"],
  ["Sign in", "შესვლა"],
  ["Log out", "გასვლა"],
  ["Clear", "გასუფთავება"],
  ["Water", "წყალი"],
  ["Area", "ფართობი"],
  ["Pool", "აუზი"],
  ["Gas", "გაზი"],
  ["Post", "გაგზავნა"],
  ["Next", "შემდეგი"],
  ["View", "ნახვა"],
  ["All", "ყველა"],
];

pairs.sort((left, right) => right[0].length - left[0].length);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toFlexiblePattern(value) {
  return value
    .trim()
    .split(/\s+/)
    .map(escapeRegExp)
    .join("\\s+");
}

function replaceAllExact(source, from, to) {
  return source.split(from).join(to);
}

function replaceQuoted(source, from, to) {
  const escaped = escapeRegExp(from);
  let output = source;
  output = output.replace(new RegExp(`"${escaped}"`, "g"), `"${to}"`);
  output = output.replace(new RegExp(`'${escaped}'`, "g"), `'${to}'`);
  return output;
}

function replaceJsx(source, from, to) {
  const pattern = new RegExp(`>(\\s*)${toFlexiblePattern(from)}(\\s*)<`, "g");
  return source.replace(pattern, `>$1${to}$2<`);
}

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

let changedFiles = 0;
for (const filePath of walk(root)) {
  let next = fs.readFileSync(filePath, "utf8");
  const original = next;
  for (const [from, to] of pairs) {
    next = replaceQuoted(next, from, to);
    next = replaceJsx(next, from, to);
    if (from.includes("&apos;") || from.includes("&amp;")) {
      next = replaceAllExact(next, from, to);
    }
  }
  if (next !== original) {
    fs.writeFileSync(filePath, next);
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} files`);
