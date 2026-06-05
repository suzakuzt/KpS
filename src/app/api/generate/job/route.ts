import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleGenerateJob } from "@/lib/server/api-handlers";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return toNextResponse(await handleGenerateJob(request.cookies.get("image_tool_auth")?.value, body));
}
