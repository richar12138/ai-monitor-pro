## 任务：同步 AI Monitor Pro 上游更新

请定期（建议每周）执行以下操作，将上游 TokenTelemetry 的最新代码合并到 AI Monitor Pro。

### 手动执行

```bash
cd /tmp/tokentelemetry && bash sync-upstream.sh
```

### 或者逐步执行

```bash
# 1. 拉取上游
cd E:\AI\Projects\ai-monitor-pro
git fetch upstream

# 2. 查看上游有什么新变化
git log main..upstream/main --oneline

# 3. 合并上游
git merge upstream/main

# 4. 品牌替换（因为 merge 后可能把品牌名改回去了）
powershell -Command "
Get-ChildItem -Recurse -Include '*.tsx','*.ts','*.js','*.py','*.json','*.md','*.yaml','*.yml','*.html','*.css' |
  Where-Object { \$_.FullName -notmatch '\\\\node_modules\\\\|\\\\dist\\\\|\\\\.git\\\\|\\\\.next\\\\' } |
  ForEach-Object {
    (Get-Content \$_.FullName -Raw) -replace 'TokenTelemetry','AI Monitor Pro' -replace 'tokentelemetry','ai-monitor-pro' -replace 'VasiHemanth','richar12138' |
    Set-Content \$_.FullName -NoNewline
  }
"

# 5. 提交并推送
git add -A
git commit -m "sync: upstream merge + rebrand $(Get-Date -Format 'yyyy-MM-dd')"
git push origin main
```

### 注意事项

1. **合并冲突**：品牌名替换会导致大量冲突，优先保留 AI Monitor Pro 版本
2. **i18n 文件**：`frontend/src/lib/i18n/` 下的中英文翻译字典是我们自己加的，冲突时也要保留
3. **package.json**：作者信息必须保持 `richar12138`
4. **README.md**：保留中文版头部描述
5. **新增文件**：上游新增的功能文件要正常接受，然后跑品牌替换
