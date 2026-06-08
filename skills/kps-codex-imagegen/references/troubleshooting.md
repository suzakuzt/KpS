# Troubleshooting

## Config Missing

Symptoms:

- `Missing config file`
- `Missing auth file`
- `Could not find OPENAI_API_KEY ... or tokens.access_token`
- `Codex backend requires tokens.account_id`

Actions:

1. Run `python .../generate_gateway_image.py --check-config`.
2. If using Codex login, sign in as the same OS user that runs the app and confirm `~/.codex/auth.json` contains non-empty `tokens.access_token` and `tokens.account_id`. Do not print the token.
3. If using an external gateway, set `CODEX_RESPONSES_BASE_URL` and `OPENAI_API_KEY` in the same shell/process that runs generation.

## Wrong Gateway

Symptoms:

- `404` at `/responses`
- `Could not find a Responses-compatible base_url`
- errors mentioning Claude or Anthropic endpoints

Actions:

- Use `CODEX_RESPONSES_BASE_URL`, not `ANTHROPIC_BASE_URL`.
- The URL should be the API root that accepts `POST /responses`, often ending in `/v1`.

## Request Rejected

Symptoms:

- HTTP `400`
- invalid `input_image_mask`
- empty base64 image URL
- invalid image MIME type
- invalid size

Actions:

- Use the bundled script version, which sends masks as ordinary `input_image` references.
- Ensure local image files exist and are non-empty.
- Use image MIME extensions like `.png`, `.jpg`, `.jpeg`, or `.webp`.
- Retry with `1024x1024`, `1024x1536`, or `1536x1024`.

## No Image Result

Symptoms:

- `No image_generation_call result returned`
- text response instead of an image

Actions:

- Keep `--backend auto` or `--backend codex`; the helper forces the image tool for Codex backend.
- Make the prompt explicitly request a finished raster image and not an explanation.
- Reduce reference image count or simplify the prompt.
