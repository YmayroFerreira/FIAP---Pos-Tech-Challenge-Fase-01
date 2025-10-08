const STORE_HOST = process.env.STORE_HOST || "localhost";
const STORE_PORT = process.env.STORE_PORT || 3002;

const STORE_URL = `http://${STORE_HOST}:${STORE_PORT}`;
HOMEPAGE_URL = `https://bytebank-homepage.vercel.app`

// const HOMEPAGE_URL = 'http://localhost:3003'
// const HOMEPAGE_URL = `http://${HOMEPAGE_HOST}:${HOMEPAGE_PORT}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/store",
        destination: `${STORE_URL}/store`,
      },

      {
        source: "/homepage",
        // destination: `https://bytebank-homepage.vercel.app/homepage`,
        destination: `${HOMEPAGE_URL}/homepage`,
      },
      {
        source: "/homepage/:path*",
        // destination: `https://bytebank-homepage.vercel.app/homepage/:path*`,
        destination: `${HOMEPAGE_URL}/homepage/:path*`,
      },
    
    ];
  },
};

module.exports = nextConfig;
