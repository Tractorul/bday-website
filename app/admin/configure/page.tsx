"use client";

import type { Birthday } from "@/types/birthday";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfigurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slugParam = searchParams.get("slug");
  const slug = slugParam ?? "";

  const [birthday, setBirthday] = useState<Birthday | null>(null);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthdayTime, setBirthdayTime] = useState("00:00");
  const [timezone, setTimezone] = useState("Europe/Bucharest");
  const [language, setLanguage] = useState<"ro" | "en">("ro");
  const [theme, setTheme] = useState("default");
  const [enableConfetti, setEnableConfetti] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        /*
         * If we don't have a slug, load the birthday list
         * so the user can choose what to configure.
         */
        if (!slug) {
          const response = await fetch("/api/birthdays");

          if (!response.ok) {
            throw new Error(
              "Nu am putut încărca zilele de naștere."
            );
          }

          const data = await response.json();

          const list = Array.isArray(data)
            ? data
            : data.birthdays ?? [];

          setBirthdays(list);
          return;
        }

        /*
         * We have a slug, so load that birthday.
         */
        const response = await fetch(
          `/api/birthdays/${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          throw new Error(
            "Nu am putut încărca ziua de naștere."
          );
        }

        const data = await response.json();

        setBirthday(data);

        setName(data.name ?? "");
        setTitle(data.title ?? "");
        setMessage(data.message ?? "");
        setBirthdayDate(data.birthday_date ?? "");
        setBirthdayTime(data.birthday_time ?? "00:00");
        setTimezone(
          data.timezone ?? "Europe/Bucharest"
        );
        setLanguage(data.language ?? "ro");
        setTheme(data.theme ?? "default");
        setEnableConfetti(
          data.enable_confetti ?? true
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "A apărut o eroare."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!slug) {
      setError(
        "Selectează mai întâi o zi de naștere."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/birthdays/${encodeURIComponent(slug)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            title,
            message,
            birthday_date: birthdayDate,
            birthday_time: birthdayTime,
            timezone,
            language,
            theme,
            enable_confetti: enableConfetti,
          }),
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null);

        throw new Error(
          data?.error ||
            "Nu am putut salva modificările."
        );
      }

      const updated = await response.json();

      setBirthday(updated);

      alert("Modificările au fost salvate! 💗");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "A apărut o eroare."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-zinc-400">
          Se încarcă...
        </p>
      </main>
    );
  }

  /*
   * No slug:
   * Show a birthday selector.
   */
  if (!slug) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/dashboard")
              }
              className="mb-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
            >
              ← Înapoi
            </button>

            <p className="text-sm text-zinc-500">
              Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Configurează un birthday
            </h1>

            <p className="mt-2 text-zinc-400">
              Alege ziua de naștere pe care vrei să o
              modifici.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {birthdays.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="text-4xl">🎂</div>

              <h2 className="mt-4 text-xl font-semibold">
                Nu există birthdays
              </h2>

              <p className="mt-2 text-zinc-400">
                Creează mai întâi o zi de naștere din
                dashboard.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/dashboard")
                }
                className="mt-6 rounded-xl bg-pink-500 px-5 py-3 font-semibold transition hover:bg-pink-400"
              >
                Înapoi la dashboard
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {birthdays.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/configure?slug=${encodeURIComponent(
                        item.slug
                      )}`
                    )
                  }
                  className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-pink-400/40 hover:bg-pink-500/5"
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.name || item.title}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      /birthday/{item.slug}
                    </p>

                    {item.birthday_date && (
                      <p className="mt-2 text-sm text-zinc-400">
                        {item.birthday_date}
                      </p>
                    )}
                  </div>

                  <span className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-pink-400">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  /*
   * Error while loading a specific birthday.
   */
  if (error && !birthday) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Eroare
          </h1>

          <p className="mt-3 text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/dashboard")
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Înapoi
          </button>
        </div>
      </main>
    );
  }

  /*
   * Actual configuration form.
   */
  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">
              Configurare
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {name || "Birthday"}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              /birthday/{slug}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/dashboard")
            }
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            Înapoi
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">
              Birthday
            </h2>

            <div className="mt-5 grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Nume
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-pink-400"
                  placeholder="Sophi"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Titlu
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-pink-400"
                  placeholder="La mulți ani, Sophi 💗"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Mesaj
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-pink-400"
                  placeholder="Scrie un mesaj..."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Data
                  </label>

                  <input
                    type="date"
                    value={birthdayDate}
                    onChange={(e) =>
                      setBirthdayDate(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-400">
                    Ora
                  </label>

                  <input
                    type="time"
                    value={birthdayTime}
                    onChange={(e) =>
                      setBirthdayTime(
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Timezone
                </label>

                <select
                  value={timezone}
                  onChange={(e) =>
                    setTimezone(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
                >
                  <option value="Europe/Bucharest">
                    Europe/Bucharest
                  </option>

                  <option value="Europe/London">
                    Europe/London
                  </option>

                  <option value="Europe/Paris">
                    Europe/Paris
                  </option>

                  <option value="Europe/Berlin">
                    Europe/Berlin
                  </option>

                  <option value="America/New_York">
                    America/New_York
                  </option>

                  <option value="America/Los_Angeles">
                    America/Los_Angeles
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Limbă
                </label>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value as
                        | "ro"
                        | "en"
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
                >
                  <option value="ro">
                    Română 🇷🇴
                  </option>

                  <option value="en">
                    English 🇬🇧
                  </option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">
              Appearance
            </h2>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-400">
                Theme
              </label>

              <select
                value={theme}
                onChange={(e) =>
                  setTheme(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 outline-none"
              >
                <option value="default">
                  Default
                </option>

                <option value="colorful">
                  Colorful
                </option>

                <option value="neon">
                  Neon
                </option>

                <option value="galaxy">
                  Galaxy
                </option>

                <option value="minimal">
                  Minimal
                </option>
              </select>
            </div>

            <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-medium">
                  Confetti
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Show confetti when the birthday
                  starts.
                </p>
              </div>

              <input
                type="checkbox"
                checked={enableConfetti}
                onChange={(e) =>
                  setEnableConfetti(
                    e.target.checked
                  )
                }
                className="h-5 w-5 accent-pink-500"
              />
            </label>
          </section>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-pink-500 px-6 py-4 font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Se salvează..."
              : "Salvează modificările 💗"}
          </button>
        </form>
      </div>
    </main>
  );
}