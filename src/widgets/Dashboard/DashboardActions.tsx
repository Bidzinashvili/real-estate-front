type DashboardActionsProps = {
  isAdmin: boolean;
};

export function DashboardActions({ isAdmin }: DashboardActionsProps) {
  return (
    <section className="mt-2">
      <h2 className="mb-3 text-sm font-semibold text-foreground">
        რისი გაკეთება გსურთ?
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/properties";
          }}
          className="group flex flex-col items-start gap-2 rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:bg-muted"
        >
          <span className="inline-flex items-center rounded-full bg-success-muted px-3 py-1 text-xs font-medium text-success">
            განცხადებები
          </span>
          <p className="text-sm font-medium text-foreground">
            განცხადებების ნახვა და მართვა
          </p>
          <p className="text-xs text-muted-foreground">
            დაამატეთ ახალი განცხადებები და განაახლეთ დეტალები ერთ სივრცეში.
          </p>
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              window.location.href = "/agents";
            }}
            className="group flex flex-col items-start gap-2 rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:bg-muted"
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              აგენტები
            </span>
            <p className="text-sm font-medium text-foreground">
              გუნდის მართვა
            </p>
            <p className="text-xs text-muted-foreground">
              მოიწვიეთ ახალი აგენტები და აკონტროლეთ სამუშაო.
            </p>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            window.location.href = "/collaborations";
          }}
          className="group flex flex-col items-start gap-2 rounded-xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:bg-muted"
        >
          <span className="inline-flex items-center rounded-full bg-warning-muted px-3 py-1 text-xs font-medium text-warning-foreground">
            თანამშრომლობა
          </span>
          <p className="text-sm font-medium text-foreground">
            {isAdmin ? "მოთხოვნების დამტკიცება" : "თანამშრომლობის მოთხოვნები"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isAdmin
              ? "დაამტკიცეთ მიღებული მოთხოვნები და აკონტროლეთ განცხადებები."
              : "ნახეთ შემოსული და გაგზავნილი თანამშრომლობის მოთხოვნები."}
          </p>
        </button>
      </div>
    </section>
  );
}

