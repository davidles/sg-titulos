import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { authOptions } from "@/lib/auth/options";
import type { MenuOption, Solicitud } from "@/types/portal";

import { StatusBadge } from "@/app/dashboard/status-badge";
import { fetchPortalData } from "@/app/dashboard/portal-data";
import logoImage from "@/app/logo.png";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userName = session.user?.name ?? "María González";
  const userLegajo = session.user?.legajo ?? "001245";
  const userUsername = session.user?.username ?? "mgonzalez";

  const { solicitudes, menuOptions } = await fetchPortalData();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Image src={logoImage} alt="Sistema de Gestión de Solicitudes de Titulos" className="h-24 w-auto" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={userName ?? "Usuario"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                    {userName?.slice(0, 2).toUpperCase() ?? "USR"}
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{userName}</p>
                <p className="text-xs">Legajo: {userLegajo}</p>
                <p className="text-xs">Usuario: {userUsername}</p>
              </div>
            </div>
            <SignOutButton className="border-slate-300 text-slate-700 hover:border-blue-700 hover:text-blue-700">
              Cerrar sesión
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-10 px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside>
            <div className="flex h-full flex-col justify-around rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Sistema control de solicitudes de título</h3>
                <p className="text-sm text-slate-600">
                  Accedé a las opciones principales para iniciar, buscar o subsanar solicitudes de forma ágil.
                </p>
              </div>
              <div className="mt-8 space-y-4">
                {menuOptions.map((option: MenuOption) => (
                  <button
                    key={option.title}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    type="button"
                  >
                    <span>{option.title}</span>
                    <span className="text-base" aria-hidden>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">Seleccionar título</h3>
              <p className="mt-2 text-sm text-slate-600">
                Elegí el trámite que necesitás gestionar para avanzar con la emisión de tu título universitario.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Solicitudes en curso</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Visualizá tus solicitudes, consultá su estado y accedé a las acciones disponibles para cada título.
                  </p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Título
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Carrera
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Facultad
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {solicitudes.map((solicitud: Solicitud) => (
                      <tr key={solicitud.titulo}>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">{solicitud.titulo}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{solicitud.carrera}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{solicitud.facultad}</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={solicitud.estado} />
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-blue-700">{solicitud.accion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          <p>Secretaría General – Universidad [Nombre]</p>
          <p>Atención al usuario: [correo institucional] | [Teléfono] · Horario de atención: [horario]</p>
        </div>
      </footer>
    </div>
  );
}
