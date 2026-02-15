import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  /**
   * Headers de segurança
   * Protegem contra diversos tipos de ataques web
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Previne clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          
          // Previne MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          
          // Controla informações enviadas no Referrer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          
          // Proteção XSS (browsers modernos)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          
          // Força HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          
          // Previne exposição de informações do servidor
          { key: "X-DNS-Prefetch-Control", value: "on" },
          
          // Permissions Policy (substitui Feature-Policy)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
