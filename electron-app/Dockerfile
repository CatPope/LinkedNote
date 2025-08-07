# Use a Node.js base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies for Electron (Xvfb for headless, other libs)
# These are common dependencies for Electron apps in a Linux environment
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk-3-0 \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    libappindicator1 \
    libsecret-1-0 \
    libxkbcommon-x11-0 \
    libxrandr2 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxshmfence1 \
    libxxf86vm1 \
    fonts-liberation \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set display for Electron (for headless environments)
ENV DISPLAY=:99

# Command to start Xvfb and then run the Electron app
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x720x24 & npm start"]