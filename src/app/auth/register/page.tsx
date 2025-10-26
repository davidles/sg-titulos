import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { authOptions } from "@/lib/auth/options";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Portal de egresados</p>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Registrate como egresado/a</h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Completá el formulario para solicitar acceso al sistema de gestión de solicitudes de títulos. Un equipo de la Secretaría General validará los datos y habilitará tu cuenta.
            </p>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p className="font-semibold text-slate-900">¿Ya tenés usuario?</p>
              <p>
                Ingresá desde la pantalla de <Link className="font-semibold text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-sm" href="/login">inicio de sesión</Link>.
              </p>
            </div>
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Requisitos previos</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                  Contar con un correo electrónico activo: será tu usuario en el portal.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                  Tener a mano tu número de documento y datos de contacto actualizados.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                  Si sos egresado militar, verificá con tu unidad el grado correspondiente para completar el registro.
                </li>
              </ul>
            </section>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-900/10">
            <h2 className="text-2xl font-semibold text-slate-900">Formulario de registro</h2>
            <p className="mt-2 text-sm text-slate-600">
              Completá la información solicitada. Te contactaremos por correo para confirmar la activación de tu cuenta.
            </p>
            <RegisterForm />
          </div>
        </div>
      </header>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Secretaría General – CRUC IUA Córdoba</p>
          <p>sgeneral@iua.edu.ar · 351-4434555 · Lunes a viernes de 9:00 a 13:00</p>
        </div>
      </footer>
    </div>
  );
}
