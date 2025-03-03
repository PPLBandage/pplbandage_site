FROM node:20.11-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --production
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]