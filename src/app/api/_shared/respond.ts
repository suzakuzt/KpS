import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/server/api-handlers";

export function toNextResponse(apiResult: ApiResult<unknown>) {
  const response = NextResponse.json(apiResult.body, { status: apiResult.status });
  for (const cookie of apiResult.cookies) {
    response.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      maxAge: cookie.maxAge,
      path: cookie.path,
    });
  }
  return response;
}
