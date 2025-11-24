import type { DashboardData } from "@/types/portal";

export const fallbackDashboardData: DashboardData = {
  menuOptions: [
    {
      id: 1,
      name: "Iniciar solicitud",
      description:
        "Permite dar inicio al trámite para la emisión del título correspondiente a una carrera finalizada.",
    },
    {
      id: 2,
      name: "Buscar solicitud",
      description: "Consulte el estado actual de una solicitud iniciada previamente.",
    },
    {
      id: 3,
      name: "Subsanar solicitud",
      description:
        "Acceda para corregir o completar datos requeridos para la continuidad del trámite.",
    },
  ],
  requests: [
    {
      idRequest: 1,
      requestTypeName: "Emisión de título - Licenciatura en Psicología",
      generatedAt: new Date().toISOString().split("T")[0],
      statusName: "En revisión",
      statusDescription: "La solicitud se encuentra en evaluación por la Secretaría.",
      nextAction: "Ver detalle",
      requestTypeId: 1,
      academicProgramName: "Licenciatura en Psicología",
      facultyName: "Facultad de Psicología",
      planName: "Plan 2020",
      totalRequirements: 3,
      completedRequirements: 2,
    },
    {
      idRequest: 2,
      requestTypeName: "Certificado Analítico - Profesorado en Matemática",
      generatedAt: new Date().toISOString().split("T")[0],
      statusName: "Aprobado",
      statusDescription: "La solicitud fue aprobada y se generó la documentación.",
      nextAction: "Descargar constancia",
      requestTypeId: 2,
      academicProgramName: "Profesorado en Matemática",
      facultyName: "Facultad de Ciencias Exactas",
      planName: "Plan 2018",
      totalRequirements: 4,
      completedRequirements: 4,
    },
  ],
};

export function getPortalFallbackData(): DashboardData {
  return fallbackDashboardData;
}
