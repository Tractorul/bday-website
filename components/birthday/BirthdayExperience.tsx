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

type Theme = {
  page: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
};

const themes: Record<string, Theme> = {
  default: {
    page:
      "bg-gradient-to-br from-zinc-950 via-zinc-900 to-black",
    card: "bg-white/5 border-white/10",
    text: "text-white",
    muted: "text-zinc-400",
    accent: "text-white",
  },

  sophi: {
    page:
      "bg-gradient-to-br from-white via-pink-50 to-rose-50",
    card:
      "bg-white/75 border-pink-200/70 shadow-xl shadow-pink-200/30",
    text: "text-zinc-800",
    muted: "text-zinc-500",
    accent: "text-rose-400",
  },

  romantic: {
    page:
      "bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100",
    card:
      "bg-white/70 border-rose-200/70 shadow-xl shadow-rose-200/30",
    text: "text-rose-950",
    muted: "text-rose-700/60",
    accent: "text-rose-500",
  },

  sakura: {
    page:
      "bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50",
    card:
      "bg-white/70 border-pink-200/60 shadow-xl shadow-pink-200/20",
    text: "text-zinc-800",
    muted: "text-zinc-500",
    accent: "text-pink-400",
  },

  ocean: {
    page:
      "bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100",
    card:
      "bg-white/65 border-sky-200/70 shadow-xl shadow-sky-200/30",
    text: "text-slate-800",
    muted: "text-slate-500",
    accent: "text-sky-500",
  },

  sunset: {
    page:
      "bg-gradient-to-br from-orange-50 via-rose-50 to-purple-100",
    card:
      "bg-white/60 border-orange-200/60 shadow-xl shadow-orange-200/20",
    text: "text-zinc-800",
    muted: "text-zinc-500",
    accent: "text-orange-400",
  },

  elegant: {
    page:
      "bg-gradient-to-br from-white via-zinc-50 to-zinc-100",
    card:
      "bg-white/80 border-zinc-200 shadow-xl shadow-zinc-200/40",
    text: "text-zinc-900",
    muted: "text-zinc-500",
    accent: "text-zinc-900",
  },
};

function getTheme(theme: string | null) {
  return themes[theme ?? "default"] ?? themes.default;
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
  const parts = getTimezoneParts(
    date,
    timezone
  );

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

    const candidateDate = new Date(
      candidate
    );

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

function getCountdown(
  target: number
): Countdown {
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 80 }).map(
        (_, index) => (
          <span
            key={index}
            className="absolute h-3 w-3 animate-bounce rounded-sm"
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 17) % 90}%`,
              background: `hsl(${
                (index * 47) % 360
              }, 90%, 60%)`,
              animationDelay: `${
                (index % 10) * 0.15
              }s`,
              animationDuration: `${
                1 + (index % 4) * 0.5
              }s`,
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
            className="absolute h-1 w-1 animate-pulse rounded-full bg-white opacity-60"
            style={{
              left: `${(index * 41) % 100}%`,
              top: `${(index * 67) % 100}%`,
              animationDelay: `${
                (index % 8) * 0.3
              }s`,
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
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="pointer-events-none absolute right-1/4 top-0 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
    </>
  );
}

function SophiBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-sky-100/30 blur-3xl" />

      {Array.from({ length: 18 }).map(
        (_, index) => (
          <span
            key={`sparkle-${index}`}
            className="absolute animate-pulse text-xs text-pink-300/60"
            style={{
              left: `${8 + ((index * 43) % 84)}%`,
              top: `${5 + ((index * 61) % 88)}%`,
              animationDelay: `${
                (index % 6) * 0.5
              }s`,
              animationDuration: `${
                2.5 + (index % 4)
              }s`,
            }}
          >
            ✦
          </span>
        )
      )}

      {Array.from({ length: 10 }).map(
        (_, index) => (
          <span
            key={`heart-${index}`}
            className="absolute animate-pulse text-sm text-pink-300/35"
            style={{
              left: `${5 + ((index * 53) % 90)}%`,
              top: `${10 + ((index * 47) % 82)}%`,
              animationDelay: `${
                (index % 5) * 0.7
              }s`,
              animationDuration: `${
                3 + (index % 3)
              }s`,
            }}
          >
            ♡
          </span>
        )
      )}

      {Array.from({ length: 8 }).map(
        (_, index) => (
          <span
            key={`petal-${index}`}
            className="absolute text-sm text-rose-300/30"
            style={{
              left: `${10 + ((index * 67) % 80)}%`,
              top: `${15 + ((index * 37) % 75)}%`,
              transform: `rotate(${
                index * 35
              }deg)`,
            }}
          >
            ❀
          </span>
        )
      )}
    </div>
  );
}

function CountdownBox({
  value,
  label,
  theme,
  isSophi,
}: {
  value: number;
  label: string;
  theme: Theme;
  isSophi: boolean;
}) {
  return (
    <div
      className={`
        rounded-3xl border p-5
        backdrop-blur-xl
        sm:p-6
        ${theme.card}
        ${
          isSophi
            ? "transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-200/30"
            : ""
        }
      `}
    >
      <div
        className={`
          text-4xl font-black
          sm:text-6xl
          ${theme.accent}
        `}
      >
        {String(value).padStart(2, "0")}
      </div>

      <div
        className={`
          mt-2 text-[10px]
          uppercase tracking-[0.2em]
          sm:text-xs
          ${theme.muted}
        `}
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

  const isSophi =
    birthday.theme === "sophi";

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

      setCelebrating(false);

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

  /*
   * BIRTHDAY DAY
   */

  if (celebrating) {
    return (
      <main
        className={`
          relative flex min-h-screen
          items-center justify-center
          overflow-hidden px-5 py-10
          sm:p-6
          ${theme.page}
          ${theme.text}
        `}
      >
        {isSophi && <SophiBackground />}

        <div className="relative z-10 w-full max-w-4xl text-center">
          {birthday.enable_confetti && (
            <Confetti />
          )}

          {isSophi ? (
            <>
              <div className="text-7xl sm:text-8xl">
                🎂
              </div>

              <p
                className="
                  mt-8 text-xs uppercase
                  tracking-[0.35em]
                  text-pink-400/70
                  sm:text-sm
                "
              >
                Astăzi este ziua ta
              </p>

              <h1
                className="
                  mt-5 text-5xl font-black
                  tracking-tight text-rose-400
                  sm:text-7xl
                "
              >
                La mulți ani,
              </h1>

              <h2
                className="
                  mt-2 text-5xl font-black
                  tracking-tight text-zinc-800
                  sm:text-7xl
                "
              >
                {birthday.name}! 💗
              </h2>

              {birthday.title && (
                <p
                  className="
                    mt-7 text-xl
                    leading-8 text-zinc-500
                  "
                >
                  {birthday.title}
                </p>
              )}

              {birthday.message && (
                <div
                  className="
                    mx-auto mt-8 max-w-2xl
                    rounded-3xl border
                    border-pink-200/70
                    bg-white/75 p-7
                    text-left shadow-xl
                    shadow-pink-200/20
                    backdrop-blur-xl
                    sm:p-9
                  "
                >
                  <p
                    className="
                      text-lg leading-8
                      text-zinc-600
                      sm:text-xl
                    "
                  >
                    {birthday.message}
                  </p>

                  <div className="mt-6 text-right text-pink-300">
                    ♡
                  </div>
                </div>
              )}

              <div className="mt-10 text-xl text-pink-300">
                ✦ ♡ ✦
              </div>
            </>
          ) : (
            <>
              <div className="animate-bounce text-8xl">
                🎉
              </div>

              <p
                className={`
                  mt-8 text-sm uppercase
                  tracking-[0.4em]
                  ${theme.muted}
                `}
              >
                {isRomanian
                  ? "Astăzi este ziua!"
                  : "Today is the day"}
              </p>

              <h1
                className={`
                  mt-5 text-6xl font-black
                  sm:text-8xl
                  ${theme.accent}
                `}
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
                  className={`
                    mt-8 text-2xl
                    ${theme.muted}
                  `}
                >
                  {birthday.title}
                </p>
              )}

              {birthday.message && (
                <p
                  className={`
                    mx-auto mt-6 max-w-2xl
                    text-lg leading-8
                    ${theme.muted}
                  `}
                >
                  {birthday.message}
                </p>
              )}

              <div className="mt-10 text-4xl">
                🎂 🎈 🎁 🥳 🎉
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  /*
   * COUNTDOWN
   */

  return (
    <main
      className={`
        relative flex min-h-screen
        items-center justify-center
        overflow-hidden px-5 py-10
        sm:p-6
        ${theme.page}
        ${theme.text}
      `}
    >
      {isSophi && <SophiBackground />}

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
        {isSophi ? (
          <>
            <div
              className="
                mx-auto flex h-28 w-28
                items-center justify-center
                rounded-full border
                border-pink-200/70
                bg-white/75 text-7xl
                shadow-xl
                shadow-pink-200/30
                backdrop-blur-xl
              "
            >
              🎂
            </div>

            <p
              className="
                mt-8 text-[10px]
                uppercase tracking-[0.35em]
                text-pink-400/70
                sm:text-xs
              "
            >
              Numărătoarea inversă până la
            </p>

            <h1
              className="
                mt-4 text-5xl
                font-black tracking-tight
                text-rose-400
                sm:text-7xl
              "
            >
              La mulți ani,
            </h1>

            <h2
              className="
                mt-1 text-5xl
                font-black tracking-tight
                text-zinc-800
                sm:text-7xl
              "
            >
              {birthday.name} 💗
            </h2>

            {birthday.title && (
              <p
                className="
                  mx-auto mt-5
                  max-w-xl text-base
                  leading-7 text-zinc-500
                  sm:text-lg
                "
              >
                {birthday.title}
              </p>
            )}

            <div
              className="
                mt-10 grid grid-cols-2
                gap-3 sm:mt-12
                sm:grid-cols-4 sm:gap-4
              "
            >
              <CountdownBox
                value={countdown.days}
                label="Zile"
                theme={theme}
                isSophi
              />

              <CountdownBox
                value={countdown.hours}
                label="Ore"
                theme={theme}
                isSophi
              />

              <CountdownBox
                value={countdown.minutes}
                label="Minute"
                theme={theme}
                isSophi
              />

              <CountdownBox
                value={countdown.seconds}
                label="Secunde"
                theme={theme}
                isSophi
              />
            </div>

            {birthday.message && (
              <div
                className="
                  mx-auto mt-8 max-w-2xl
                  rounded-3xl border
                  border-pink-200/70
                  bg-white/75 p-6
                  text-left shadow-xl
                  shadow-pink-200/20
                  backdrop-blur-xl
                  sm:mt-10 sm:p-8
                "
              >
                <div className="mb-4 text-sm font-medium text-pink-400">
                  💌 Un mesaj pentru tine
                </div>

                <p
                  className="
                    text-base leading-7
                    text-zinc-600
                    sm:text-lg sm:leading-8
                  "
                >
                  {birthday.message}
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <span className="text-xs text-zinc-400">
                ✦ făcut cu drag ♡ ✦
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              className={`
                mx-auto flex h-28 w-28
                items-center justify-center
                rounded-full border
                text-7xl backdrop-blur-xl
                ${theme.card}
              `}
            >
              🎂
            </div>

            <p
              className={`
                mt-8 text-sm uppercase
                tracking-[0.4em]
                ${theme.muted}
              `}
            >
              {isRomanian
                ? "Numărătoarea inversă până la"
                : "Counting down to"}
            </p>

            <h1
              className={`
                mt-4 text-5xl font-black
                sm:text-7xl
                ${theme.accent}
              `}
            >
              {isRomanian
                ? `Ziua lui ${birthday.name}`
                : `${birthday.name}'s`}
            </h1>

            <h2
              className={`
                mt-2 text-3xl font-bold
                sm:text-4xl
                ${theme.muted}
              `}
            >
              {isRomanian
                ? "Zi de naștere"
                : "Birthday"}
            </h2>

            {birthday.title && (
              <p
                className={`
                  mt-5 text-xl
                  ${theme.muted}
                `}
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
                isSophi={false}
              />

              <CountdownBox
                value={countdown.hours}
                label={
                  isRomanian
                    ? "Ore"
                    : "Hours"
                }
                theme={theme}
                isSophi={false}
              />

              <CountdownBox
                value={countdown.minutes}
                label={
                  isRomanian
                    ? "Minute"
                    : "Minutes"
                }
                theme={theme}
                isSophi={false}
              />

              <CountdownBox
                value={countdown.seconds}
                label={
                  isRomanian
                    ? "Secunde"
                    : "Seconds"
                }
                theme={theme}
                isSophi={false}
              />
            </div>

            {birthday.message && (
              <p
                className={`
                  mx-auto mt-10 max-w-2xl
                  text-lg leading-8
                  ${theme.muted}
                `}
              >
                {birthday.message}
              </p>
            )}

            <p
              className={`
                mt-8 text-center text-sm opacity-60
                ${theme.muted}
              `}
            >
              {birthday.birthday_date} ·{" "}
              {birthday.birthday_time} ·{" "}
              {birthday.timezone}
            </p>
          </>
        )}
      </div>
    </main>
  );
}