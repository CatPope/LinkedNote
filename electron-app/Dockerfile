# Stage 1: Build the Electron app
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY electron-app/ ./electron-app/

WORKDIR /app/electron-app

RUN npm install
RUN npm run build

# Stage 2: Create the final image
FROM debian:stable-slim

WORKDIR /app

# Install necessary dependencies for Electron
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libasound2 \
    libnss3 \
    libxss1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libgbm-dev \
    libappindicator1 \
    libsecret-1-0 \
    libvulkan1 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libdrm-dev \
    libxkbfile1 \
    libxmu-dev \
    libxpm-dev \
    libxt-dev \
    libxxf86vm-dev \
    libxcb-dri3-0 \
    libx11-xcb1 \
    libxrender1 \
    libxi6 \
    libsm6 \
    libice6 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libfreetype6 \
    libglib2.0-0 \
    libjpeg62-turbo \
    libpng16-16 \
    libstdc++6 \
    libuuid1 \
    libwebp6 \
    libxcursor1 \
    libxext6 \
    libxft2 \
    libxinerama1 \
    libxrandr2 \
    libxrender1 \
    libxshmfence-dev \
    libxxf86vm1 \
    libgbm1 \
    libnotify4 \
    libgconf-2-4 \
    libappindicator1 \
    libsecret-1-0 \
    libvulkan1 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxtst6 \
    libnss3 \
    libcups2 \
    libdrm-dev \
    libxkbfile1 \
    libxmu-dev \
    libxpm-dev \
    libxt-dev \
    libxxf86vm-dev \
    libxcb-dri3-0 \
    libx11-xcb1 \
    libxrender1 \
    libxi6 \
    libsm6 \
    libice6 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libfreetype6 \
    libglib2.0-0 \
    libjpeg62-turbo \
    libpng16-16 \
    libstdc++6 \
    libuuid1 \
    libwebp6 \
    libxcursor1 \
    libxext6 \
    libxft2 \
    libxinerama1 \
    libxrandr2 \
    libxrender1 \
    libxshmfence-dev \
    libxxf86vm1 \
    libgbm1 \
    libnotify4 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy the built application from the builder stage
COPY --from=builder /app/electron-app/dist/ ./

# Set the entry point
ENTRYPOINT ["./LinkedNote"]
