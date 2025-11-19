"use client";

import { useMemo, useState } from "react";

import type {
  RequestFormData,
  RequestFormDataPerson,
  RequestFormDataContact,
  RequestFormDataAddress,
  RequestFormDataGraduate,
  UpdateRequestFormPayload,
  ForceAttributes,
  MilitaryRankAttributes,
} from "@/types/request-flow";
import { updateRequestFormData } from "@/lib/api";

import PersonalDataStep from "./steps/personal-data-step";
import ContactDataStep from "./steps/contact-data-step";
import AddressDataStep from "./steps/address-data-step";
import GraduateDataStep from "./steps/graduate-data-step";

const steps = [
  { id: "personal", label: "Datos personales" },
  { id: "contact", label: "Datos de contacto" },
  { id: "address", label: "Domicilio" },
  { id: "graduate", label: "Tipo de egresado" },
] as const;

const createDefaultPerson = (): RequestFormDataPerson => ({
  idPerson: 0,
  lastName: "",
  firstName: "",
  documentNumber: "",
  birthDate: null,
  nationalityId: null,
  birthCityId: null,
});

const createDefaultContact = (): RequestFormDataContact => ({
  idContact: 0,
  mobilePhone: null,
  emailAddress: null,
});

const createDefaultAddress = (): RequestFormDataAddress => ({
  idAddress: 0,
  street: "",
  streetNumber: null,
  cityId: null,
  city: null,
  province: null,
  country: null,
});

const createDefaultGraduate = (): RequestFormDataGraduate => ({
  idGraduate: 0,
  graduateType: null,
  militaryRankId: null,
  forceId: null,
});

type RequestFormWizardProps = {
  initialData: RequestFormData | null;
  userId: number;
  accessToken: string;
  fetchError: string | null;
};

type WizardState = {
  currentStepIndex: number;
  saving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
};

export default function RequestFormWizard({
  initialData,
  userId,
  accessToken,
  fetchError,
}: RequestFormWizardProps) {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStepIndex: 0,
    saving: false,
    errorMessage: fetchError,
    successMessage: null,
  });

  const [person, setPerson] = useState<RequestFormDataPerson>(
    () => (initialData?.person ? { ...initialData.person } : createDefaultPerson())
  );
  const [contact, setContact] = useState<RequestFormDataContact>(
    () => (initialData?.contact ? { ...initialData.contact } : createDefaultContact())
  );
  const [address, setAddress] = useState<RequestFormDataAddress>(
    () => (initialData?.address ? { ...initialData.address } : createDefaultAddress())
  );
  const [graduate, setGraduate] = useState<RequestFormDataGraduate>(
    () => (initialData?.graduate ? { ...initialData.graduate } : createDefaultGraduate())
  );

  const forces = useMemo<ForceAttributes[]>(
    () => (initialData?.catalogs?.forces ? [...initialData.catalogs.forces] : []),
    [initialData?.catalogs?.forces]
  );

  const ranks = useMemo<MilitaryRankAttributes[]>(
    () => (initialData?.catalogs?.militaryRanks ? [...initialData.catalogs.militaryRanks] : []),
    [initialData?.catalogs?.militaryRanks]
  );

  const currentStep = steps[wizardState.currentStepIndex];

  const currentComponent = useMemo(() => {
    switch (currentStep.id) {
      case "personal":
        return <PersonalDataStep person={person} onChange={setPerson} />;
      case "contact":
        return <ContactDataStep contact={contact} onChange={setContact} />;
      case "address":
        return <AddressDataStep address={address} onChange={setAddress} />;
      case "graduate":
        return (
          <GraduateDataStep
            graduate={graduate}
            forces={forces}
            ranks={ranks}
            onChange={setGraduate}
          />
        );
      default:
        return null;
    }
  }, [currentStep.id, person, contact, address, graduate, forces, ranks]);

  const goToStep = (index: number) => {
    setWizardState((prev) => ({
      ...prev,
      currentStepIndex: Math.min(Math.max(index, 0), steps.length - 1),
      successMessage: null,
      errorMessage: null,
    }));
  };

  const sanitizeString = (value: string | null | undefined): string | null => {
    if (value === null || value === undefined) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  };

  const sanitizeNumber = (value: number | null | undefined): number | null =>
    typeof value === "number" && Number.isFinite(value) ? value : null;

  const sanitizeContact = (value: RequestFormDataContact): UpdateRequestFormPayload["contact"] => {
    const mobilePhone = sanitizeString(value.mobilePhone);
    const emailAddress = sanitizeString(value.emailAddress);
    if (!mobilePhone && !emailAddress) {
      return null;
    }
    return {
      mobilePhone,
      emailAddress,
    };
  };

  const sanitizeAddress = (value: RequestFormDataAddress): UpdateRequestFormPayload["address"] => {
    const street = sanitizeString(value.street);
    const streetNumber = sanitizeNumber(value.streetNumber);
    const cityId = sanitizeNumber(value.cityId);

    if (!street && !streetNumber && !cityId) {
      return null;
    }

    return {
      street,
      streetNumber,
      cityId,
    };
  };

  const sanitizeGraduate = (value: RequestFormDataGraduate): UpdateRequestFormPayload["graduate"] => {
    if (!value.graduateType) {
      return null;
    }

    if (value.graduateType === "Civil") {
      return {
        graduateType: "Civil",
        militaryRankId: null,
        forceId: null,
      };
    }

    return {
      graduateType: value.graduateType,
      militaryRankId: sanitizeNumber(value.militaryRankId),
      forceId: sanitizeNumber(value.forceId),
    };
  };

  const handleSaveStep = async (): Promise<boolean> => {
    setWizardState((prev) => ({ ...prev, saving: true, errorMessage: null, successMessage: null }));

    const payload: UpdateRequestFormPayload = {
      person: {
        lastName: sanitizeString(person.lastName) ?? "",
        firstName: sanitizeString(person.firstName) ?? "",
        documentNumber: sanitizeString(person.documentNumber) ?? "",
        birthDate: sanitizeString(person.birthDate),
        nationalityId: sanitizeNumber(person.nationalityId),
        birthCityId: sanitizeNumber(person.birthCityId),
      },
      contact: sanitizeContact(contact),
      graduate: sanitizeGraduate(graduate),
      address: sanitizeAddress(address),
    };

    try {
      const updatedData = await updateRequestFormData(userId, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setWizardState((prev) => ({
        ...prev,
        saving: false,
        successMessage: "Datos guardados correctamente.",
      }));

      if (updatedData) {
        setPerson(updatedData.person ? { ...updatedData.person } : createDefaultPerson());
        setContact(updatedData.contact ? { ...updatedData.contact } : createDefaultContact());
        setAddress(updatedData.address ? { ...updatedData.address } : createDefaultAddress());
        setGraduate(updatedData.graduate ? { ...updatedData.graduate } : createDefaultGraduate());
      }

      return true;
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "No pudimos guardar los datos. Intentá nuevamente.";

      const apiMessage = (error as { body?: { message?: string } })?.body?.message ?? null;

      setWizardState((prev) => ({
        ...prev,
        saving: false,
        errorMessage: apiMessage ?? fallbackMessage,
      }));

      return false;
    }
  };

  const isLastStep = wizardState.currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    const success = await handleSaveStep();
    if (success) {
      setWizardState((prev) => ({
        ...prev,
        currentStepIndex: Math.min(prev.currentStepIndex + 1, steps.length - 1),
      }));
    }
  };

  const handlePrevious = () => {
    goToStep(Math.max(wizardState.currentStepIndex - 1, 0));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {steps.map((step, index) => {
          const isActive = index === wizardState.currentStepIndex;
          const isCompleted = index < wizardState.currentStepIndex;
          const stepClassName = [
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            isActive
              ? "bg-blue-700 text-white"
              : isCompleted
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-200 text-slate-600",
          ].join(" ");

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              className={stepClassName}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {wizardState.errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {wizardState.errorMessage}
        </div>
      ) : null}

      {wizardState.successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {wizardState.successMessage}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {currentComponent}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={wizardState.currentStepIndex === 0 || wizardState.saving}
          className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Volver
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveStep}
            disabled={wizardState.saving}
            className="rounded-2xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={wizardState.saving}
            className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLastStep ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </footer>
    </div>
  );
}
