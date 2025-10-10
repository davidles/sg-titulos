import { NextResponse } from "next/server";

import { getPortalData } from "@/data/portal";

export async function GET() {
  const data = getPortalData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}
