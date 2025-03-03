FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --omit=dev
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]