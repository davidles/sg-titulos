"use client";

import type { ChangeEvent } from "react";

import type { RequestFormDataPerson } from "@/types/request-flow";

type PersonalDataStepProps = {
  person: RequestFormDataPerson;
  onChange: (value: RequestFormDataPerson) => void;
};

export default function PersonalDataStep({ person, onChange }: PersonalDataStepProps) {
  const handleInputChange = (field: keyof RequestFormDataPerson) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onChange({
        ...person,
        [field]: value,
      });
    };

  const handleNumberInput = (field: keyof RequestFormDataPerson) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      const parsed = rawValue === "" ? null : Number(rawValue);
      onChange({
        ...person,
        [field]: Number.isNaN(parsed) ? null : parsed,
      });
    };

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Apellido</span>
          <input
            type="text"
            value={person.lastName ?? ""}
            onChange={handleInputChange("lastName")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Nombre</span>
          <input
            type="text"
            value={person.firstName ?? ""}
            onChange={handleInputChange("firstName")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Documento</span>
          <input
            type="text"
            value={person.documentNumber ?? ""}
            onChange={handleInputChange("documentNumber")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Fecha de nacimiento</span>
          <input
            type="date"
            value={person.birthDate ?? ""}
            onChange={handleInputChange("birthDate")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Nacionalidad (ID)</span>
          <input
            type="number"
            value={person.nationalityId ?? ""}
            onChange={handleNumberInput("nationalityId")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Ciudad de nacimiento (ID)</span>
          <input
            type="number"
            value={person.birthCityId ?? ""}
            onChange={handleNumberInput("birthCityId")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>
    </form>
  );
}
