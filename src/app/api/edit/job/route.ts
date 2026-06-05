import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleEditJob } from "@/lib/server/api-handlers";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return toNextResponse(await handleEditJob(request.cookies.get("image_tool_auth")?.value, formData));
}
