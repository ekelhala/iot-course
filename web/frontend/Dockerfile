FROM node:latest AS builder
RUN mkdir app
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
RUN chown -R www-data /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD [ "nginx", "-g", "daemon off;" ]