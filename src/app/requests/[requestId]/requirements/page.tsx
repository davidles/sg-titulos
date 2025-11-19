import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { getRequestRequirements } from "@/lib/api";
import type { RequestRequirementItem } from "@/types/request-flow";

import RequestRequirementsClient from "./request-requirements-client";

type RequestRequirementsPageProps = {
  params: Promise<{
    requestId: string;
  }>;
};

export default async function RequestRequirementsPage({ params }: RequestRequirementsPageProps) {
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

  const resolvedParams = await params;
  const parsedRequestId = Number(resolvedParams.requestId);

  if (!Number.isFinite(parsedRequestId) || parsedRequestId <= 0) {
    notFound();
  }

  let items: RequestRequirementItem[] = [];
  let fetchError: string | null = null;

  try {
    items = await getRequestRequirements(parsedRequestId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error al obtener requisitos de la solicitud", error);
    }
    fetchError = "No fue posible obtener los requisitos de la solicitud. Intentá nuevamente más tarde.";
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-0">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Requisitos documentales</p>
          <h1 className="text-3xl font-bold text-slate-900">Subí la documentación requerida</h1>
          <p className="text-sm text-slate-600">
            Revisá el listado de requisitos asociados a esta solicitud y cargá los archivos necesarios. Podés
            reemplazar un archivo si necesitás actualizarlo.
          </p>
        </header>

        <RequestRequirementsClient
          requestId={parsedRequestId}
          items={items}
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
    </div>
  );
}
