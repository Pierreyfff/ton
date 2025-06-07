#!/bin/bash

echo "🚀 Iniciando entorno de desarrollo..."

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

if [ ! -d "apps/backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd apps/backend && npm install && cd ../..
fi

if [ ! -d "apps/frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd apps/frontend && npm install && cd ../..
fi

# Generar cliente de Prisma
echo "🔄 Generando cliente de Prisma..."
cd apps/backend && npx prisma generate && cd ../..

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones de base de datos..."
cd apps/backend && npx prisma migrate dev && cd ../..

# Iniciar aplicaciones
echo "🚀 Iniciando aplicaciones..."
npm run dev