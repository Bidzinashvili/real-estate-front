const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

const linePairs = [
  ["Filters", "ფილტრები"],
  ["Add client", "კლიენტის დამატება"],
  ["Add phone", "ტელეფონის დამატება"],
  ["Add person", "პირის დამატება"],
  ["Add district", "უბნის დამატება"],
  ["Add address", "მისამართის დამატება"],
  ["Add label", "ლეიბლის დამატება"],
  ["Invite links", "მოწვევის ბმულები"],
  ["Delete agent", "აგენტის წაშლა"],
  ["Edit reminder", "შეხსენების რედაქტირება"],
  ["Edit listing", "განცხადების რედაქტირება"],
  ["Clear error", "შეცდომის გასუფთავება"],
  ["Back to listing", "განცხადებაზე დაბრუნება"],
  ["Back to client", "კლიენტზე დაბრუნება"],
  ["Back to clients", "კლიენტებზე დაბრუნება"],
  ["My data: pending", "ჩემი მონაცემები: მოლოდინში"],
  ["No photos attached to this listing.", "ამ განცხადებას ფოტოები არ აქვს."],
  ["No external IDs added yet.", "გარე ID-ები ჯერ არ არის დამატებული."],
  ["+ Add another reminder", "+ სხვა შეხსენების დამატება"],
];

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
  const original = fs.readFileSync(filePath, "utf8");
  const next = original
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      for (const [from, to] of linePairs) {
        if (trimmed === from) {
          return line.replace(from, to);
        }
      }
      return line;
    })
    .join("\n");
  if (next !== original) {
    fs.writeFileSync(filePath, next);
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} files`);
