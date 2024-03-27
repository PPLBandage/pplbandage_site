# Используем официальный образ Node.js как базовый образ
FROM node:latest

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Указываем порт, который приложение будет использовать
EXPOSE 3000

# Запускаем сервер Next.js
CMD ["npm", "start"]