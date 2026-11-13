# syntax=docker/dockerfile:1

# --------------------------------------------------
# BUILD - Nuxt em modo SPA/estático
# --------------------------------------------------
FROM node:24-alpine AS build

WORKDIR /app

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./

# O nginx dos microservices publica este container em /app/admin/.
# A API é consumida na mesma origem: o nginx encaminha /users para o gateway.
ARG NUXT_APP_BASE_URL=/app/admin/
ARG NUXT_PUBLIC_USERS_API_URL=/users
ARG NUXT_PUBLIC_NOTIFICATIONS_API_URL=/notifications
# Vazio esconde o botão "Entrar com Google" (o GSI só é carregado com client ID).
ARG NUXT_PUBLIC_GOOGLE_CLIENT_ID=

ENV NUXT_APP_BASE_URL=$NUXT_APP_BASE_URL
ENV NUXT_PUBLIC_USERS_API_URL=$NUXT_PUBLIC_USERS_API_URL
ENV NUXT_PUBLIC_NOTIFICATIONS_API_URL=$NUXT_PUBLIC_NOTIFICATIONS_API_URL
ENV NUXT_PUBLIC_GOOGLE_CLIENT_ID=$NUXT_PUBLIC_GOOGLE_CLIENT_ID

RUN npm run generate

# --------------------------------------------------
# RUNTIME - nginx estático
# --------------------------------------------------
FROM nginx:1.28-alpine AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /usr/share/nginx/html/app/admin

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/app/admin/ || exit 1
