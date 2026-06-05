import type { GalleryItem, ImageJob, ImageJobInput, ImageMode, TemplateItem } from "@/lib/shared/types";
import { generateImagesForJob, shouldUseGatewayProvider } from "./image-provider";

const initialCredits = 124;

type Session = {
  id: string;
  accessKey: string;
  creditsRemaining: number;
  createdAt: number;
};

type MockStore = {
  sessions: Map<string, Session>;
  jobs: Map<string, ImageJob>;
  sharedGalleryItems: GalleryItem[];
};

declare global {
  var __imageToolMockStore: MockStore | undefined;
}

const store = globalThis.__imageToolMockStore ?? {
  sessions: new Map<string, Session>(),
  jobs: new Map<string, ImageJob>(),
  sharedGalleryItems: [],
};

globalThis.__imageToolMockStore = store;

if (!store.sharedGalleryItems) {
  store.sharedGalleryItems = [];
}

const { sessions, jobs, sharedGalleryItems } = store;

const imageSeeds = [
  "/demo/product-blue.png",
  "/demo/valley-poster.png",
  "/demo/minimal-landscape.png",
  "/demo/lifestyle-afternoon.png",
  "/demo/tech-workstation.png",
  "/demo/geometric-space.png",
];

const templateSeeds: Array<Pick<TemplateItem, "id" | "title" | "category" | "prompt">> = [
  {
    id: "tpl-product-poster",
    title: "高端产品海报",
    category: "商业海报",
    prompt: "premium product poster, clean studio light, reflective surface, sharp details",
  },
  {
    id: "tpl-social-cover",
    title: "社媒封面图",
    category: "社媒内容",
    prompt: "editorial social poster cover, bold composition, bright natural light, modern layout",
  },
  {
    id: "tpl-avatar",
    title: "电影感头像",
    category: "人物写真",
    prompt: "cinematic portrait, soft rim light, shallow depth of field, realistic skin texture",
  },
  {
    id: "tpl-architecture",
    title: "建筑概念图",
    category: "空间设计",
    prompt: "minimal architecture concept, glass facade, warm evening light, ultra realistic",
  },
  {
    id: "tpl-food",
    title: "餐饮菜品图",
    category: "电商图片",
    prompt: "restaurant food photography, overhead angle, appetizing light, clean background",
  },
  {
    id: "tpl-packaging",
    title: "包装视觉",
    category: "商业海报",
    prompt: "luxury packaging render, soft shadows, monochrome background, premium branding",
  },
];

function makeTemplate(seed: Pick<TemplateItem, "id" | "title" | "category" | "prompt">, index: number): TemplateItem {
  const imageUrl = imageSeeds[index % imageSeeds.length];
  return {
    ...seed,
    imageObjectKey: `templates/${seed.id}/image.jpg`,
    imageUrl,
    imageMimeType: "image/jpeg",
    imageWidth: 1024,
    imageHeight: 1024,
    imageSize: 426000 + index * 1200,
    thumbnailObjectKey: `templates/${seed.id}/thumb.jpg`,
    thumbnailUrl: imageUrl,
    thumbnailMimeType: "image/jpeg",
    thumbnailWidth: 512,
    thumbnailHeight: 512,
    thumbnailSize: 92000 + index * 900,
    sourceUrl: "",
    sourceImageUrl: imageUrl,
    license: "workspace-demo",
    status: "active",
    sortOrder: index + 1,
    metadata: { model: "mock-provider", ratio: "1:1" },
  };
}

const templates = templateSeeds.map(makeTemplate);

function makeGalleryItem(index: number, mode: ImageMode = index % 2 === 0 ? "generate" : "edit"): GalleryItem {
  const imageUrl = imageSeeds[index % imageSeeds.length];
  const title = ["蓝调产品图", "山谷海报", "极简景观", "午后生活方式", "科技工作台", "几何空间"][index % 6];
  const prompt = [
    "blue product photography with polished metal and clean shadows",
    "quiet valley poster, mist, editorial composition",
    "minimal landscape, high contrast, cinematic color",
    "lifestyle scene, warm sunlight, natural material",
    "developer workspace, luminous screens, precise details",
    "geometric architecture, purple skylight, futuristic atrium",
  ][index % 6];
  return {
    id: `gal-${index + 1}`,
    createdAt: new Date(Date.UTC(2026, 4, 30, 8, index)).toISOString(),
    prompt,
    title,
    mode,
    visibility: "public",
    status: "active",
    imageUrl,
    displayUrl: imageUrl,
    objectKey: `gallery/${index + 1}/original.jpg`,
    displayObjectKey: `gallery/${index + 1}/display.jpg`,
    displayMimeType: "image/jpeg",
    displayWidth: 1024,
    displayHeight: 1024,
    displaySize: 512000 + index * 1800,
    originalWidth: 1024,
    originalHeight: 1024,
    originalMimeType: "image/jpeg",
    originalSize: 612000 + index * 1800,
    thumbnailUrl: imageUrl,
    thumbnailObjectKey: `gallery/${index + 1}/thumb.jpg`,
    thumbnailMimeType: "image/jpeg",
    thumbnailWidth: 512,
    thumbnailHeight: 512,
    thumbnailSize: 122000 + index * 800,
    mimeType: "image/jpeg",
    fileExtension: "jpg",
    revisedPrompt: prompt,
    remoteUrl: imageUrl,
    metadata: { provider: "mock-provider", seed: index + 1 },
    clientHash: `mock-${index + 1}`,
  };
}

const seedGalleryItems = Array.from({ length: 9 }, (_, index) => makeGalleryItem(index));

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function textValue(value: unknown) {
  return String(value || "").trim();
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function metadataValue(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function imageRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function inferImageExtension(url: string, fallback = "png") {
  const clean = url.split("?")[0].split("#")[0];
  const extension = clean.includes(".") ? clean.slice(clean.lastIndexOf(".") + 1).toLowerCase() : "";
  return extension && extension.length <= 5 ? extension : fallback;
}

function imageMimeType(extension: string) {
  return extension === "jpg" || extension === "jpeg" ? "image/jpeg" : `image/${extension || "png"}`;
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = textValue(value);
    if (text) {
      return text;
    }
  }
  return "";
}

function createGalleryItemFromImage(input: {
  image?: unknown;
  prompt?: unknown;
  mode?: ImageMode;
  metadata?: unknown;
}): GalleryItem {
  const image = imageRecord(input.image);
  const metadata = metadataValue(input.metadata);
  const displayUrl = firstText(
    image.displayUrl,
    image.imageUrl,
    image.dataUrl,
    image.storedUrl,
    image.galleryUrl,
    image.remoteUrl
  );
  if (!displayUrl) {
    throw new Error("Image is required");
  }

  const prompt = firstText(input.prompt, image.revisedPrompt);
  const fileExtension = firstText(image.fileExtension, inferImageExtension(displayUrl));
  const mimeType = firstText(
    image.displayMimeType,
    image.mimeType,
    image.originalMimeType,
    imageMimeType(fileExtension)
  );
  const width = numberValue(image.displayWidth) || numberValue(image.originalWidth) || 1024;
  const height = numberValue(image.displayHeight) || numberValue(image.originalHeight) || 1024;
  const size = numberValue(image.displaySize) || numberValue(image.originalSize);
  const title = firstText(metadata.title, prompt.slice(0, 36), input.mode === "edit" ? "Edited image" : "Generated image");
  const id = createId("gallery");

  return {
    id,
    createdAt: new Date().toISOString(),
    prompt,
    title,
    mode: input.mode === "edit" ? "edit" : "generate",
    visibility: "public",
    status: "completed",
    imageUrl: displayUrl,
    displayUrl,
    objectKey: "",
    displayObjectKey: "",
    displayMimeType: mimeType,
    displayWidth: width,
    displayHeight: height,
    displaySize: size,
    originalWidth: numberValue(image.originalWidth) || width,
    originalHeight: numberValue(image.originalHeight) || height,
    originalMimeType: firstText(image.originalMimeType, mimeType),
    originalSize: numberValue(image.originalSize) || size,
    thumbnailUrl: firstText(image.thumbnailUrl, displayUrl),
    thumbnailObjectKey: "",
    thumbnailMimeType: firstText(image.thumbnailMimeType, mimeType),
    thumbnailWidth: numberValue(image.thumbnailWidth) || Math.min(width, 512),
    thumbnailHeight: numberValue(image.thumbnailHeight) || Math.min(height, 512),
    thumbnailSize: numberValue(image.thumbnailSize),
    mimeType,
    fileExtension,
    revisedPrompt: firstText(image.revisedPrompt, prompt),
    remoteUrl: firstText(image.remoteUrl, displayUrl),
    metadata,
    clientHash: id,
  };
}

function findSharedGalleryItemByUrl(displayUrl: string) {
  return sharedGalleryItems.find((item) => item.displayUrl === displayUrl || item.imageUrl === displayUrl);
}

function addSharedGalleryItem(input: {
  image?: unknown;
  prompt?: unknown;
  mode?: ImageMode;
  metadata?: unknown;
}) {
  const item = createGalleryItemFromImage(input);
  const existing = findSharedGalleryItemByUrl(item.displayUrl);
  if (existing) {
    return existing;
  }

  sharedGalleryItems.unshift(item);
  return item;
}

function makeJobResultItem(job: ImageJob, index: number): GalleryItem {
  const base = makeGalleryItem((index + job.prompt.length) % seedGalleryItems.length, job.mode);
  const id = `${job.id}-result-${index + 1}`;
  return {
    ...base,
    id,
    createdAt: new Date().toISOString(),
    prompt: job.prompt,
    title: job.mode === "edit" ? `Edit result ${index + 1}` : `Generated result ${index + 1}`,
    revisedPrompt: job.prompt,
    metadata: {
      ...base.metadata,
      provider: "mock-provider",
      jobId: job.id,
    },
    clientHash: id,
  };
}

function shareJobResultsIfRequested(job: ImageJob) {
  if (!job.shareToGallery) {
    job.galleryItems = [];
    return [];
  }
  if (job.galleryItems?.length) {
    return job.galleryItems;
  }

  job.galleryItems = job.results.map((image) =>
    addSharedGalleryItem({
      image,
      prompt: job.prompt,
      mode: job.mode,
      metadata: {
        title: job.mode === "edit" ? "Edited image" : "Generated image",
        jobId: job.id,
      },
    })
  );
  return job.galleryItems;
}

function requireSession(sessionId: string | undefined): Session {
  if (!sessionId || !sessions.has(sessionId)) {
    throw new Error("Authentication required");
  }
  return sessions.get(sessionId)!;
}

export function shareImageToGallery(sessionId: string | undefined, input: {
  image?: unknown;
  prompt?: unknown;
  mode?: ImageMode;
  metadata?: unknown;
}) {
  requireSession(sessionId);
  return addSharedGalleryItem(input);
}

export function resetMockService() {
  sessions.clear();
  jobs.clear();
  sharedGalleryItems.length = 0;
}

function startGatewayJob(job: ImageJob) {
  void generateImagesForJob(job)
    .then((results) => {
      job.results = results;
      shareJobResultsIfRequested(job);
      job.status = job.error ? "partial" : "succeeded";
      job.updatedAt = new Date().toISOString();
    })
    .catch((error) => {
      job.status = "failed";
      job.error = error instanceof Error ? error.message : "Image generation failed";
      job.updatedAt = new Date().toISOString();
    });
}

export function loginWithAccessKey(accessKey: string) {
  const normalized = String(accessKey || "").trim();
  if (!normalized) {
    throw new Error("Access key is required");
  }
  const sessionId = createId("session");
  sessions.set(sessionId, {
    id: sessionId,
    accessKey: normalized,
    creditsRemaining: initialCredits,
    createdAt: Date.now(),
  });
  return {
    authenticated: true,
    authMode: "unkey",
    loginType: "access-key",
    credits: initialCredits,
    creditsRemaining: initialCredits,
    sessionId,
  };
}

export function logout(sessionId: string | undefined) {
  if (sessionId) {
    sessions.delete(sessionId);
  }
  return { authenticated: false };
}

export function getAuthStatus(sessionId?: string) {
  const session = sessionId ? sessions.get(sessionId) : undefined;
  return {
    authEnabled: true,
    authenticated: Boolean(session),
    authMode: "unkey",
    loginType: session ? "access-key" : null,
    credits: session?.creditsRemaining ?? 0,
    creditsRemaining: session?.creditsRemaining ?? 0,
    keyId: session ? session.id.slice(0, 12) : null,
    isAdmin: false,
    permissions: {
      generate: Boolean(session),
      edit: Boolean(session),
      galleryShare: Boolean(session),
    },
  };
}

export function getTemplates(options: { page?: number; pageSize?: number; search?: string; category?: string }) {
  const page = Math.max(1, Number(options.page || 1));
  const limit = Math.min(24, Math.max(1, Number(options.pageSize || 12)));
  const search = String(options.search || "").trim().toLowerCase();
  const category = String(options.category || "").trim();
  const filtered = templates.filter((template) => {
    const matchesSearch = !search || `${template.title} ${template.prompt}`.toLowerCase().includes(search);
    const matchesCategory = !category || category === "全部" || template.category === category;
    return matchesSearch && matchesCategory;
  });
  const offset = (page - 1) * limit;
  const pageItems = filtered.slice(offset, offset + limit);
  const categories = ["全部", ...Array.from(new Set(templates.map((template) => template.category)))];
  return {
    templates: pageItems,
    categories,
    total: filtered.length,
    limit,
    page,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    cursor: String(offset),
    nextCursor: offset + limit < filtered.length ? String(offset + limit) : null,
    hasMore: offset + limit < filtered.length,
  };
}

export function getGallery(options: { page?: number; pageSize?: number; cursor?: string }) {
  const limit = Math.min(24, Math.max(1, Number(options.pageSize || 12)));
  const start = options.cursor ? Number(options.cursor) || 0 : Math.max(0, (Number(options.page || 1) - 1) * limit);
  const allItems = [...sharedGalleryItems, ...seedGalleryItems];
  const items = allItems.slice(start, start + limit);
  return {
    items,
    total: allItems.length,
    limit,
    cursor: String(start),
    nextCursor: start + limit < allItems.length ? String(start + limit) : null,
    hasMore: start + limit < allItems.length,
  };
}

export function getInspiration(limit = 6) {
  const allItems = [...sharedGalleryItems, ...seedGalleryItems];
  const items = allItems.slice(0, Math.min(limit, allItems.length));
  return { items, total: allItems.length, limit: items.length };
}

export function createImageJob(sessionId: string | undefined, input: ImageJobInput): ImageJob {
  const session = requireSession(sessionId);
  const count = Math.min(4, Math.max(1, Number(input.count || 1)));
  session.creditsRemaining = Math.max(0, session.creditsRemaining - count);
  const now = new Date().toISOString();
  const id = createId("job");
  const provider = shouldUseGatewayProvider() ? "gateway" : "mock";
  const job: ImageJob = {
    ...input,
    count,
    id,
    status: provider === "gateway" ? "running" : "queued",
    provider,
    createdAt: now,
    updatedAt: now,
    results: [],
    creditsRemaining: session.creditsRemaining,
  };
  jobs.set(id, job);
  if (provider === "gateway") {
    startGatewayJob(job);
  }
  return job;
}

export function getImageJob(sessionId: string | undefined, jobId: string): ImageJob {
  requireSession(sessionId);
  const job = jobs.get(jobId);
  if (!job) {
    throw new Error("Job not found");
  }
  if (job.provider === "gateway") {
    return job;
  }
  const elapsed = Date.now() - new Date(job.createdAt).getTime();
  if (job.status === "queued" && elapsed > 900) {
    job.status = "processing";
    job.updatedAt = new Date().toISOString();
  }
  if ((job.status === "queued" || job.status === "processing") && elapsed > 2000) {
    job.status = "succeeded";
    job.updatedAt = new Date().toISOString();
    job.results = Array.from({ length: job.count }, (_, index) => makeJobResultItem(job, index));
    shareJobResultsIfRequested(job);
  }
  return job;
}

export function summarizeTitle(prompt: string, mode: ImageMode) {
  const clean = String(prompt || "").trim();
  const prefix = mode === "edit" ? "编辑任务" : "生成任务";
  return {
    title: clean ? `${prefix}: ${clean.slice(0, 18)}` : prefix,
  };
}

export function optimizePrompt(prompt: string, mode: ImageMode) {
  const clean = String(prompt || "").trim();
  return {
    prompt: `${clean}, high detail, balanced composition, production-ready lighting`,
    mode,
  };
}
