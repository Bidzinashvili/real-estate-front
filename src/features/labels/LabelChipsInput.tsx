"use client";

import { useState, type KeyboardEvent } from "react";

type LabelChipsInputProps = {
  id: string;
  label: string;
  value: string[];
  onChange: (nextValue: string[]) => void;
};

function normalizeLabelName(rawValue: string): string {
  return rawValue.trim().replace(/\s+/g, " ");
}

function hasMatchingLabel(labels: string[], candidateName: string): boolean {
  const candidateKey = candidateName.toLocaleLowerCase();
  return labels.some((labelName) => labelName.toLocaleLowerCase() === candidateKey);
}

export function LabelChipsInput({
  id,
  label,
  value,
  onChange,
}: LabelChipsInputProps) {
  const [inputValue, setInputValue] = useState("");

  function commitLabel(rawValue: string) {
    const normalizedName = normalizeLabelName(rawValue);
    if (normalizedName === "") {
      setInputValue("");
      return;
    }

    if (hasMatchingLabel(value, normalizedName)) {
      setInputValue("");
      return;
    }

    onChange([...value, normalizedName]);
    setInputValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitLabel(inputValue);
    }

    if (event.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function handleRemoveLabel(labelName: string) {
    onChange(value.filter((currentLabelName) => currentLabelName !== labelName));
  }

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="rounded-lg border border-border bg-card px-3 py-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {value.map((labelName) => (
            <span
              key={labelName.toLocaleLowerCase()}
              className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm text-foreground"
            >
              <span>{labelName}</span>
              <button
                type="button"
                onClick={() => handleRemoveLabel(labelName)}
                aria-label={`${labelName}-ის წაშლა`}
                className="text-muted-foreground transition hover:text-foreground"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            id={id}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => commitLabel(inputValue)}
            placeholder="აკრიფეთ ლეიბლი და დააჭირეთ Enter"
            className="block w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => commitLabel(inputValue)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            დამატება
          </button>
        </div>
      </div>
    </div>
  );
}
