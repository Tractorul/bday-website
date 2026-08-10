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
  const [language, setLanguage] = useState<"ro" | "en">("ro");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);

    if (!slug) {
      const generated = value
        .toLowerCase()
        .trim()
        .replace(/ă/g, "a")
        .replace(/â/g, "a")
        .replace(/î/g, "i")
        .replace(/ș/g, "s")
        .replace(/ț/g, "t")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setSlug(generated);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/birthdays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          title,
          message,
          birthday_date: birthdayDate,
          birthday_time: birthdayTime,
          timezone,
          language,
          theme: "default",
          enable_confetti: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Nu am putut crea birthday-ul."
        );
      }

      router.push(
        `/admin/configure?slug=${encodeURIComponent(
          data.slug ?? slug
        )}`
      );
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

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/dashboard")
          }
          className="mb-6 rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
        >
          ← Înapoi
        </button>

        <div className="mb-8">
          <p className="text-sm text-zinc-500">
            Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            New Birthday 🎂
          </h1>

          <p className="mt-2 text-zinc-400">
            Creează o nouă experiență de birthday.
          </p>
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
                    handleNameChange(e.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-pink-400"
                  placeholder="Sophi"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  URL slug
                </label>

                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-pink-400"
                  placeholder="sophi"
                />

                <p className="mt-2 text-xs text-zinc-500">
                  Va fi disponibil la{" "}
                  <span className="text-zinc-300">
                    /birthday/{slug || "sophi"}
                  </span>
                </p>
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
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-pink-400"
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
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-pink-400"
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
                      setBirthdayDate(e.target.value)
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
                      setBirthdayTime(e.target.value)
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
                      e.target.value as "ro" | "en"
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

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-pink-500 px-6 py-4 font-semibold transition hover:bg-pink-400 disabled:opacity-50"
          >
            {saving
              ? "Se creează..."
              : "Create Birthday 🎀"}
          </button>
        </form>
      </div>
    </main>
  );
}