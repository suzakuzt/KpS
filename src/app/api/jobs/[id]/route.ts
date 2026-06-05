import type { NextRequest } from "next/server";

import { toNextResponse } from "@/app/api/_shared/respond";
import { handleJob } from "@/lib/server/api-handlers";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Params) {
  const { id } = await context.params;
  return toNextResponse(handleJob(request.cookies.get("image_tool_auth")?.value, id));
}
