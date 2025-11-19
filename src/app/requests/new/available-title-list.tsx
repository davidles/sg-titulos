"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createRequest } from "@/lib/api";
import type { AvailableTitle, RequestCreationResponse } from "@/types/request-flow";

type AvailableTitleListProps = {
  availableTitles: AvailableTitle[];
  userId: number;
  accessToken: string;
  fetchError: string | null;
};

type SubmissionState = {
  submittingTitleId: number | null;
  errorMessage: string | null;
};

export default function AvailableTitleList({
  availableTitles,
  userId,
  accessToken,
  fetchError,
}: AvailableTitleListProps) {
  const router = useRouter();
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    submittingTitleId: null,
    errorMessage: null,
  });

  const handleCreateRequest = async (title: AvailableTitle) => {
    if (!title.requestTypeId) {
      setSubmissionState({
        submittingTitleId: null,
        errorMessage:
          "El título no tiene asociado un tipo de solicitud. Contactá a la Secretaría para revisar la configuración.",
      });
      return;
    }

    setSubmissionState({ submittingTitleId: title.idTitle, errorMessage: null });

    try {
      const createdRequest = (await createRequest(
        {
          idUser: userId,
          idTitle: title.idTitle,
          idRequestType: title.requestTypeId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )) as RequestCreationResponse | null;

      if (!createdRequest) {
        throw new Error("Respuesta inesperada del servidor. Intentalo nuevamente.");
      }

      router.push("/requests/form");
      router.refresh();
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "No se pudo generar la solicitud. Intentá nuevamente.";

      const apiMessage = (error as { body?: { message?: string } })?.body?.message ?? null;

      setSubmissionState({
        submittingTitleId: null,
        errorMessage: apiMessage ?? fallbackMessage,
      });
    }
  };

  if (fetchError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        {fetchError}
      </div>
    );
  }

  if (!availableTitles.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">No encontramos títulos disponibles</h2>
        <p className="mt-2 text-sm text-slate-600">
          Todavía no hay títulos en estado “Pendiente de solicitar” para tu usuario. Si creés que es un error,
          comunicate con la Secretaría General.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {submissionState.errorMessage ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submissionState.errorMessage}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {availableTitles.map((title) => {
          const isSubmitting = submissionState.submittingTitleId === title.idTitle;

          return (
            <article
              key={title.idTitle}
              className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-600 hover:shadow-md"
            >
              <header className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {title.requestTypeName ?? "Solicitud"}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {title.titleName ?? "Título sin nombre"}
                </h2>
                <p className="text-sm text-slate-600">
                  {title.academicProgramName ?? "Programa no disponible"}
                </p>
                <p className="text-xs text-slate-500">
                  {title.facultyName ? `Facultad: ${title.facultyName}` : "Facultad no disponible"}
                </p>
                <p className="text-xs text-slate-500">
                  {title.planName ? `Plan: ${title.planName}` : "Plan no disponible"}
                </p>
              </header>

              <div className="flex flex-col gap-3">
                <p className="text-xs text-slate-500">
                  Estado del título: {title.statusName ?? "Sin estado"}
                </p>
                <button
                  type="button"
                  onClick={() => handleCreateRequest(title)}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isSubmitting ? "Generando solicitud..." : "Iniciar solicitud"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
