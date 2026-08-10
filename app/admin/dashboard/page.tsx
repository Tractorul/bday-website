import Link from "next/link";
import {
  createAdminClient,
  requireAdmin,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BirthdayList from "@/components/admin/BirthdayList";

export default async function AdminDashboard() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/admin/login");
  }

  const supabase = await createAdminClient();

  const { data: birthdays, error } = await supabase
    .from("birthday_configs")
    .select("*")
    .order("name");

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
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
            <BirthdayList birthdays={birthdays ?? []} />
          </div>
        )}
      </div>
    </main>
  );
}