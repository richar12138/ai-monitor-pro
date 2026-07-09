"""Sidecar, mtime-keyed parse cache for expensive-to-reparse agent session data.

Mirrors the pattern used by `_estimate_antigravity_tokens` in `main.py` (a
`tokens_cache.json` sidecar next to the transcript, keyed by comparing mtimes),
but instead of writing into the agent's own data directory — which Claude/Codex
don't expose a natural scratch subdir for — sidecars live under
TokenTelemetry's own `data_dir()` (see `tt_paths.py`), namespaced by agent and
session id.

Freshness is tracked via an explicit `_mtime` float stored INSIDE the JSON
payload rather than the sidecar file's own on-disk mtime. This is deterministic
under coarse filesystem mtime resolution and trivially testable with plain
float comparisons.

Both `read_cache` and `write_cache` are best-effort: a missing, corrupt, or
unwritable cache — or a non-JSON-serializable payload — must never break a
scan, so all failure modes are swallowed and logged at debug level rather than
raised.
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional

from tt_paths import data_dir

logger = logging.getLogger("tokentelemetry.scan_cache")


def _require_safe_component(candidate: str) -> str:
    """Reject anything that isn't a bare, filename-safe path component.

    Both `agent` and `session_id` end up as path segments under the cache
    dir. `session_id` in particular can originate from on-disk data we don't
    control (e.g. Codex's session_index.jsonl), so a crafted id like
    "../../../foo" must never be allowed to escape data_dir()/cache/.
    """
    if not candidate or "/" in candidate or "\\" in candidate or Path(candidate).name != candidate:
        raise ValueError(f"unsafe path component: {candidate!r}")
    return candidate


def cache_path(agent: str, session_id: str) -> Path:
    """Path to the sidecar cache file for one session. Does not create it.

    Raises ValueError if `agent` or `session_id` isn't a safe, bare filename
    component (see `_require_safe_component`). Callers (`read_cache`/
    `write_cache`) catch this and treat it as a miss/no-op — cache code must
    never raise into the scan.
    """
    agent = _require_safe_component(agent)
    session_id = _require_safe_component(session_id)
    return data_dir() / "cache" / agent / f"{session_id}.json"


def read_cache(agent: str, session_id: str, source_mtime: float) -> Optional[Dict[str, Any]]:
    """Return the cached payload if fresh (stored _mtime >= source_mtime), else None.

    Never raises — any OSError/JSONDecodeError/missing-key/unsafe-id is
    treated as a cache miss.
    """
    path = None
    try:
        path = cache_path(agent, session_id)
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        cached_mtime = data["_mtime"]
        if cached_mtime >= source_mtime:
            return data
        return None
    except (OSError, json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
        logger.debug(
            "scan_cache miss for agent=%s session_id=%s path=%s: %s",
            agent,
            session_id,
            path,
            exc,
        )
        return None


def write_cache(agent: str, session_id: str, source_mtime: float, payload: Dict[str, Any]) -> None:
    """Persist payload with source_mtime folded in as payload["_mtime"].

    Creates parent dirs as needed. Never raises — any OSError, unsafe
    agent/session_id (ValueError from cache_path), or a non-JSON-serializable
    payload (TypeError/ValueError from json.dump), is swallowed and logged at
    debug level. Callers should still serialize their own datetime fields for
    correctness — this is a safety net, not a substitute for doing that.
    """
    to_write = dict(payload)
    to_write["_mtime"] = source_mtime
    path = None
    try:
        path = cache_path(agent, session_id)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as f:
            json.dump(to_write, f)
    except (OSError, TypeError, ValueError) as exc:
        logger.debug(
            "scan_cache write failed for agent=%s session_id=%s path=%s: %s",
            agent,
            session_id,
            path,
            exc,
        )
