# Image Tool Workspace

This is a local Next.js clone of the image tool UI with API routes for auth, jobs, gallery, prompt helpers, and Codex-backed image generation.

## Local Development

```bash
npm install
npm run dev -- -p 3001
```

Open:

```text
http://127.0.0.1:3001/
```

The current local access screen accepts any non-empty access key. Replace `loginWithAccessKey` in `src/lib/server/mock-service.ts` before using this as a public service.

## Image Generation Configuration

Image jobs are handled by `src/lib/server/image-provider.ts`, which calls:

```text
scripts/generate_gateway_image.py
```

By default, non-test environments use the gateway provider. For local UI-only testing, set:

```bash
IMAGE_PROVIDER=mock
```

For Codex-backed generation on your server:

1. Install and log in to Codex on the server so `~/.codex/auth.json` and `~/.codex/config.toml` exist.
2. Verify config from the project root:

```bash
python scripts/generate_gateway_image.py --check-config
```

Expected backend when using the Codex login:

```json
{"backend":"codex","base_url":"https://chatgpt.com/backend-api/codex","account_id_present":true}
```

For an external Responses-compatible gateway instead, configure:

```bash
IMAGE_PROVIDER=gateway
CODEX_RESPONSES_BASE_URL=https://your-gateway.example/v1
OPENAI_API_KEY=your_gateway_key
```

The helper also accepts per-call overrides such as `--backend`, `--base-url`, `--model`, `--image`, and `--action`.

## Production Build

```bash
npm run build
npm run start
```

Generated images are written to `public/generated/`, and temporary uploads/logs are written under `.imagegen/`. Both are ignored by git.

## Checks

```bash
npm run test:run
npm run build
```
