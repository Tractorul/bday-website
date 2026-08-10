"use client";

import { useEffect, useState } from "react";

type Props = {
  date: string;
  time: string;
  timezone: string;
};

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimezoneParts(date: Date, timezone: string) {
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

function getTimezoneOffset(date: Date, timezone: string) {
  const parts = getTimezoneParts(date, timezone);

  const utc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );

  return utc - date.getTime();
}

function getNextBirthdayTimestamp(
  birthdayDate: string,
  birthdayTime: string,
  timezone: string
) {
  const [month, day] = birthdayDate
    .split("-")
    .slice(1)
    .map(Number);

  const [hour, minute] = birthdayTime
    .split(":")
    .map(Number);

  const now = new Date();

  const current = getTimezoneParts(now, timezone);

  let year = current.year;

  function calculate(yearValue: number) {
    const candidate = Date.UTC(
      yearValue,
      month - 1,
      day,
      hour,
      minute,
      0
    );

    const candidateDate = new Date(candidate);

    return (
      candidate -
      getTimezoneOffset(candidateDate, timezone)
    );
  }

  let timestamp = calculate(year);

  if (timestamp <= now.getTime()) {
    year++;
    timestamp = calculate(year);
  }

  return timestamp;
}

function getCountdown(target: number): CountdownValues {
  const difference = Math.max(0, target - Date.now());

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function CountdownBox({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
      <div className="text-3xl font-black sm:text-4xl">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}

export default function Countdown({
  date,
  time,
  timezone,
}: Props) {
  const [countdown, setCountdown] =
    useState<CountdownValues>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  useEffect(() => {
    const update = () => {
      const target = getNextBirthdayTimestamp(
        date,
        time,
        timezone
      );

      setCountdown(getCountdown(target));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [date, time, timezone]);

  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      <CountdownBox
        value={countdown.days}
        label="Days"
      />

      <CountdownBox
        value={countdown.hours}
        label="Hours"
      />

      <CountdownBox
        value={countdown.minutes}
        label="Minutes"
      />

      <CountdownBox
        value={countdown.seconds}
        label="Seconds"
      />
    </div>
  );
}