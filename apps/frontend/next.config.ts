/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de ESLint para el build
  eslint: {
    // Permite que el build continúe incluso con warnings de ESLint
    ignoreDuringBuilds: false, // Mantener false para mostrar warnings pero no fallar
    dirs: ['src'], // Solo ejecutar ESLint en la carpeta src
  },

  // Configuración de TypeScript
  typescript: {
    // Permite warnings pero mantiene la verificación de tipos
    ignoreBuildErrors: false,
  },

  // Configuración adicional
  reactStrictMode: true,

  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig