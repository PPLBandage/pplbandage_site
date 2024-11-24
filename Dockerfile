FROM node:20.11-alpine

WORKDIR /app

COPY . .

RUN npm i

CMD ["npm", "run", "start"]