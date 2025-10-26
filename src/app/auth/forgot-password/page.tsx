"use client";

import { useState } from "react";
import Link from "next/link";

import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getInputClasses = (hasError?: boolean) =>
    `rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 bg-white focus:border-blue-600 focus:ring-blue-100"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    try {
      setIsLoading(true);
      await requestPasswordReset(identifier.trim());
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-700/10 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-start">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Recuperar contraseña</p>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Solicitar enlace de restablecimiento</h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">Ingresá tu correo o usuario. Si está registrado, te enviaremos un enlace para restablecer tu contraseña.</p>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p>
                ¿Recordaste tu contraseña? <Link className="font-semibold text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline" href="/login">Volver al inicio de sesión</Link>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-900/10">
            <h2 className="text-2xl font-semibold text-slate-900">Formulario</h2>
            <p className="mt-2 text-sm text-slate-600">Recibirás un enlace si el identificador corresponde a un usuario válido.</p>

            {submitted ? (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                Si tu correo está registrado, te enviamos un enlace para restablecer tu contraseña.
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="identifier">
                    Correo o usuario
                  </label>
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="nombre.apellido@correo.com"
                    className={getInputClasses(false)}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold shadow focus:outline-none focus:ring-2 ${
                    isLoading
                      ? "bg-slate-300 text-slate-500 focus:ring-slate-200"
                      : "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-200"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
