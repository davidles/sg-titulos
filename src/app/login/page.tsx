import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { authOptions } from "@/lib/auth/options";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Sistema de Gestión de Solicitudes de Titulos
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
              Portal de la Secretaría General – CRUC IUA Córdoba
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Acceda al portal oficial para iniciar solicitudes de títulos, realizar el seguimiento de trámites en curso y completar información pendiente con acompañamiento institucional.
            </p>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p className="font-semibold text-slate-900">
                Secretaría General – CRUC IUA Córdoba
              </p>
              <p>Atención al usuario: sgeneral@iua.edu.ar | 351-4434555</p>
              <p>Horario de atención: lunes a viernes de 9:00 a 13:00</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-900/10">
            <h2 className="text-2xl font-semibold text-slate-900">Ingreso seguro</h2>
            <p className="mt-2 text-sm text-slate-600">
              Acceso exclusivo para egresados habilitados por la Secretaría General.
            </p>
            <LoginForm />
            <div className="mt-6 space-y-2 text-center text-sm text-blue-700">
              <a className="block hover:underline" href="#">
                ¿Olvidó su contraseña?
              </a>
              <a className="block hover:underline" href="#">
                Registrarse como egresado
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            Ingrese al sistema para gestionar sus solicitudes
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Esta sección se habilitará automáticamente una vez que inicie sesión con sus credenciales institucionales.
          </p>
          <p className="mt-6 text-sm text-blue-700">
            ¿No posee credenciales? Seleccione la opción &quot;Registrarse como egresado&quot; y siga las instrucciones de la Secretaría General.
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
