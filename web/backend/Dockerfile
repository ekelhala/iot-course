FROM node:23-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
EXPOSE 8002
ENV PORT=8000
ENV WS_PORT=8002
RUN adduser --system --no-create-home nodejs
USER nodejs
CMD ["npm", "start"]