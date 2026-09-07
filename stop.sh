#!/usr/bin/env bash
# AI面试复盘系统 - 关闭脚本 (Git Bash 版)
# 用法: ./stop.sh

echo "============================================"
echo "  AI面试复盘系统 - 关闭脚本"
echo "============================================"
echo ""

# 结束占用 8000 端口 (后端)
echo "[1/2] 停止后端服务 (:8000)..."
BACKEND_PID=$(netstat -aon 2>/dev/null | grep ":8000" | grep -i "LISTENING" | awk '{print $NF}' | sort -u)
if [ -n "$BACKEND_PID" ]; then
    for pid in $BACKEND_PID; do kill -f "$pid" 2>/dev/null; done
    echo "  已终止 PID: $BACKEND_PID"
else
    echo "  后端未在运行"
fi

# 结束占用 5174 端口 (前端)
echo "[2/2] 停止前端服务 (:5174)..."
FRONTEND_PID=$(netstat -aon 2>/dev/null | grep ":5174" | grep -i "LISTENING" | awk '{print $NF}' | sort -u)
if [ -n "$FRONTEND_PID" ]; then
    for pid in $FRONTEND_PID; do kill -f "$pid" 2>/dev/null; done
    echo "  已终止 PID: $FRONTEND_PID"
else
    echo "  前端未在运行"
fi

echo ""
echo "============================================"
echo "  全部服务已停止！"
echo "============================================"
