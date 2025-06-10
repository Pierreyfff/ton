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
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { SedesModule } from './sedes/sedes.module';
import { ToursModule } from './tours/tours.module';
import { ToursProgramadosModule } from './tours-programados/tours-programados.module';
import { EmbarcacionesModule } from './embarcaciones/embarcaciones.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportesModule } from './reportes/reportes.module';
import { HorariosTourModule } from './horarios-tour/horarios-tour.module';
import { TiposPasajeModule } from './tipos-pasaje/tipos-pasaje.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { CanalesVentaModule } from './canales-venta/canales-venta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SedesModule,
    ToursModule,
    ToursProgramadosModule,
    EmbarcacionesModule,
    ClientesModule,
    ReservasModule,
    DashboardModule,
    ReportesModule,
    HorariosTourModule,
    TiposPasajeModule,
    MetodosPagoModule,
    CanalesVentaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}