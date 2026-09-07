#!/usr/bin/env bash
# AI面试复盘系统 - 启动脚本 (Git Bash 版)
# 用法: ./start.sh

cd "$(dirname "$0")"

echo "============================================"
echo "  AI面试复盘系统 - 启动脚本"
echo "============================================"
echo ""

# 启动后端 (FastAPI, :8000)
echo "[1/2] 启动后端服务 (FastAPI / :8000)..."
(cd backend && python run.py) & BACKEND_PID=$!

# 启动前端 (Vite, :5174)
echo "[2/2] 启动前端服务 (Vite / :5174)..."
(cd frontend-react && npm run dev) & FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  启动完成！"
echo ""
echo "  前端页面:  http://localhost:5174"
echo "  后端 API:  http://localhost:8000"
echo "  API 文档:  http://localhost:8000/docs"
echo "============================================"
echo ""
echo "提示: 关闭服务请运行 ./stop.sh"
echo ""
# 保持脚本前台运行，Ctrl+C 结束时同时终止子进程
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' INT TERM
wait
