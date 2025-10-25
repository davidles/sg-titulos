"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/api";

const ACCOUNT_TYPE = "ACTIVA";
const EGRESADO_ROLE_ID = 3;

const graduateTypes = [
  { value: "Civil", label: "Civil" },
  { value: "Militar", label: "Militar" }
];

const initialFormValues = {
  firstName: "",
  lastName: "",
  documentNumber: "",
  birthDate: "",
  email: "",
  mobilePhone: "",
  password: "",
  confirmPassword: "",
  street: "",
  streetNumber: "",
  cityId: "",
  graduateType: "Civil" as "Civil" | "Militar",
  militaryRankId: ""
};

type FormState = typeof initialFormValues;

export function RegisterForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormState>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    const numericStreetNumber = Number(formValues.streetNumber);
    const numericCityId = Number(formValues.cityId);
    const numericMilitaryRankId = formValues.militaryRankId ? Number(formValues.militaryRankId) : null;

    if (!Number.isFinite(numericStreetNumber) || numericStreetNumber <= 0) {
      setErrorMessage("El número de calle debe ser un número positivo.");
      return;
    }

    if (!Number.isFinite(numericCityId) || numericCityId <= 0) {
      setErrorMessage("La ciudad seleccionada no es válida.");
      return;
    }

    try {
      setIsLoading(true);

      await registerUser({
        credentials: {
          username: formValues.email.toLowerCase(),
          password: formValues.password,
          accountType: ACCOUNT_TYPE,
          roleId: EGRESADO_ROLE_ID
        },
        person: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          documentNumber: formValues.documentNumber,
          birthDate: formValues.birthDate || null,
          nationalityId: null,
          birthCityId: null
        },
        contact: {
          emailAddress: formValues.email,
          mobilePhone: formValues.mobilePhone || null
        },
        address: {
          street: formValues.street,
          streetNumber: numericStreetNumber,
          cityId: numericCityId
        },
        graduate: {
          graduateType: formValues.graduateType,
          militaryRankId: formValues.graduateType === "Militar" ? numericMilitaryRankId : null
        }
      });

      setSuccessMessage("Registro exitoso. Revisá tu correo para próximas instrucciones.");
      resetForm();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      const fallbackMessage = "No pudimos completar el registro. Intentalo nuevamente.";
      if (error instanceof Error) {
        setErrorMessage(error.message || fallbackMessage);
      } else {
        setErrorMessage(fallbackMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Datos personales</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="firstName">
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Juan"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Pérez"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="documentNumber">
              Documento
            </label>
            <input
              id="documentNumber"
              name="documentNumber"
              type="text"
              placeholder="30123456"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.documentNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="birthDate">
              Fecha de nacimiento
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Contacto</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre.apellido@correo.com"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="mobilePhone">
              Teléfono (opcional)
            </label>
            <input
              id="mobilePhone"
              name="mobilePhone"
              type="tel"
              placeholder="+54 9 351 6000000"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.mobilePhone}
              onChange={handleChange}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Domicilio</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="street">
              Calle
            </label>
            <input
              id="street"
              name="street"
              type="text"
              placeholder="Av. Siempre Viva"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="streetNumber">
              Número
            </label>
            <input
              id="streetNumber"
              name="streetNumber"
              type="number"
              min="1"
              placeholder="742"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.streetNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="cityId">
              Ciudad (ID)
            </label>
            <input
              id="cityId"
              name="cityId"
              type="number"
              min="1"
              placeholder="Ingrese el identificador"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.cityId}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-slate-500">
              Este valor es temporal hasta habilitar el catálogo de ciudades.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Tipo de egresado</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="graduateType">
              Seleccioná el tipo
            </label>
            <select
              id="graduateType"
              name="graduateType"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.graduateType}
              onChange={handleChange}
            >
              {graduateTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {formValues.graduateType === "Militar" ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="militaryRankId">
                Grado militar (ID)
              </label>
              <input
                id="militaryRankId"
                name="militaryRankId"
                type="number"
                min="1"
                placeholder="Identificador del grado"
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={formValues.militaryRankId}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-slate-500">
                Ingresá el identificador correspondiente. Próximamente se mostrará el listado.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Credenciales</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 md:col-span-2">
            <p className="text-xs text-slate-500">
              Usaremos tu correo como usuario para ingresar al portal.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              placeholder="Debe tener al menos 8 caracteres"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.password}
              onChange={handleChange}
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
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={formValues.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? "Registrando..." : "Registrarme"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Al completar el registro, aceptás ser contactado por la Secretaría General para validar tu información.
      </p>
    </form>
  );
}
