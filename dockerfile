FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npx tsc 

# stage 2
FROM node:20

WORKDIR /app

COPY --from=builder .app/package.json ./
COPY --from=builder .app/dist ./dist 
COPY --from=builder .app/views ./views

RUN npm install --omit=dev

EXPOSE 8000

CMD ["node","dist/index.js"]