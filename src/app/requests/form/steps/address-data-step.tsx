"use client";

import type { ChangeEvent } from "react";
import type { RequestFormDataAddress } from "@/types/request-flow";

type AddressDataStepProps = {
  address: RequestFormDataAddress;
  onChange: (value: RequestFormDataAddress) => void;
};

export default function AddressDataStep({ address, onChange }: AddressDataStepProps) {
  const handleTextChange = (field: keyof RequestFormDataAddress) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...address,
        [field]: event.target.value,
      });
    };

  const handleNumberChange = (field: keyof RequestFormDataAddress) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      const parsed = rawValue === "" ? null : Number(rawValue);
      onChange({
        ...address,
        [field]: Number.isNaN(parsed) ? null : parsed,
      });
    };

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Calle</span>
          <input
            type="text"
            value={address.street ?? ""}
            onChange={handleTextChange("street")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Número</span>
          <input
            type="number"
            value={address.streetNumber ?? ""}
            onChange={handleNumberChange("streetNumber")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Ciudad (ID)</span>
          <input
            type="number"
            value={address.cityId ?? ""}
            onChange={handleNumberChange("cityId")}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
        </label>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p>
            <strong>Ciudad asociada:</strong> {address.city?.cityName ?? "Sin datos"}
          </p>
          <p>
            <strong>Provincia:</strong> {address.province?.provinceName ?? "Sin datos"}
          </p>
          <p>
            <strong>País:</strong> {address.country?.countryName ?? "Sin datos"}
          </p>
        </div>
      </div>
    </form>
  );
}
