import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleTemplates } from "@/lib/server/api-handlers";

export function GET(request: NextRequest) {
  return toNextResponse(handleTemplates(request.nextUrl));
}
