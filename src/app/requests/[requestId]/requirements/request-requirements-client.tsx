"use client";

import { useMemo, useState } from "react";

import { downloadRequirementFile, uploadRequirementFile, reviewRequirement } from "@/lib/api";
import type { RequestRequirementItem, RequirementReviewPayload } from "@/types/request-flow";

type RequestRequirementsClientProps = {
  requestId: number;
  items: RequestRequirementItem[];
  userId: number;
  accessToken: string;
  fetchError: string | null;
  roleId: number | null | undefined;
};

const COMPLETED_STATUS_ID = 2;
const ACCEPTED_STATUS_ID = 3;
const REJECTED_STATUS_ID = 4;

type LocalRequirementState = RequestRequirementItem & {
  uploading: boolean;
  downloading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  reviewComment: string;
  reviewing: boolean;
  reviewingAction: "accept" | "reject" | null;
};

export default function RequestRequirementsClient({
  requestId,
  items,
  userId,
  accessToken,
  fetchError,
  roleId,
}: RequestRequirementsClientProps) {
  const isFacultyReviewer = useMemo(() => {
    if (roleId === null || roleId === undefined) {
      return false;
    }

    return roleId >= 200;
  }, [roleId]);

  const visibleItems = useMemo(() => {
    if (isFacultyReviewer) {
      return items;
    }

    return items.filter((item) => item.responsibility !== "ADMINISTRATIVE");
  }, [items, isFacultyReviewer]);

  const [requirements, setRequirements] = useState<LocalRequirementState[]>(
    () =>
      visibleItems.map((item) => ({
        ...item,
        uploading: false,
        downloading: false,
        errorMessage: null,
        successMessage: null,
        reviewComment: item.requirementInstance.reviewReason ?? "",
        reviewing: false,
        reviewingAction: null,
      })),
  );

  const allGraduateAccepted = useMemo(() => {
    const graduateItems = requirements.filter((item) => item.responsibility !== "ADMINISTRATIVE");

    if (!graduateItems.length) {
      return false;
    }

    return graduateItems.every((item) => item.status?.idRequirementInstanceStatus === ACCEPTED_STATUS_ID);
  }, [requirements]);

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
          ? {
              ...item,
              uploading: true,
              errorMessage: null,
              successMessage: null
            }
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
                downloading: false,
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

  const handleDownload = async (requirementInstanceId: number) => {
    setRequirements((prev) =>
      prev.map((item) =>
        item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
          ? { ...item, downloading: true, errorMessage: null }
          : item,
      ),
    );

    try {
      const { blob, fileName } = await downloadRequirementFile({
        requestId,
        requirementInstanceId,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName ?? `requisito-${requirementInstanceId}.bin`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setRequirements((prev) =>
        prev.map((item) =>
          item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
            ? { ...item, downloading: false }
            : item,
        ),
      );
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "No pudimos descargar el archivo. Intentá nuevamente.";
      const apiMessage = (error as { body?: { message?: string } })?.body?.message ?? null;

      setRequirements((prev) =>
        prev.map((item) =>
          item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
            ? {
                ...item,
                downloading: false,
                errorMessage: apiMessage ?? fallbackMessage,
              }
            : item,
        ),
      );
    }
  };

  const handleReview = async (
    requirementInstanceId: number,
    nextStatusId: number,
    reviewComment: string,
  ) => {
    setRequirements((prev) =>
      prev.map((item) =>
        item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
          ? {
              ...item,
              reviewing: true,
              reviewingAction: nextStatusId === ACCEPTED_STATUS_ID ? "accept" : "reject",
              errorMessage: null,
              successMessage: null,
            }
          : item,
      ),
    );

    const payload: RequirementReviewPayload = {
      nextStatusId,
      reviewReason: reviewComment || null,
      reviewerUserId: userId,
    };

    try {
      const updatedItem = (await reviewRequirement({
        requestId,
        requirementInstanceId,
        payload,
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
                reviewComment: reviewComment,
                reviewing: false,
                reviewingAction: null,
                errorMessage: null,
                successMessage:
                  nextStatusId === ACCEPTED_STATUS_ID
                    ? "Requisito aceptado correctamente."
                    : "Requisito marcado como rechazado."
              }
            : item,
        ),
      );
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "No se pudo actualizar el requisito. Intentá nuevamente.";
      const apiMessage = (error as { body?: { message?: string } })?.body?.message ?? null;

      setRequirements((prev) =>
        prev.map((item) =>
          item.requirementInstance.idRequestRequirementInstance === requirementInstanceId
            ? {
                ...item,
                reviewing: false,
                errorMessage: apiMessage ?? fallbackMessage,
                successMessage: null,
              }
            : item,
        ),
      );
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
        const {
          requirementInstance,
          requirement,
          status,
          uploading,
          downloading,
          errorMessage,
          successMessage
        } = item;
        const hasFile = Boolean(requirementInstance.requirementFilePath);
        const isAccepted = status?.idRequirementInstanceStatus === ACCEPTED_STATUS_ID;
        const isRejected = status?.idRequirementInstanceStatus === REJECTED_STATUS_ID;
        const isAdministrativeRequirement = item.responsibility === "ADMINISTRATIVE";

        const isUploadDisabledForAdmin =
          isFacultyReviewer &&
          ((item.responsibility !== "ADMINISTRATIVE" && isRejected) ||
            (isAdministrativeRequirement && !allGraduateAccepted));

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

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                {isRejected || item.requirementInstance.reviewReason ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Observación: {item.requirementInstance.reviewReason && item.requirementInstance.reviewReason.trim().length > 0
                      ? item.requirementInstance.reviewReason
                      : "Revisá este documento y volvé a cargarlo."}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                {hasFile ? (
                  <button
                    type="button"
                    onClick={() => handleDownload(requirementInstance.idRequestRequirementInstance)}
                    disabled={uploading || downloading}
                    className="inline-flex items-center justify-center rounded-2xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-700 hover:text-blue-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                  >
                    {downloading ? "Descargando..." : "Descargar archivo"}
                  </button>
                ) : null}

                <label className="relative inline-flex cursor-pointer items-center justify-center rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300">
                  <span>
                    {uploading ? "Subiendo archivo..." : hasFile ? "Reemplazar archivo" : "Subir archivo"}
                  </span>
                  <input
                    type="file"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={(event) => handleFileChange(requirementInstance.idRequestRequirementInstance, event)}
                    disabled={uploading || isUploadDisabledForAdmin}
                  />
                </label>
              </div>
            </div>

            {isFacultyReviewer && hasFile && item.responsibility !== "ADMINISTRATIVE" ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-xs font-semibold text-slate-700" htmlFor={`review-${requirementInstance.idRequestRequirementInstance}`}>
                  Observaciones (opcional)
                </label>
                <textarea
                  id={`review-${requirementInstance.idRequestRequirementInstance}`}
                  className="min-h-[72px] rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={item.reviewComment}
                  onChange={(event) =>
                    setRequirements((prev) =>
                      prev.map((localItem) =>
                        localItem.requirementInstance.idRequestRequirementInstance ===
                        requirementInstance.idRequestRequirementInstance
                          ? {
                              ...localItem,
                              reviewComment: event.target.value,
                            }
                          : localItem,
                      ),
                    )
                  }
                  placeholder="Ingresá un comentario para el egresado"
                  disabled={item.reviewing}
                />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleReview(
                        requirementInstance.idRequestRequirementInstance,
                        ACCEPTED_STATUS_ID,
                        item.reviewComment,
                      )
                    }
                    disabled={
                      item.reviewing ||
                      isAccepted ||
                      isRejected ||
                      item.reviewingAction === "reject"
                    }
                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    {item.reviewing && item.reviewingAction === "accept"
                      ? "Guardando..."
                      : isAccepted
                        ? "Aceptado"
                        : "Marcar como aceptado"}
                  </button>
                  {!isAccepted && !isRejected && (
                    <button
                      type="button"
                      onClick={() =>
                        handleReview(
                          requirementInstance.idRequestRequirementInstance,
                          REJECTED_STATUS_ID,
                          item.reviewComment,
                        )
                      }
                      disabled={
                        item.reviewing ||
                        isRejected ||
                        item.reviewingAction === "accept"
                      }
                      className="inline-flex items-center justify-center rounded-2xl border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-700 hover:text-red-800 disabled:cursor-not-allowed disabled:border-red-300 disabled:text-red-300"
                    >
                      {item.reviewing && item.reviewingAction === "reject"
                        ? "Guardando..."
                        : isRejected
                          ? "Rechazado"
                          : "Marcar como rechazado"}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
