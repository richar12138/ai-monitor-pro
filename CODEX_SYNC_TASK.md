## 任务：每周同步 AI Monitor Pro 上游更新

项目路径：E:\AI\Projects\ai-monitor-pro
GitHub 仓库：https://github.com/richar12138/ai-monitor-pro
上游来源：https://github.com/richar12138/ai-monitor-pro
同步脚本：sync-upstream.sh
详细指南：SYNC_GUIDE.md

### 每周一早上执行以下步骤：

1. cd E:\AI\Projects\ai-monitor-pro  
2. git fetch upstream
3. git log main..upstream/main --oneline （查看上游有哪些新提交）
4. 如果没有新提交，结束
5. 如果有新提交：
   a. git merge upstream/main
   b. 如果出现冲突，按以下规则解决：
      - i18n 文件（frontend/src/lib/i18n/*）→ 保留我们的版本
      - package.json（author、repository）→ 保留我们的版本
      - README.md → 保留我们的版本
      - 其他冲突文件 → 用 git checkout --ours 保留我们的版本
   c. 执行品牌替换（PowerShell）：
      遍历所有 .tsx .ts .js .py .json .md .yaml .yml .html .css .sh .ps1 文件，
      排除 node_modules、dist、.git、.next 目录，
      替换 AI Monitor Pro → AI Monitor Pro
      替换 ai-monitor-pro → ai-monitor-pro
      替换 richar12138 → richar12138
   d. git add -A
   e. git commit -m "sync: upstream merge + rebrand (日期)"
   f. git push origin main
