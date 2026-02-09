#!/bin/bash

# Скрипт для настройки Git и загрузки на GitHub

echo "🚀 Настройка Git репозитория..."

# Переходим в папку проекта
cd "$(dirname "$0")"

# Инициализируем Git
echo "📦 Инициализация Git..."
git init

# Добавляем все файлы
echo "➕ Добавление файлов..."
git add .

# Делаем первый коммит
echo "💾 Создание коммита..."
git commit -m "Initial commit: PC Simulator with 3D visualization and accordion UI"

# Добавляем remote
echo "🔗 Добавление remote репозитория..."
git remote add origin https://github.com/astigmacist/PCSIMULATOR.git 2>/dev/null || git remote set-url origin https://github.com/astigmacist/PCSIMULATOR.git

# Переименовываем ветку в main
echo "🌿 Настройка ветки..."
git branch -M main

echo ""
echo "✅ Готово к загрузке!"
echo ""
echo "📤 Для загрузки на GitHub выполните:"
echo "   git push -u origin main"
echo ""
echo "🔐 Если потребуется авторизация, используйте Personal Access Token"
echo "   или настройте SSH ключ (см. GIT_SETUP.md)"
