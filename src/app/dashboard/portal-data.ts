import { getPortalFallbackData } from "@/data/portal";
import type { DashboardData } from "@/types/portal";
import type { Session } from "next-auth";
import { fetchFromApi } from "@/lib/api";

type PortalData = {
  menuOptions: DashboardData["menuOptions"];
  requests: DashboardData["requests"];
};

export async function fetchPortalData(session: Session): Promise<PortalData> {
  try {
    if (!session?.user?.id || !session.user.accessToken) {
      throw new Error("Sesión no encontrada o token no disponible");
    }

    const dashboardData = await fetchFromApi(`/api/dashboard?userId=${session.user.id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    });

    return dashboardData as DashboardData;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Falling back to local portal data", error);
    }
    return getPortalFallbackData();
  }
}
