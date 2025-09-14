// Em sua Shell App -> next.config.js

// Define a URL da sua aplicação de loja.
// É uma boa prática usar variáveis de ambiente para isso.
const STORE_URL = process.env.STORE_URL || 'http://localhost:3002';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      // Regra para a raiz da loja
      {
        source: '/store',
        destination: `${STORE_URL}/store`,
      },
      // Regra para todas as outras rotas dentro da loja
      {
        source: '/store/:path*',
        destination: `${STORE_URL}/store/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
