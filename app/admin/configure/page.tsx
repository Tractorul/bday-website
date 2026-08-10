"use client";

import type { Birthday } from "@/types/birthday";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ConfigurePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = searchParams.get("slug");

  const [birthday, setBirthday] = useState<Birthday | null>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthdayTime, setBirthdayTime] = useState("00:00");
  const [timezone, setTimezone] = useState("Europe/Bucharest");
  const [language, setLanguage] = useState<"ro" | "en">("ro");
  const [theme, setTheme] = useState("default");
  const [enableConfetti, setEnableConfetti] = useState(true);

  const [loading, setLoading] = useState(Boolean(slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function loadBirthday() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/birthdays", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Nu am putut încărca zilele de naștere."
          );
        }

        const list: Birthday[] = Array.isArray(data)
          ? data
          : data.birthdays ?? [];

        const found = list.find((item) => item.slug === slug);

        if (!found) {
          throw new Error(
            `Nu am găsit ziua de naștere "${slug}".`
          );
        }

        setBirthday(found);

        setName(found.name ?? "");
        setTitle(found.title ?? "");
        setMessage(found.message ?? "");
        setBirthdayDate(found.birthday_date ?? "");
        setBirthdayTime(found.birthday_time ?? "00:00");
        setTimezone(found.timezone ?? "Europe/Bucharest");
        setLanguage(found.language === "en" ? "en" : "ro");
        setTheme(found.theme ?? "default");
        setEnableConfetti(found.enable_confetti ?? true);
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

    loadBirthday();
  }, [slug]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const generatedSlug = slug || createSlug(name);

    if (!name.trim()) {
      setError("Introdu numele persoanei.");
      setSaving(false);
      return;
    }

    if (!birthdayDate) {
      setError("Alege data zilei de naștere.");
      setSaving(false);
      return;
    }

    if (!generatedSlug) {
      setError("Numele nu poate fi folosit pentru generarea linkului.");
      setSaving(false);
      return;
    }

    try {
      
      if (!slug) {
        const response = await fetch("/api/admin/birthdays", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            slug: generatedSlug,
            title:
              title.trim() ||
              (language === "ro"
                ? `La mulți ani, ${name.trim()}!`
                : `Happy Birthday, ${name.trim()}!`),
            message: message.trim(),
            birthday_date: birthdayDate,
            birthday_time: birthdayTime || "00:00",
            timezone,
            language,
            theme,
            enable_confetti: enableConfetti,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Nu am putut crea ziua de naștere."
          );
        }

        setSuccess("Ziua de naștere a fost creată! 🎂");

        setTimeout(() => {
          router.push(
            `/admin/configure?slug=${encodeURIComponent(
              generatedSlug
            )}`
          );
        }, 500);

        return;
      }

      
      const response = await fetch(
        `/api/admin/birthdays?slug=${encodeURIComponent(slug)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            name: name.trim(),
            title: title.trim(),
            message: message.trim(),
            birthday_date: birthdayDate,
            birthday_time: birthdayTime || "00:00",
            timezone,
            language,
            theme,
            enable_confetti: enableConfetti,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "API-ul nu poate actualiza încă această zi de naștere."
        );
      }

      setBirthday(data);
      setSuccess("Modificările au fost salvate! 💗");
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
        <div className="text-center">
          <div className="text-4xl">🎂</div>
          <p className="mt-4 text-zinc-400">
            Se încarcă...
          </p>
        </div>
      </main>
    );
  }

  const isEditing = Boolean(slug);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="mb-6 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            ← Dashboard
          </button>

          <p className="text-sm font-medium text-pink-400">
            Birthday Website
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {isEditing
              ? `Editează ${name || "birthday-ul"}`
              : "Creează un birthday"}
          </h1>

          <p className="mt-3 text-zinc-400">
            {isEditing
              ? "Modifică setările acestei pagini."
              : "Configurează o nouă pagină de zi de naștere."}
          </p>

          {isEditing && slug && (
            <p className="mt-2 text-sm text-zinc-600">
              /birthday/{slug}
            </p>
          )}
        </header>

        {/* Errors */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <div className="font-semibold">
              Ceva nu a mers 😭
            </div>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Birthday */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Birthday 🎂
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Informațiile principale ale zilei de naștere.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Nume
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isEditing}
                  placeholder="Sophi"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                {!isEditing && (
                  <p className="mt-2 text-xs text-zinc-600">
                    Numele va fi folosit pentru generarea linkului.
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Titlu
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    language === "ro"
                      ? "La mulți ani, Sophi! 💗"
                      : "Happy Birthday, Sophi! 💗"
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-pink-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Mesaj
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder={
                    language === "ro"
                      ? "Scrie mesajul pe care vrei să îl vadă..."
                      : "Write the message you want them to see..."
                  }
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-pink-400"
                />
              </div>

              {/* Date + Time */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Data 🎂
                  </label>

                  <input
                    type="date"
                    value={birthdayDate}
                    onChange={(e) =>
                      setBirthdayDate(e.target.value)
                    }
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-300">
                    Ora sărbătorii ⏰
                  </label>

                  <input
                    type="time"
                    value={birthdayTime}
                    onChange={(e) =>
                      setBirthdayTime(e.target.value)
                    }
                    required
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Fus orar
                </label>

                <select
                  value={timezone}
                  onChange={(e) =>
                    setTimezone(e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3.5 text-white outline-none focus:border-pink-400"
                >
                  <option value="Europe/Bucharest">
                    Europe/Bucharest 🇷🇴
                  </option>
                  <option value="Europe/London">
                    Europe/London 🇬🇧
                  </option>
                  <option value="Europe/Paris">
                    Europe/Paris 🇫🇷
                  </option>
                  <option value="Europe/Berlin">
                    Europe/Berlin 🇩🇪
                  </option>
                  <option value="America/New_York">
                    America/New_York 🇺🇸
                  </option>
                  <option value="America/Los_Angeles">
                    America/Los_Angeles 🇺🇸
                  </option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Limbă
                </label>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(
                      e.target.value === "en" ? "en" : "ro"
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3.5 text-white outline-none focus:border-pink-400"
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

          {/* Appearance */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl sm:p-7">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Appearance ✨
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Alege cum va arăta experiența de birthday.
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Theme
              </label>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3.5 text-white outline-none focus:border-pink-400"
              >
                <option value="default">
                  Default
                </option>

                <option value="colorful">
                  Colorful 🌈
                </option>

                <option value="neon">
                  Neon ⚡
                </option>

                <option value="galaxy">
                  Galaxy 🌌
                </option>

                <option value="minimal">
                  Minimal 🤍
                </option>

                <option value="pink-dream">
                  Pink Dream 🎀
                </option>
              </select>

              <p className="mt-2 text-xs text-zinc-600">
                Temele vor controla aspectul paginii de birthday.
              </p>
            </div>

            {/* Confetti */}
            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-medium">
                  Confetti 🎉
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Arată confetti când începe ziua de naștere.
                </p>
              </div>

              <input
                type="checkbox"
                checked={enableConfetti}
                onChange={(e) =>
                  setEnableConfetti(e.target.checked)
                }
                className="h-5 w-5 shrink-0 accent-pink-500"
              />
            </div>
          </section>

          {/* Save */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/admin/dashboard")}
              className="order-2 w-full rounded-2xl border border-white/10 px-6 py-4 font-semibold text-zinc-300 transition hover:bg-white/10 sm:order-1"
            >
              Anulează
            </button>

            <button
              type="submit"
              disabled={saving}
              className="order-1 w-full rounded-2xl bg-pink-500 px-6 py-4 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2"
            >
              {saving
                ? "Se salvează..."
                : isEditing
                  ? "Salvează modificările 💗"
                  : "Creează birthday 🎂"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ConfigurePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
          <p className="text-zinc-400">
            Se încarcă...
          </p>
        </main>
      }
    >
      <ConfigurePageContent />
    </Suspense>
  );
}