#!/bin/bash

echo "🚀 Configurando proyecto TON..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Se requiere Node.js 18 o superior"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias raíz
echo "📦 Instalando dependencias del workspace..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd apps/backend
npm install
echo "🔄 Generando cliente de Prisma..."
npx prisma generate
cd ../..

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd apps/frontend
npm install
cd ../..

# Configurar hooks de Git
echo "🔧 Configurando hooks de Git..."
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
npx husky add .husky/pre-push "npm run test"

echo "✅ ¡Configuración completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configura las variables de entorno en apps/backend/.env"
echo "2. Configura las variables de entorno en apps/frontend/.env.local"
echo "3. Ejecuta las migraciones: npm run prisma:migrate"
echo "4. Inicia el proyecto: npm run dev"