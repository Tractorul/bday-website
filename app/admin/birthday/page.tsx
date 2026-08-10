import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BirthdayForm from "@/components/admin/BirthdayForm";

export default async function BirthdayPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/dashboard"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 text-4xl font-bold">
          Birthday
        </h1>

        <p className="mt-2 text-zinc-400">
          Configure the birthday experience.
        </p>

        <BirthdayForm />
      </div>
    </main>
  );
}