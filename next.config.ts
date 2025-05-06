import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Или 'https'
        hostname: 'localhost', // Замените на имя вашего хоста (или домен)
        port: '3000', // Укажите порт, если необходимо (например, для localhost)
        pathname: '/icons/**', // Путь к изображениям (используйте ** для соответствия всем подпапкам)
      },
      // Добавьте другие remotePatterns, если необходимо
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // },
    ],
  },
};

export default nextConfig;
