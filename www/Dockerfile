FROM node:18 as build

ARG SERVER_HOST
ARG SERVER_PORT

WORKDIR /app
COPY ./ /app

RUN npm ci
RUN VITE_SERVER_HOST=${SERVER_HOST} VITE_SERVER_PORT=${SERVER_PORT} npm run build

FROM nginx:stable as deploy

COPY --from=build /app/dist/ /etc/nginx/html/
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
