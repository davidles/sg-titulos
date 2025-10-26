"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = params.get("token") ?? "";
    setToken(t);
  }, [params]);

  const getInputClasses = (hasError?: boolean) =>
    `rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 bg-white focus:border-blue-600 focus:ring-blue-100"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token || password.length < 8 || password !== confirmPassword) {
      setError("Verificá el token y que las contraseñas coincidan (mínimo 8 caracteres).");
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No pudimos actualizar tu contraseña.";
      setError(message);
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
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Restablecer contraseña</h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">Ingresá tu nueva contraseña.</p>
            <div className="rounded-xl border border-blue-100 bg-white/70 p-5 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p>
                ¿Ya podés iniciar sesión? <Link className="font-semibold text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline" href="/login">Volver al inicio de sesión</Link>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white p-8 shadow-2xl shadow-blue-900/10">
            <h2 className="text-2xl font-semibold text-slate-900">Formulario</h2>
            {success ? (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>
                ) : null}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="password">
                    Nueva contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    className={getInputClasses(false)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="confirmPassword">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    minLength={8}
                    placeholder="Repetí la contraseña"
                    className={getInputClasses(false)}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </form>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
