# Stage 1: O estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração do pacote
COPY package.json package-lock.json ./

# Instala as dependências, incluindo as de desenvolvimento
RUN npm install

# Copia o restante do código-fonte para o contêiner
COPY . .

# Habilita o output standalone no próximo passo do build
RUN echo "module.exports = { output: 'standalone' };" > next.config.js

# Constrói o aplicativo para produção
RUN npm run build

# Stage 2: O estágio de produção, menor e mais seguro
FROM node:18-alpine AS runner

WORKDIR /app

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Copia apenas os arquivos necessários do estágio de construção
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/cache ./.next/cache

# Copia os arquivos do pacote
COPY --from=builder /app/package.json ./package.json

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Expõe a porta que o Next.js usará
EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["node", "server.js"]