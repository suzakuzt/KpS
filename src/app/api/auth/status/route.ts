import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleAuthStatus } from "@/lib/server/api-handlers";

export function GET(request: NextRequest) {
  return toNextResponse(handleAuthStatus(request.cookies.get("image_tool_auth")?.value));
}
