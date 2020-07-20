FROM node:8.11-alpine AS builder

WORKDIR /usr/src/app
RUN apk add --no-cache git python krb5 krb5-libs gcc make g++ krb5-dev
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .
RUN rm -rf node_modules
RUN git config --global http.sslverify "false"
RUN npm install
RUN npm run build

FROM nginx
ARG BRANCH
RUN rm /etc/nginx/conf.d/*.conf
COPY ./system/nginx.spa.conf /etc/nginx/conf.d/
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY ./public/${BRANCH}.robots.txt /usr/share/nginx/html/robots.txt
EXPOSE 80
