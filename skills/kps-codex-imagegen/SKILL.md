---
name: kps-codex-imagegen
description: Use when a project or module needs reusable Codex-backed raster image generation, image editing from references, or a local Responses-compatible image_generation helper script.
---

# KpS Codex Imagegen

Use this skill to add or call the reusable KpS image generation helper from any project. It generates local raster files through the current Codex login by default, and can also call an external Responses-compatible gateway.

Bundled script:

```text
scripts/generate_gateway_image.py
```

## Direct Use

Resolve the skill directory first, then run the bundled script from there:

```powershell
python C:/Users/tongzhu/.codex/skills/kps-codex-imagegen/scripts/generate_gateway_image.py --check-config
```

The script is ready when `--check-config` prints non-secret JSON including:

- `backend`: `codex` or `gateway`
- `base_url`
- `model`
- `api_key_source`
- `account_id_present`

Normal Codex login usage should show:

```json
{"backend":"codex","base_url":"https://chatgpt.com/backend-api/codex","account_id_present":true}
```

## Generate Images

Text to image:

```powershell
python C:/Users/tongzhu/.codex/skills/kps-codex-imagegen/scripts/generate_gateway_image.py --prompt "<prompt>" --out "<output.png>" --size 1024x1024
```

Image editing with one or more references:

```powershell
python C:/Users/tongzhu/.codex/skills/kps-codex-imagegen/scripts/generate_gateway_image.py --prompt "<edit prompt>" --image "<reference.png>" --action edit --out "<output.png>" --size 1024x1024
```

Useful flags:

- `--backend auto|codex|gateway`
- `--base-url <url>` for external Responses gateways
- `--model <model>`
- `--image <path>` repeatable local reference image
- `--image-url <url>` repeatable remote reference image
- `--mask <path>` sends the mask as an ordinary input image with a text instruction because some gateways reject `input_image_mask`
- `--output-format png|jpeg|webp`
- `--timeout 600`

## Add To Another Module

For an app repository that needs its own local copy:

1. Create `scripts/` in that repo if needed.
2. Copy this skill's `scripts/generate_gateway_image.py` into the repo's `scripts/`.
3. Add a backend/provider wrapper that calls:

   ```text
   python scripts/generate_gateway_image.py --prompt ... --out ... --size ... --action ...
   ```

4. Store outputs under an app-served directory such as `public/generated/`.
5. Ignore generated outputs and secrets in git:

   ```gitignore
   public/generated/
   .imagegen/
   .env
   .env.*
   !.env.example
   __pycache__/
   *.pyc
   ```

## Configuration

Codex login path:

- Do not set `OPENAI_API_KEY` or `CODEX_RESPONSES_BASE_URL`.
- Ensure the process user has `~/.codex/auth.json` and `~/.codex/config.toml`.
- Run `--check-config`; require `backend: codex` and `account_id_present: true`.

External gateway path:

```powershell
$env:CODEX_RESPONSES_BASE_URL = "https://your-gateway.example/v1"
$env:OPENAI_API_KEY = "your_gateway_key"
```

Use `CODEX_RESPONSES_BASE_URL` for OpenAI Responses-compatible gateways. `ANTHROPIC_BASE_URL` is intentionally ignored.

## Prompt Shape

Write prompts as production specs:

- subject and scene
- visual style
- composition
- lighting
- output format cues, such as `poster`, `product photo`, `mobile screenshot`, `photorealistic`, `transparent background`
- for edits: what to preserve, what to change, and whether references must be followed tightly

Known-good sizes:

- `1024x1024`
- `1024x1536`
- `1536x1024`

If a gateway rejects a size, retry with one of those.

## Failure Handling

If generation fails, read the JSON body before changing the prompt. For repeated or unclear failures, read `references/troubleshooting.md`.

Common local checks:

```powershell
python C:/Users/tongzhu/.codex/skills/kps-codex-imagegen/scripts/generate_gateway_image.py --check-config
python C:/Users/tongzhu/.codex/skills/kps-codex-imagegen/scripts/generate_gateway_image.py --prompt "simple blue product photo" --out .imagegen/test-output.png --size 1024x1024
```

Never print or commit `~/.codex/auth.json`, `.env`, tokens, cookies, or API keys.
