import { NextResponse } from "next/server";

import { getPortalFallbackData } from "@/data/portal";

export async function GET() {
  const data = getPortalFallbackData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}
