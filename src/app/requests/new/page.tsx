import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { getAvailableTitles } from "@/lib/api";
import type { AvailableTitle } from "@/types/request-flow";

import AvailableTitleList from "./available-title-list";

export default async function NewRequestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const rawUserId = session.user?.id;
  const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId ?? NaN);
  const accessToken = session.user?.accessToken ?? null;

  if (!Number.isFinite(userId) || !accessToken) {
    redirect("/dashboard");
  }

  let availableTitles: AvailableTitle[] = [];
  let fetchError: string | null = null;

  try {
    availableTitles = await getAvailableTitles(userId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error al cargar títulos disponibles", error);
    }
    fetchError = "No fue posible obtener los títulos disponibles. Intentá nuevamente.";
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-0">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Nueva solicitud</p>
        <h1 className="text-3xl font-bold text-slate-900">Seleccioná el título a solicitar</h1>
        <p className="text-sm text-slate-600">
          Mostramos únicamente los títulos que la Secretaría registró como disponibles para iniciar una nueva solicitud.
        </p>
      </header>

      <AvailableTitleList
        availableTitles={availableTitles}
        userId={userId}
        accessToken={accessToken}
        fetchError={fetchError}
      />

      <div className="mt-8 flex justify-end">
        <Link
          href="/dashboard"
          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-700 hover:text-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
