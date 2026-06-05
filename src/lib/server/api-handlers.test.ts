import { describe, expect, test, vi } from "vitest";

import {
  handleConfig,
  handleEditJob,
  handleGallery,
  handleGenerateJob,
  handleJob,
  handleLogin,
  handleShareGallery,
  handleTemplates,
} from "./api-handlers";
import { resetMockService } from "./mock-service";
import { statSync } from "node:fs";

describe("api handler payloads", () => {
  test("login returns a session cookie and auth payload", async () => {
    resetMockService();

    const result = await handleLogin({ password: "demo", accessKey: "demo" });

    expect(result.status).toBe(200);
    expect(result.cookies[0]).toMatchObject({
      name: "image_tool_auth",
      httpOnly: true,
      sameSite: "lax",
    });
    expect(result.body).toMatchObject({
      authenticated: true,
      authMode: "unkey",
    });
  });

  test("config matches the reference endpoint shape", () => {
    expect(handleConfig()).toEqual({
      defaultModel: "gpt-image-2",
      hasServerKey: true,
      galleryEnabled: true,
      publicAssetBaseUrl: "",
    });
  });

  test("templates handler respects page size", () => {
    resetMockService();

    const result = handleTemplates(new URL("https://local/api/templates?page=1&pageSize=3"));

    expect(result.body.templates).toHaveLength(3);
    expect(result.body).toHaveProperty("categories");
  });

  test("generate handler requires authentication", async () => {
    resetMockService();

    const result = await handleGenerateJob(undefined, {
      prompt: "studio portrait",
      n: 1,
      size: "1024x1024",
      quality: "high",
      output_format: "png",
    });

    expect(result.status).toBe(401);
    expect(result.body).toEqual({ error: "Authentication required" });
  });

  test("completed generate jobs are not reported as gallery items unless sharing is requested", async () => {
    vi.useFakeTimers();
    resetMockService();
    const login = await handleLogin({ accessKey: "demo" });
    const sessionId = (login.body as { sessionId: string }).sessionId;

    const created = await handleGenerateJob(sessionId, {
      prompt: "private product render",
      n: 1,
      size: "1024x1024",
      quality: "high",
      output_format: "png",
      shareToGallery: false,
    });
    const jobId = (created.body as { job: { jobId: string } }).job.jobId;
    vi.advanceTimersByTime(2200);

    const polled = handleJob(sessionId, jobId);
    const job = polled.body.job as { images: unknown[]; galleryItems: unknown[] };

    expect(job.images).toHaveLength(1);
    expect(job.galleryItems).toHaveLength(0);
    vi.useRealTimers();
  });

  test("shareToGallery stores completed generate results in the public gallery", async () => {
    vi.useFakeTimers();
    resetMockService();
    const login = await handleLogin({ accessKey: "demo" });
    const sessionId = (login.body as { sessionId: string }).sessionId;

    const created = await handleGenerateJob(sessionId, {
      prompt: "public product render",
      n: 1,
      size: "1024x1024",
      quality: "high",
      output_format: "png",
      shareToGallery: true,
    });
    const jobId = (created.body as { job: { jobId: string } }).job.jobId;
    vi.advanceTimersByTime(2200);

    const polled = handleJob(sessionId, jobId);
    const job = polled.body.job as { galleryItems: Array<{ id: string; prompt: string }> };
    const gallery = handleGallery(new URL("https://local/api/gallery?page=1&pageSize=20"));
    const galleryItem = gallery.body.items.find((item) => item.id === job.galleryItems[0].id);

    expect(job.galleryItems).toHaveLength(1);
    expect(job.galleryItems[0].prompt).toBe("public product render");
    expect(galleryItem?.prompt).toBe("public product render");
    vi.useRealTimers();
  });

  test("manual share endpoint stores a local result in the public gallery", async () => {
    resetMockService();
    const login = await handleLogin({ accessKey: "demo" });
    const sessionId = (login.body as { sessionId: string }).sessionId;

    const shared = await handleShareGallery(sessionId, {
      image: {
        dataUrl: "/generated/manual-share.png",
        fileExtension: "png",
        displayWidth: 1024,
        displayHeight: 1024,
      },
      prompt: "manual share prompt",
      mode: "generate",
      metadata: { title: "Manual share" },
    });
    const gallery = handleGallery(new URL("https://local/api/gallery?page=1&pageSize=20"));

    expect(shared.status).toBe(200);
    expect(gallery.body.items[0].id).toBe((shared.body as { item: { id: string } }).item.id);
    expect(gallery.body.items[0].prompt).toBe("manual share prompt");
  });

  test("edit handler ignores empty upload placeholders before creating the job", async () => {
    resetMockService();
    const login = await handleLogin({ accessKey: "demo" });
    const sessionId = (login.body as { sessionId: string }).sessionId;
    const formData = new FormData();
    const validImage = new File([new Uint8Array([137, 80, 78, 71])], "source.png", {
      type: "image/png",
    });
    const emptyReference = new File([], "empty-reference.png", { type: "image/png" });
    const emptyMask = new File([], "empty-mask.png", { type: "image/png" });

    formData.set("prompt", "change the product background");
    formData.set("n", "1");
    formData.set("size", "1024x1024");
    formData.set("quality", "high");
    formData.set("output_format", "png");
    formData.append("images", validImage);
    formData.append("images", emptyReference);
    formData.set("mask", emptyMask);

    const result = await handleEditJob(sessionId, formData);
    const job = result.body.job as {
      referenceImagePaths?: string[];
      maskImagePath?: string;
      sourceImageName?: string;
    };

    expect(result.status).toBe(200);
    expect(job.referenceImagePaths).toHaveLength(1);
    expect(job.sourceImageName).toBe("source.png");
    expect(job.maskImagePath).toBeUndefined();
    expect(statSync(job.referenceImagePaths![0]).size).toBeGreaterThan(0);
  });
});
