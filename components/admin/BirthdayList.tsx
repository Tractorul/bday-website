import type { Birthday } from "@/types/birthday";
import Link from "next/link";
import DeleteBirthdayButton from "./DeleteBirthdayButton";


type Props = {
  birthdays: Birthday[];
};

export default function BirthdayList({
  birthdays,
}: Props) {
  if (birthdays.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="text-5xl">
          🎂
        </div>

        <h2 className="mt-4 text-xl font-semibold">
          No birthdays yet
        </h2>

        <p className="mt-2 text-zinc-500">
          Create your first birthday configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {birthdays.map((birthday) => (
        <div
          key={birthday.id}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold">
                  {birthday.name}
                </h2>

                {birthday.is_primary && (
                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                    ⭐ Primary
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                /birthday/{birthday.slug}
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                {birthday.birthday_date} ·{" "}
                {birthday.birthday_time} ·{" "}
                {birthday.timezone}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/birthday/${birthday.slug}`}
                target="_blank"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                View
              </Link>

              <Link
                href={`/admin/configure?slug=${birthday.slug}`}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Edit
              </Link>

              <DeleteBirthdayButton
                id={birthday.id}
                name={birthday.name}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}