"use client";

import { useState } from "react";

import { uploadRequirementFile } from "@/lib/api";
import type { RequestRequirementItem } from "@/types/request-flow";

type RequestRequirementsClientProps = {
  requestId: number;
  items: RequestRequirementItem[];
  userId: number;
  accessToken: string;
  fetchError: string | null;
};

const COMPLETED_STATUS_ID = 2;

type LocalRequirementState = RequestRequirementItem & {
  uploading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
};

export default function RequestRequirementsClient({
  requestId,
  items,
  userId,
  accessToken,
  fetchError,
}: RequestRequirementsClientProps) {
  const [requirements, setRequirements] = useState<LocalRequirementState[]>(
    () =>
      items.map((item) => ({
        ...item,
        uploading: false,
        errorMessage: null,
        successMessage: null,
      })),
  );

  const handleFileChange = async (
    requirementInstanceId: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setRequirements((prev) =>
      prev.map((item) =>
        item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
          ? { ...item, uploading: true, errorMessage: null, successMessage: null }
          : item,
      ),
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(userId));
    formData.append("nextStatusId", String(COMPLETED_STATUS_ID));

    try {
      const updatedItem = (await uploadRequirementFile({
        requestId,
        requirementInstanceId,
        formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })) as RequestRequirementItem | null;

      if (!updatedItem) {
        throw new Error("Respuesta inesperada del servidor. Intentá nuevamente.");
      }

      setRequirements((prev) =>
        prev.map((item) =>
          item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
            ? {
                ...item,
                ...updatedItem,
                uploading: false,
                errorMessage: null,
                successMessage: "Archivo cargado correctamente.",
              }
            : item,
        ),
      );
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "No se pudo subir el archivo. Intentá nuevamente.";
      const apiMessage = (error as { body?: { message?: string } })?.body?.message ?? null;

      setRequirements((prev) =>
        prev.map((item) =>
          item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
            ? {
                ...item,
                uploading: false,
                errorMessage: apiMessage ?? fallbackMessage,
                successMessage: null,
              }
            : item,
        ),
      );
    } finally {
      event.target.value = "";
    }
  };

  if (fetchError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{fetchError}</div>
    );
  }

  if (!requirements.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">No hay requisitos configurados</h2>
        <p className="mt-2 text-sm text-slate-600">
          Todavía no se configuraron requisitos documentales para esta solicitud. Ante dudas, consultá con la
          Secretaría General.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requirements.map((item) => {
        const { requirementInstance, requirement, status, uploading, errorMessage, successMessage } = item;
        const hasFile = Boolean(requirementInstance.requirementFilePath);

        return (
          <article
            key={requirementInstance.idRequestRequirementInstance}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {requirement?.requirementName ?? "Requisito sin nombre"}
                </h2>
                <p className="text-xs text-slate-600">
                  {requirement?.requirementDescription ?? "Sin descripción"}
                </p>
              </div>
              <div className="mt-2 text-xs sm:mt-0">
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                  {status?.requirementInstanceStatusName ?? "Sin estado"}
                </span>
              </div>
            </header>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-600">
                {hasFile ? (
                  <p>
                    Archivo cargado. Versión {requirementInstance.complianceVersion ?? 1}.
                  </p>
                ) : (
                  <p>No hay archivo cargado todavía.</p>
                )}
                {errorMessage ? (
                  <p className="mt-1 text-xs text-red-700">{errorMessage}</p>
                ) : successMessage ? (
                  <p className="mt-1 text-xs text-emerald-700">{successMessage}</p>
                ) : null}
              </div>

              <label className="relative inline-flex cursor-pointer items-center justify-center rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300">
                <span>{uploading ? "Subiendo archivo..." : hasFile ? "Reemplazar archivo" : "Subir archivo"}</span>
                <input
                  type="file"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  onChange={(event) => handleFileChange(requirementInstance.idRequestRequirementInstance, event)}
                  disabled={uploading}
                />
              </label>
            </div>
          </article>
        );
      })}
    </div>
  );
}
