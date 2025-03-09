#!/bin/bash
# Проверяем наличие флагов среди аргументов
FLAG_FOUND_CLIENT=false
FLAG_FOUND_SERVER=false
for arg in "$@"; do
  if [[ "$arg" == "--no_client_build" ]]; then
    FLAG_FOUND_CLIENT=true
  fi
  if [[ "$arg" == "--no_server_build" ]]; then
    FLAG_FOUND_SERVER=true
  fi
done

echo "Запуск сборки проекта..."

if [ ! -d "release" ]; then
    mkdir release
fi
cd client
# Выполняем npm run build только если флаг '-l' не был передан
if [ "$FLAG_FOUND_CLIENT" != true ]; then
  npm run build
  if [ $? -ne 0 ]; then
      echo "Ошибка сборки!"
      exit 1
  fi
fi
cd ../server
if [ "$FLAG_FOUND_SERVER" != true ]; then
    cp -R build ../release
    pkg src/server.js --targets 'node16-win-x64' --outputs 'server.exe'
    echo "Сервер собран!"
    mv server.exe ../release
fi
cp -R test ../release
cp ./node_modules/sqlite3/build/release/node_sqlite3.node ../release
echo "Создаем сценарий запуска"
cp ../smartStart.cmd ../release
echo "Сборка завершена успешно!"