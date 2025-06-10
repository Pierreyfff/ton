/*import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientesModule } from './clientes/clientes.module';
import { SedesModule } from './sedes/sedes.module';
import { ToursModule } from './tours/tours.module';
import { ReservasModule } from './reservas/reservas.module';
import { EmbarcacionesModule } from './embarcaciones/embarcaciones.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientesModule,
    SedesModule,
    ToursModule,
    ReservasModule,
    EmbarcacionesModule,
    PagosModule,
  ],
})
export class AppModule {}*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientesModule } from './clientes/clientes.module';
import { SedesModule } from './sedes/sedes.module';
import { ToursModule } from './tours/tours.module';
import { ToursProgramadosModule } from './tours-programados/tours-programados.module';
import { ReservasModule } from './reservas/reservas.module';
import { EmbarcacionesModule } from './embarcaciones/embarcaciones.module';
import { PagosModule } from './pagos/pagos.module';
import { DashboardModule } from './dashboard/dashboard.module';
//import { ReportesModule } from './reportes/reportes.module';
//import { HorariosModule } from './horarios/horarios.module';
//import { TiposPasajeModule } from './tipos-pasaje/tipos-pasaje.module';
//import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
//import { CanalesVentaModule } from './canales-venta/canales-venta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientesModule,
    SedesModule,
    ToursModule,
    ToursProgramadosModule,
    ReservasModule,
    EmbarcacionesModule,
    PagosModule,
    DashboardModule,
    //ReportesModule,
    //HorariosModule,
    //TiposPasajeModule,
    //MetodosPagoModule,
    //CanalesVentaModule,
  ],
})
export class AppModule {}