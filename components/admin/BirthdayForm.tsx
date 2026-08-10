"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BirthdayForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [birthdayTime, setBirthdayTime] = useState("00:00");
  const [timezone, setTimezone] = useState("Europe/Bucharest");
  const [title, setTitle] = useState("Happy Birthday!");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("elegant");
  const [confetti, setConfetti] = useState(true);
  const [music, setMusic] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    const supabase = createClient();

    if (isPrimary) {
      const { error: resetError } = await supabase
        .from("birthday_configs")
        .update({ is_primary: false })
        .eq("is_primary", true);

      if (resetError) {
        setError(resetError.message);
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from("birthday_configs")
      .upsert(
        {
          slug,
          name,
          birthday_date: birthdayDate,
          birthday_time: birthdayTime,
          timezone,
          title,
          message,
          theme,
          enable_confetti: confetti,
          enable_music: music,
          is_primary: isPrimary,
        },
        {
          onConflict: "slug",
        }
      );

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSuccess("Birthday configuration saved!");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Basic information</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Name
            </label>

            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              URL slug
            </label>

            <input
              required
              value={slug}
              onChange={(e) =>
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-")
                )
              }
              placeholder="alex"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <p className="mt-2 text-xs text-zinc-500">
              Birthday page: /birthday/{slug || "alex"}
            </p>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
          <div>
            <p className="font-medium">⭐ Primary birthday</p>

            <p className="mt-1 text-sm text-zinc-500">
              Show this birthday on the main homepage at /.
            </p>
          </div>

          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="h-5 w-5"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">
          Birthday date & time
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Birthday
            </label>

            <input
              required
              type="date"
              value={birthdayDate}
              onChange={(e) => setBirthdayDate(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Time
            </label>

            <input
              required
              type="time"
              value={birthdayTime}
              onChange={(e) => setBirthdayTime(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Timezone
            </label>

            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
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
              <option value="Asia/Tokyo">
                Asia/Tokyo
              </option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">
          Birthday message
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Title
            </label>

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Message
            </label>

            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Have an amazing birthday! 🎂"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">
          Celebration
        </h2>

        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
            <div>
              <p className="font-medium">Confetti</p>
              <p className="text-sm text-zinc-500">
                Launch confetti when the birthday begins.
              </p>
            </div>

            <input
              type="checkbox"
              checked={confetti}
              onChange={(e) => setConfetti(e.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
            <div>
              <p className="font-medium">Music</p>
              <p className="text-sm text-zinc-500">
                Enable background music.
              </p>
            </div>

            <input
              type="checkbox"
              checked={music}
              onChange={(e) => setMusic(e.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Theme</h2>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="mt-6 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
        >
          <option value="elegant">Elegant</option>
          <option value="colorful">Colorful</option>
          <option value="neon">Neon</option>
          <option value="galaxy">Galaxy</option>
          <option value="minimal">Minimal</option>
        </select>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-300">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save birthday"}
      </button>
    </form>
  );
}