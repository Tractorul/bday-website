"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  date: string;
  time: string;
  timezone: string;
};

function getTimeZoneParts(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);

  const values: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
}

function getTimeZoneOffset(date: Date, timezone: string) {
  const parts = getTimeZoneParts(date, timezone);

  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return asUTC - date.getTime();
}

function getBirthdayTimestamp(
  date: string,
  time: string,
  timezone: string
) {
  const [month, day, year] = date.includes("-")
    ? date.split("-").map(Number).reverse()
    : [1, 1, 2000];

  const [hour, minute] = time.split(":").map(Number);

  const now = new Date();

  const currentParts = getTimeZoneParts(now, timezone);

  let targetYear = currentParts.year;

  const candidateUTC = Date.UTC(
    targetYear,
    month - 1,
    day,
    hour,
    minute,
    0
  );

  const initialDate = new Date(candidateUTC);

  const offset = getTimeZoneOffset(initialDate, timezone);

  let targetTimestamp = candidateUTC - offset;

  if (targetTimestamp <= now.getTime()) {
    targetYear += 1;

    const nextCandidateUTC = Date.UTC(
      targetYear,
      month - 1,
      day,
      hour,
      minute,
      0
    );

    const nextInitialDate = new Date(nextCandidateUTC);
    const nextOffset = getTimeZoneOffset(
      nextInitialDate,
      timezone
    );

    targetTimestamp = nextCandidateUTC - nextOffset;
  }

  return targetTimestamp;
}

function getCountdown(target: number) {
  const difference = Math.max(0, target - Date.now());

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export default function Countdown({
  date,
  time,
  timezone,
}: CountdownProps) {
  const [target, setTarget] = useState<number | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetTime = getBirthdayTimestamp(
      date,
      time,
      timezone
    );

    setTarget(targetTime);
    setCountdown(getCountdown(targetTime));

    const interval = setInterval(() => {
      setCountdown(getCountdown(targetTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time, timezone]);

  if (target === null) {
    return (
      <div className="mt-8 text-zinc-500">
        Calculating countdown...
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-3xl font-bold sm:text-4xl">
            {countdown.days}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Days
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-3xl font-bold sm:text-4xl">
            {countdown.hours}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Hours
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-3xl font-bold sm:text-4xl">
            {countdown.minutes}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Minutes
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-3xl font-bold sm:text-4xl">
            {countdown.seconds}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}