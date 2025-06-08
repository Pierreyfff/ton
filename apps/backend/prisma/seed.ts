import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding mejorado...');

  // Crear sede principal
  const sede = await prisma.sede.upsert({
    where: { id_sede: 1 },
    update: {},
    create: {
      nombre: 'Paracas Explorer Tours',
      direccion: 'Av. Paracas 123, El Chaco - Paracas',
      telefono: '+51 956 847 123',
      correo: 'info@paracasexplorer.com',
      distrito: 'Paracas',
      provincia: 'Pisco',
      pais: 'Perú',
      image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
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
    prisma.idioma.upsert({
      where: { nombre: 'Francés' },
      update: {},
      create: { nombre: 'Francés' },
    }),
  ]);

  console.log('✅ Idiomas creados');

  // Crear usuarios con roles específicos
  const adminPassword = await bcrypt.hash('admin123', 10);
  const vendedorPassword = await bcrypt.hash('vendedor123', 10);
  const choferPassword = await bcrypt.hash('chofer123', 10);

  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@paracasexplorer.com' },
    update: {},
    create: {
      id_sede: sede.id_sede,
      nombres: 'Roberto',
      apellidos: 'Administrador',
      correo: 'admin@paracasexplorer.com',
      telefono: '+51 987 654 321',
      rol: 'ADMIN',
      nacionalidad: 'Peruana',
      tipo_de_documento: 'DNI',
      numero_documento: '12345678',
      contrasena: adminPassword,
    },
  });

  const vendedores = await Promise.all([
    prisma.usuario.upsert({
      where: { correo: 'carlos@paracasexplorer.com' },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombres: 'Carlos',
        apellidos: 'Mendoza',
        correo: 'carlos@paracasexplorer.com',
        telefono: '+51 987 654 322',
        rol: 'VENDEDOR',
        nacionalidad: 'Peruana',
        tipo_de_documento: 'DNI',
        numero_documento: '12345679',
        contrasena: vendedorPassword,
      },
    }),
    prisma.usuario.upsert({
      where: { correo: 'sofia@paracasexplorer.com' },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombres: 'Sofia',
        apellidos: 'Rodriguez',
        correo: 'sofia@paracasexplorer.com',
        telefono: '+51 987 654 323',
        rol: 'VENDEDOR',
        nacionalidad: 'Peruana',
        tipo_de_documento: 'DNI',
        numero_documento: '12345680',
        contrasena: vendedorPassword,
      },
    }),
  ]);

  const choferes = await Promise.all([
    prisma.usuario.upsert({
      where: { correo: 'miguel@paracasexplorer.com' },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombres: 'Miguel',
        apellidos: 'Vargas',
        correo: 'miguel@paracasexplorer.com',
        telefono: '+51 987 654 324',
        rol: 'CHOFER',
        nacionalidad: 'Peruana',
        tipo_de_documento: 'DNI',
        numero_documento: '12345681',
        contrasena: choferPassword,
      },
    }),
    prisma.usuario.upsert({
      where: { correo: 'jose@paracasexplorer.com' },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombres: 'José',
        apellidos: 'Flores',
        correo: 'jose@paracasexplorer.com',
        telefono: '+51 987 654 325',
        rol: 'CHOFER',
        nacionalidad: 'Peruana',
        tipo_de_documento: 'DNI',
        numero_documento: '12345682',
        contrasena: choferPassword,
      },
    }),
  ]);

  console.log('✅ Usuarios creados');

  // Crear embarcaciones modernas
  const embarcaciones = await Promise.all([
    prisma.embarcacion.upsert({
      where: { id_embarcacion: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Paracas Explorer I',
        capacidad: 35,
        descripcion: 'Embarcación moderna con techo retráctil, asientos acolchados y sistema de audio bilingüe',
        estado: 'DISPONIBLE',
      },
    }),
    prisma.embarcacion.upsert({
      where: { id_embarcacion: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Paracas Explorer II',
        capacidad: 30,
        descripcion: 'Lancha rápida con motores nuevos, chalecos salvavidas y guías certificados',
        estado: 'DISPONIBLE',
      },
    }),
    prisma.embarcacion.upsert({
      where: { id_embarcacion: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Ballestas Premium',
        capacidad: 25,
        descripcion: 'Embarcación VIP con servicio personalizado y refrigerios incluidos',
        estado: 'DISPONIBLE',
      },
    }),
  ]);

  console.log('✅ Embarcaciones creadas');

  // Crear tipos de tour diversos
  const tiposTour = await Promise.all([
    prisma.tipoTour.upsert({
      where: { id_tipo_tour: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Tour Clásico Islas Ballestas',
        descripcion: 'Recorrido tradicional de 2 horas por las Islas Ballestas. Observa lobos marinos, pingüinos de Humboldt, pelícanos y más fauna marina en su hábitat natural.',
        duracion_minutos: 120,
        cantidad_pasajeros: 35,
        url_imagen: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      },
    }),
    prisma.tipoTour.upsert({
      where: { id_tipo_tour: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Tour Premium Ballestas',
        descripcion: 'Experiencia exclusiva con embarcación VIP, guía especializado bilingüe, refrigerios gourmet y tiempo extendido para fotografía profesional.',
        duracion_minutos: 150,
        cantidad_pasajeros: 25,
        url_imagen: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
      },
    }),
    prisma.tipoTour.upsert({
      where: { id_tipo_tour: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Tour Familiar Especial',
        descripcion: 'Tour diseñado especialmente para familias con niños. Incluye actividades educativas, material didáctico y descuentos especiales.',
        duracion_minutos: 105,
        cantidad_pasajeros: 30,
        url_imagen: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
      },
    }),
  ]);

  console.log('✅ Tipos de tour creados');

  // Crear galería de imágenes para los tours
  const galerias = await Promise.all([
    // Galería Tour Clásico
    prisma.tipoTourGaleria.create({
      data: {
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        imagen_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
        descripcion: 'Vista panorámica de las Islas Ballestas',
      },
    }),
    prisma.tipoTourGaleria.create({
      data: {
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        imagen_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
        descripcion: 'Lobos marinos descansando en las rocas',
      },
    }),
    // Galería Tour Premium
    prisma.tipoTourGaleria.create({
      data: {
        id_tipo_tour: tiposTour[1].id_tipo_tour,
        imagen_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
        descripcion: 'Embarcación VIP con servicio exclusivo',
      },
    }),
    // Galería Tour Familiar
    prisma.tipoTourGaleria.create({
      data: {
        id_tipo_tour: tiposTour[2].id_tipo_tour,
        imagen_url: 'https://images.unsplash.com/photo-1594736797933-d0800ba0d14d?w=800&q=80',
        descripcion: 'Familia disfrutando del tour educativo',
      },
    }),
  ]);

  // Crear horarios variados
  const horarios = await Promise.all([
    // Horarios Tour Clásico
    prisma.horarioTour.create({
      data: {
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        id_sede: sede.id_sede,
        hora_inicio: '07:30:00',
        hora_fin: '09:30:00',
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true,
      },
    }),
    prisma.horarioTour.create({
      data: {
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        id_sede: sede.id_sede,
        hora_inicio: '10:00:00',
        hora_fin: '12:00:00',
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true,
      },
    }),
    // Horarios Tour Premium
    prisma.horarioTour.create({
      data: {
        id_tipo_tour: tiposTour[1].id_tipo_tour,
        id_sede: sede.id_sede,
        hora_inicio: '08:00:00',
        hora_fin: '10:30:00',
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true,
      },
    }),
    // Horarios Tour Familiar
    prisma.horarioTour.create({
      data: {
        id_tipo_tour: tiposTour[2].id_tipo_tour,
        id_sede: sede.id_sede,
        hora_inicio: '09:00:00',
        hora_fin: '10:45:00',
        disponible_lunes: false,
        disponible_martes: false,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true,
      },
    }),
  ]);

  console.log('✅ Horarios creados');

  // Crear tipos de pasaje realistas
  const tiposPasaje = await Promise.all([
    // Pasajes Tour Clásico
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        nombre: 'Adulto Nacional',
        costo: 35.00,
        edad: '12 años en adelante',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        nombre: 'Adulto Extranjero',
        costo: 45.00,
        edad: '12 años en adelante',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        nombre: 'Niño Nacional',
        costo: 20.00,
        edad: '3 a 11 años',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[0].id_tipo_tour,
        nombre: 'Niño Extranjero',
        costo: 25.00,
        edad: '3 a 11 años',
        es_feriado: false,
      },
    }),
    // Pasajes Tour Premium
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[1].id_tipo_tour,
        nombre: 'Adulto Premium',
        costo: 80.00,
        edad: '12 años en adelante',
        es_feriado: false,
      },
    }),
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[1].id_tipo_tour,
        nombre: 'Niño Premium',
        costo: 60.00,
        edad: '3 a 11 años',
        es_feriado: false,
      },
    }),
    // Pasajes Tour Familiar
    prisma.tipoPasaje.create({
      data: {
        id_sede: sede.id_sede,
        id_tipo_tour: tiposTour[2].id_tipo_tour,
        nombre: 'Paquete Familiar (2 Adultos + 2 Niños)',
        costo: 100.00,
        edad: 'Familia completa',
        es_feriado: false,
      },
    }),
  ]);

  console.log('✅ Tipos de pasaje creados');

  // Crear métodos de pago modernos
  const metodosPago = await Promise.all([
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 1 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo en soles peruanos',
      },
    }),
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Tarjeta de Crédito/Débito',
        descripcion: 'Visa, MasterCard, American Express',
      },
    }),
    prisma.metodoPago.upsert({
      where: { id_metodo_pago: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Transferencia Bancaria',
        descripcion: 'Transferencia a cuenta BCP o Interbank',
      },
    }),
    prisma.metodoPago.create({
      data: {
        id_sede: sede.id_sede,
        nombre: 'Yape/Plin',
        descripcion: 'Pagos móviles digitales',
      },
    }),
    prisma.metodoPago.create({
      data: {
        id_sede: sede.id_sede,
        nombre: 'PayPal',
        descripcion: 'Pagos internacionales con PayPal',
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
        nombre: 'Sitio Web',
        descripcion: 'Reservas online a través de www.paracasexplorer.com',
      },
    }),
    prisma.canalVenta.upsert({
      where: { id_canal: 2 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'Oficina Paracas',
        descripcion: 'Ventas directas en nuestra oficina de Paracas',
      },
    }),
    prisma.canalVenta.upsert({
      where: { id_canal: 3 },
      update: {},
      create: {
        id_sede: sede.id_sede,
        nombre: 'WhatsApp',
        descripcion: 'Reservas vía WhatsApp +51 956 847 123',
      },
    }),
    prisma.canalVenta.create({
      data: {
        id_sede: sede.id_sede,
        nombre: 'Agencias de Turismo',
        descripcion: 'Venta a través de agencias asociadas',
      },
    }),
  ]);

  console.log('✅ Canales de venta creados');

  // Crear tours programados para los próximos 14 días
  const today = new Date();
  const toursPrograms = [];

  for (let i = 0; i < 14; i++) {
    const fecha = new Date(today);
    fecha.setDate(today.getDate() + i);

    // Tours del día para cada tipo
    for (let tipoTourIndex = 0; tipoTourIndex < tiposTour.length; tipoTourIndex++) {
      const tipoTour = tiposTour[tipoTourIndex];
      const horariosTour = horarios.filter(h => h.id_tipo_tour === tipoTour.id_tipo_tour);
      
      for (let horarioIndex = 0; horarioIndex < horariosTour.length; horarioIndex++) {
        const horario = horariosTour[horarioIndex];
        const embarcacion = embarcaciones[tipoTourIndex % embarcaciones.length];
        const chofer = choferes[Math.floor(Math.random() * choferes.length)];

        try {
          const tourProgramado = await prisma.tourProgramado.create({
            data: {
              id_tipo_tour: tipoTour.id_tipo_tour,
              id_embarcacion: embarcacion.id_embarcacion,
              id_horario: horario.id_horario,
              id_sede: sede.id_sede,
              id_chofer: chofer.id_usuario,
              fecha: fecha,
              cupo_maximo: embarcacion.capacidad,
              cupo_disponible: Math.floor(embarcacion.capacidad * (0.7 + Math.random() * 0.3)), // Entre 70% y 100% disponible
              estado: 'PROGRAMADO',
            },
          });

          toursPrograms.push(tourProgramado);
        } catch (error) {
          // Ignorar errores de duplicados
          console.log(`Tour ya existe para ${fecha.toDateString()}`);
        }
      }
    }
  }

  console.log(`✅ ${toursPrograms.length} tours programados creados`);

  // Crear clientes de ejemplo
  const clientePassword = await bcrypt.hash('cliente123', 10);

  const clientes = await Promise.all([
    prisma.cliente.upsert({
      where: { correo: 'maria.garcia@email.com' },
      update: {},
      create: {
        tipo_documento: 'DNI',
        numero_documento: '87654321',
        nombres: 'María Elena',
        apellidos: 'García López',
        correo: 'maria.garcia@email.com',
        contrasena: clientePassword,
      },
    }),
    prisma.cliente.create({
      data: {
        tipo_documento: 'Pasaporte',
        numero_documento: 'US123456789',
        nombres: 'John',
        apellidos: 'Smith',
        correo: 'john.smith@email.com',
        contrasena: clientePassword,
      },
    }),
    prisma.cliente.create({
      data: {
        tipo_documento: 'DNI',
        numero_documento: '45678912',
        nombres: 'Carlos',
        apellidos: 'Mendoza Ruiz',
        correo: 'carlos.mendoza@email.com',
        contrasena: clientePassword,
      },
    }),
  ]);

  console.log('✅ Clientes de ejemplo creados');

  // Crear algunas reservas de ejemplo
  const reservasEjemplo = [];
  
  for (let i = 0; i < 10; i++) {
    const tourAleatorio = toursPrograms[Math.floor(Math.random() * toursPrograms.length)];
    const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
    const vendedorAleatorio = vendedores[Math.floor(Math.random() * vendedores.length)];
    const canalAleatorio = canalesVenta[Math.floor(Math.random() * canalesVenta.length)];
    
    try {
      const reserva = await prisma.reserva.create({
        data: {
          id_vendedor: vendedorAleatorio.id_usuario,
          id_cliente: clienteAleatorio.id_cliente,
          id_tour_programado: tourAleatorio.id_tour_programado,
          id_canal: canalAleatorio.id_canal,
          id_sede: sede.id_sede,
          total_pagar: 70.00 + Math.random() * 100, // Entre S/70 y S/170
          notas: `Reserva de ejemplo #${i + 1}`,
          estado: ['RESERVADO', 'CONFIRMADO', 'COMPLETADO'][Math.floor(Math.random() * 3)],
        },
      });

      // Crear pasajes para la reserva
      await prisma.pasajesCantidad.create({
        data: {
          id_reserva: reserva.id_reserva,
          id_tipo_pasaje: tiposPasaje[Math.floor(Math.random() * 4)].id_tipo_pasaje, // Solo los primeros 4 (tour clásico)
          cantidad: 1 + Math.floor(Math.random() * 3), // 1 a 3 pasajes
        },
      });

      reservasEjemplo.push(reserva);
    } catch (error) {
      console.log(`Error creando reserva de ejemplo ${i + 1}:`, error.message);
    }
  }

  console.log(`✅ ${reservasEjemplo.length} reservas de ejemplo creadas`);

  console.log('🎉 Seeding mejorado completado exitosamente!');
  console.log('\n📝 Credenciales de acceso:');
  console.log('👨‍💼 Admin: admin@paracasexplorer.com / admin123');
  console.log('👨‍💻 Vendedores:');
  console.log('  - carlos@paracasexplorer.com / vendedor123');
  console.log('  - sofia@paracasexplorer.com / vendedor123');
  console.log('🚗 Choferes:');
  console.log('  - miguel@paracasexplorer.com / chofer123');
  console.log('  - jose@paracasexplorer.com / chofer123');
  console.log('👤 Clientes:');
  console.log('  - maria.garcia@email.com / cliente123');
  console.log('  - john.smith@email.com / cliente123');
  console.log('  - carlos.mendoza@email.com / cliente123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });