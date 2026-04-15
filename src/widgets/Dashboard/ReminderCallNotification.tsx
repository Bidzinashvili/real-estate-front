"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, Clock3, X } from "lucide-react";
import type { DashboardReminderRow } from "@/features/reminders/dashboardReminderNormalizer";

type ReminderCallNotificationProps = {
  reminder: DashboardReminderRow;
  isSnoozing: boolean;
  error: string | null;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
  onClearError: () => void;
};

const SNOOZE_OPTIONS_MINUTES = [5, 10, 15, 30];

function formatDueDateTime(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return parsed.toLocaleString();
}

async function playTone(audioContext: AudioContext): Promise<void> {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(880, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.28);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
}

export function ReminderCallNotification({
  reminder,
  isSnoozing,
  error,
  onDismiss,
  onSnooze,
  onClearError,
}: ReminderCallNotificationProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const startRinging = async () => {
      if (!soundEnabled) {
        return;
      }
      try {
        const context =
          audioContextRef.current ??
          new window.AudioContext();
        audioContextRef.current = context;
        if (context.state === "suspended") {
          await context.resume();
        }
        if (isCancelled) {
          return;
        }
        await playTone(context);
      } catch {
        // Ignore sound playback failures (autoplay policy, unsupported audio context, etc.)
      }
    };

    void startRinging();
    const timer = window.setInterval(() => {
      void startRinging();
    }, 2200);

    return () => {
      isCancelled = true;
      window.clearInterval(timer);
    };
  }, [reminder.id, soundEnabled]);

  return (
    <div className="fixed right-4 top-4 z-[60] w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl ring-2 ring-emerald-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Bell className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Reminder due now</p>
            <p className="mt-1 text-sm text-slate-700">{reminder.subjectTitle}</p>
            <p className="mt-1 text-xs text-slate-500">
              {reminder.reminderKindLabel} • {formatDueDateTime(reminder.dueAtIso)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Dismiss reminder alert"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {error ? (
        <p className="mt-3 rounded-md bg-red-50 px-2.5 py-1.5 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSoundEnabled((current) => !current)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {soundEnabled ? <Bell className="h-3.5 w-3.5" aria-hidden /> : <BellOff className="h-3.5 w-3.5" aria-hidden />}
          {soundEnabled ? "Sound on" : "Sound off"}
        </button>
        {error ? (
          <button
            type="button"
            onClick={onClearError}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear error
          </button>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-500">
          <Clock3 className="h-3.5 w-3.5" aria-hidden />
          Snooze
        </p>
        <div className="flex flex-wrap gap-2">
          {SNOOZE_OPTIONS_MINUTES.map((minutes) => (
            <button
              key={minutes}
              type="button"
              onClick={() => onSnooze(minutes)}
              disabled={isSnoozing}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSnoozing ? "Working…" : `${minutes} min`}
            </button>
          ))}
          <button
            type="button"
            onClick={onDismiss}
            disabled={isSnoozing}
            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
