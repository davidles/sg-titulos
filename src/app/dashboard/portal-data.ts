import { getPortalData } from "@/data/portal";
import type { MenuOption, Solicitud } from "@/types/portal";

type PortalData = {
  solicitudes: Solicitud[];
  menuOptions: MenuOption[];
};

function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function fetchPortalData(): Promise<PortalData> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/portal`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portal data: ${response.status}`);
    }

    const data = (await response.json()) as PortalData;
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Falling back to local portal data", error);
    }
    return getPortalData();
  }
}
