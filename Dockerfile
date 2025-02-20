FROM node:20.11.0-slim
LABEL maintainer="yoongjunquan@gmail.com"

WORKDIR /app
ADD . /app
RUN chmod -R 700 /app
# Install project dependencies
RUN npm install pm2 -g
RUN npm install
RUN npm run build
COPY package.json ./
COPY server.js ./

ARG ENVIRONMENT
ENV ENVIRONMENT=$ENVIRONMENT

# PORTS
EXPOSE 8080

# Expose Volume
VOLUME ["/app", "/app/node_modules/", "/app/storage/logs"]

CMD ["sh", "-c", "NODE_ENV=production pm2 start ./server.js --no-daemon"]
