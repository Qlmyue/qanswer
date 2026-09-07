@echo off
chcp 65001 >nul
echo ============================================
echo   AI面试复盘系统 - 启动脚本
echo ============================================
echo.

rem 启动后端 (FastAPI, 端口 8000)
echo [1/2] 正在启动后端服务 (FastAPI / :8000)...
start "AI-Replay-Backend" cmd /k "cd /d %~dp0backend && python run.py"

rem 启动前端 (Vite, 端口 5174)
echo [2/2] 正在启动前端服务 (Vite / :5174)...
start "AI-Replay-Frontend" cmd /k "cd /d %~dp0frontend-react && npm run dev"

echo.
echo ============================================
echo   启动完成！
echo.
echo   前端页面:  http://localhost:5174
echo   后端 API:  http://localhost:8000
echo   API 文档:  http://localhost:8000/docs
echo ============================================
echo.
echo 提示: 关闭服务请运行 stop.bat
echo.
timeout /t 3 >nul
