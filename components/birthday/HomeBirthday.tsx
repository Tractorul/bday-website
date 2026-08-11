"use client";

import { useEffect, useState } from "react";
import type { Birthday } from "@/types/birthday";

type Props = {
  birthday: Birthday;
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

function getBirthdayTimestamp(
  date: string,
  time: string,
  timezone: string,
  year: number
) {
  const [, month, day] = date
    .split("-")
    .map(Number);

  const [hour, minute] = time
    .split(":")
    .map(Number);

  const candidate = Date.UTC(
    year,
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

function getNextBirthday(
  date: string,
  time: string,
  timezone: string
) {
  const now = new Date();

  const current = getTimezoneParts(
    now,
    timezone
  );

  let year = current.year;

  let timestamp = getBirthdayTimestamp(
    date,
    time,
    timezone,
    year
  );

  if (timestamp <= now.getTime()) {
    year++;

    timestamp = getBirthdayTimestamp(
      date,
      time,
      timezone,
      year
    );
  }

  return timestamp;
}

function getCurrentBirthday(
  date: string,
  time: string,
  timezone: string
) {
  const now = new Date();

  const current = getTimezoneParts(
    now,
    timezone
  );

  const timestamp = getBirthdayTimestamp(
    date,
    time,
    timezone,
    current.year
  );

  /*
   * Birthday is considered active from the
   * configured birthday time until midnight
   * in the configured timezone.
   */
  const tomorrowTimestamp =
    getBirthdayTimestamp(
      date,
      time,
      timezone,
      current.year
    );

  const [, month, day] = date
    .split("-")
    .map(Number);

  const birthdayStart = timestamp;

  /*
   * Calculate midnight at the beginning
   * of the next day in the birthday timezone.
   */
  const nextDay = new Date(
    Date.UTC(
      current.year,
      month - 1,
      day + 1,
      0,
      0,
      0
    )
  );

  const nextDayParts = getTimezoneParts(
    nextDay,
    timezone
  );

  const midnightCandidate = Date.UTC(
    nextDayParts.year,
    nextDayParts.month - 1,
    nextDayParts.day,
    0,
    0,
    0
  );

  const birthdayEnd =
    midnightCandidate -
    getTimezoneOffset(
      new Date(midnightCandidate),
      timezone
    );

  return (
    now.getTime() >= birthdayStart &&
    now.getTime() < birthdayEnd &&
    birthdayStart === tomorrowTimestamp
  );
}

function getCountdown(
  target: number
): CountdownValues {
  const difference = Math.max(
    0,
    target - Date.now()
  );

  const totalSeconds = Math.floor(
    difference / 1000
  );

  return {
    days: Math.floor(
      totalSeconds / 86400
    ),
    hours: Math.floor(
      (totalSeconds % 86400) / 3600
    ),
    minutes: Math.floor(
      (totalSeconds % 3600) / 60
    ),
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

export default function HomeBirthday({
  birthday,
}: Props) {
  const [countdown, setCountdown] =
    useState<CountdownValues>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  const [isBirthday, setIsBirthday] =
    useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const birthdayToday =
        getCurrentBirthday(
          birthday.birthday_date,
          birthday.birthday_time,
          birthday.timezone
        );

      setIsBirthday(birthdayToday);

      if (birthdayToday) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const target =
        getNextBirthday(
          birthday.birthday_date,
          birthday.birthday_time,
          birthday.timezone
        );

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
  }, [
    birthday.birthday_date,
    birthday.birthday_time,
    birthday.timezone,
  ]);

  /*
   * If the setting is OFF:
   * always show the message.
   *
   * If the setting is ON:
   * only show it on the birthday.
   */
  const showMessage =
    !birthday.show_message_on_birthday_only ||
    isBirthday;

  return (
    <>
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

      {showMessage &&
        birthday.message && (
          <p className="mx-auto mt-8 max-w-xl text-zinc-400">
            {birthday.message}
          </p>
        )}
    </>
  );
}