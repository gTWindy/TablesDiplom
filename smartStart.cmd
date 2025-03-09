@echo off
start "" serve -s build
:: Получение PID процесса, занимающего порт 5000
for /f "tokens=5" %%P in ('netstat -aon ^| findstr ":5000"') do set pid=%%P

:: Проверка, что PID был найден
if "%pid%"=="" (
    echo Port 5000 free.
) else (
    echo PID busy on port 5000: %pid%
    
    :: Убийство процесса
    taskkill /F /PID %pid%
    
    echo Process with PID %pid% had killed.
)

:: Продолжение выполнения скрипта
echo ...
start "" server.exe