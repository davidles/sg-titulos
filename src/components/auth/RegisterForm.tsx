"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getCitiesByProvince, getCountries, getProvincesByCountry, getProvinces, registerUser } from "@/lib/api";

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/i;
const DOCUMENT_REGEX = /^\d{6,12}$/;
const PHONE_REGEX = /^[0-9+()\s-]{10,20}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;

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
  countryId: "",
  provinceId: "",
  cityId: "",
  graduateType: "Civil" as "Civil" | "Militar",
  militaryRankId: ""
};

type FormState = typeof initialFormValues;
type FormErrors = Partial<Record<keyof FormState, string>>;

const trimFormValues = (values: FormState): FormState => ({
  ...values,
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  documentNumber: values.documentNumber.trim(),
  birthDate: values.birthDate.trim(),
  email: values.email.trim(),
  mobilePhone: values.mobilePhone.trim(),
  street: values.street.trim(),
  streetNumber: values.streetNumber.trim(),
  countryId: values.countryId.trim(),
  provinceId: values.provinceId.trim(),
  cityId: values.cityId.trim(),
  militaryRankId: values.militaryRankId.trim()
});

const validateForm = (values: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!values.firstName) {
    errors.firstName = "Ingresá tu nombre.";
  } else if (!NAME_REGEX.test(values.firstName)) {
    errors.firstName = "El nombre solo puede incluir letras y espacios.";
  }

  if (!values.lastName) {
    errors.lastName = "Ingresá tu apellido.";
  } else if (!NAME_REGEX.test(values.lastName)) {
    errors.lastName = "El apellido solo puede incluir letras y espacios.";
  }

  if (!values.documentNumber) {
    errors.documentNumber = "Ingresá tu número de documento.";
  } else if (!DOCUMENT_REGEX.test(values.documentNumber)) {
    errors.documentNumber = "El documento debe tener entre 6 y 12 dígitos.";
  }

  if (values.birthDate) {
    const birthDate = new Date(values.birthDate);
    if (Number.isNaN(birthDate.getTime())) {
      errors.birthDate = "La fecha ingresada no es válida.";
    } else {
      const today = new Date();
      if (birthDate > today) {
        errors.birthDate = "La fecha de nacimiento no puede ser futura.";
      }
    }
  }

  if (!values.email) {
    errors.email = "Ingresá tu correo electrónico.";
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = "El correo electrónico no tiene un formato válido.";
  }

  if (values.mobilePhone) {
    if (!PHONE_REGEX.test(values.mobilePhone)) {
      errors.mobilePhone = "El teléfono debe incluir solo números, espacios o símbolos (+, -, ()).";
    }
  }

  if (!values.street || values.street.length < 3) {
    errors.street = "Ingresá la calle (al menos 3 caracteres).";
  }

  const streetNumber = Number(values.streetNumber);
  if (!values.streetNumber) {
    errors.streetNumber = "Ingresá el número de la calle.";
  } else if (!Number.isFinite(streetNumber) || streetNumber <= 0) {
    errors.streetNumber = "El número de calle debe ser un número positivo.";
  }

  const countryId = Number(values.countryId);
  if (!values.countryId) {
    errors.countryId = "Seleccioná el país.";
  } else if (!Number.isFinite(countryId) || countryId <= 0) {
    errors.countryId = "El país seleccionado no es válido.";
  }

  const provinceId = Number(values.provinceId);
  if (!values.provinceId) {
    errors.provinceId = "Seleccioná la provincia.";
  } else if (!Number.isFinite(provinceId) || provinceId <= 0) {
    errors.provinceId = "La provincia seleccionada no es válida.";
  }

  const cityId = Number(values.cityId);
  if (!values.cityId) {
    errors.cityId = "Seleccioná la ciudad.";
  } else if (!Number.isFinite(cityId) || cityId <= 0) {
    errors.cityId = "La ciudad seleccionada no es válida.";
  }

  if (!graduateTypes.some((type) => type.value === values.graduateType)) {
    errors.graduateType = "Seleccioná un tipo de egresado válido.";
  }

  if (values.graduateType === "Militar") {
    const rankId = Number(values.militaryRankId);
    if (!values.militaryRankId) {
      errors.militaryRankId = "Ingresá el grado militar.";
    } else if (!Number.isFinite(rankId) || rankId <= 0) {
      errors.militaryRankId = "El grado militar debe ser un número positivo.";
    }
  }

  if (!values.password) {
    errors.password = "Ingresá una contraseña.";
  } else if (!PASSWORD_REGEX.test(values.password)) {
    errors.password = "La contraseña debe tener al menos 8 caracteres e incluir letras y números.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirmá la contraseña.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
};

export function RegisterForm() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormState>(initialFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [countries, setCountries] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [provinces, setProvinces] = useState<Array<{ id: number; name: string }>>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [cities, setCities] = useState<Array<{ id: number; name: string }>>([]);
  const [citiesCache, setCitiesCache] = useState<Record<number, Array<{ id: number; name: string }>>>({});
  const [loadingCities, setLoadingCities] = useState(false);
  const [provincesCache, setProvincesCache] = useState<Record<number, Array<{ id: number; name: string }>>>({});

  useEffect(() => {
    (async () => {
      try {
        setLoadingCountries(true);
        const list = await getCountries();
        console.debug('Countries fetched:', Array.isArray(list) ? list.length : 0);
        setCountries(list);
      } catch (_) {
        console.error('No se pudieron cargar los países');
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormState;

    setFormValues((prev) => {
      const next = { ...prev, [fieldName]: value } as FormState;

      if (fieldName === "graduateType" && value === "Civil") {
        next.militaryRankId = "";
      }

      if (fieldName === "countryId") {
        next.provinceId = "";
        next.cityId = "";
      }

      if (fieldName === "provinceId") {
        next.cityId = "";
      }

      return next;
    });

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];

      if (fieldName === "graduateType") {
        delete next.militaryRankId;
      }

      if (fieldName === "countryId") {
        delete next.provinceId;
        delete next.cityId;
      }

      if (fieldName === "provinceId") {
        delete next.cityId;
      }

      return next;
    });

    if (fieldName === "countryId") {
      const numericCountryId = Number(value);
      setProvinces([]);
      setCities([]);
      if (!Number.isFinite(numericCountryId) || numericCountryId <= 0) {
        return;
      }
      const cachedProv = provincesCache[numericCountryId];
      if (cachedProv && cachedProv.length > 0) {
        setProvinces(cachedProv);
        return;
      }
      setLoadingProvinces(true);
      getProvincesByCountry(numericCountryId)
        .then((list) => {
          setProvinces(list);
          setProvincesCache((prev) => ({ ...prev, [numericCountryId]: list }));
        })
        .finally(() => setLoadingProvinces(false));
    }

    if (fieldName === "provinceId") {
      const numericProvinceId = Number(value);
      setCities([]);
      if (!Number.isFinite(numericProvinceId) || numericProvinceId <= 0) {
        return;
      }
      // Use cache if available
      const cached = citiesCache[numericProvinceId];
      if (cached && cached.length > 0) {
        setCities(cached);
        return;
      }
      setLoadingCities(true);
      getCitiesByProvince(numericProvinceId)
        .then((list) => {
          setCities(list);
          setCitiesCache((prev) => ({ ...prev, [numericProvinceId]: list }));
        })
        .finally(() => setLoadingCities(false));
    }
  };

  const resetForm = () => {
    setFormValues(initialFormValues);
    setFieldErrors({});
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormState;
    const normalizedValue = typeof value === "string" ? value.trim() : value;

    const nextValuesBase = {
      ...formValues,
      [fieldName]: normalizedValue
    } as FormState;

    if (fieldName === "graduateType" && normalizedValue === "Civil") {
      nextValuesBase.militaryRankId = "";
    }

    const nextValues = trimFormValues(nextValuesBase);

    setFormValues(nextValues);

    const allErrors = validateForm(nextValues);
    const nextFieldErrors: FormErrors = { ...fieldErrors };

    const applyErrorFor = (field: keyof FormState) => {
      const fieldError = allErrors[field];

      if (fieldError) {
        nextFieldErrors[field] = fieldError;
      } else {
        delete nextFieldErrors[field];
      }
    };

    applyErrorFor(fieldName);

    if (fieldName === "password" || fieldName === "confirmPassword") {
      applyErrorFor("password");
      applyErrorFor("confirmPassword");
    }

    if (fieldName === "graduateType" || fieldName === "militaryRankId") {
      applyErrorFor("graduateType");

      if (nextValues.graduateType === "Militar") {
        applyErrorFor("militaryRankId");
      } else {
        delete nextFieldErrors.militaryRankId;
      }
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length === 0) {
      setErrorMessage(null);
    } else {
      setErrorMessage((prev) => prev ?? "Revisá los campos marcados para continuar.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const normalizedValues = trimFormValues(formValues);
    setFormValues(normalizedValues);

    const errors = validateForm(normalizedValues);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Revisá los campos marcados para continuar.");
      return;
    }

    setFieldErrors({});

    try {
      setIsLoading(true);

      const numericStreetNumber = Number(normalizedValues.streetNumber);
      const numericProvinceId = Number(normalizedValues.provinceId);
      const numericCityId = Number(normalizedValues.cityId);
      const numericMilitaryRankId = normalizedValues.militaryRankId
        ? Number(normalizedValues.militaryRankId)
        : null;

      await registerUser({
        credentials: {
          username: normalizedValues.email.toLowerCase(),
          password: normalizedValues.password,
          accountType: ACCOUNT_TYPE,
          roleId: EGRESADO_ROLE_ID
        },
        person: {
          firstName: normalizedValues.firstName,
          lastName: normalizedValues.lastName,
          documentNumber: normalizedValues.documentNumber,
          birthDate: normalizedValues.birthDate || null,
          nationalityId: null,
          birthCityId: null
        },
        contact: {
          emailAddress: normalizedValues.email,
          mobilePhone: normalizedValues.mobilePhone || null
        },
        address: {
          street: normalizedValues.street,
          streetNumber: numericStreetNumber,
          cityId: numericCityId,
          provinceId: numericProvinceId
        },
        graduate: {
          graduateType: normalizedValues.graduateType,
          militaryRankId: normalizedValues.graduateType === "Militar" ? numericMilitaryRankId : null
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

  const getInputClasses = (hasError?: boolean) =>
    `rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-300 bg-white focus:border-red-500 focus:ring-red-100"
        : "border-slate-200 bg-slate-50 focus:border-blue-600 focus:ring-blue-100"
    }`;

  const getButtonClasses = (disabled: boolean) =>
    `w-full rounded-lg px-4 py-3 text-sm font-semibold shadow focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 ${
      disabled
        ? "bg-slate-300 text-slate-500 hover:bg-slate-300 focus:ring-slate-200"
        : "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-200"
    }`;

  const getSelectClasses = (hasError?: boolean, disabled?: boolean) =>
    `rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
      disabled
        ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
        : hasError
          ? "border-red-300 bg-white text-slate-700 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 bg-white text-slate-700 focus:border-blue-600 focus:ring-blue-100"
    }`;

  const normalizedValuesForValidation = useMemo(() => trimFormValues(formValues), [formValues]);
  const validationSnapshot = useMemo(
    () => validateForm(normalizedValuesForValidation),
    [normalizedValuesForValidation]
  );
  const hasBlockingErrors = Object.keys(validationSnapshot).length > 0;
  const isSubmitDisabled = isLoading || hasBlockingErrors;

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
              className={getInputClasses(Boolean(fieldErrors.firstName))}
              value={formValues.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.firstName)}
              aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
            />
            {fieldErrors.firstName ? (
              <p className="text-xs text-red-600" id="firstName-error">
                {fieldErrors.firstName}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.lastName))}
              value={formValues.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.lastName)}
              aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
            />
            {fieldErrors.lastName ? (
              <p className="text-xs text-red-600" id="lastName-error">
                {fieldErrors.lastName}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.documentNumber))}
              value={formValues.documentNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.documentNumber)}
              aria-describedby={fieldErrors.documentNumber ? "documentNumber-error" : undefined}
            />
            {fieldErrors.documentNumber ? (
              <p className="text-xs text-red-600" id="documentNumber-error">
                {fieldErrors.documentNumber}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="birthDate">
              Fecha de nacimiento
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className={getInputClasses(Boolean(fieldErrors.birthDate))}
              value={formValues.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldErrors.birthDate)}
              aria-describedby={fieldErrors.birthDate ? "birthDate-error" : undefined}
            />
            {fieldErrors.birthDate ? (
              <p className="text-xs text-red-600" id="birthDate-error">
                {fieldErrors.birthDate}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.email))}
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email ? (
              <p className="text-xs text-red-600" id="email-error">
                {fieldErrors.email}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.mobilePhone))}
              value={formValues.mobilePhone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldErrors.mobilePhone)}
              aria-describedby={fieldErrors.mobilePhone ? "mobilePhone-error" : undefined}
            />
            {fieldErrors.mobilePhone ? (
              <p className="text-xs text-red-600" id="mobilePhone-error">
                {fieldErrors.mobilePhone}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.street))}
              value={formValues.street}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.street)}
              aria-describedby={fieldErrors.street ? "street-error" : undefined}
            />
            {fieldErrors.street ? (
              <p className="text-xs text-red-600" id="street-error">
                {fieldErrors.street}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.streetNumber))}
              value={formValues.streetNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.streetNumber)}
              aria-describedby={fieldErrors.streetNumber ? "streetNumber-error" : undefined}
            />
            {fieldErrors.streetNumber ? (
              <p className="text-xs text-red-600" id="streetNumber-error">
                {fieldErrors.streetNumber}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="countryId">
              País
            </label>
            <select
              id="countryId"
              name="countryId"
              className={getSelectClasses(Boolean(fieldErrors.countryId), false)}
              value={formValues.countryId}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.countryId)}
              aria-describedby={fieldErrors.countryId ? "countryId-error" : undefined}
            >
              <option value="">{loadingCountries ? "Cargando países..." : (countries.length === 0 ? "No hay países disponibles" : "Seleccioná un país")}</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {fieldErrors.countryId ? (
              <p className="text-xs text-red-600" id="countryId-error">
                {fieldErrors.countryId}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="provinceId">
              Provincia
            </label>
            <select
              id="provinceId"
              name="provinceId"
              className={getSelectClasses(Boolean(fieldErrors.provinceId), !formValues.countryId || loadingProvinces)}
              value={formValues.provinceId}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={!formValues.countryId || loadingProvinces}
              aria-disabled={!formValues.countryId || loadingProvinces}
              aria-invalid={Boolean(fieldErrors.provinceId)}
              aria-describedby={fieldErrors.provinceId ? "provinceId-error" : undefined}
            >
              <option value="">{
                !formValues.countryId
                  ? "Elegí primero un país"
                  : loadingProvinces
                    ? "Cargando provincias..."
                    : (provinces.length === 0 ? "No hay provincias disponibles" : "Seleccioná una provincia")
              }</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {fieldErrors.provinceId ? (
              <p className="text-xs text-red-600" id="provinceId-error">
                {fieldErrors.provinceId}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="cityId">
              Ciudad
            </label>
            <select
              id="cityId"
              name="cityId"
              className={getSelectClasses(Boolean(fieldErrors.cityId), !formValues.provinceId || loadingCities)}
              value={formValues.cityId}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              disabled={!formValues.provinceId || loadingCities}
              aria-disabled={!formValues.provinceId || loadingCities}
              aria-invalid={Boolean(fieldErrors.cityId)}
              aria-describedby={fieldErrors.cityId ? "cityId-error" : undefined}
            >
              <option value="">
                {!formValues.provinceId ? "Elegí primero una provincia" : (loadingCities ? "Cargando ciudades..." : "Seleccioná una ciudad")}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {fieldErrors.cityId ? (
              <p className="text-xs text-red-600" id="cityId-error">
                {fieldErrors.cityId}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.graduateType))}
              value={formValues.graduateType}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldErrors.graduateType)}
              aria-describedby={fieldErrors.graduateType ? "graduateType-error" : undefined}
            >
              {graduateTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {fieldErrors.graduateType ? (
              <p className="text-xs text-red-600" id="graduateType-error">
                {fieldErrors.graduateType}
              </p>
            ) : null}
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
                className={getInputClasses(Boolean(fieldErrors.militaryRankId))}
                value={formValues.militaryRankId}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-invalid={Boolean(fieldErrors.militaryRankId)}
                aria-describedby={fieldErrors.militaryRankId ? "militaryRankId-error" : undefined}
              />
              <p className="text-xs text-slate-500">
                Ingresá el identificador correspondiente. Próximamente se mostrará el listado.
              </p>
              {fieldErrors.militaryRankId ? (
                <p className="text-xs text-red-600" id="militaryRankId-error">
                  {fieldErrors.militaryRankId}
                </p>
              ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.password))}
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            {fieldErrors.password ? (
              <p className="text-xs text-red-600" id="password-error">
                {fieldErrors.password}
              </p>
            ) : null}
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
              className={getInputClasses(Boolean(fieldErrors.confirmPassword))}
              value={formValues.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            {fieldErrors.confirmPassword ? (
              <p className="text-xs text-red-600" id="confirmPassword-error">
                {fieldErrors.confirmPassword}
              </p>
            ) : null}
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
        className={getButtonClasses(isSubmitDisabled)}
        disabled={isSubmitDisabled}
      >
        {isLoading ? "Registrando..." : "Registrarme"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Al completar el registro, aceptás ser contactado por la Secretaría General para validar tu información.
      </p>
    </form>
  );
}
