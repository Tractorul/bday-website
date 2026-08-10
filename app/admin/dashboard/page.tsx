import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BirthdayList from "@/components/admin/BirthdayList";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: birthdays, error } = await supabase
    .from("birthday_configs")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-600">
              Admin
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Birthdays
            </h1>

            <p className="mt-2 text-zinc-500">
              Manage your birthday experiences.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Open site
            </Link>

            {/* Updated path to point to the new creation page */}
            <Link
              href="/admin/configure/new"
              className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              + New birthday
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            Failed to load birthdays:
            <br />
            {error.message}
          </div>
        ) : (
          <div className="mt-10">
            <BirthdayList
              birthdays={birthdays ?? []}
            />
          </div>
        )}
      </div>
    </main>
  );
}