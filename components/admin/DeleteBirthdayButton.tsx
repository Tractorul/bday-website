"use client";

import { useState } from "react";

type Props = {
  id: string;
  name: string;
};

export default function DeleteBirthdayButton({
  id,
  name,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch("/api/admin/birthdays", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const text = await response.text();

      let result: {
        error?: string;
        success?: boolean;
      } = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          `Server returned invalid response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            `Delete failed with status ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error("Delete failed.");
      }

      // Refresh the server-rendered birthday list.
      window.location.reload();
    } catch (error) {
      console.error("Delete birthday error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to delete birthday."
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}