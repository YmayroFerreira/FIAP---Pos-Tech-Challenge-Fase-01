

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/homepage",
        destination: `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/homepage`,
      },
      {
        source: "/homepage/:path*",
        destination: `${process.env.NEXT_PUBLIC_HOMEPAGE_URL}/homepage/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
