FROM node:23-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
RUN adduser --system --no-create-home nodejs
USER nodejs
CMD ["npm", "start"]