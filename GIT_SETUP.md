# 🚀 Настройка Git и загрузка на GitHub

## 📋 Инструкция по загрузке проекта на GitHub

### Шаг 1: Откройте терминал в папке проекта

```bash
cd "/Users/erbolsadibekov/Desktop/PC simulator"
```

### Шаг 2: Инициализируйте Git репозиторий

```bash
git init
```

### Шаг 3: Добавьте все файлы

```bash
git add .
```

### Шаг 4: Сделайте первый коммит

```bash
git commit -m "Initial commit: PC Simulator with 3D visualization"
```

### Шаг 5: Добавьте remote репозиторий

```bash
git remote add origin https://github.com/astigmacist/PCSIMULATOR.git
```

### Шаг 6: Переименуйте ветку в main (если нужно)

```bash
git branch -M main
```

### Шаг 7: Загрузите на GitHub

```bash
git push -u origin main
```

---

## 🔐 Если потребуется авторизация

GitHub может попросить логин и пароль. Используйте:

### Вариант 1: Personal Access Token
1. Зайдите на GitHub → Settings → Developer settings → Personal access tokens
2. Создайте новый token с правами `repo`
3. Используйте его вместо пароля при push

### Вариант 2: SSH ключ
```bash
# Проверьте есть ли SSH ключ
ls -al ~/.ssh

# Если нет, создайте
ssh-keygen -t ed25519 -C "your_email@example.com"

# Добавьте в GitHub → Settings → SSH and GPG keys
cat ~/.ssh/id_ed25519.pub
```

---

## 📝 Все команды одной строкой

```bash
cd "/Users/erbolsadibekov/Desktop/PC simulator" && \
git init && \
git add . && \
git commit -m "Initial commit: PC Simulator with 3D visualization" && \
git remote add origin https://github.com/astigmacist/PCSIMULATOR.git && \
git branch -M main && \
git push -u origin main
```

---

## 🔄 Для других людей (git pull)

### Чтобы скачать проект:

```bash
git clone https://github.com/astigmacist/PCSIMULATOR.git
cd PCSIMULATOR
npm install
npm run dev
```

### Чтобы обновить проект (если уже скачан):

```bash
git pull origin main
npm install  # если добавились новые зависимости
```

---

## 📦 Что будет загружено

✅ Весь исходный код  
✅ Конфигурационные файлы  
✅ База данных компонентов  
✅ Документация  
✅ README файлы  

❌ НЕ будет загружено (благодаря .gitignore):
- node_modules/
- dist/
- .DS_Store
- Логи

---

## 🎯 После загрузки

Другие люди смогут:

1. **Склонировать проект:**
   ```bash
   git clone https://github.com/astigmacist/PCSIMULATOR.git
   ```

2. **Установить зависимости:**
   ```bash
   cd PCSIMULATOR
   npm install
   ```

3. **Запустить проект:**
   ```bash
   npm run dev
   ```

---

## 🔧 Полезные команды Git

### Проверить статус:
```bash
git status
```

### Посмотреть изменения:
```bash
git diff
```

### Добавить изменения:
```bash
git add .
git commit -m "Описание изменений"
git push
```

### Обновить с GitHub:
```bash
git pull
```

### Посмотреть историю:
```bash
git log
```

---

## ⚠️ Важно

1. **Не коммитьте** `node_modules` - они в .gitignore
2. **Делайте понятные** сообщения коммитов
3. **Перед push** проверьте что все работает
4. **Регулярно делайте** `git pull` перед работой

---

## 🎉 Готово!

После выполнения всех команд проект будет доступен по адресу:
**https://github.com/astigmacist/PCSIMULATOR**

Любой сможет скачать и использовать ваш проект! 🚀
