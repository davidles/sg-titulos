"use client";

import Link from "next/link";

export function RegisterForm() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
      <p className="text-lg font-semibold text-slate-900">Registro deshabilitado</p>
      <p>
        El registro público ya no está disponible. Comunicate con la Secretaría General para solicitar tus credenciales de acceso.
      </p>
      <p className="text-slate-500">sgeneral@iua.edu.ar · 351-4434555 · Lunes a viernes de 9:00 a 13:00</p>
      <p className="text-slate-500">
        Si ya contás con un usuario, podés ingresar desde la página de
        <Link href="/login" className="text-blue-600 hover:text-blue-800">
          Ingreso
        </Link>
      </p>
    </div>
  );
}
