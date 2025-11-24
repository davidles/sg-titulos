"use client";

import { useMemo } from "react";
import type { ChangeEvent } from "react";

import type {
  RequestFormDataAddress,
  CountryAttributes,
  ProvinceAttributes,
  CityAttributes,
} from "@/types/request-flow";

type AddressDataStepProps = {
  address: RequestFormDataAddress;
  onChange: (value: RequestFormDataAddress) => void;
  countries: CountryAttributes[];
  provinces: ProvinceAttributes[];
  cities: CityAttributes[];
};

export default function AddressDataStep({
  address,
  onChange,
  countries,
  provinces,
  cities,
}: AddressDataStepProps) {
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

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    const country = parsed ? countries.find((item) => item.idCountry === parsed) ?? null : null;
    onChange({
      ...address,
      country: country ?? null,
      province: null,
      city: null,
      cityId: null,
    });
  };

  const handleProvinceChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    const province = parsed ? provinces.find((item) => item.idProvince === parsed) ?? null : null;
    const country = province
      ? countries.find((item) => item.idCountry === province.countryId) ?? null
      : address.country ?? null;
    onChange({
      ...address,
      province: province ?? null,
      country,
      city: null,
      cityId: null,
    });
  };

  const handleCityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value;
    const parsed = rawValue === "" ? null : Number(rawValue);
    const city = parsed ? cities.find((item) => item.idCity === parsed) ?? null : null;
    const province = city
      ? provinces.find((item) => item.idProvince === city.provinceId) ?? null
      : address.province ?? null;
    const country = province
      ? countries.find((item) => item.idCountry === province.countryId) ?? null
      : address.country ?? null;
    onChange({
      ...address,
      cityId: city ? city.idCity : null,
      city,
      province,
      country,
    });
  };

  const selectedCity = useMemo(
    () => (address.cityId ? cities.find((city) => city.idCity === address.cityId) ?? null : address.city ?? null),
    [address.cityId, address.city, cities],
  );

  const selectedProvinceId = address.province?.idProvince ?? selectedCity?.provinceId ?? null;

  const selectedCountryId =
    address.country?.idCountry ??
    (selectedProvinceId
      ? provinces.find((province) => province.idProvince === selectedProvinceId)?.countryId ?? null
      : null);

  const filteredProvinces = useMemo(() => {
    if (!selectedCountryId) {
      return [...provinces].sort((a, b) => (a.provinceName ?? "").localeCompare(b.provinceName ?? "", "es"));
    }
    return provinces
      .filter((province) => province.countryId === selectedCountryId)
      .sort((a, b) => (a.provinceName ?? "").localeCompare(b.provinceName ?? "", "es"));
  }, [provinces, selectedCountryId]);

  const filteredCities = useMemo(() => {
    if (!selectedProvinceId) {
      return [] as CityAttributes[];
    }
    return cities
      .filter((city) => city.provinceId === selectedProvinceId)
      .sort((a, b) => (a.cityName ?? "").localeCompare(b.cityName ?? "", "es"));
  }, [cities, selectedProvinceId]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => (a.countryName ?? "").localeCompare(b.countryName ?? "", "es")),
    [countries],
  );

  const selectedProvince = selectedProvinceId
    ? provinces.find((province) => province.idProvince === selectedProvinceId) ?? null
    : address.province ?? null;

  const selectedCountry = selectedCountryId
    ? countries.find((country) => country.idCountry === selectedCountryId) ?? null
    : address.country ?? null;

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

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">País</span>
          <select
            value={selectedCountryId ?? ""}
            onChange={handleCountryChange}
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

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Provincia</span>
          <select
            value={selectedProvinceId ?? ""}
            onChange={handleProvinceChange}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            disabled={!selectedCountryId}
          >
            <option value="">Seleccioná una provincia</option>
            {filteredProvinces.map((province) => (
              <option key={province.idProvince} value={province.idProvince ?? ""}>
                {province.provinceName ?? `Provincia ${province.idProvince}`}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Ciudad</span>
          <select
            value={selectedCity?.idCity ?? ""}
            onChange={handleCityChange}
            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            disabled={!selectedProvinceId}
          >
            <option value="">Seleccioná una ciudad</option>
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
          <strong>Ciudad seleccionada:</strong> {selectedCity?.cityName ?? "Sin datos"}
        </p>
        <p>
          <strong>Provincia:</strong> {selectedProvince?.provinceName ?? "Sin datos"}
        </p>
        <p>
          <strong>País:</strong> {selectedCountry?.countryName ?? "Sin datos"}
        </p>
      </div>
    </form>
  );
}
