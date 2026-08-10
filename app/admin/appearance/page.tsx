import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppearanceForm from "@/components/admin/AppearanceForm";

export default async function AppearancePage() {
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
          Appearance
        </h1>

        <p className="mt-2 text-zinc-400">
          Customize the look and feel of the birthday page.
        </p>

        <AppearanceForm />
      </div>
    </main>
  );
}