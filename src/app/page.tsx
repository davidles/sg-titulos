const solicitudes = [
  {
    titulo: "Licenciatura en Psicología",
    carrera: "Psicología",
    facultad: "Facultad de Humanidades",
    estado: "En revisión",
    accion: "Ver detalle",
  },
  {
    titulo: "Profesorado en Matemática",
    carrera: "Matemática",
    facultad: "Facultad de Ciencias Exactas",
    estado: "Aprobado",
    accion: "Descargar resolución",
  },
];

const menuOptions = [
  {
    title: "Iniciar solicitud",
    description:
      "Permite dar inicio al trámite para la emisión del título correspondiente a una carrera finalizada.",
  },
  {
    title: "Buscar solicitud",
    description:
      "Consulte el estado actual de una solicitud iniciada previamente.",
  },
  {
    title: "Subsanar solicitud",
    description:
      "Acceda para corregir o completar datos requeridos para la continuidad del trámite.",
  },
];

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

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Secretaría General – Universidad [Nombre]
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 md:text-4xl">
              Portal de la Secretaría General de la Universidad [Nombre]
            </h1>
            <p className="mt-3 max-w-xl text-base text-slate-600">
              Sistema de Gestión de Títulos Universitarios. Inicie nuevas solicitudes, realice seguimiento de trámites en curso y complete información pendiente de forma segura y transparente.
            </p>
          </div>
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Ingreso al sistema</h2>
            <p className="mt-2 text-sm text-slate-500">
              Acceso exclusivo para estudiantes y egresados registrados.
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Correo institucional
                </label>
                <input
                  type="email"
                  placeholder="nombre.apellido@universidad.edu"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Iniciar sesión
              </button>
              <div className="flex flex-col gap-2 text-center text-sm text-blue-700">
                <a className="hover:underline" href="#recuperar">
                  ¿Olvidó su contraseña?
                </a>
                <a className="hover:underline" href="#registro">
                  Registrarse como egresado
                </a>
              </div>
            </form>
            <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Atención al usuario: [correo institucional] · [Teléfono]
              <br />
              Horario de atención: [horario]
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Secretaría General – Sistema de Gestión de Títulos
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
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
                  Visualice el detalle de sus solicitudes de título, incluyendo la carrera, facultad de origen, estado del trámite y las acciones disponibles. Para iniciar la gestión, seleccione el título correspondiente o utilice las opciones del menú lateral.
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
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
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
                Autenticación con correo institucional, registro para egresados y seguimiento en tiempo real de cada etapa del trámite.
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
