import { afterEach, describe, expect, test } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  buildGatewayCommand,
  generateImagesForJob,
  normalizeGatewaySize,
  setGatewayCommandRunnerForTests,
  setGatewayRunnerForTests,
} from "./image-provider";
import {
  createImageJob,
  getImageJob,
  loginWithAccessKey,
  resetMockService,
} from "./mock-service";

describe("gateway image provider", () => {
  afterEach(() => {
    setGatewayRunnerForTests(null);
    setGatewayCommandRunnerForTests(null);
    delete process.env.IMAGE_PROVIDER;
    resetMockService();
  });

  test("normalizes frontend auto size to a legal gateway size", () => {
    expect(normalizeGatewaySize("auto")).toBe("1024x1024");
    expect(normalizeGatewaySize("1536x1024")).toBe("1536x1024");
    expect(normalizeGatewaySize("bad-value")).toBe("1024x1024");
  });

  test("builds the python gateway command without exposing credentials", () => {
    const command = buildGatewayCommand({
      prompt: "studio product render",
      outputPath: "D:/project/public/generated/job-1.png",
      size: "auto",
      action: "generate",
      referenceImages: [],
    });

    expect(command.executable).toBe("python");
    expect(command.args).toContain("scripts/generate_gateway_image.py");
    expect(command.args).toContain("--prompt");
    expect(command.args).toContain("studio product render");
    expect(command.args).toContain("--out");
    expect(command.args).toContain("D:/project/public/generated/job-1.png");
    expect(command.args).toContain("--size");
    expect(command.args).toContain("1024x1024");
    expect(command.args.join(" ")).not.toMatch(/token|password|access/i);
  });

  test("passes mask uploads as ordinary reference images because gateway rejects input_image_mask", () => {
    const command = buildGatewayCommand({
      prompt: "replace the background using the mask as guidance",
      outputPath: "D:/project/public/generated/job-1.png",
      size: "1024x1024",
      action: "edit",
      referenceImages: ["D:/uploads/source.png"],
      maskImage: "D:/uploads/mask.png",
    });

    expect(command.args).not.toContain("--mask");
    expect(command.args.filter((arg) => arg === "--image")).toHaveLength(2);
    expect(command.args).toContain("D:/uploads/source.png");
    expect(command.args).toContain("D:/uploads/mask.png");
  });

  test("gateway helper script does not emit unsupported input_image_mask content", () => {
    const script = readFileSync("scripts/generate_gateway_image.py", "utf8");

    expect(script).not.toContain('"type": "input_image_mask"');
  });

  test("gateway helper rejects empty image files before building data URLs", () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), "image-tool-empty-"));
    const emptyImagePath = path.join(tempDir, "empty.png");
    writeFileSync(emptyImagePath, new Uint8Array());

    const python = [
      "import importlib.util, sys",
      'spec = importlib.util.spec_from_file_location("gateway", r"scripts/generate_gateway_image.py")',
      "module = importlib.util.module_from_spec(spec)",
      'sys.modules["gateway"] = module',
      "spec.loader.exec_module(module)",
      `module.encode_image_data_url(r"${emptyImagePath.replace(/\\/g, "\\\\")}")`,
    ].join("\n");
    const result = spawnSync("python", ["-c", python], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    rmSync(tempDir, { recursive: true, force: true });
    expect(result.status).toBe(1);
    expect(`${result.stderr}${result.stdout}`).toContain("Image file is empty");
  });

  test("uses the gateway runner to resolve a generated image job", async () => {
    process.env.IMAGE_PROVIDER = "gateway";
    setGatewayRunnerForTests(async ({ outputs }) => outputs);
    const login = loginWithAccessKey("demo-key");

    const job = createImageJob(login.sessionId, {
      mode: "generate",
      prompt: "studio product render",
      count: 1,
      size: "auto",
      quality: "high",
      format: "png",
    });

    expect(job.status).toBe("running");
    let resolved = getImageJob(login.sessionId, job.id);
    for (let attempt = 0; attempt < 20 && resolved.status === "running"; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      resolved = getImageJob(login.sessionId, job.id);
    }

    expect(resolved.status).toBe("succeeded");
    expect(resolved.results).toHaveLength(1);
    expect(resolved.results[0].displayUrl).toMatch(/^\/generated\//);
  });

  test("retries one missing image_generation result before failing the image", async () => {
    let attempts = 0;
    setGatewayCommandRunnerForTests(async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new Error('{"error":"runtime_error","message":"No image_generation_call result returned from Codex SSE stream"}');
      }
    });
    const job = {
      id: "job_retry",
      mode: "generate" as const,
      prompt: "studio product render",
      count: 1,
      size: "auto",
      quality: "high",
      format: "png",
      provider: "gateway" as const,
      status: "running" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [],
      creditsRemaining: 10,
    };

    const results = await generateImagesForJob(job);

    expect(attempts).toBe(2);
    expect(results).toHaveLength(1);
  });

  test("returns partial results when one of several images keeps failing", async () => {
    let attempts = 0;
    setGatewayCommandRunnerForTests(async () => {
      attempts += 1;
      if (attempts >= 2) {
        throw new Error("No image_generation_call result returned from Codex SSE stream");
      }
    });
    const job = {
      id: "job_partial",
      mode: "generate" as const,
      prompt: "studio product render",
      count: 2,
      size: "auto",
      quality: "high",
      format: "png",
      provider: "gateway" as const,
      status: "running" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [],
      creditsRemaining: 10,
    };

    const results = await generateImagesForJob(job);

    expect(results).toHaveLength(1);
    expect(job.error).toContain("Some images failed");
  });
});
