export type ImageMode = "generate" | "edit";
export type JobStatus = "queued" | "processing" | "running" | "partial" | "succeeded" | "failed" | "canceled";

export type TemplateItem = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  imageObjectKey: string;
  imageUrl: string;
  imageMimeType: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  thumbnailObjectKey: string;
  thumbnailUrl: string;
  thumbnailMimeType: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailSize: number;
  sourceUrl: string;
  sourceImageUrl: string;
  license: string;
  status: string;
  sortOrder: number;
  metadata: Record<string, unknown>;
};

export type GalleryItem = {
  id: string;
  createdAt: string;
  prompt: string;
  title: string;
  mode: ImageMode;
  visibility: "public" | "private";
  status: string;
  imageUrl: string;
  displayUrl: string;
  objectKey: string;
  displayObjectKey: string;
  displayMimeType: string;
  displayWidth: number;
  displayHeight: number;
  displaySize: number;
  originalWidth: number;
  originalHeight: number;
  originalMimeType: string;
  originalSize: number;
  thumbnailUrl: string;
  thumbnailObjectKey: string;
  thumbnailMimeType: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  thumbnailSize: number;
  mimeType: string;
  fileExtension: string;
  revisedPrompt: string;
  remoteUrl: string;
  metadata: Record<string, unknown>;
  clientHash: string;
};

export type ImageJobInput = {
  mode: ImageMode;
  prompt: string;
  count: number;
  size: string;
  quality: string;
  format: string;
  sourceImageName?: string;
  referenceImagePaths?: string[];
  maskImagePath?: string;
  shareToGallery?: boolean;
};

export type ImageJob = ImageJobInput & {
  id: string;
  status: JobStatus;
  provider: "mock" | "gateway";
  createdAt: string;
  updatedAt: string;
  results: GalleryItem[];
  galleryItems?: GalleryItem[];
  creditsRemaining: number;
  error?: string;
  galleryError?: string;
  generationError?: string;
};
