FROM node:23-alpine3.20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8000
ENV PORT=8000
RUN adduser --system --no-create-home nodejs
USER nodejs
CMD ["npm", "start"]