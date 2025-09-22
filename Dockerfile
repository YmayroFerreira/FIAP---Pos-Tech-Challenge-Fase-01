# Stage 1: O estágio de construção
FROM node:18-slim AS builder

# Declara os argumentos que serão recebidos do docker-compose
ARG STORE_HOST
ARG STORE_PORT
ARG HOMEPAGE_HOST
ARG HOMEPAGE_PORT
ARG NEXT_PUBLIC_API_URL

# Torna os argumentos disponíveis como variáveis de ambiente para os comandos seguintes (como `npm run build`)
ENV STORE_HOST=${STORE_HOST}
ENV STORE_PORT=${STORE_PORT}
ENV HOMEPAGE_HOST=${HOMEPAGE_HOST}
ENV HOMEPAGE_PORT=${HOMEPAGE_PORT}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

WORKDIR /app

COPY package*.json ./ 
# Limpa o cache para garantir uma instalação limpa
RUN rm -rf node_modules package-lock.json
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Runner
FROM node:18-slim AS runner

ENV NODE_ENV production

WORKDIR /app

# A pasta .next/standalone já contém tudo o que é necessário para rodar a aplicação.
# Copia o servidor standalone e as dependências de produção.
COPY --from=builder /app/.next/standalone/ ./

# Copia os assets estáticos (CSS, JS, etc.) gerados pelo build.
COPY --from=builder /app/.next/static/ ./.next/static
# Copia a pasta public (imagens, fontes, etc.).
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]