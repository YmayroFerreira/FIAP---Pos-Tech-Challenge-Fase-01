// Em sua Shell App -> next.config.js

// Define a URL da sua aplicação de loja.
// Ao rodar com Docker, o host deve ser o nome do serviço (ex: 'app-financeiro-store').
// Fora do Docker, pode ser 'localhost'.
const STORE_HOST = process.env.STORE_HOST || "localhost";
const STORE_PORT = process.env.STORE_PORT || 3002;
const STORE_URL = `http://${STORE_HOST}:${STORE_PORT}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      // Regra para a raiz da loja
      {
        source: "/store",
        destination: `${STORE_URL}/store`,
      },
      // Regra para todas as outras rotas dentro da loja
      {
        source: "/store/:path*",
        destination: `${STORE_URL}/store/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
