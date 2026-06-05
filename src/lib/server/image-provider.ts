import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import type { GalleryItem, ImageJob } from "@/lib/shared/types";

const legalSizes = new Set(["1024x1024", "1024x1536", "1536x1024"]);
const scriptPath = "scripts/generate_gateway_image.py";

export type GatewayCommandInput = {
  prompt: string;
  outputPath: string;
  size: string;
  action: "generate" | "edit";
  referenceImages: string[];
  maskImage?: string;
};

export type GatewayRunnerInput = {
  job: ImageJob;
  outputs: string[];
  commandInputs: GatewayCommandInput[];
};

type GatewayRunner = (input: GatewayRunnerInput) => Promise<string[] | void>;
type GatewayCommandRunner = (input: GatewayCommandInput) => Promise<void>;

let testRunner: GatewayRunner | null = null;
let testCommandRunner: GatewayCommandRunner | null = null;

export function setGatewayRunnerForTests(runner: GatewayRunner | null) {
  testRunner = runner;
}

export function setGatewayCommandRunnerForTests(runner: GatewayCommandRunner | null) {
  testCommandRunner = runner;
}

export function normalizeGatewaySize(size: string) {
  const normalized = String(size || "").trim();
  return legalSizes.has(normalized) ? normalized : "1024x1024";
}

export function shouldUseGatewayProvider() {
  const configured = String(process.env.IMAGE_PROVIDER || "").trim().toLowerCase();
  if (configured === "mock") {
    return false;
  }
  if (configured === "gateway") {
    return true;
  }
  return process.env.NODE_ENV !== "test";
}

export function buildGatewayCommand(input: GatewayCommandInput) {
  const args = [
    scriptPath,
    "--prompt",
    input.prompt,
    "--out",
    input.outputPath,
    "--size",
    normalizeGatewaySize(input.size),
    "--action",
    input.action,
    "--output-format",
    "png",
  ];

  const referenceImages = input.maskImage
    ? [...input.referenceImages, input.maskImage]
    : input.referenceImages;

  for (const image of referenceImages) {
    args.push("--image", image);
  }

  return {
    executable: "python",
    args,
  };
}

function runCommand(executable: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: process.env,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error((stderr || stdout || `Image generation failed with exit code ${code}`).slice(0, 1200)));
    });
  });
}

function sanitizeGatewayError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error || "Image generation failed");
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.message) {
      return sanitizeGatewayError(new Error(String(parsed.message)));
    }
  } catch {
    // The gateway helper may return plain text. Keep it when it is not JSON.
  }
  if (raw.includes("No image_generation_call result returned")) {
    return "Image generation returned no image result after retry. Try fewer images or a different prompt.";
  }
  if (raw.includes("input_image_mask")) {
    return "Mask uploads are sent as reference images because this gateway does not support input_image_mask.";
  }
  return raw.slice(0, 500);
}

function retryPrompt(input: GatewayCommandInput, attempt: number): GatewayCommandInput {
  if (attempt === 0) {
    return input;
  }
  return {
    ...input,
    prompt: [
      "Create a finished raster image for the following user request.",
      "Return an actual image result, not a text explanation.",
      `User request: ${input.prompt}`,
    ].join("\n"),
  };
}

async function runGatewayCommandWithRetry(input: GatewayCommandInput) {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const attemptInput = retryPrompt(input, attempt);
    try {
      if (testCommandRunner) {
        await testCommandRunner(attemptInput);
      } else {
        const command = buildGatewayCommand(attemptInput);
        await runCommand(command.executable, command.args);
      }
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(sanitizeGatewayError(lastError));
}

function outputPathFor(jobId: string, index: number) {
  return path.join(process.cwd(), "public", "generated", `${jobId}-${index + 1}.png`);
}

function publicUrlFor(jobId: string, index: number) {
  return `/generated/${jobId}-${index + 1}.png`;
}

function galleryItemFromOutput(job: ImageJob, index: number, displayUrl: string): GalleryItem {
  const id = `${job.id}-result-${index + 1}`;
  return {
    id,
    createdAt: new Date().toISOString(),
    prompt: job.prompt,
    title: job.mode === "edit" ? `Edit result ${index + 1}` : `Generated result ${index + 1}`,
    mode: job.mode,
    visibility: "public",
    status: "active",
    imageUrl: displayUrl,
    displayUrl,
    objectKey: displayUrl.replace(/^\//, ""),
    displayObjectKey: displayUrl.replace(/^\//, ""),
    displayMimeType: "image/png",
    displayWidth: 1024,
    displayHeight: 1024,
    displaySize: 0,
    originalWidth: 1024,
    originalHeight: 1024,
    originalMimeType: "image/png",
    originalSize: 0,
    thumbnailUrl: displayUrl,
    thumbnailObjectKey: displayUrl.replace(/^\//, ""),
    thumbnailMimeType: "image/png",
    thumbnailWidth: 512,
    thumbnailHeight: 512,
    thumbnailSize: 0,
    mimeType: "image/png",
    fileExtension: "png",
    revisedPrompt: job.prompt,
    remoteUrl: displayUrl,
    metadata: {
      provider: "codex-gateway-imagegen",
      source: "local-gateway",
    },
    clientHash: id,
  };
}

export async function generateImagesForJob(job: ImageJob): Promise<GalleryItem[]> {
  await mkdir(path.join(process.cwd(), "public", "generated"), { recursive: true });

  const count = Math.min(4, Math.max(1, job.count || 1));
  const outputs = Array.from({ length: count }, (_, index) => outputPathFor(job.id, index));
  const action: "generate" | "edit" =
    job.mode === "edit" && (job.referenceImagePaths?.length || job.maskImagePath) ? "edit" : "generate";
  const commandInputs: GatewayCommandInput[] = outputs.map((outputPath, index) => ({
    prompt: count > 1 ? `${job.prompt}\nVariation ${index + 1} of ${count}.` : job.prompt,
    outputPath,
    size: job.size,
    action,
    referenceImages: job.referenceImagePaths || [],
    maskImage: job.maskImagePath,
  }));

  if (testRunner) {
    await testRunner({ job, outputs, commandInputs });
    return outputs.map((_output, index) => galleryItemFromOutput(job, index, publicUrlFor(job.id, index)));
  }

  const results: GalleryItem[] = [];
  const failures: string[] = [];
  for (const [index, input] of commandInputs.entries()) {
    try {
      await runGatewayCommandWithRetry(input);
      results.push(galleryItemFromOutput(job, index, publicUrlFor(job.id, index)));
    } catch (error) {
      failures.push(sanitizeGatewayError(error));
    }
  }

  if (!results.length) {
    throw new Error(failures[0] || "Image generation failed without returning an image result.");
  }
  if (failures.length) {
    job.error = `Some images failed: ${failures[0]}`;
  }
  return results;
}
