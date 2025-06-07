#!/bin/bash

echo "🚀 Configuración completa del proyecto TON"
echo "==========================================="

# Verificar Node.js
echo "📋 Verificando prerrequisitos..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Crear archivos de variables de entorno si no existen
echo "📝 Configurando variables de entorno..."

if [ ! -f "apps/backend/.env" ]; then
    cat > apps/backend/.env << EOF
DATABASE_URL="postgresql://neondb_owner:npg_Uq4zD8ZyeWJH@ep-raspy-snow-a8ysqpcc-pooler.eastus2.azure.neon.tech/Database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
EOF
    echo "✅ Archivo .env del backend creado"
fi

if [ ! -f "apps/frontend/.env.local" ]; then
    cat > apps/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="TON - Tours Islas Ballestas"
EOF
    echo "✅ Archivo .env.local del frontend creado"
fi

# Instalar dependencias raíz
echo "📦 Instalando dependencias del workspace..."
npm install

# Backend setup
echo "📦 Configurando backend..."
cd apps/backend
npm install

# Generar cliente Prisma
echo "🔄 Generando cliente de Prisma..."
npx prisma generate

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npx prisma migrate dev --name init

# Ejecutar seeds
echo "🌱 Ejecutando seeds..."
npm run prisma:seed

cd ../..

# Frontend setup
echo "📦 Configurando frontend..."
cd apps/frontend
npm install
cd ../..

# Configurar Git hooks
echo "🔧 Configurando Git hooks..."
if [ -d ".git" ]; then
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
    echo "✅ Git hooks configurados"
else
    echo "⚠️ No es un repositorio Git, saltando configuración de hooks"
fi

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "📝 Para iniciar el proyecto:"
echo "   npm run dev"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo ""
echo "👤 Credenciales:"
echo "   Admin:    admin@ton.com / admin123"
echo "   Vendedor: vendedor@ton.com / vendedor123"
echo "   Cliente:  cliente@example.com / cliente123"
echo ""
echo "🚀 ¡El proyecto TON está listo para usar!"