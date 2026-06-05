import { NextResponse } from "next/server";

import { handleConfig } from "@/lib/server/api-handlers";

export function GET() {
  return NextResponse.json(handleConfig());
}
