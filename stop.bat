@echo off
chcp 65001 >nul
echo ============================================
echo   AI面试复盘系统 - 关闭脚本
echo ============================================
echo.

rem 结束占用 8000 端口 (后端)
echo [1/2] 正在停止后端服务 (:8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /f /t /pid %%a >nul 2>&1
)

rem 结束占用 5174 端口 (前端)
echo [2/2] 正在停止前端服务 (:5174)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5174" ^| findstr "LISTENING"') do (
    taskkill /f /t /pid %%a >nul 2>&1
)

echo.
echo ============================================
echo   全部服务已停止！
echo ============================================
echo.
timeout /t 3 >nul
