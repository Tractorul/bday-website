"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBirthdayPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthdayTime, setBirthdayTime] = useState("00:00");
  const [timezone, setTimezone] = useState("Europe/Bucharest");
  const [language, setLanguage] = useState("ro");
  const [theme, setTheme] = useState("default");
  const [enableConfetti, setEnableConfetti] = useState(true);
  const [isPrimary, setIsPrimary] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }

    if (!title) {
      setTitle(
        language === "ro"
          ? `La mulți ani, ${value}!`
          : `Happy birthday, ${value}!`
      );
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    if (!name.trim()) {
      setError("Numele este obligatoriu.");
      setLoading(false);
      return;
    }

    if (!slug.trim()) {
      setError("Slug-ul este obligatoriu.");
      setLoading(false);
      return;
    }

    if (!birthdayDate) {
      setError("Data nașterii este obligatorie.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/birthdays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          title:
            title.trim() ||
            (language === "ro"
              ? `La mulți ani, ${name.trim()}!`
              : `Happy birthday, ${name.trim()}!`),
          message: message.trim(),
          birthday_date: birthdayDate,
          birthday_time: birthdayTime || "00:00",
          timezone,
          language,
          theme,
          enable_confetti: enableConfetti,
          is_primary: isPrimary,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        throw new Error(
          `API-ul a returnat ceva care nu este JSON. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Nu am putut crea ziua de naștere."
        );
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "A apărut o eroare."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="mb-6 text-sm text-zinc-400 transition hover:text-white"
          >
            ← Înapoi la dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Creează o zi de naștere
          </h1>

          <p className="mt-2 text-zinc-400">
            Configurează o nouă pagină de aniversare.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* BASIC INFO */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Informații de bază
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Nume
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                  placeholder="Sophi"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      generateSlug(e.target.value)
                    )
                  }
                  placeholder="sophi"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-pink-500"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Pagina va fi disponibilă la:
                  {" "}
                  /birthday/{slug || "sophi"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Titlu
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="La mulți ani, Sophi! 💗"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Mesaj
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  rows={5}
                  placeholder="Un mesaj special pentru ea..."
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-pink-500"
                />
              </div>
            </div>
          </section>

          {/* BIRTHDAY */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Data aniversării
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Data
                </label>

                <input
                  type="date"
                  value={birthdayDate}
                  onChange={(e) =>
                    setBirthdayDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Ora
                </label>

                <input
                  type="time"
                  value={birthdayTime}
                  onChange={(e) =>
                    setBirthdayTime(e.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-zinc-300">
                Fus orar
              </label>

              <select
                value={timezone}
                onChange={(e) =>
                  setTimezone(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-pink-500"
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
          </section>

          {/* LANGUAGE */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Limbă
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLanguage("ro");

                  if (
                    title ===
                    `Happy birthday, ${name}!`
                  ) {
                    setTitle(
                      `La mulți ani, ${name}!`
                    );
                  }
                }}
                className={`rounded-xl border px-4 py-3 transition ${
                  language === "ro"
                    ? "border-pink-500 bg-pink-500/10 text-pink-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                🇷🇴 Română
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage("en");

                  if (
                    title ===
                    `La mulți ani, ${name}!`
                  ) {
                    setTitle(
                      `Happy birthday, ${name}!`
                    );
                  }
                }}
                className={`rounded-xl border px-4 py-3 transition ${
                  language === "en"
                    ? "border-pink-500 bg-pink-500/10 text-pink-300"
                    : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </section>

          {/* APPEARANCE */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Appearance
            </h2>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">
                Temă
              </label>

              <select
                value={theme}
                onChange={(e) =>
                  setTheme(e.target.value)
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-pink-500"
              >
                <option value="default">
                  Default
                </option>

                <option value="dreamy">
                  Dreamy 💗
                </option>

                <option value="romantic">
                  Romantic 🌸
                </option>

                <option value="pink">
                  Pink ✨
                </option>

                <option value="minimal">
                  Minimal
                </option>
              </select>
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={enableConfetti}
                onChange={(e) =>
                  setEnableConfetti(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-pink-500"
              />

              <span className="text-sm text-zinc-300">
                Activează confetti 🎉
              </span>
            </label>
          </section>

          {/* PRIMARY */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold">
              Homepage
            </h2>

            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) =>
                  setIsPrimary(
                    e.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-pink-500"
              />

              <div>
                <p className="text-sm font-medium">
                  Setează ca aniversare principală
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Dacă este activată, această
                  aniversare va apărea pe
                  homepage cu countdown-ul
                  principal.
                </p>
              </div>
            </label>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/dashboard")
              }
              disabled={loading}
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 disabled:opacity-50"
            >
              Anulează
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Se creează..."
                : "Creează ziua 🎂"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}