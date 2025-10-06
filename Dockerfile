# Building stage
FROM node:20.11-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20.11-alpine

WORKDIR /app
COPY package*.json ./

# All runtime required files
COPY .env .

RUN npm install --omit=dev

COPY --from=builder /app/.next ./.next
CMD ["npm", "run", "start"]
