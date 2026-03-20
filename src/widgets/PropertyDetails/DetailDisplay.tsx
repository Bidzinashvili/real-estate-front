import type { ReactNode } from "react";

const EMPTY = "—";

function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

export function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="break-words text-sm text-slate-900">{children}</div>
    </div>
  );
}

export function DetailText({
  label,
  value,
  empty = EMPTY,
}: {
  label: string;
  value: string | null | undefined;
  empty?: string;
}) {
  const text = isEmpty(value) ? empty : String(value);
  return (
    <DetailRow label={label}>
      <span>{text}</span>
    </DetailRow>
  );
}

export function DetailMultiline({
  label,
  value,
  empty = EMPTY,
}: {
  label: string;
  value: string | null | undefined;
  empty?: string;
}) {
  const text = isEmpty(value) ? empty : String(value);
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="rounded-lg border border-slate-100 bg-slate-50/90 px-3 py-2 text-sm text-slate-800 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

export function DetailYesNo({ label, value }: { label: string; value: boolean }) {
  return (
    <DetailRow label={label}>
      <span
        className={
          value ? "font-medium text-emerald-800" : "text-slate-500"
        }
      >
        {value ? "Yes" : "No"}
      </span>
    </DetailRow>
  );
}

export function DetailPhone({
  label,
  value,
  empty = EMPTY,
}: {
  label: string;
  value: string | null | undefined;
  empty?: string;
}) {
  if (isEmpty(value)) {
    return <DetailText label={label} value="" empty={empty} />;
  }
  const raw = String(value).trim();
  const tel = raw.replace(/\s+/g, "");
  return (
    <DetailRow label={label}>
      <a
        href={`tel:${tel}`}
        className="text-emerald-800 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-900"
      >
        {raw}
      </a>
    </DetailRow>
  );
}

export function DetailDateTime({
  label,
  value,
  empty = EMPTY,
}: {
  label: string;
  value: string | null | undefined;
  empty?: string;
}) {
  if (isEmpty(value)) {
    return <DetailText label={label} value="" empty={empty} />;
  }
  const d = new Date(value as string);
  const text = Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  return <DetailText label={label} value={text} />;
}

export function DetailNumber({
  label,
  value,
  suffix,
  empty = EMPTY,
}: {
  label: string;
  value: number | null | undefined;
  suffix?: string;
  empty?: string;
}) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return <DetailText label={label} value="" empty={empty} />;
  }
  return (
    <DetailRow label={label}>
      <span>
        {value.toLocaleString()}
        {suffix ? ` ${suffix}` : ""}
      </span>
    </DetailRow>
  );
}
