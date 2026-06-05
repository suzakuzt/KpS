import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleInspiration } from "@/lib/server/api-handlers";

export function GET(request: NextRequest) {
  return toNextResponse(handleInspiration(request.nextUrl));
}
