type ClientProfileOccurrenceLinesProps = {
  occurrenceCount: number;
  ownOccurrenceCount: number;
};

export function ClientProfileOccurrenceLines({
  occurrenceCount,
  ownOccurrenceCount,
}: ClientProfileOccurrenceLinesProps) {
  return (
    <div className="space-y-0.5 text-sm text-foreground">
      <p>სისტემაში გამოჩნდა: {occurrenceCount}-ჯერ</p>
      <p>ჩემთან: {ownOccurrenceCount}-ჯერ</p>
    </div>
  );
}
