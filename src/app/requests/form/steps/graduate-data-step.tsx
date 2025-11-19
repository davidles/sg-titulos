"use client";

import type { ChangeEvent } from "react";

import type {
  RequestFormDataGraduate,
  ForceAttributes,
  MilitaryRankAttributes,
} from "@/types/request-flow";

type GraduateDataStepProps = {
  graduate: RequestFormDataGraduate;
  forces: ForceAttributes[];
  ranks: MilitaryRankAttributes[];
  onChange: (value: RequestFormDataGraduate) => void;
};

export default function GraduateDataStep({ graduate, forces, ranks, onChange }: GraduateDataStepProps) {
  const handleGraduateTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as RequestFormDataGraduate["graduateType"];
    if (value === "Civil") {
      onChange({
        ...graduate,
        graduateType: "Civil",
        militaryRankId: null,
        forceId: null,
      });
      return;
    }

    onChange({
      ...graduate,
      graduateType: value,
    });
  };

  const handleForceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    onChange({
      ...graduate,
      forceId: Number.isNaN(parsed) ? null : parsed,
      militaryRankId: null,
    });
  };

  const handleRankChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    onChange({
      ...graduate,
      militaryRankId: Number.isNaN(parsed) ? null : parsed,
    });
  };

  const militaryRanksOptions = graduate.forceId
    ? ranks.filter((rank) => rank.forceId === graduate.forceId)
    : [];

  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-slate-700">Tipo de egresado</span>
        <select
          value={graduate.graduateType ?? ""}
          onChange={handleGraduateTypeChange}
          className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
        >
          <option value="">Seleccioná una opción</option>
          <option value="Civil">Civil</option>
          <option value="Militar">Militar</option>
        </select>
      </label>

      {graduate.graduateType === "Militar" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Fuerza</span>
            <select
              value={graduate.forceId ?? ""}
              onChange={handleForceChange}
              className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            >
              <option value="">Seleccioná la fuerza</option>
              {forces.map((force) => (
                <option key={force.idForce} value={force.idForce ?? ""}>
                  {force.forceName ?? `Fuerza ${force.idForce}`}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-700">Grado</span>
            <select
              value={graduate.militaryRankId ?? ""}
              onChange={handleRankChange}
              className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            >
              <option value="">Seleccioná el grado</option>
              {militaryRanksOptions.map((rank) => (
                <option key={rank.idMilitaryRank} value={rank.idMilitaryRank ?? ""}>
                  {rank.militaryRankName ?? `Grado ${rank.idMilitaryRank}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
    </form>
  );
}
