const STORE_HOST = process.env.STORE_HOST || "localhost";
const STORE_PORT = process.env.STORE_PORT || 3002;


const STORE_URL = `http://${STORE_HOST}:${STORE_PORT}`;
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
        destination: `https://bytebank-homepage.vercel.app/homepage`,
      },
      {
        source: "/homepage/:path*",
        destination: `https://bytebank-homepage.vercel.app/homepage/:path*`,
      },
    
    ];
  },
};

module.exports = nextConfig;
