import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BirthdayExperience from "@/components/birthday/BirthdayExperience";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("birthday_configs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold">
            Database error
          </h1>

          <p className="mt-3 text-zinc-400">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    notFound();
  }

  return (
    <BirthdayExperience
      birthday={data}
    />
  );
}