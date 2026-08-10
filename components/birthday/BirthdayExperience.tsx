"use client";

import type { Birthday } from "@/types/birthday";
import { useEffect, useMemo, useState } from "react";

type Props = {
  birthday: Birthday;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const themes = {
  default: {
    page:
      "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black",
    card: "bg-white/5 border-white/10",
    text: "text-white",
    muted: "text-zinc-400",
    accent: "text-white",
  },

  colorful: {
    page:
      "bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600",
    card: "bg-white/15 border-white/20",
    text: "text-white",
    muted: "text-white/75",
    accent: "text-yellow-200",
  },

  neon: {
    page:
      "bg-gradient-to-br from-black via-purple-950 to-black",
    card:
      "bg-purple-500/10 border-purple-400/30 shadow-lg shadow-purple-500/20",
    text: "text-white",
    muted: "text-purple-200/70",
    accent: "text-cyan-300",
  },

  galaxy: {
    page:
      "bg-gradient-to-br from-slate-950 via-indigo-950 to-black",
    card:
      "bg-indigo-500/10 border-indigo-300/20 shadow-lg shadow-indigo-900/30",
    text: "text-white",
    muted: "text-indigo-200/70",
    accent: "text-indigo-200",
  },

  minimal: {
    page:
      "bg-gradient-to-br from-white via-zinc-50 to-zinc-200",
    card: "bg-black/5 border-black/10",
    text: "text-zinc-900",
    muted: "text-zinc-500",
    accent: "text-zinc-900",
  },
};

function getTheme(theme: string | null) {
  return (
    themes[theme as keyof typeof themes] ??
    themes.default
  );
}

function getTimezoneParts(
  date: Date,
  timezone: string
) {
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }
  );

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

function getTimezoneOffset(
  date: Date,
  timezone: string
) {
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

function getNextBirthday(
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

  const current = getTimezoneParts(
    now,
    timezone
  );

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
      getTimezoneOffset(
        candidateDate,
        timezone
      )
    );
  }

  let timestamp = calculate(year);

  if (timestamp <= now.getTime()) {
    year++;
    timestamp = calculate(year);
  }

  return timestamp;
}

function getCountdown(target: number): Countdown {
  const difference = Math.max(
    0,
    target - Date.now()
  );

  const seconds = Math.floor(
    difference / 1000
  );

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor(
      (seconds % 86400) / 3600
    ),
    minutes: Math.floor(
      (seconds % 3600) / 60
    ),
    seconds: seconds % 60,
  };
}

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 80 }).map(
        (_, index) => (
          <span
            key={index}
            className="absolute h-3 w-3 animate-bounce rounded-sm"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 17) % 90}%`,
              background:
                `hsl(${(index * 47) % 360}, 90%, 60%)`,
              animationDelay:
                `${(index % 10) * 0.15}s`,
              animationDuration:
                `${1 + (index % 4) * 0.5}s`,
            }}
          />
        )
      )}
    </div>
  );
}

function GalaxyBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 100 }).map(
        (_, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-white opacity-60 animate-pulse"
            style={{
              left: `${(index * 41) % 100}%`,
              top: `${(index * 67) % 100}%`,
              animationDelay:
                `${(index % 8) * 0.3}s`,
            }}
          />
        )
      )}
    </div>
  );
}

function NeonBackground() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute right-1/4 top-0 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
    </>
  );
}

function CountdownBox({
  value,
  label,
  theme,
}: {
  value: number;
  label: string;
  theme: (typeof themes)["default"];
}) {
  return (
    <div
      className={`rounded-3xl border p-6 backdrop-blur-xl ${theme.card}`}
    >
      <div
        className={`text-5xl font-black sm:text-6xl ${theme.accent}`}
      >
        {String(value).padStart(2, "0")}
      </div>

      <div
        className={`mt-2 text-xs uppercase tracking-[0.2em] ${theme.muted}`}
      >
        {label}
      </div>
    </div>
  );
}

export default function BirthdayExperience({
  birthday,
}: Props) {
  const theme = getTheme(birthday.theme);

  const isRomanian =
    birthday.language === "ro";

  const [celebrating, setCelebrating] =
    useState(false);

  const [countdown, setCountdown] =
    useState<Countdown>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  const target = useMemo(
    () =>
      getNextBirthday(
        birthday.birthday_date,
        birthday.birthday_time,
        birthday.timezone
      ),
    [
      birthday.birthday_date,
      birthday.birthday_time,
      birthday.timezone,
    ]
  );

  useEffect(() => {
    const update = () => {
      const remaining =
        target - Date.now();

      if (remaining <= 0) {
        setCelebrating(true);
        return;
      }

      setCountdown(
        getCountdown(target)
      );
    };

    update();

    const interval = setInterval(
      update,
      1000
    );

    return () =>
      clearInterval(interval);
  }, [target]);

  if (celebrating) {
    return (
      <main
        className={`relative flex min-h-screen items-center justify-center overflow-hidden p-6 ${theme.page} ${theme.text}`}
      >
        {birthday.theme === "galaxy" && (
          <GalaxyBackground />
        )}

        {birthday.theme === "neon" && (
          <NeonBackground />
        )}

        {birthday.enable_confetti && (
          <Confetti />
        )}

        <div className="relative z-10 w-full max-w-4xl text-center">
          <div className="text-8xl animate-bounce">
            🎉
          </div>

          <p
            className={`mt-8 text-sm uppercase tracking-[0.4em] ${theme.muted}`}
          >
            {isRomanian
              ? "Astăzi este ziua!"
              : "Today is the day"}
          </p>

          <h1
            className={`mt-5 text-6xl font-black sm:text-8xl ${theme.accent}`}
          >
            {isRomanian
              ? "La mulți ani,"
              : "Happy Birthday,"}
          </h1>

          <h2 className="mt-3 text-6xl font-black sm:text-8xl">
            {birthday.name}! 🎂
          </h2>

          {birthday.title && (
            <p
              className={`mt-8 text-2xl ${theme.muted}`}
            >
              {birthday.title}
            </p>
          )}

          {birthday.message && (
            <p
              className={`mx-auto mt-6 max-w-2xl text-lg leading-8 ${theme.muted}`}
            >
              {birthday.message}
            </p>
          )}

          <div className="mt-10 text-4xl">
            🎂 🎈 🎁 🥳 🎉
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden p-6 ${theme.page} ${theme.text}`}
    >
      {birthday.theme === "galaxy" && (
        <GalaxyBackground />
      )}

      {birthday.theme === "neon" && (
        <NeonBackground />
      )}

      {birthday.theme === "colorful" && (
        <>
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-yellow-300/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-300/20 blur-3xl" />
        </>
      )}

      <div className="relative z-10 w-full max-w-4xl text-center">
        <div
          className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full border text-7xl backdrop-blur-xl ${theme.card}`}
        >
          🎂
        </div>

        <p
          className={`mt-8 text-sm uppercase tracking-[0.4em] ${theme.muted}`}
        >
          {isRomanian
            ? "Numărătoarea inversă până la"
            : "Counting down to"}
        </p>

        <h1
          className={`mt-4 text-5xl font-black sm:text-7xl ${theme.accent}`}
        >
          {isRomanian
            ? `Ziua lui ${birthday.name}`
            : `${birthday.name}'s`}
        </h1>

        <h2
          className={`mt-2 text-3xl font-bold sm:text-4xl ${theme.muted}`}
        >
          {isRomanian
            ? "Zi de naștere"
            : "Birthday"}
        </h2>

        {birthday.title && (
          <p
            className={`mt-5 text-xl ${theme.muted}`}
          >
            {birthday.title}
          </p>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <CountdownBox
            value={countdown.days}
            label={
              isRomanian
                ? "Zile"
                : "Days"
            }
            theme={theme}
          />

          <CountdownBox
            value={countdown.hours}
            label={
              isRomanian
                ? "Ore"
                : "Hours"
            }
            theme={theme}
          />

          <CountdownBox
            value={countdown.minutes}
            label={
              isRomanian
                ? "Minute"
                : "Minutes"
            }
            theme={theme}
          />

          <CountdownBox
            value={countdown.seconds}
            label={
              isRomanian
                ? "Secunde"
                : "Seconds"
            }
            theme={theme}
          />
        </div>

        {birthday.message && (
          <p
            className={`mx-auto mt-10 max-w-2xl text-lg leading-8 ${theme.muted}`}
          >
            {birthday.message}
          </p>
        )}

        <p
          className={`mt-8 text-sm opacity-60 ${theme.muted}`}
        >
          {birthday.birthday_date} ·{" "}
          {birthday.birthday_time} ·{" "}
          {birthday.timezone}
        </p>
      </div>
    </main>
  );
}