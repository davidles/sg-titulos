"use client";

import type { ChangeEvent } from "react";
import type { RequestFormDataContact } from "@/types/request-flow";

type ContactDataStepProps = {
  contact: RequestFormDataContact;
  onChange: (value: RequestFormDataContact) => void;
};

export default function ContactDataStep({ contact, onChange }: ContactDataStepProps) {
  const handleChange = (field: keyof RequestFormDataContact) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...contact,
      [field]: event.target.value,
    });
  };

  const handleClear = () => {
    onChange({
      ...contact,
      mobilePhone: "",
      emailAddress: "",
    });
  };

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Teléfono celular</span>
          <input
            type="tel"
            value={contact.mobilePhone ?? ""}
            onChange={handleChange("mobilePhone")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Correo electrónico</span>
          <input
            type="email"
            value={contact.emailAddress ?? ""}
            onChange={handleChange("emailAddress")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={handleClear}
        className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
      >
        Limpiar datos de contacto
      </button>
    </form>
  );
}
