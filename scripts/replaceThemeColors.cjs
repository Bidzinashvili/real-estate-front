const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src");

const replacements = [
  ["placeholder:text-slate-400", "placeholder:text-muted-foreground"],
  ["disabled:bg-slate-50", "disabled:bg-muted"],
  ["hover:bg-slate-50", "hover:bg-muted"],
  ["hover:bg-slate-100", "hover:bg-accent"],
  ["hover:bg-slate-800", "hover:bg-primary/90"],
  ["hover:text-slate-900", "hover:text-foreground"],
  ["hover:text-slate-700", "hover:text-foreground"],
  ["focus:border-slate-900", "focus:border-primary"],
  ["focus:border-slate-400", "focus:border-primary"],
  ["ring-slate-200/80", "ring-border/80"],
  ["ring-slate-200", "ring-border"],
  ["divide-slate-100", "divide-border"],
  ["divide-slate-200", "divide-border"],
  ["border-slate-200", "border-border"],
  ["border-slate-300", "border-border"],
  ["border-slate-100", "border-border"],
  ["bg-white/70", "bg-card/70"],
  ["bg-white/80", "bg-card/80"],
  ["bg-slate-50/90", "bg-muted/90"],
  ["bg-slate-100/80", "bg-muted/80"],
  ["bg-slate-900", "bg-primary"],
  ["bg-slate-50", "bg-muted"],
  ["bg-slate-100", "bg-muted"],
  ["bg-slate-200", "bg-border"],
  ["bg-white", "bg-card"],
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["text-slate-300", "text-muted-foreground"],
  ["bg-emerald-50", "bg-success-muted"],
  ["bg-emerald-100", "bg-success-muted"],
  ["text-emerald-900", "text-success-foreground"],
  ["text-emerald-800", "text-success-foreground"],
  ["text-emerald-700", "text-success"],
  ["bg-rose-50", "bg-destructive/10"],
  ["bg-rose-100", "bg-destructive/15"],
  ["border-rose-200", "border-destructive/30"],
  ["border-rose-300", "border-destructive/40"],
  ["text-rose-800", "text-destructive"],
  ["text-rose-700", "text-destructive"],
  ["hover:bg-rose-100", "hover:bg-destructive/20"],
  ["bg-amber-50", "bg-warning-muted"],
  ["bg-amber-100", "bg-warning-muted"],
  ["border-amber-400", "border-warning"],
  ["text-amber-800", "text-warning-foreground"],
  ["text-red-600", "text-destructive"],
  ["text-red-700", "text-destructive"],
  ["border-red-500", "border-destructive"],
  ["focus:border-red-600", "focus:border-destructive"],
  ["bg-red-50", "bg-destructive/10"],
  ["border-red-100", "border-destructive/20"],
  ["hover:bg-red-100", "hover:bg-destructive/15"],
  ["bg-green-100", "bg-success-muted"],
  ["text-green-800", "text-success-foreground"],
  ["bg-blue-100", "bg-primary/15"],
  ["text-blue-800", "text-primary"],
  ["bg-sky-50", "bg-primary/10"],
  ["text-sky-700", "text-primary"],
  ["text-blue-600", "text-primary"],
  ["hover:text-blue-800", "hover:text-primary"],
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(ts|tsx|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

let changedFiles = 0;
for (const filePath of walk(root)) {
  const original = fs.readFileSync(filePath, "utf8");
  let next = original;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  next = next.split("bg-primary text-white").join("bg-primary text-primary-foreground");
  if (next !== original) {
    fs.writeFileSync(filePath, next);
    changedFiles += 1;
  }
}

console.log(`Updated ${changedFiles} files`);
