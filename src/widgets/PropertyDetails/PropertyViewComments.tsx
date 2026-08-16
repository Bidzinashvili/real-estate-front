import type { Property } from "@/features/properties/types";
import { formatPropertyDateTime } from "@/widgets/PropertyDetails/propertyViewFormatters";

type PropertyViewCommentsProps = {
  property: Property;
  canViewPrivateFields: boolean;
};

function CommentBlock({
  title,
  value,
  variant,
}: {
  title: string;
  value: string;
  variant: "public" | "private" | "internal";
}) {
  const shellClassName =
    variant === "public"
      ? "rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6"
      : variant === "private"
        ? "rounded-2xl border border-warning/30 bg-warning-muted/40 p-5 shadow-sm ring-1 ring-border sm:p-6"
        : "rounded-2xl border border-primary/25 bg-primary/5 p-5 shadow-sm ring-1 ring-border sm:p-6";

  return (
    <section className={shellClassName}>
      {variant !== "public" ? (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          შიდა ინფორმაცია
        </p>
      ) : null}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground">{value}</p>
    </section>
  );
}

export function PropertyViewPublicComment({ property }: { property: Property }) {
  const publicComment = (property.publicComment ?? property.description ?? "").trim();
  if (!publicComment) {
    return null;
  }
  return <CommentBlock title="საჯარო კომენტარი" value={publicComment} variant="public" />;
}

export function PropertyViewPrivateComments({
  property,
  canViewPrivateFields,
}: PropertyViewCommentsProps) {
  if (!canViewPrivateFields) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-muted/50 p-5">
        <p className="text-sm text-muted-foreground">
          პირადი კომენტარი და შიდა ინფორმაცია მხოლოდ განცხადების აგენტსა და ადმინისტრატორებს
          ეჩვენებათ.
        </p>
      </section>
    );
  }

  const privateComment = (property.privateComment ?? property.comment ?? "").trim();
  const internalText = (property.internalText ?? property.internalComment ?? "").trim();
  const commentDate = formatPropertyDateTime(property.commentDate);

  return (
    <div className="space-y-4">
      {privateComment ? (
        <div className="space-y-2">
          <CommentBlock title="პირადი კომენტარი" value={privateComment} variant="private" />
          {commentDate ? (
            <p className="px-1 text-xs text-muted-foreground">კომენტარის თარიღი: {commentDate}</p>
          ) : null}
        </div>
      ) : null}
      {internalText ? (
        <CommentBlock title="შიდა ინფორმაცია" value={internalText} variant="internal" />
      ) : null}
    </div>
  );
}
