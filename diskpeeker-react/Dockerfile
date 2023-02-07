# build react app
FROM node:19.6.0-alpine AS react-build
WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
RUN npm run build

# configure nginx
FROM nginx:1.23.3
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx-default.conf.template /etc/nginx/templates/
COPY --from=react-build /app/build .
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]

EXPOSE 3080
