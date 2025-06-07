# TON - Sistema de Reservas Tours Islas Ballestas 🏝️

[![CI/CD Pipeline](https://github.com/Pierreyfff/ton/actions/workflows/ci-cd-simple.yml/badge.svg)](https://github.com/Pierreyfff/ton/actions/workflows/ci-cd-simple.yml)

Sistema completo de reservas de tours desarrollado con tecnologías modernas, diseñado específicamente para la gestión de tours a las Islas Ballestas.

## 🚀 Tecnologías

### Backend
- **NestJS** - Framework de Node.js
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos (Neon Serverless)
- **JWT** - Autenticación

### Frontend
- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **CSS Modules** - Estilos

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Pierreyfff/ton.git
cd ton

# Ejecutar configuración automática
chmod +x setup-complete.sh
./setup-complete.sh

# O instalación manual
npm install
cd apps/backend && npm install && npx prisma generate && npx prisma migrate dev
cd ../frontend && npm install
cd ../..