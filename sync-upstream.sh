#!/bin/bash
# AI Monitor Pro - 上游同步脚本
# 用法: ./sync-upstream.sh
#
# 功能: 从原项目 AI Monitor Pro (VasiHemanth) 拉取最新代码，
#       自动替换所有品牌名为 AI Monitor Pro，解决冲突。

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "============================================"
echo "  AI Monitor Pro - 上游同步"
echo "============================================"
echo ""

# 1. 拉取上游最新代码
echo "[1/4] 拉取上游 AI Monitor Pro 最新代码..."
git fetch upstream

# 2. 创建临时分支进行同步
SYNC_BRANCH="sync-upstream-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$SYNC_BRANCH" main

# 3. 合并上游代码（-X ours 优先保留我们的品牌修改）
echo "[2/4] 合并上游 main..."
if git merge upstream/main -m "sync: merge upstream AI Monitor Pro" 2>/dev/null; then
    echo "  ✓ 合并成功，无冲突"
else
    echo "  ⚠ 有冲突，自动解决中..."
    # 解决冲突：品牌名相关冲突用我们的版本
    git diff --name-only --diff-filter=U | while read f; do
        if [ -f "$f" ]; then
            # 非 i18n 文件的冲突用 ours
            grep -q "i18n" <<< "$f" || git checkout --ours "$f" 2>/dev/null
        fi
    done
    git add -A
    git commit -m "sync: resolve merge conflicts (ours)" 2>/dev/null || true
fi

# 4. 品牌替换
echo "[3/4] 执行品牌替换..."
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.py" \
    -o -name "*.json" -o -name "*.md" -o -name "*.mdx" -o -name "*.yaml" \
    -o -name "*.yml" -o -name "*.html" -o -name "*.css" -o -name "*.sh" \
    -o -name "*.ps1" -o -name "*.cff" -o -name "*.txt" \) \
    -not -path "*/.git/*" -not -path "*/node_modules/*" -not -path "*/dist/*" \
    -not -path "*/.next/*" \
    -exec sed -i 's/AI Monitor Pro/AI Monitor Pro/g' {} + 2>/dev/null || true

find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.py" \
    -o -name "*.json" -o -name "*.md" -o -name "*.mdx" \) \
    -not -path "*/.git/*" -not -path "*/node_modules/*" -not -path "*/dist/*" \
    -exec sed -i 's/tokentelemetry/ai-monitor-pro/g' {} + 2>/dev/null || true

find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.py" \
    -o -name "*.json" -o -name "*.md" -o -name "*.mdx" \) \
    -not -path "*/.git/*" -not -path "*/node_modules/*" -not -path "*/dist/*" \
    -exec sed -i 's/VasiHemanth/richar12138/g' {} + 2>/dev/null || true

git add -A
git commit -m "sync: rebrand after upstream merge" 2>/dev/null || echo "  (no brand changes needed)"

# 5. 切回 main 并合并
echo "[4/4] 切回 main 并合并..."
git checkout main
git merge "$SYNC_BRANCH" -m "sync: merge upstream update $(date +%Y-%m-%d)"

git push origin main

# 清理
git branch -d "$SYNC_BRANCH"

echo ""
echo "============================================"
echo "  ✓ 上游同步完成！"
echo "  https://github.com/richar12138/ai-monitor-pro"
echo "============================================"
