# 设置基础镜像
FROM node:lts-alpine as build-stage

#创建一个工作目录
WORKDIR /app
COPY . .
RUN npm install 
RUN yarn build:prod

# production stage
FROM nginxinc/nginx-unprivileged  as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露镜像端口
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
