import type { ImageMode } from "@/lib/shared/types";
import type { GalleryItem, ImageJob } from "@/lib/shared/types";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  createImageJob,
  getAuthStatus,
  getGallery,
  getImageJob,
  getInspiration,
  getTemplates,
  loginWithAccessKey,
  logout,
  optimizePrompt,
  shareImageToGallery,
  summarizeTitle,
} from "./mock-service";

export type ApiCookie = {
  name: string;
  value: string;
  httpOnly: boolean;
  sameSite: "lax";
  maxAge?: number;
  path: string;
};

export type ApiResult<T> = {
  status: number;
  body: T;
  cookies: ApiCookie[];
};

function result<T>(status: number, body: T, cookies: ApiCookie[] = []): ApiResult<T> {
  return { status, body, cookies };
}

function authError(error: unknown) {
  const message = error instanceof Error ? error.message : "Authentication required";
  return result(401, { error: message }, []);
}

function toReferenceImage(item: GalleryItem, index: number) {
  return {
    resultId: item.id || `result-${index + 1}`,
    dataUrl: item.displayUrl || item.imageUrl,
    revisedPrompt: item.revisedPrompt || item.prompt,
    remoteUrl: item.remoteUrl || item.displayUrl,
    objectKey: item.objectKey,
    storedUrl: item.displayUrl,
    fileExtension: item.fileExtension,
    galleryItemId: item.id,
    galleryUrl: "",
    displayObjectKey: item.displayObjectKey,
    displayUrl: item.displayUrl,
    displayMimeType: item.displayMimeType,
    displayWidth: item.displayWidth,
    displayHeight: item.displayHeight,
    displaySize: item.displaySize,
    originalWidth: item.originalWidth,
    originalHeight: item.originalHeight,
    originalMimeType: item.originalMimeType,
    originalSize: item.originalSize,
    thumbnailObjectKey: item.thumbnailObjectKey,
    thumbnailUrl: item.thumbnailUrl,
  };
}

function toReferenceJob(job: ImageJob) {
  const status = job.status === "processing" ? "running" : job.status;
  return {
    ...job,
    jobId: job.id,
    status,
    images: job.results.map(toReferenceImage),
    galleryItems: job.galleryItems || [],
  };
}

export async function handleLogin(body: unknown) {
  const payload = body as { password?: string; accessKey?: string };
  try {
    const login = loginWithAccessKey(payload.accessKey || payload.password || "");
    return result(200, login, [
      {
        name: "image_tool_auth",
        value: login.sessionId,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      },
    ]);
  } catch (error) {
    return result(400, { error: error instanceof Error ? error.message : "Login failed" });
  }
}

export function handleLogout(sessionId?: string) {
  return result(200, logout(sessionId), [
    {
      name: "image_tool_auth",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    },
  ]);
}

export function handleAuthStatus(sessionId?: string) {
  return result(200, getAuthStatus(sessionId));
}

export function handleConfig() {
  return {
    defaultModel: "gpt-image-2",
    hasServerKey: true,
    galleryEnabled: true,
    publicAssetBaseUrl: "",
  };
}

export function handleTemplates(url: URL) {
  return result(200, getTemplates({
    page: Number(url.searchParams.get("page") || 1),
    pageSize: Number(url.searchParams.get("pageSize") || url.searchParams.get("limit") || 12),
    search: url.searchParams.get("search") || "",
    category: url.searchParams.get("category") || "",
  }));
}

export function handleGallery(url: URL) {
  return result(200, getGallery({
    page: Number(url.searchParams.get("page") || 1),
    pageSize: Number(url.searchParams.get("pageSize") || url.searchParams.get("limit") || 12),
    cursor: url.searchParams.get("cursor") || undefined,
  }));
}

export function handleInspiration(url: URL) {
  return result(200, getInspiration(Number(url.searchParams.get("limit") || 6)));
}

export async function handleGenerateJob(sessionId: string | undefined, body: unknown) {
  try {
    const payload = body as Record<string, unknown>;
    const job = createImageJob(sessionId, {
      mode: "generate",
      prompt: String(payload.prompt || ""),
      count: Number(payload.n || payload.count || 1),
      size: String(payload.size || "1024x1024"),
      quality: String(payload.quality || "high"),
      format: String(payload.output_format || payload.outputFormat || payload.format || "png"),
      shareToGallery: payload.shareToGallery === true || payload.shareToGallery === "true",
    });
    return result(200, { job: toReferenceJob(job), creditsRemaining: job.creditsRemaining });
  } catch (error) {
    return authError(error);
  }
}

export async function handleEditJob(sessionId: string | undefined, formData: FormData) {
  try {
    const imageFiles = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File)
      .filter(isNonEmptyUploadFile);
    const maskFile = formData.get("mask");
    const referenceImagePaths = await saveUploadFiles(imageFiles);
    const maskImagePath =
      maskFile instanceof File && isNonEmptyUploadFile(maskFile)
        ? (await saveUploadFiles([maskFile]))[0]
        : undefined;
    const file = imageFiles[0];
    const sourceImageName = file?.name;
    const job = createImageJob(sessionId, {
      mode: "edit",
      prompt: String(formData.get("prompt") || ""),
      count: Number(formData.get("n") || 1),
      size: String(formData.get("size") || "1024x1024"),
      quality: String(formData.get("quality") || "high"),
      format: String(formData.get("output_format") || "png"),
      sourceImageName,
      referenceImagePaths,
      maskImagePath,
      shareToGallery: formData.get("shareToGallery") === "true",
    });
    return result(200, { job: toReferenceJob(job), creditsRemaining: job.creditsRemaining });
  } catch (error) {
    return authError(error);
  }
}

function isNonEmptyUploadFile(file: File) {
  return file.size > 0;
}

async function saveUploadFiles(files: File[]) {
  if (!files.length) {
    return [];
  }
  const uploadDir = path.join(process.cwd(), ".imagegen", "uploads", Date.now().toString(36));
  await mkdir(uploadDir, { recursive: true });
  const paths: string[] = [];
  for (const [index, file] of files.entries()) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!buffer.length) {
      continue;
    }
    const extension = path.extname(file.name || "") || ".png";
    const outputPath = path.join(uploadDir, `reference-${index + 1}${extension}`);
    await writeFile(outputPath, buffer);
    paths.push(outputPath);
  }
  return paths;
}

export async function handleShareGallery(sessionId: string | undefined, body: unknown) {
  try {
    const payload = body as {
      image?: unknown;
      prompt?: unknown;
      mode?: ImageMode;
      metadata?: unknown;
    };
    const item = shareImageToGallery(sessionId, payload);
    return result(200, { item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Share failed";
    return result(message === "Authentication required" ? 401 : 400, { error: message });
  }
}

export function handleJob(sessionId: string | undefined, jobId: string) {
  try {
    const job = getImageJob(sessionId, jobId);
    return result(200, { job: toReferenceJob(job), creditsRemaining: job.creditsRemaining });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job not found";
    return result(message === "Job not found" ? 404 : 401, { error: message });
  }
}

export async function handleOptimizePrompt(sessionId: string | undefined, body: unknown) {
  if (!getAuthStatus(sessionId).authenticated) {
    return result(401, { error: "Authentication required" });
  }
  const payload = body as { prompt?: string; mode?: ImageMode };
  return result(200, optimizePrompt(payload.prompt || "", payload.mode || "generate"));
}

export async function handleSummarizeTitle(sessionId: string | undefined, body: unknown) {
  if (!getAuthStatus(sessionId).authenticated) {
    return result(401, { error: "Authentication required" });
  }
  const payload = body as { prompt?: string; mode?: ImageMode };
  return result(200, summarizeTitle(payload.prompt || "", payload.mode || "generate"));
}
