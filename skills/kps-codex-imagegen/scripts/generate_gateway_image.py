#!/usr/bin/env python3
"""
Generate an image through the Responses-compatible gateway configured for Codex.
"""

from __future__ import annotations

import argparse
import base64
from collections.abc import Mapping
from dataclasses import dataclass
import json
import mimetypes
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import ssl

try:
    import tomllib
except ModuleNotFoundError:  # pragma: no cover
    import tomli as tomllib  # type: ignore


DEFAULT_MODEL = "gpt-5.4"
DEFAULT_TIMEOUT = 600
DEFAULT_SIZE = "1024x1024"
CODEX_BACKEND_BASE_URL = "https://chatgpt.com/backend-api/codex"
CODEX_BACKEND_VERSION = "0.122.0"
BASE_URL_ENV_VARS = (
    "CODEX_RESPONSES_BASE_URL",
    "CODEX_GATEWAY_BASE_URL",
    "OPENAI_BASE_URL",
    "OPENAI_API_BASE",
)


@dataclass(frozen=True)
class RuntimeSettings:
    backend: str
    base_url: str
    api_key: str
    model: str
    base_url_source: str
    api_key_source: str
    account_id: str | None = None


def normalize_base_url(value: str) -> str:
    return value.strip().rstrip("/")


def first_env_value(environ: Mapping[str, str], names: tuple[str, ...]) -> tuple[str | None, str | None]:
    for name in names:
        value = environ.get(name)
        if value:
            return value, name
    return None, None


def base_url_from_config(config: dict) -> tuple[str | None, str | None]:
    if config.get("base_url"):
        return str(config["base_url"]), "~/.codex/config.toml base_url"

    providers = config.get("model_providers", {})
    if not isinstance(providers, dict):
        return None, None

    provider_name = config.get("model_provider")
    if provider_name:
        provider = providers.get(provider_name, {})
        if isinstance(provider, dict) and provider.get("base_url"):
            return str(provider["base_url"]), f"~/.codex/config.toml model_providers.{provider_name}.base_url"

    providers_with_base_url = [
        (name, provider)
        for name, provider in providers.items()
        if isinstance(provider, dict) and provider.get("base_url")
    ]
    if len(providers_with_base_url) == 1:
        name, provider = providers_with_base_url[0]
        return str(provider["base_url"]), f"~/.codex/config.toml model_providers.{name}.base_url"

    return None, None


def credential_from_auth(auth: dict) -> tuple[str | None, str | None]:
    if auth.get("OPENAI_API_KEY"):
        return str(auth["OPENAI_API_KEY"]), "~/.codex/auth.json OPENAI_API_KEY"

    tokens = auth.get("tokens", {})
    if isinstance(tokens, dict) and tokens.get("access_token"):
        return str(tokens["access_token"]), "~/.codex/auth.json tokens.access_token"

    return None, None


def account_id_from_auth(auth: dict) -> str | None:
    tokens = auth.get("tokens", {})
    if isinstance(tokens, dict) and tokens.get("account_id"):
        return str(tokens["account_id"])
    return None


def load_runtime_settings(
    *,
    home: Path | None = None,
    environ: Mapping[str, str] | None = None,
    base_url_override: str | None = None,
    model_override: str | None = None,
    backend_override: str = "auto",
) -> RuntimeSettings:
    root = home or Path.home()
    env = environ if environ is not None else os.environ
    config_path = root / ".codex" / "config.toml"
    auth_path = root / ".codex" / "auth.json"

    if not config_path.exists():
        raise RuntimeError(f"Missing config file: {config_path}")
    if not auth_path.exists():
        raise RuntimeError(f"Missing auth file: {auth_path}")

    config = tomllib.loads(config_path.read_text(encoding="utf-8"))
    auth = json.loads(auth_path.read_text(encoding="utf-8"))
    api_key = env.get("OPENAI_API_KEY")
    api_key_source = "OPENAI_API_KEY environment variable"
    if not api_key:
        api_key, api_key_source = credential_from_auth(auth)

    if not api_key:
        raise RuntimeError(
            "Could not find OPENAI_API_KEY in the environment, OPENAI_API_KEY in ~/.codex/auth.json, "
            "or tokens.access_token in ~/.codex/auth.json"
        )

    account_id = account_id_from_auth(auth)
    configured_model = config.get("model") or DEFAULT_MODEL
    model = model_override or configured_model

    base_url = base_url_override
    base_url_source = "--base-url"

    if not base_url:
        base_url, base_url_source = first_env_value(env, BASE_URL_ENV_VARS)

    if not base_url:
        base_url, base_url_source = base_url_from_config(config)

    wants_codex_backend = backend_override == "codex" or (
        backend_override == "auto"
        and not base_url
        and api_key_source == "~/.codex/auth.json tokens.access_token"
        and bool(account_id)
    )
    if wants_codex_backend:
        if not account_id:
            raise RuntimeError("Codex backend requires tokens.account_id in ~/.codex/auth.json")
        codex_model = model_override or DEFAULT_MODEL
        return RuntimeSettings(
            backend="codex",
            base_url=CODEX_BACKEND_BASE_URL,
            api_key=str(api_key),
            model=str(codex_model),
            base_url_source="Codex ChatGPT backend",
            api_key_source=str(api_key_source),
            account_id=account_id,
        )

    if not base_url:
        anthropic_note = ""
        if env.get("ANTHROPIC_BASE_URL"):
            anthropic_note = (
                " ANTHROPIC_BASE_URL is intentionally ignored because it often points to a "
                "Claude-compatible or web gateway, not an OpenAI Responses-compatible /responses endpoint."
            )
        raise RuntimeError(
            "Could not find a Responses-compatible base_url. Pass --base-url, set "
            "CODEX_RESPONSES_BASE_URL, or add model_provider plus "
            "[model_providers.<name>].base_url to ~/.codex/config.toml."
            f"{anthropic_note}"
        )

    return RuntimeSettings(
        backend="gateway",
        base_url=normalize_base_url(str(base_url)),
        api_key=str(api_key),
        model=str(model),
        base_url_source=str(base_url_source),
        api_key_source=str(api_key_source),
    )


def load_config() -> tuple[str, str]:
    settings = load_runtime_settings()
    return settings.base_url, settings.api_key


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate an image via the configured Responses gateway.")
    parser.add_argument("--prompt", help="Image generation prompt.")
    parser.add_argument("--out", help="Output image path.")
    parser.add_argument("--size", default=DEFAULT_SIZE, help="Image size, e.g. 1024x1024 or 1024x1536.")
    parser.add_argument(
        "--action",
        choices=("auto", "generate", "edit"),
        default="auto",
        help="Image tool action. Use edit when providing a reference image or mask.",
    )
    parser.add_argument(
        "--image",
        action="append",
        default=[],
        help="Reference image path. Repeat the flag to include multiple images.",
    )
    parser.add_argument(
        "--image-url",
        action="append",
        default=[],
        help="Reference image URL. Repeat the flag to include multiple images.",
    )
    parser.add_argument(
        "--mask",
        help="Optional mask image path for edit workflows.",
    )
    parser.add_argument("--model", help=f"Responses model to call. Defaults to ~/.codex/config.toml model or {DEFAULT_MODEL}.")
    parser.add_argument("--base-url", help="Override the Responses-compatible gateway base URL.")
    parser.add_argument(
        "--backend",
        choices=("auto", "codex", "gateway"),
        default="auto",
        help="Use Codex ChatGPT backend, an external Responses gateway, or auto-detect.",
    )
    parser.add_argument("--output-format", default="png", help="Image output format, e.g. png.")
    parser.add_argument("--session-id", default="codex-gateway-imagegen", help="Session id header for Codex backend requests.")
    parser.add_argument(
        "--check-config",
        action="store_true",
        help="Validate local config and print non-secret runtime settings without calling the gateway.",
    )
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT, help="HTTP timeout in seconds.")
    return parser.parse_args(argv)


def validate_generation_args(args: argparse.Namespace) -> None:
    if args.check_config:
        return
    if not args.prompt:
        raise RuntimeError("--prompt is required unless --check-config is used")
    if not args.out:
        raise RuntimeError("--out is required unless --check-config is used")


def encode_image_data_url(image_path: str) -> str:
    path = Path(image_path).expanduser().resolve()
    if not path.exists():
        raise RuntimeError(f"Image file does not exist: {path}")

    mime_type, _ = mimetypes.guess_type(path.name)
    if not mime_type or not mime_type.startswith("image/"):
        raise RuntimeError(f"Unsupported image MIME type for {path}: {mime_type or 'unknown'}")

    image_bytes = path.read_bytes()
    if not image_bytes:
        raise RuntimeError(f"Image file is empty: {path}")

    encoded = base64.b64encode(image_bytes).decode("ascii")
    return f"data:{mime_type};base64,{encoded}"


def build_payload(args: argparse.Namespace, *, stream: bool = False, force_image_tool: bool = False) -> bytes:
    input_content: list[dict[str, str]] = [
        {
            "type": "input_text",
            "text": args.prompt,
        }
    ]

    for image_path in args.image:
        input_content.append(
            {
                "type": "input_image",
                "image_url": encode_image_data_url(image_path),
            }
        )

    for image_url in args.image_url:
        input_content.append(
            {
                "type": "input_image",
                "image_url": image_url,
            }
        )

    if args.mask:
        input_content.append(
            {
                "type": "input_text",
                "text": "The next image is a mask/reference guide for the edit. Use it as visual guidance; do not return text.",
            }
        )
        input_content.append(
            {
                "type": "input_image",
                "image_url": encode_image_data_url(args.mask),
            }
        )

    image_tool = {
        "type": "image_generation",
        "size": args.size,
        "action": args.action,
        "output_format": args.output_format,
    }
    payload = {
        "model": args.model,
        "input": [
            {
                "role": "user",
                "content": input_content,
            }
        ],
        "tools": [image_tool],
    }
    if stream:
        payload["instructions"] = "Use the image_generation tool to create the requested image. Do not answer with text only."
        payload["tool_choice"] = {"type": "image_generation"} if force_image_tool else "auto"
        payload["stream"] = True
        payload["store"] = False
    return json.dumps(payload, ensure_ascii=False).encode("utf-8")


def extract_image_base64(data: dict) -> str:
    for item in data.get("output", []):
        if item.get("type") == "image_generation_call" and item.get("result"):
            return item["result"]
    raise RuntimeError("No image_generation_call result returned")


def extract_image_base64_from_sse_lines(lines) -> str:
    for raw_line in lines:
        line = raw_line.decode("utf-8", errors="replace") if isinstance(raw_line, bytes) else str(raw_line)
        line = line.rstrip("\r\n")
        if not line.startswith("data:"):
            continue
        payload = line[5:].strip()
        if not payload or payload == "[DONE]":
            continue
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            continue

        candidates = []
        if isinstance(data.get("item"), dict):
            candidates.append(data["item"])
        if isinstance(data.get("response"), dict):
            candidates.extend(data["response"].get("output") or [])
        candidates.extend(data.get("output") or [])
        if data.get("type") == "image_generation_call":
            candidates.append(data)

        for item in candidates:
            if isinstance(item, dict) and item.get("type") == "image_generation_call" and item.get("result"):
                return str(item["result"])

    raise RuntimeError("No image_generation_call result returned from Codex SSE stream")


def build_codex_headers(settings: RuntimeSettings, *, session_id: str) -> dict[str, str]:
    if not settings.account_id:
        raise RuntimeError("Codex backend requires chatgpt account id")
    return {
        "Authorization": f"Bearer {settings.api_key}",
        "chatgpt-account-id": settings.account_id,
        "user-agent": f"codex-tui/{CODEX_BACKEND_VERSION} (Windows 10; x86_64) vscode/3.0.12 (codex-tui; {CODEX_BACKEND_VERSION})",
        "version": CODEX_BACKEND_VERSION,
        "originator": "codex_cli_rs",
        "session_id": session_id,
        "accept": "text/event-stream",
        "Content-Type": "application/json",
    }


def main() -> int:
    args = parse_args()

    try:
        validate_generation_args(args)
        settings = load_runtime_settings(
            base_url_override=args.base_url,
            model_override=args.model,
            backend_override=args.backend,
        )
        args.model = settings.model

        if args.check_config:
            print(
                json.dumps(
                    {
                        "backend": settings.backend,
                        "base_url": settings.base_url,
                        "base_url_source": settings.base_url_source,
                        "model": settings.model,
                        "api_key_source": settings.api_key_source,
                        "account_id_present": bool(settings.account_id),
                    },
                    ensure_ascii=False,
                )
            )
            return 0

        if settings.backend == "codex":
            body = build_payload(args, stream=True, force_image_tool=True)
            request = Request(
                f"{settings.base_url}/responses",
                data=body,
                headers=build_codex_headers(settings, session_id=args.session_id),
                method="POST",
            )
            with urlopen(request, context=ssl.create_default_context(), timeout=args.timeout) as response:
                image_base64 = extract_image_base64_from_sse_lines(response)
        else:
            body = build_payload(args)
            request = Request(
                f"{settings.base_url}/responses",
                data=body,
                headers={
                    "Authorization": f"Bearer {settings.api_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )

            with urlopen(request, context=ssl.create_default_context(), timeout=args.timeout) as response:
                data = json.loads(response.read().decode("utf-8", errors="replace"))
            image_base64 = extract_image_base64(data)

        output_path = Path(args.out).resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(base64.b64decode(image_base64))
        print(json.dumps({"saved": str(output_path), "bytes": output_path.stat().st_size}, ensure_ascii=False))
        return 0
    except HTTPError as exc:
        message = exc.read().decode("utf-8", errors="replace")
        print(
            json.dumps(
                {
                    "error": "http_error",
                    "status": exc.code,
                    "body": message,
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )
        return 1
    except URLError as exc:
        print(json.dumps({"error": "network_error", "message": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    except TimeoutError as exc:
        print(json.dumps({"error": "timeout", "message": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1
    except Exception as exc:
        print(json.dumps({"error": "runtime_error", "message": str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
