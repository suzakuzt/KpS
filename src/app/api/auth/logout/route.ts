import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleLogout } from "@/lib/server/api-handlers";

export function POST(request: NextRequest) {
  return toNextResponse(handleLogout(request.cookies.get("image_tool_auth")?.value));
}
