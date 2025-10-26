import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { authOptions } from "@/lib/auth/options";
import type { DashboardRequestSummary } from "@/types/portal";

import { StatusBadge } from "@/app/dashboard/status-badge";
import { fetchPortalData } from "@/app/dashboard/portal-data";
import logoImage from "@/app/logo.png";
import { fallbackDashboardData } from "@/data/portal";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user?.firstName ?? null;
  const lastName = session.user?.lastName ?? null;
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || session.user?.username || "Usuario";
  const initialsForAvatar = [firstName?.trim().charAt(0), lastName?.trim().charAt(0)]
    .filter(Boolean)
    .join("")
    .toUpperCase() || session.user?.username?.slice(0, 2).toUpperCase() || "US";
  const userDocumentNumber = session.user?.documentNumber ?? "Documento no disponible";
  const userUsername = session.user?.username ?? "Sin usuario";

  const { requests } = await fetchPortalData(session);
  const actionButtons = fallbackDashboardData.menuOptions;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:px-6">
          <div className="flex items-center justify-center gap-4 sm:justify-start">
            <Image src={logoImage} alt="Sistema de Gestión de Solicitudes de Titulos" className="h-16 w-auto sm:h-20 md:h-24" priority />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={displayName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                    {initialsForAvatar}
                  </span>
                )}
              </div>
              <div className="text-center text-sm text-slate-600 sm:text-left">
                <p className="font-semibold text-slate-900 capitalize">{displayName}</p>
                <p className="text-xs">Legajo: {userDocumentNumber}</p>
                <p className="text-xs">Usuario: {userUsername}</p>
              </div>
            </div>
            <SignOutButton className="w-full text-center border-slate-300 text-slate-700 hover:border-blue-700 hover:text-blue-700 sm:w-auto">
              Cerrar sesión
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
          <aside>
            <div className="flex h-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="space-y-4 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-slate-900">Sistema control de solicitudes de título</h3>
                <p className="text-sm text-slate-600">
                  Accedé a las opciones principales para iniciar, buscar o subsanar solicitudes de forma ágil.
                </p>
              </div>
              <div className="space-y-3">
                {actionButtons.map((option) => (
                  <button
                    key={option.id}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:px-5 sm:py-4"
                    type="button"
                  >
                    <span>{option.name ?? "Opción disponible"}</span>
                    <span className="text-base" aria-hidden>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-slate-900">Seleccionar título</h3>
              <p className="mt-2 text-sm text-slate-600">
                Elegí el trámite que necesitás gestionar para avanzar con la emisión de tu título universitario.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Solicitudes en curso</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Visualizá tus solicitudes, consultá su estado y accedé a las acciones disponibles para cada título.
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="hidden min-w-full divide-y divide-slate-200 lg:table">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Solicitud
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Fecha
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Estado
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Próximo paso
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {requests.map((request: DashboardRequestSummary) => (
                          <tr key={request.idRequest}>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">{request.requestTypeName ?? `Solicitud #${request.idRequest}`}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {request.generatedAt ? new Date(request.generatedAt).toLocaleDateString() : "Sin fecha"}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="space-y-1">
                                <StatusBadge status={request.statusName ?? "Sin estado"} />
                                {request.statusDescription ? (
                                  <p className="text-xs text-slate-500">{request.statusDescription}</p>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-blue-700">{request.nextAction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4 lg:hidden">
                  {requests.map((request: DashboardRequestSummary) => (
                    <article key={request.idRequest} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <header className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-slate-900">{request.requestTypeName ?? `Solicitud #${request.idRequest}`}</p>
                        <p className="text-xs text-slate-500">
                          Fecha: {request.generatedAt ? new Date(request.generatedAt).toLocaleDateString() : "Sin fecha"}
                        </p>
                      </header>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <StatusBadge status={request.statusName ?? "Sin estado"} />
                          {request.statusDescription ? (
                            <span className="text-xs text-slate-500">{request.statusDescription}</span>
                          ) : null}
                        </div>
                        <span className="text-sm font-semibold text-blue-700">{request.nextAction}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Los estados se actualizan automáticamente. Ante dudas, contactá a la Secretaría General.
              </p>
            </div>

          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Secretaría General – CRUC IUA Córdoba</p>
          <p>sgeneral@iua.edu.ar · 351-4434555 · Lunes a viernes de 9:00 a 13:00</p>
        </div>
      </footer>
    </div>
  );
}
