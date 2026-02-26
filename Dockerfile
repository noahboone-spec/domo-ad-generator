FROM node:20-slim

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy server source and assets
COPY scripts/ scripts/
COPY public/ public/

# tsx is needed to run TypeScript directly
RUN npm install -g tsx

EXPOSE 8080

CMD ["tsx", "scripts/serve-for-figma.ts"]
