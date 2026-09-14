type ClosedRecordStatChip = {
  key: string;
  label: string;
};

type ClosedRecordStatChipsProps = {
  items: ClosedRecordStatChip[];
};

export function ClosedRecordStatChips({ items }: ClosedRecordStatChipsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      {items.map((item) => (
        <span
          key={item.key}
          className="rounded-full bg-success-muted px-2.5 py-1 text-foreground"
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
