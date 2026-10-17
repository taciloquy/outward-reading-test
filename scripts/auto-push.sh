#!/bin/bash
# 用法: ./auto-push.sh <remote> <branch> [max_retries] [repo_dir]
# 每 5 分钟重试 git push，直到成功（或超过 max_retries 次，默认无限）
REMOTE="${1:?remote required}"
BRANCH="${2:?branch required}"
MAX="${3:-0}"   # 0 = 无限重试
DIR="${4:-$(pwd)}"
RETRIES=0

while true; do
  cd "$DIR" || exit 1
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') 第 $((RETRIES+1)) 次推送 $REMOTE/$BRANCH ====="
  if git push "$REMOTE" "$BRANCH" 2>&1; then
    echo "✅ 推送成功: $REMOTE/$BRANCH"
    exit 0
  fi
  RETRIES=$((RETRIES+1))
  if [ "$MAX" -gt 0 ] && [ "$RETRIES" -ge "$MAX" ]; then
    echo "❌ 超过最大重试次数 $MAX"
    exit 1
  fi
  echo "⏳ 推送失败，5 分钟后重试..."
  sleep 300
done
