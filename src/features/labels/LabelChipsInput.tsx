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
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {value.map((labelName) => (
            <span
              key={labelName.toLocaleLowerCase()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
            >
              <span>{labelName}</span>
              <button
                type="button"
                onClick={() => handleRemoveLabel(labelName)}
                aria-label={`Remove ${labelName}`}
                className="text-slate-500 transition hover:text-slate-800"
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
            placeholder="Type a label and press Enter"
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => commitLabel(inputValue)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
