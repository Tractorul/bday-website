import type { Birthday } from "@/types/birthday";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomeBirthday from "@/components/birthday/HomeBirthday";
import { Analytics } from "@vercel/analytics/next"

export default async function Home() {
  const supabase = await createClient();

  const { data: birthdays, error } = await supabase
    .from("birthday_configs")
    .select(
      `
        id,
        slug,
        name,
        birthday_date,
        birthday_time,
        timezone,
        title,
        message,
        theme,
        language,
        enable_confetti,
        enable_music,
        is_primary,
        show_message_on_birthday_only
      `
    )
    .order("name");

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="max-w-xl text-center">
          <div className="text-4xl">⚠️</div>

          <h1 className="mt-6 text-2xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const birthdayList = (birthdays ?? []) as Birthday[];

  /*
   * No birthdays
   */
  if (birthdayList.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="text-center">
          <div className="text-5xl">🎂</div>

          <h1 className="mt-6 text-3xl font-bold">
            No birthdays yet
          </h1>

          <p className="mt-3 text-zinc-400">
            Create a birthday from the admin panel.
          </p>

          <Link
            href="/admin/dashboard"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
          >
            Open Admin
          </Link>
        </div>
      </main>
    );
  }

  /*
   * One birthday OR a primary birthday exists
   */
  const primaryBirthday =
    birthdayList.find((birthday) => birthday.is_primary) ??
    (birthdayList.length === 1 ? birthdayList[0] : null);

  /*
   * Show the selected birthday
   */
  if (primaryBirthday) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="w-full max-w-4xl text-center">
          <p className="mt-6 text-sm uppercase tracking-[0.35em] text-zinc-500">
            Birthday Countdown
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            {primaryBirthday.name}
          </h1>

          {primaryBirthday.title && (
            <p className="mt-4 text-xl text-zinc-400">
              {primaryBirthday.title}
            </p>
          )}

          <HomeBirthday birthday={primaryBirthday} />

          <div className="mt-6 text-sm text-zinc-600">
            {primaryBirthday.birthday_date} ·{" "}
            {primaryBirthday.birthday_time} ·{" "}
            {primaryBirthday.timezone}
          </div>

          <Link
            href={`/birthday/${primaryBirthday.slug}`}
            className="mt-8 inline-block text-sm text-zinc-500 transition hover:text-white"
          >
            View birthday page →
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Multiple birthdays and none is primary.
   * Show all birthdays.
   */
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mt-5 text-4xl font-bold">
          Birthday Countdown
        </h1>

        <p className="mt-3 text-zinc-400">
          Choose a birthday to view its countdown.
        </p>

        <div className="mt-8 grid gap-4">
          {birthdayList.map((birthday) => (
            <div
              key={birthday.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {birthday.name}
                  </h2>

                  {birthday.title && (
                    <p className="mt-2 text-zinc-400">
                      {birthday.title}
                    </p>
                  )}
                </div>

                <Link
                  href={`/birthday/${birthday.slug}`}
                  className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  View birthday →
                </Link>
              </div>

              <HomeBirthday birthday={birthday} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}