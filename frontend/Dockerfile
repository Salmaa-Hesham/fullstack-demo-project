# Stage 1: Build the React/Vite app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# Stage 2: Serve the built static files without Nginx
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
