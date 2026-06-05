import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleGallery } from "@/lib/server/api-handlers";

export function GET(request: NextRequest) {
  return toNextResponse(handleGallery(request.nextUrl));
}
