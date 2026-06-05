import { describe, expect, test, vi } from "vitest";

import {
  createImageJob,
  getAuthStatus,
  getGallery,
  getImageJob,
  getTemplates,
  loginWithAccessKey,
  resetMockService,
} from "./mock-service";

describe("mock image workspace service", () => {
  test("accepts access-key login and reports authenticated status", () => {
    resetMockService();

    const login = loginWithAccessKey("demo-key");
    const status = getAuthStatus(login.sessionId);

    expect(login.authenticated).toBe(true);
    expect(status).toMatchObject({
      authEnabled: true,
      authenticated: true,
      authMode: "unkey",
      creditsRemaining: 124,
    });
  });

  test("rejects blank access keys", () => {
    resetMockService();

    expect(() => loginWithAccessKey(" ")).toThrow("Access key is required");
  });

  test("returns paginated templates with observed top-level shape", () => {
    resetMockService();

    const page = getTemplates({ page: 1, pageSize: 2, search: "poster" });

    expect(page.templates).toHaveLength(2);
    expect(page.categories).toContain("全部");
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.totalPages).toBeGreaterThanOrEqual(1);
    expect(page.templates[0]).toHaveProperty("imageObjectKey");
  });

  test("returns gallery items with cursor metadata", () => {
    resetMockService();

    const gallery = getGallery({ pageSize: 2 });

    expect(gallery.items).toHaveLength(2);
    expect(gallery).toMatchObject({
      limit: 2,
      hasMore: true,
    });
    expect(gallery.items[0]).toHaveProperty("displayObjectKey");
  });

  test("moves image jobs from queued to succeeded after polling", () => {
    vi.useFakeTimers();
    resetMockService();
    const login = loginWithAccessKey("demo-key");

    const job = createImageJob(login.sessionId, {
      mode: "generate",
      prompt: "cinematic product photo",
      count: 2,
      size: "1024x1024",
      quality: "high",
      format: "png",
    });

    expect(job.status).toBe("queued");
    vi.advanceTimersByTime(2200);

    const resolved = getImageJob(login.sessionId, job.id);
    expect(resolved.status).toBe("succeeded");
    expect(resolved.results).toHaveLength(2);
    expect(resolved.creditsRemaining).toBe(122);
    vi.useRealTimers();
  });
});
