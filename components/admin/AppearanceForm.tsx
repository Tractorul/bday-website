"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const themes = [
  {
    id: "elegant",
    name: "Elegant",
    description: "Clean, classy and minimal.",
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Bright and playful birthday vibes.",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Glowing colors and a modern look.",
  },
  {
    id: "galaxy",
    name: "Galaxy",
    description: "Dark space-inspired celebration.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and distraction-free.",
  },
];

export default function AppearanceForm() {
  const [slug, setSlug] = useState("");
  const [theme, setTheme] = useState("elegant");
  const [primaryColor, setPrimaryColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#a855f7");
  const [confetti, setConfetti] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    const supabase = createClient();

    const { error } = await supabase
      .from("birthday_configs")
      .update({
        theme,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        enable_confetti: confetti,
      })
      .eq("slug", slug);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSuccess("Appearance saved!");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Birthday page</h2>

        <p className="mt-2 text-sm text-zinc-400">
          Enter the slug of the birthday configuration you want to edit.
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm text-zinc-300">
            Birthday slug
          </label>

          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="razvan"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
          />

          <p className="mt-2 text-xs text-zinc-500">
            This must match the slug used when creating the birthday.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Theme</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {themes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                theme === item.id
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.name}</h3>

                {theme === item.id && (
                  <span className="text-sm text-white">✓</span>
                )}
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                {item.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Colors</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Primary color
            </label>

            <div className="flex gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
              />

              <input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Secondary color
            </label>

            <div className="flex gap-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="h-12 w-16 cursor-pointer rounded-lg border-0 bg-transparent"
              />

              <input
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Celebration effects</h2>

        <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
          <div>
            <p className="font-medium">Confetti</p>

            <p className="text-sm text-zinc-500">
              Launch confetti when the countdown reaches zero.
            </p>
          </div>

          <input
            type="checkbox"
            checked={confetti}
            onChange={(e) => setConfetti(e.target.checked)}
            className="h-5 w-5"
          />
        </label>
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
        {saving ? "Saving..." : "Save appearance"}
      </button>
    </form>
  );
}