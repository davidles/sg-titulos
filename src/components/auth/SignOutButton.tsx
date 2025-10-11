"use client";

import { signOut } from "next-auth/react";

import type { ReactNode } from "react";

type SignOutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-700 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`${baseClasses} ${className ?? ""}`.trim()}
      type="button"
    >
      {children ?? "Cerrar sesión"}
    </button>
  );
}
