import { getServerSession } from "next-auth";

import { LoginForm } from "@/components/auth/LoginForm";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { authOptions } from "@/lib/auth/options";
import { getPortalData } from "@/data/portal";
import type { MenuOption, Solicitud } from "@/types/portal";

type PortalData = {
  solicitudes: Solicitud[];
  menuOptions: MenuOption[];
};

function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

async function fetchPortalData(): Promise<PortalData> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/portal`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener datos del portal: ${response.status}`);
    }

    const data = (await response.json()) as PortalData;
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Fallo la carga desde /api/portal, usando datos locales.", error);
    }
    return getPortalData();
  }
}

const statusStyles: Record<string, string> = {
  "En revisión": "bg-amber-100 text-amber-700",
  Aprobado: "bg-emerald-100 text-emerald-700",
  "Observado": "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const badgeClass = statusStyles[status] ?? "bg-slate-200 text-slate-700";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
      {status}
    </span>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name ?? "María González";
  const userLegajo = session?.user?.legajo ?? "001245";
  const userUsername = session?.user?.username ?? "mgonzalez";
  const { solicitudes, menuOptions } = await fetchPortalData();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800">
              Sistema de Gestión de Títulos Universitarios
            </span>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Portal de la Secretaría General de la Universidad [Nombre]
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Acceda al portal oficial para iniciar solicitudes de títulos, realizar el seguimiento de trámites en curso y completar información pendiente con acompañamiento institucional.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#form-login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Iniciar sesión
              </a>
              <a
                href="#recuperar"
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                ¿Olvidó su contraseña?
              </a>
              <a
                href="#registro"
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Registrarse como egresado
              </a>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p className="font-semibold text-slate-900">
                Secretaría General – Universidad [Nombre]
              </p>
              <p>Atención al usuario: [correo institucional] | [Teléfono]</p>
              <p>Horario de atención: [horario]</p>
            </div>
          </div>

          <div
            id="form-login"
            className="rounded-2xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-900/10"
          >
            <h2 className="text-2xl font-semibold text-slate-900">
              Ingreso seguro
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Acceso exclusivo para estudiantes y egresados habilitados por la Secretaría General.
            </p>
            <LoginForm />
            <div className="mt-6 space-y-2 text-center text-sm text-blue-700">
              <a id="recuperar" className="block hover:underline" href="#">
                ¿Olvidó su contraseña?
              </a>
              <a id="registro" className="block hover:underline" href="#">
                Registrarse como egresado
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        {session ? (
          <>
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
              <div className="flex items-center gap-4">
                <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-lg font-semibold text-white sm:flex">
                  SG
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                    Secretaría General – Sistema de Gestión de Títulos
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    Panel principal del egresado
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="text-sm text-slate-600">
                  <p className="font-semibold text-slate-900">{userName}</p>
                  <p>Legajo: {userLegajo}</p>
                  <p>Usuario: {userUsername}</p>
                </div>
                <SignOutButton />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Bienvenido/a, {userName}.
              </h3>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Desde este panel podrá acceder a todas las funcionalidades del Sistema de Gestión de Títulos, consultar el estado de sus trámites en curso e iniciar nuevas solicitudes vinculadas a su trayectoria académica.
              </p>
            </section>

            <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <aside className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Menú de solicitudes
                  </h2>
                  <p className="mt-3 text-sm text-slate-600">
                    Acceda rápidamente a las principales gestiones disponibles para la administración de sus títulos universitarios.
                  </p>
                </div>
                <nav className="space-y-4">
                  {menuOptions.map((option) => (
                    <div
                      key={option.title}
                      className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-600 hover:shadow"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {option.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                      <button className="mt-3 inline-flex items-center text-sm font-semibold text-blue-700">
                        Gestionar
                        <span aria-hidden className="ml-2 transition group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                    </div>
                  ))}
                </nav>
              </aside>

              <section className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        Mis solicitudes de título
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-slate-600">
                        Visualice el detalle de sus solicitudes, incluyendo la carrera, facultad de origen, estado del trámite y las acciones disponibles. Para iniciar la gestión seleccione el título correspondiente o utilice las opciones del menú lateral.
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
                        {solicitudes.map((solicitud) => (
                          <tr key={solicitud.titulo}>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                              {solicitud.titulo}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {solicitud.carrera}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {solicitud.facultad}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <StatusBadge status={solicitud.estado} />
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-blue-700">
                              {solicitud.accion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    La información aquí presentada es de carácter orientativo. Los estados actualizados de los trámites podrán ser verificados en todo momento desde este portal. Ante cualquier consulta, comuníquese con la Secretaría General mediante los canales oficiales de atención.
                  </p>
                </div>

                <section className="grid gap-6 lg:grid-cols-2">
                  <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Experiencia segura y transparente
                    </h3>
                    <p className="mt-3 text-sm text-blue-900/80">
                      Autenticación con usuario institucional, registro para egresados y seguimiento en tiempo real de cada etapa del trámite.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Documentación y alertas informativas
                    </h3>
                    <p className="mt-3 text-sm text-slate-600">
                      Reciba notificaciones sobre subsanación de datos, control de entregas y disponibilidad de resoluciones para descargar.
                    </p>
                  </article>
                </section>
              </section>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Ingrese al sistema para gestionar sus solicitudes
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Esta sección se habilitará automáticamente una vez que inicie sesión con sus credenciales institucionales.
            </p>
            <p className="mt-6 text-sm text-blue-700">
              ¿No posee credenciales? Seleccione la opción "Registrarse como egresado" y siga las instrucciones de la Secretaría General.
            </p>
            <div className="mt-8 grid gap-4 text-left text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">1. Registro</p>
                <p className="mt-1 text-xs">
                  Complete su formulario de alta de egresado y adjunte la documentación solicitada.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">2. Verificación</p>
                <p className="mt-1 text-xs">
                  El equipo de la Secretaría General validará sus datos y habilitará sus credenciales.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">3. Acceso</p>
                <p className="mt-1 text-xs">
                  Ingrese al portal para iniciar nuevas solicitudes y hacer seguimiento de sus trámites.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Secretaría General – Universidad [Nombre]</p>
          <p>
            Atención al usuario: [correo institucional] | [Teléfono] · Horario de atención: [horario]
          </p>
        </div>
      </footer>
    </div>
  );
}
