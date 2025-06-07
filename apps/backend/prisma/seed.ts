import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding...');

  // Crear sede principal
  const sede = await prisma.sede.upsert({
    where: { id_sede: 1 },
    update: {},
    create: {
      nombre: 'Sede Paracas',
      direccion: 'Av. Paracas 123, El Chaco',
      telefono: '056-545678',
      correo: 'paracas@ton.com',
      distrito: 'Paracas',
      provincia: 'Pisco',
      pais: 'Perú',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
    },
  });

  console.log('✅ Sede creada:', sede.nombre);

  // Crear idiomas
  const idiomas = await Promise.all([
    prisma.idioma.upsert({
      where: { nombre: 'Español' },
      update: {},
      create: { nombre: 'Español' },
    }),
    prisma.idioma.upsert({
      where: { nombre: 'Inglés' },
      update: {},
      create: { nombre: 'Inglés' },
    }),
  ]);

  console.log('✅ Idiomas creados');

  // Crear usuarios administradores
  const adminPassword = await bcrypt.hash('admin123', 10);
  const vendedorPassword = await bcrypt.hash('vendedor123', 10);
  const choferPassword = await bcrypt.hash('chofer123', 10);

  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@ton.com' },
    update: {},
    create: {
      id_sede: sede.id_sede,
      nombres: 'Administrador',
      apellidos: 'Principal',
      correo: 'admin@ton.com',
      telefono: '987654321',
      rol: 'ADMIN',
      tipo_de_documento: 'DNI',
      numero_documento: '12345678',
      contrasena: adminPassword,
    },
  });

  const vendedor = await prisma.usuario.upsert({
    where: { correo: 'vendedor@ton.com' },
    update: {},
    create: {
      id_sede: sede.id_sede,
      nombres: 'Carlos',
      apellidos: 'Vendedor',
      correo: 'vendedor@ton.com',
      telefono: '987654322',
      rol: 'VENDEDOR',
      tipo_de_documento: 'DNI',
      numero_documento: '12345679',
      contrasena: vendedorPassword,
    },
  });

  const chofer = await prisma.usuario.upsert({
    where: { correo: 'chofer@ton.com' },
    update: {},
    create: {
      id_sede: sede.id_sede,
      nombres: 'Miguel',
      apellidos: 'Chofer',
      correo: 'chofer@ton.com',
      telefono: '987654323',
      rol: 'CHOFER',
      tipo_de_documento: 'DNI',
      numero_documento: '12345680',
      contrasena: choferPassword,
    },
  });

  console.log('✅ Usuarios creados');

  // Crear embarcaciones
  const embarcaciones = await Promise.all([
    prisma.embarcacion.upsert({
      where: { id_embarcacion: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Lancha Ballestas I',
        capacidad: 30,
        descripcion: 'Lancha moderna con todas las comodidades para el tour',
        estado: 'DISPONIBLE',
      },
    }),
    prisma.embarcacion.upsert({
      where: { id_embarcacion: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Lancha Ballestas II',
        capacidad: 25,
        descripcion: 'Lancha rápida y segura',
        estado: 'DISPONIBLE',
      },
    }),
  ]);

  console.log('✅ Embarcaciones creadas');

  // Crear tipos de tour
  const tipoTour = await prisma.tipoTour.upsert({
    where: { id_tipo_tour: 1 },
    update: {},
    create: {
      id_sede: sede.id_sede,
      nombre: 'Tour Islas Ballestas Clásico',
      descripcion: 'Recorrido completo por las Islas Ballestas, observando lobos marinos, pingüinos y aves',
      duracion_minutos: 120,
      cantidad_pasajeros: 30,
      url_imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
    },
  });

  console.log('✅ Tipo de tour creado');

  // Crear horarios de tour
  const horarioTour = await prisma.horarioTour.upsert({
    where: { id_horario: 1 },
    update: {},
    create: {
      id_tipo_tour: tipoTour.id_tipo_tour,
      id_sede: sede.id_sede,
      hora_inicio: '08:00:00',
      hora_fin: '10:00:00',
      disponible_lunes: true,
      disponible_martes: true,
      disponible_miercoles: true,
      disponible_jueves: true,
      disponible_viernes: true,
      disponible_sabado: true,
      disponible_domingo: true,
    },
  });

  const horarioTour2 = await prisma.horarioTour.upsert({
    where: { id_horario: 2 },
    update: {},
    create: {
      id_tipo_tour: tipoTour.id_tipo_tour,
      id_sede: sede.id_sede,
      hora_inicio: '10:30:00',
      hora_fin: '12:30:00',
      disponible_lunes: true,
      disponible_martes: true,
      disponible_miercoles: true,
      disponible_jueves: true,
      disponible_viernes: true,
      disponible_sabado: true,
      disponible_domingo: true,
    },
  });

  console.log('✅ Horarios de tour creados');

  // Crear tipos de pasaje
  const tiposPasaje = await Promise.all([
    prisma.tipoPasaje.upsert({
      where: { id_tipo_pasaje: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        id_tipo_tour: tipoTour.id_tipo_tour,
        nombre: 'Adulto',
        costo: 35.00,
        edad: 'Mayor de 12 años',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.upsert({
      where: { id_tipo_pasaje: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        id_tipo_tour: tipoTour.id_tipo_tour,
        nombre: 'Niño',
        costo: 20.00,
        edad: '3 a 12 años',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.upsert({
      where: { id_tipo_pasaje: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        id_tipo_tour: tipoTour.id_tipo_tour,
        nombre: 'Adulto Mayor',
        costo: 30.00,
        edad: 'Mayor de 65 años',
        es_feriado: false,
      },
    }),
  ]);

  console.log('✅ Tipos de pasaje creados');

  // Crear métodos de pago
  const metodosPago = await Promise.all([
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo',
      },
    }),
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Tarjeta de Crédito',
        descripcion: 'Visa, MasterCard',
      },
    }),
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Transferencia Bancaria',
        descripcion: 'Transferencia electrónica',
      },
    }),
  ]);

  console.log('✅ Métodos de pago creados');

  // Crear canales de venta
  const canalesVenta = await Promise.all([
    prisma.canalVenta.upsert({
      where: { id_canal: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Web',
        descripcion: 'Reservas a través del sitio web',
      },
    }),
    prisma.canalVenta.upsert({
      where: { id_canal: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Presencial',
        descripcion: 'Ventas directas en oficina',
      },
    }),
    prisma.canalVenta.upsert({
      where: { id_canal: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Teléfono',
        descripcion: 'Reservas telefónicas',
      },
    }),
  ]);

  console.log('✅ Canales de venta creados');

  // Crear tours programados para los próximos días
  const today = new Date();
  const toursPrograms = [];

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(today);
    fecha.setDate(today.getDate() + i);

    try {
      // Tour de la mañana
      const tourManana = await prisma.tourProgramado.create({
        data: {
          id_tipo_tour: tipoTour.id_tipo_tour,
          id_embarcacion: embarcaciones[0].id_embarcacion,
          id_horario: horarioTour.id_horario,
          id_sede: sede.id_sede,
          id_chofer: chofer.id_usuario,
          fecha: fecha,
          cupo_maximo: 30,
          cupo_disponible: 30,
          estado: 'PROGRAMADO',
        },
      });

      toursPrograms.push(tourManana);
    } catch (error) {
      // Ignorar errores de duplicados
      console.log(`Tour de mañana para ${fecha.toDateString()} ya existe`);
    }

    try {
      // Tour del mediodía
      const tourMediodia = await prisma.tourProgramado.create({
        data: {
          id_tipo_tour: tipoTour.id_tipo_tour,
          id_embarcacion: embarcaciones[1].id_embarcacion,
          id_horario: horarioTour2.id_horario,
          id_sede: sede.id_sede,
          id_chofer: chofer.id_usuario,
          fecha: fecha,
          cupo_maximo: 25,
          cupo_disponible: 25,
          estado: 'PROGRAMADO',
        },
      });

      toursPrograms.push(tourMediodia);
    } catch (error) {
      // Ignorar errores de duplicados
      console.log(`Tour de mediodía para ${fecha.toDateString()} ya existe`);
    }
  }

  console.log(`✅ ${toursPrograms.length} tours programados creados`);

  // Crear cliente de ejemplo
  const clientePassword = await bcrypt.hash('cliente123', 10);
  const cliente = await prisma.cliente.upsert({
    where: { correo: 'cliente@example.com' },
    update: {},
    create: {
      tipo_documento: 'DNI',
      numero_documento: '87654321',
      nombres: 'María',
      apellidos: 'Cliente',
      correo: 'cliente@example.com',
      contrasena: clientePassword,
    },
  });

  console.log('✅ Cliente de ejemplo creado');

  console.log('🎉 Seeding completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('👨‍💼 Admin: admin@ton.com / admin123');
  console.log('👨‍💻 Vendedor: vendedor@ton.com / vendedor123');
  console.log('🚗 Chofer: chofer@ton.com / chofer123');
  console.log('👤 Cliente: cliente@example.com / cliente123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });