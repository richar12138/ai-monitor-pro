# AI Monitor Pro — Hermes Dashboard Plugin

A thin launcher for [AI Monitor Pro](https://github.com/richar12138/ai-monitor-pro) inside the [Hermes Agent](https://github.com/NousResearch/hermes-agent) web dashboard (port `9119`).

Instead of remembering a second port, click the **AI Monitor Pro** tab inside Hermes Dashboard and launch any TT page in a new browser tab — Hermes Overview, Skills, Memory, Analytics, Projects.

## Install

### Most users — via Hermes's plugin manager

```bash
hermes plugins install richar12138/ai-monitor-pro-hermes-plugin
hermes dashboard
```

The standalone repo at [`richar12138/ai-monitor-pro-hermes-plugin`](https://github.com/richar12138/ai-monitor-pro-hermes-plugin) is auto-synced from this directory by `scripts/publish-plugin.sh`.

### Hacking on the plugin — from this repo

```bash
./scripts/install-hermes-plugin.sh    # symlinks into ~/.hermes/plugins/
hermes dashboard
```

Or manually:

```bash
mkdir -p ~/.hermes/plugins/ai-monitor-pro
ln -s "$(pwd)/plugin/hermes-dashboard" ~/.hermes/plugins/ai-monitor-pro/dashboard
hermes dashboard
```

Open `http://127.0.0.1:9119`, click **AI Monitor Pro** in the sidebar. If TT isn't running, you'll see start-up instructions; once it's up, the launcher lights up with six deep-link cards.

## What it does

- Registers a nav tab in Hermes Dashboard (position: `after:analytics`)
- Probes your local AI Monitor Pro instance (default `http://localhost:3000`) and shows a reachability pill
- Six launcher cards that open TT in a new tab at the right page
- Inline base-URL editor (persists to `localStorage`) for non-default deployments
- Pure frontend — no backend routes, no `plugin_api.py`, no network access beyond your local TT

## File layout

```
plugin/hermes-dashboard/
├── manifest.json        # nav tab + icon + position
├── dist/
│   ├── index.js         # IIFE launcher (uses window.__HERMES_PLUGIN_SDK__)
│   └── style.css        # optional, minimal
└── README.md            # this file
```

## Uninstall

```bash
rm -rf ~/.hermes/plugins/ai-monitor-pro
hermes dashboard --stop && hermes dashboard
```
