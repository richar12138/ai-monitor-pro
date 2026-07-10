# AI Monitor Pro — Claude Code 上下文

> 本文件是 AI Monitor Pro 项目的**唯一知识入口**。进入项目后先读这个。
> 项目路径：`E:\AI\Projects\ai-monitor-pro`

---

## 一、项目概述

AI Monitor Pro 是一个**本地 AI Agent 可观测仪表盘**，读取 Claude Code、Codex、Cursor、Gemini CLI、Hermes 等工具写在本机的日志，展示：

- Token 使用量、成本（按模型/按 Agent/按时段）
- 工具调用统计、Skill 调用分析
- 会话追踪（完整回放、子代理、计划模式）
- 项目热度热力图
- Hermes Agent 专用页面
- 预算和告警

**100% 本地运行，数据不上传。** 免费开源，MIT 协议。

**来源**：从上游 `VasiHemanth/tokentelemetry` 定制而来，做了完整的品牌替换和中英文国际化。

## 二、品牌与仓库

| 项目 | 值 |
|------|-----|
| 项目名 | AI Monitor Pro |
| 包名 | ai-monitor-pro |
| GitHub | https://github.com/richar12138/ai-monitor-pro |
| 上游来源 | https://github.com/VasiHemanth/tokentelemetry |
| license | MIT |

**规则**：
- 代码中品牌始终用 `AI Monitor Pro` / `ai-monitor-pro` / `richar12138`
- 真实上游信息（TokenTelemetry / VasiHemanth）只在同步文档、致谢、来源说明中保留
- package.json 的 author、repository、homepage 必须保留我们的版本
- README.md 保留中文头部和我们的品牌

## 三、快速启动

```powershell
cd E:\AI\Projects\ai-monitor-pro
node bin\cli.js
```

浏览器打开：
- 前端仪表盘：http://localhost:3000
- 后端 API：http://localhost:8000

Windows 也可以双击 `start.bat`。

带的参数：
```powershell
node bin\cli.js --port 4000 --api-port 9000
node bin\cli.js --data-dir E:\AI\Data\ai-monitor-pro
node bin\cli.js --host 0.0.0.0
```

依赖：Node.js 18+、Python 3.9+、npm、git。启动器会自动处理 venv 和 npm install。

## 四、项目结构

```
ai-monitor-pro/
├── bin/cli.js          ← 跨平台启动器
├── backend/            ← FastAPI，扫描本机 agent 日志，REST API
│   ├── main.py         ← 路由 + session 扫描 + 聚合
│   ├── tt_paths.py     ← 数据目录解析
│   ├── history_store.py← SQLite 持久历史
│   ├── pricing.py      ← 价格计算
│   ├── billing_mode.py ← 账单模式（订阅/API/免费/本地）
│   ├── test_*.py       ← 后端测试
│   └── summarizers/    ← 摘要后端适配
├── frontend/           ← Next.js 仪表盘
│   └── src/
│       ├── app/        ← 页面（dashboard, analytics, sessions, settings, hermes, projects）
│       ├── components/ ← 共享组件（Navigation, LocaleSwitcher, ui/）
│       └── lib/        ← API 客户端、i18n、agents、format、billing
├── website/            ← 文档站（Fumadocs）
├── plugin/             ← Hermes Dashboard 插件
├── proxy/              ← Cloudflare Worker
├── scripts/            ← 安装、发布、同步脚本
├── docs/               ← 设计文档和 ADR（英文，来自上游）
├── sync-upstream.sh    ← 上游同步脚本
├── SYNC_GUIDE.md       ← 上游同步手册
└── CODEX_SYNC_TASK.md  ← Codex 同步任务说明
```

## 五、数据流

1. 用户运行 `node bin\cli.js`
2. 启动器创建后端 venv，装依赖，起 FastAPI（端口 8000）
3. 前端 Next.js 起在端口 3000
4. 后端扫描本机 agent 日志：
   - Claude Code → `~/.claude/`
   - Codex → `~/.codex/`
   - Cursor、Gemini、Qwen、OpenCode、Vibe、Copilot、Antigravity、Grok、Hermes 等各自默认位置
5. 前端通过 REST API 展示所有数据

## 六、关键模块

### 后端

| 文件 | 职责 |
|------|------|
| `backend/main.py` | 最大文件，所有 FastAPI 路由和 session 聚合 |
| `backend/tt_paths.py` | 数据目录（默认 `~/.ai-monitor-pro/`） |
| `backend/history_store.py` | SQLite 持久化，防止 agent 清理日志后数据丢失 |
| `backend/pricing.py` + `pricing_data.json` | 模型价格和成本计算 |
| `backend/billing_mode.py` | 订阅 vs API vs 免费 vs 本地模型 |
| `backend/power_config.py` / `power_meter.py` | 本地模型功耗、电费、CO2 |
| `backend/telemetry.py` | 匿名产品统计（可关闭） |

### 前端

| 路径 | 功能 |
|------|------|
| `app/page.tsx` | 主仪表盘 |
| `app/analytics/page.tsx` | 全局分析 |
| `app/projects/` | 项目列表、详情、配置、洞察 |
| `app/sessions/[id]/page.tsx` | 会话详情（2618 行，最大组件） |
| `app/hermes/` | Hermes Agent 专区 |
| `app/settings/page.tsx` | 设置页 |
| `lib/api.ts` | API 请求封装 |
| `lib/agents.ts` | Agent 元数据 |
| `lib/i18n/` | **我们的定制**：中英文翻译（240+ 键） |

## 七、设计约束

- 本地日志默认不出机器
- 可选匿名 telemetry 必须内容无关、可一键关闭
- Claude Code subagent token 在父 session 上作为 delegated bucket 暴露，不重复加总
- 不同 agent 不记录的信号诚实显示 `n/a`，不估算
- UI 保持信息密度，避免营销页风格
- 不要给用户默认引入上传日志/prompt/代码到云端的路径

## 八、i18n 翻译（我们的专属定制）

翻译文件在 `frontend/src/lib/i18n/`：
- `en.ts` — 英文
- `zh.ts` — 中文
- `index.tsx` — I18nProvider + useI18n + t() 函数
- `types.ts` — 类型定义

语言切换组件：`frontend/src/components/LocaleSwitcher.tsx`

**冲突时优先保留我们的版本**，因为上游没有 i18n。

## 九、上游同步

### 当前远程

```
origin   https://github.com/richar12138/ai-monitor-pro.git
upstream https://github.com/VasiHemanth/tokentelemetry.git
```

### 每周同步流程

```powershell
cd E:\AI\Projects\ai-monitor-pro
git fetch upstream
git log main..upstream/main --oneline
```

无新提交 → 结束。有新提交：

```powershell
F:\Git\bin\bash.exe .\sync-upstream.sh
```

或手动：
```powershell
git checkout -b sync-$(Get-Date -Format yyyyMMdd)
git merge upstream/main
# 有冲突时：
#   - i18n 文件 → ours
#   - package.json author/repository → ours
#   - README.md → ours
#   - 其他 → ours，再人工检查上游新功能
```

### 品牌替换（merge 后必须执行）

搜索所有 `.tsx .ts .js .py .json .md .yaml .yml .html .css .sh .ps1` 文件，排除 `node_modules dist .git .next`：
- `TokenTelemetry` → `AI Monitor Pro`
- `tokentelemetry` → `ai-monitor-pro`
- `VasiHemanth` → `richar12138`

**不要替换的文件**：`CODEX_SYNC_TASK.md`、`SYNC_GUIDE.md`、`sync-upstream.sh`（里面描述真实上游的部分）。

## 十、本机 Git 环境

| 项目 | 值 |
|------|-----|
| GitHub CLI | `E:\AI\CLI-Tools\GitHubCLI\gh.exe` |
| 账号 | richar12138 |
| Git 代理 | `http://127.0.0.1:1080` |
| 如果代理未开 | `git config --global --unset https.proxy` |

## 十一、验证

```powershell
# 后端测试
cd E:\AI\Projects\ai-monitor-pro
backend\.venv\Scripts\python.exe -m pytest backend

# 前端验证
cd frontend
npm install
npm run lint
npm run build
```

## 十二、常见修改位置

| 任务 | 看哪里 |
|------|--------|
| 新增/修复 agent 扫描 | `backend/main.py` + `test_*.py` |
| 数据目录问题 | `backend/tt_paths.py` |
| 成本/价格不对 | `backend/pricing.py`、`backend/pricing_data.json` |
| 预算、订阅 | `backend/billing_mode.py`、`backend/billing_route.py` |
| 前端 UI | `frontend/src/app/...`、`frontend/src/components/...` |
| Hermes 专区 | `frontend/src/app/hermes/` |
| 文档站 | `website/` |
| 安装体验 | `install.ps1`、`install.sh`、`bin/cli.js` |
| 中英文翻译 | `frontend/src/lib/i18n/` |
