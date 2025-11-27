"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

import type {
  RequestFormDataPerson,
  CountryAttributes,
  ProvinceAttributes,
  CityAttributes,
} from "@/types/request-flow";

type PersonalDataStepProps = {
  person: RequestFormDataPerson;
  onChange: (value: RequestFormDataPerson) => void;
  countries: CountryAttributes[];
  provinces: ProvinceAttributes[];
  cities: CityAttributes[];
};

export default function PersonalDataStep({
  person,
  onChange,
  countries,
  provinces,
  cities,
}: PersonalDataStepProps) {
  const handleInputChange = (field: keyof RequestFormDataPerson) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onChange({
        ...person,
        [field]: value,
      });
    };

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => (a.countryName ?? "").localeCompare(b.countryName ?? "", "es")),
    [countries],
  );

  const sortedProvinces = useMemo(
    () => [...provinces].sort((a, b) => (a.provinceName ?? "").localeCompare(b.provinceName ?? "", "es")),
    [provinces],
  );

  const sortedCities = useMemo(
    () => [...cities].sort((a, b) => (a.cityName ?? "").localeCompare(b.cityName ?? "", "es")),
    [cities],
  );

  const selectedBirthCity = useMemo(
    () => (person.birthCityId ? cities.find((city) => city.idCity === person.birthCityId) ?? null : null),
    [person.birthCityId, cities],
  );

  const selectedBirthProvince = useMemo(
    () =>
      selectedBirthCity
        ? provinces.find((province) => province.idProvince === selectedBirthCity.provinceId) ?? null
        : null,
    [selectedBirthCity, provinces],
  );

  const selectedBirthCountry = useMemo(
    () =>
      selectedBirthProvince
        ? countries.find((country) => country.idCountry === selectedBirthProvince.countryId) ?? null
        : null,
    [selectedBirthProvince, countries],
  );

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    () => person.nationalityId ?? selectedBirthCountry?.idCountry ?? null,
  );
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    () => selectedBirthProvince?.idProvince ?? null,
  );

  useEffect(() => {
    setSelectedCountryId(person.nationalityId ?? selectedBirthCountry?.idCountry ?? null);

    if (person.birthCityId) {
      setSelectedProvinceId(selectedBirthProvince?.idProvince ?? null);
    }
  }, [
    person.nationalityId,
    person.birthCityId,
    selectedBirthCountry?.idCountry,
    selectedBirthProvince?.idProvince,
  ]);

  const filteredProvinces = useMemo(() => {
    if (!selectedCountryId) {
      return [] as ProvinceAttributes[];
    }

    return sortedProvinces.filter((province) => province.countryId === selectedCountryId);
  }, [sortedProvinces, selectedCountryId]);

  const filteredCities = useMemo(() => {
    if (!selectedProvinceId) {
      return [] as CityAttributes[];
    }

    return sortedCities.filter((city) => city.provinceId === selectedProvinceId);
  }, [sortedCities, selectedProvinceId]);

  const handleProvinceSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    const normalizedValue = parsed !== null && !Number.isNaN(parsed) ? parsed : null;

    setSelectedProvinceId(normalizedValue);

    onChange({
      ...person,
      birthCityId: null,
    });
  };

  const handleCitySelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    const normalizedValue = parsed !== null && !Number.isNaN(parsed) ? parsed : null;

    if (normalizedValue === null) {
      onChange({
        ...person,
        birthCityId: null,
      });
      return;
    }

    const city = cities.find((item) => item.idCity === normalizedValue) ?? null;
    const province = city ? provinces.find((item) => item.idProvince === city.provinceId) ?? null : null;

    if (province?.idProvince && province.idProvince !== selectedProvinceId) {
      setSelectedProvinceId(province.idProvince);
    }

    onChange({
      ...person,
      birthCityId: normalizedValue,
    });
  };

  const provinceSelectDisabled = !selectedCountryId || filteredProvinces.length === 0;
  const citySelectDisabled = !selectedProvinceId || filteredCities.length === 0;

  const countrySummary = selectedCountryId
    ? countries.find((country) => country.idCountry === selectedCountryId) ?? selectedBirthCountry
    : selectedBirthCountry;
  const provinceSummary = selectedProvinceId
    ? provinces.find((province) => province.idProvince === selectedProvinceId) ?? selectedBirthProvince
    : selectedBirthProvince;
  const citySummary = person.birthCityId
    ? cities.find((city) => city.idCity === person.birthCityId) ?? selectedBirthCity
    : selectedBirthCity;

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
          <span className="font-medium text-slate-700">Nacionalidad</span>
          <select
            value={selectedCountryId ?? ""}
            onChange={(event) => {
              const rawValue = event.target.value;
              const parsed = rawValue === "" ? null : Number(rawValue);
              const normalizedValue = parsed !== null && !Number.isNaN(parsed) ? parsed : null;

              setSelectedCountryId(normalizedValue);
              setSelectedProvinceId(null);

              onChange({
                ...person,
                nationalityId: normalizedValue,
                birthCityId: null,
              });
            }}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          >
            <option value="">Seleccioná un país</option>
            {sortedCountries.map((country) => (
              <option key={country.idCountry} value={country.idCountry ?? ""}>
                {country.countryName ?? `País ${country.idCountry}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Provincia / Estado</span>
          <select
            value={selectedProvinceId ?? ""}
            onChange={handleProvinceSelect}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            disabled={provinceSelectDisabled}
          >
            <option value="">Seleccioná una provincia</option>
            {selectedCountryId && filteredProvinces.length === 0 ? (
              <option value="" disabled>
                No hay provincias registradas
              </option>
            ) : null}
            {filteredProvinces.map((province) => (
              <option key={province.idProvince} value={province.idProvince ?? ""}>
                {province.provinceName ?? `Provincia ${province.idProvince}`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Ciudad de nacimiento</span>
          <select
            value={person.birthCityId ?? ""}
            onChange={handleCitySelect}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            disabled={citySelectDisabled}
          >
            <option value="">Seleccioná una ciudad</option>
            {selectedProvinceId && filteredCities.length === 0 ? (
              <option value="" disabled>
                No hay ciudades registradas
              </option>
            ) : null}
            {filteredCities.map((city) => (
              <option key={city.idCity} value={city.idCity ?? ""}>
                {city.cityName ?? `Ciudad ${city.idCity}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p>
          <strong>Ciudad seleccionada:</strong> {citySummary?.cityName ?? "Sin datos"}
        </p>
        <p>
          <strong>Provincia:</strong> {provinceSummary?.provinceName ?? "Sin datos"}
        </p>
        <p>
          <strong>País:</strong> {countrySummary?.countryName ?? "Sin datos"}
        </p>
      </div>
    </form>
  );
}
