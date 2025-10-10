import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { authOptions } from "@/lib/auth/options";
import type { MenuOption, Solicitud } from "@/types/portal";

import { StatusBadge } from "@/app/dashboard/status-badge";
import { fetchPortalData } from "@/app/dashboard/portal-data";

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
        <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Sistema de Gestión de Títulos Universitarios
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Panel principal del egresado</h1>
            <p className="mt-2 text-sm text-slate-600">
              Gestione sus solicitudes, acceda a documentación y siga el estado de cada trámite.
            </p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{userName}</p>
            <p>Legajo: {userLegajo}</p>
            <p>Usuario: {userUsername}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
          <div className="flex items-center gap-4">
            <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-lg font-semibold text-white sm:flex">
              SG
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Secretaría General – Sistema de Gestión de Títulos
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Bienvenido/a, {userName}</h2>
            </div>
          </div>
          <SignOutButton />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Accesos rápidos</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Consulte el estado de cada solicitud, inicie nuevas gestiones y subsane observaciones desde este panel.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Menú de solicitudes</h2>
              <p className="mt-3 text-sm text-slate-600">
                Acceda rápidamente a las principales gestiones disponibles para la administración de sus títulos universitarios.
              </p>
            </div>
            <nav className="space-y-4">
              {menuOptions.map((option: MenuOption) => (
                <div
                  key={option.title}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-600 hover:shadow"
                >
                  <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                  <button className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700">
                    Gestionar
                    <span aria-hidden className="ml-2 transition group-hover:translate-x-1">→</span>
                  </button>
                </div>
              ))}
            </nav>
          </aside>

          <section className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Mis solicitudes de título</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Visualice el detalle de sus solicitudes, incluyendo la carrera, facultad de origen, estado del trámite y las acciones disponibles.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                  Seleccionar título
                </button>
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
                La información aquí presentada es de carácter orientativo. Los estados actualizados de los trámites podrán ser verificados en todo momento desde este portal.
              </p>
            </div>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-900">Experiencia segura y transparente</h3>
                <p className="mt-3 text-sm text-blue-900/80">
                  Autenticación con usuario institucional, registro para egresados y seguimiento en tiempo real de cada etapa del trámite.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Documentación y alertas informativas</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Reciba notificaciones sobre subsanación de datos, control de entregas y disponibilidad de resoluciones para descargar.
                </p>
              </article>
            </section>
          </section>
        </section>
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
