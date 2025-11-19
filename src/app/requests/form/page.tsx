import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { getRequestFormData } from "@/lib/api";
import type { RequestFormData } from "@/types/request-flow";

import RequestFormWizard from "./request-form-wizard";

export default async function RequestFormPage() {
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

  let initialData: RequestFormData | null = null;
  let fetchError: string | null = null;

  try {
    initialData = await getRequestFormData(userId, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error al obtener datos del formulario", error);
    }
    fetchError = "No pudimos cargar el formulario. Intentá nuevamente más tarde.";
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-0">
        <header className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Formulario de solicitud</p>
          <h1 className="text-3xl font-bold text-slate-900">Completá los datos requeridos</h1>
          <p className="text-sm text-slate-600">
            Revisá y actualizá tus datos personales. Podés guardar cada paso y continuar luego.
          </p>
        </header>

        <RequestFormWizard
          initialData={initialData}
          userId={userId}
          accessToken={accessToken}
          fetchError={fetchError}
        />
      </div>
    </div>
  );
}
