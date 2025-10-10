import type { MenuOption, Solicitud } from "@/types/portal";

export const menuOptions: MenuOption[] = [
  {
    title: "Iniciar solicitud",
    description:
      "Permite dar inicio al trámite para la emisión del título correspondiente a una carrera finalizada.",
  },
  {
    title: "Buscar solicitud",
    description:
      "Consulte el estado actual de una solicitud iniciada previamente.",
  },
  {
    title: "Subsanar solicitud",
    description:
      "Acceda para corregir o completar datos requeridos para la continuidad del trámite.",
  },
];

export const solicitudes: Solicitud[] = [
  {
    titulo: "Licenciatura en Psicología",
    carrera: "Psicología",
    facultad: "Facultad de Humanidades",
    estado: "En revisión",
    accion: "Ver detalle",
  },
  {
    titulo: "Profesorado en Matemática",
    carrera: "Matemática",
    facultad: "Facultad de Ciencias Exactas",
    estado: "Aprobado",
    accion: "Descargar resolución",
  },
];

export function getPortalData() {
  return {
    solicitudes,
    menuOptions,
  };
}
