-- CreateTable
CREATE TABLE "sede" (
    "id_sede" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(20),
    "correo" VARCHAR(100),
    "distrito" VARCHAR(100) NOT NULL,
    "provincia" VARCHAR(100),
    "pais" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sede_pkey" PRIMARY KEY ("id_sede")
);

-- CreateTable
CREATE TABLE "idioma" (
    "id_idioma" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "idioma_pkey" PRIMARY KEY ("id_idioma")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_sede" INTEGER,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100),
    "telefono" VARCHAR(20),
    "direccion" VARCHAR(255),
    "fecha_nacimiento" DATE,
    "rol" VARCHAR(20) NOT NULL,
    "nacionalidad" VARCHAR(50),
    "tipo_de_documento" VARCHAR(50) NOT NULL,
    "numero_documento" VARCHAR(20) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contrasena" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "usuario_idioma" (
    "id_usuario_idioma" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_idioma" INTEGER NOT NULL,
    "nivel" VARCHAR(20),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_idioma_pkey" PRIMARY KEY ("id_usuario_idioma")
);

-- CreateTable
CREATE TABLE "embarcacion" (
    "id_embarcacion" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "descripcion" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "embarcacion_pkey" PRIMARY KEY ("id_embarcacion")
);

-- CreateTable
CREATE TABLE "tipo_tour" (
    "id_tipo_tour" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "duracion_minutos" INTEGER NOT NULL,
    "cantidad_pasajeros" INTEGER NOT NULL,
    "url_imagen" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_tour_pkey" PRIMARY KEY ("id_tipo_tour")
);

-- CreateTable
CREATE TABLE "tipo_tour_idioma" (
    "id_tipo_tour_idioma" SERIAL NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "id_idioma" INTEGER NOT NULL,
    "nombre_traducido" VARCHAR(100),
    "descripcion_traducida" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_tour_idioma_pkey" PRIMARY KEY ("id_tipo_tour_idioma")
);

-- CreateTable
CREATE TABLE "tipo_tour_galeria" (
    "id_galeria" SERIAL NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "imagen_url" VARCHAR(255) NOT NULL,
    "descripcion" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_tour_galeria_pkey" PRIMARY KEY ("id_galeria")
);

-- CreateTable
CREATE TABLE "horario_tour" (
    "id_horario" SERIAL NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "disponible_lunes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_martes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_miercoles" BOOLEAN NOT NULL DEFAULT false,
    "disponible_jueves" BOOLEAN NOT NULL DEFAULT false,
    "disponible_viernes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_sabado" BOOLEAN NOT NULL DEFAULT false,
    "disponible_domingo" BOOLEAN NOT NULL DEFAULT false,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "horario_tour_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "horario_chofer" (
    "id_horario_chofer" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "disponible_lunes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_martes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_miercoles" BOOLEAN NOT NULL DEFAULT false,
    "disponible_jueves" BOOLEAN NOT NULL DEFAULT false,
    "disponible_viernes" BOOLEAN NOT NULL DEFAULT false,
    "disponible_sabado" BOOLEAN NOT NULL DEFAULT false,
    "disponible_domingo" BOOLEAN NOT NULL DEFAULT false,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "horario_chofer_pkey" PRIMARY KEY ("id_horario_chofer")
);

-- CreateTable
CREATE TABLE "tour_programado" (
    "id_tour_programado" SERIAL NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "id_embarcacion" INTEGER NOT NULL,
    "id_horario" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_chofer" INTEGER,
    "fecha" DATE NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "cupo_disponible" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PROGRAMADO',
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_programado_pkey" PRIMARY KEY ("id_tour_programado")
);

-- CreateTable
CREATE TABLE "metodo_pago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "metodo_pago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "canal_venta" (
    "id_canal" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "canal_venta_pkey" PRIMARY KEY ("id_canal")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "tipo_documento" VARCHAR(50) NOT NULL,
    "numero_documento" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(100),
    "contrasena" VARCHAR(255),
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "tipo_pasaje" (
    "id_tipo_pasaje" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,
    "edad" VARCHAR(50),
    "es_feriado" BOOLEAN NOT NULL DEFAULT false,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tipo_pasaje_pkey" PRIMARY KEY ("id_tipo_pasaje")
);

-- CreateTable
CREATE TABLE "paquete_pasajes" (
    "id_paquete" SERIAL NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_tipo_tour" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "precio_total" DECIMAL(10,2) NOT NULL,
    "es_feriado" BOOLEAN NOT NULL DEFAULT false,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "paquete_pasajes_pkey" PRIMARY KEY ("id_paquete")
);

-- CreateTable
CREATE TABLE "paquete_pasaje_detalle" (
    "id_paquete_detalle" SERIAL NOT NULL,
    "id_paquete" INTEGER NOT NULL,
    "id_tipo_pasaje" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "paquete_pasaje_detalle_pkey" PRIMARY KEY ("id_paquete_detalle")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id_reserva" SERIAL NOT NULL,
    "id_vendedor" INTEGER,
    "id_cliente" INTEGER NOT NULL,
    "id_tour_programado" INTEGER NOT NULL,
    "id_canal" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "id_paquete" INTEGER,
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_pagar" DECIMAL(10,2) NOT NULL,
    "notas" TEXT,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'RESERVADO',
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateTable
CREATE TABLE "pasajes_cantidad" (
    "id_pasajes_cantidad" SERIAL NOT NULL,
    "id_reserva" INTEGER,
    "id_tipo_pasaje" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pasajes_cantidad_pkey" PRIMARY KEY ("id_pasajes_cantidad")
);

-- CreateTable
CREATE TABLE "pago" (
    "id_pago" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "id_canal" INTEGER NOT NULL,
    "id_sede" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PROCESADO',
    "numero_comprobante" VARCHAR(20),
    "url_comprobante" TEXT,
    "eliminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "devolucion_pago" (
    "id_devolucion" SERIAL NOT NULL,
    "id_pago" INTEGER NOT NULL,
    "fecha_devolucion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "motivo" TEXT NOT NULL,
    "monto_devolucion" DECIMAL(10,2) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "observaciones" TEXT,

    CONSTRAINT "devolucion_pago_pkey" PRIMARY KEY ("id_devolucion")
);

-- CreateIndex
CREATE INDEX "sede_nombre_idx" ON "sede"("nombre");

-- CreateIndex
CREATE INDEX "sede_distrito_idx" ON "sede"("distrito");

-- CreateIndex
CREATE INDEX "sede_eliminado_idx" ON "sede"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "idioma_nombre_key" ON "idioma"("nombre");

-- CreateIndex
CREATE INDEX "idioma_nombre_idx" ON "idioma"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE INDEX "usuario_id_sede_idx" ON "usuario"("id_sede");

-- CreateIndex
CREATE INDEX "usuario_rol_idx" ON "usuario"("rol");

-- CreateIndex
CREATE INDEX "usuario_nombres_apellidos_idx" ON "usuario"("nombres", "apellidos");

-- CreateIndex
CREATE INDEX "usuario_tipo_de_documento_numero_documento_idx" ON "usuario"("tipo_de_documento", "numero_documento");

-- CreateIndex
CREATE INDEX "usuario_eliminado_idx" ON "usuario"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_numero_documento_key" ON "usuario"("numero_documento");

-- CreateIndex
CREATE INDEX "usuario_idioma_id_usuario_idx" ON "usuario_idioma"("id_usuario");

-- CreateIndex
CREATE INDEX "usuario_idioma_id_idioma_idx" ON "usuario_idioma"("id_idioma");

-- CreateIndex
CREATE INDEX "usuario_idioma_eliminado_idx" ON "usuario_idioma"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_idioma_id_usuario_id_idioma_key" ON "usuario_idioma"("id_usuario", "id_idioma");

-- CreateIndex
CREATE INDEX "embarcacion_id_sede_idx" ON "embarcacion"("id_sede");

-- CreateIndex
CREATE INDEX "embarcacion_estado_idx" ON "embarcacion"("estado");

-- CreateIndex
CREATE INDEX "embarcacion_eliminado_idx" ON "embarcacion"("eliminado");

-- CreateIndex
CREATE INDEX "tipo_tour_id_sede_idx" ON "tipo_tour"("id_sede");

-- CreateIndex
CREATE INDEX "tipo_tour_eliminado_idx" ON "tipo_tour"("eliminado");

-- CreateIndex
CREATE INDEX "tipo_tour_idioma_id_tipo_tour_idx" ON "tipo_tour_idioma"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "tipo_tour_idioma_id_idioma_idx" ON "tipo_tour_idioma"("id_idioma");

-- CreateIndex
CREATE INDEX "tipo_tour_idioma_eliminado_idx" ON "tipo_tour_idioma"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_tour_idioma_id_tipo_tour_id_idioma_key" ON "tipo_tour_idioma"("id_tipo_tour", "id_idioma");

-- CreateIndex
CREATE INDEX "tipo_tour_galeria_id_tipo_tour_idx" ON "tipo_tour_galeria"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "tipo_tour_galeria_eliminado_idx" ON "tipo_tour_galeria"("eliminado");

-- CreateIndex
CREATE INDEX "horario_tour_id_tipo_tour_idx" ON "horario_tour"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "horario_tour_id_sede_idx" ON "horario_tour"("id_sede");

-- CreateIndex
CREATE INDEX "horario_tour_hora_inicio_idx" ON "horario_tour"("hora_inicio");

-- CreateIndex
CREATE INDEX "horario_tour_eliminado_idx" ON "horario_tour"("eliminado");

-- CreateIndex
CREATE INDEX "horario_chofer_id_usuario_idx" ON "horario_chofer"("id_usuario");

-- CreateIndex
CREATE INDEX "horario_chofer_id_sede_idx" ON "horario_chofer"("id_sede");

-- CreateIndex
CREATE INDEX "horario_chofer_fecha_inicio_fecha_fin_idx" ON "horario_chofer"("fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE INDEX "horario_chofer_eliminado_idx" ON "horario_chofer"("eliminado");

-- CreateIndex
CREATE INDEX "tour_programado_id_tipo_tour_idx" ON "tour_programado"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "tour_programado_id_embarcacion_idx" ON "tour_programado"("id_embarcacion");

-- CreateIndex
CREATE INDEX "tour_programado_id_horario_idx" ON "tour_programado"("id_horario");

-- CreateIndex
CREATE INDEX "tour_programado_id_sede_idx" ON "tour_programado"("id_sede");

-- CreateIndex
CREATE INDEX "tour_programado_id_chofer_idx" ON "tour_programado"("id_chofer");

-- CreateIndex
CREATE INDEX "tour_programado_fecha_idx" ON "tour_programado"("fecha");

-- CreateIndex
CREATE INDEX "tour_programado_estado_idx" ON "tour_programado"("estado");

-- CreateIndex
CREATE INDEX "tour_programado_eliminado_idx" ON "tour_programado"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "tour_programado_id_embarcacion_fecha_id_horario_key" ON "tour_programado"("id_embarcacion", "fecha", "id_horario");

-- CreateIndex
CREATE INDEX "metodo_pago_id_sede_idx" ON "metodo_pago"("id_sede");

-- CreateIndex
CREATE INDEX "metodo_pago_eliminado_idx" ON "metodo_pago"("eliminado");

-- CreateIndex
CREATE INDEX "canal_venta_id_sede_idx" ON "canal_venta"("id_sede");

-- CreateIndex
CREATE INDEX "canal_venta_eliminado_idx" ON "canal_venta"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_correo_key" ON "cliente"("correo");

-- CreateIndex
CREATE INDEX "cliente_nombres_apellidos_idx" ON "cliente"("nombres", "apellidos");

-- CreateIndex
CREATE INDEX "cliente_correo_idx" ON "cliente"("correo");

-- CreateIndex
CREATE INDEX "cliente_eliminado_idx" ON "cliente"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_tipo_documento_numero_documento_key" ON "cliente"("tipo_documento", "numero_documento");

-- CreateIndex
CREATE INDEX "tipo_pasaje_id_sede_idx" ON "tipo_pasaje"("id_sede");

-- CreateIndex
CREATE INDEX "tipo_pasaje_id_tipo_tour_idx" ON "tipo_pasaje"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "tipo_pasaje_es_feriado_idx" ON "tipo_pasaje"("es_feriado");

-- CreateIndex
CREATE INDEX "tipo_pasaje_eliminado_idx" ON "tipo_pasaje"("eliminado");

-- CreateIndex
CREATE INDEX "paquete_pasajes_id_sede_idx" ON "paquete_pasajes"("id_sede");

-- CreateIndex
CREATE INDEX "paquete_pasajes_id_tipo_tour_idx" ON "paquete_pasajes"("id_tipo_tour");

-- CreateIndex
CREATE INDEX "paquete_pasajes_es_feriado_idx" ON "paquete_pasajes"("es_feriado");

-- CreateIndex
CREATE INDEX "paquete_pasajes_eliminado_idx" ON "paquete_pasajes"("eliminado");

-- CreateIndex
CREATE INDEX "paquete_pasaje_detalle_id_paquete_idx" ON "paquete_pasaje_detalle"("id_paquete");

-- CreateIndex
CREATE INDEX "paquete_pasaje_detalle_id_tipo_pasaje_idx" ON "paquete_pasaje_detalle"("id_tipo_pasaje");

-- CreateIndex
CREATE INDEX "paquete_pasaje_detalle_eliminado_idx" ON "paquete_pasaje_detalle"("eliminado");

-- CreateIndex
CREATE UNIQUE INDEX "paquete_pasaje_detalle_id_paquete_id_tipo_pasaje_key" ON "paquete_pasaje_detalle"("id_paquete", "id_tipo_pasaje");

-- CreateIndex
CREATE INDEX "reserva_id_vendedor_idx" ON "reserva"("id_vendedor");

-- CreateIndex
CREATE INDEX "reserva_id_cliente_idx" ON "reserva"("id_cliente");

-- CreateIndex
CREATE INDEX "reserva_id_tour_programado_idx" ON "reserva"("id_tour_programado");

-- CreateIndex
CREATE INDEX "reserva_id_canal_idx" ON "reserva"("id_canal");

-- CreateIndex
CREATE INDEX "reserva_id_sede_idx" ON "reserva"("id_sede");

-- CreateIndex
CREATE INDEX "reserva_id_paquete_idx" ON "reserva"("id_paquete");

-- CreateIndex
CREATE INDEX "reserva_fecha_reserva_idx" ON "reserva"("fecha_reserva");

-- CreateIndex
CREATE INDEX "reserva_estado_idx" ON "reserva"("estado");

-- CreateIndex
CREATE INDEX "reserva_eliminado_idx" ON "reserva"("eliminado");

-- CreateIndex
CREATE INDEX "pasajes_cantidad_id_reserva_idx" ON "pasajes_cantidad"("id_reserva");

-- CreateIndex
CREATE INDEX "pasajes_cantidad_id_tipo_pasaje_idx" ON "pasajes_cantidad"("id_tipo_pasaje");

-- CreateIndex
CREATE INDEX "pasajes_cantidad_eliminado_idx" ON "pasajes_cantidad"("eliminado");

-- CreateIndex
CREATE INDEX "pago_id_reserva_idx" ON "pago"("id_reserva");

-- CreateIndex
CREATE INDEX "pago_id_metodo_pago_idx" ON "pago"("id_metodo_pago");

-- CreateIndex
CREATE INDEX "pago_id_canal_idx" ON "pago"("id_canal");

-- CreateIndex
CREATE INDEX "pago_id_sede_idx" ON "pago"("id_sede");

-- CreateIndex
CREATE INDEX "pago_fecha_pago_idx" ON "pago"("fecha_pago");

-- CreateIndex
CREATE INDEX "pago_estado_idx" ON "pago"("estado");

-- CreateIndex
CREATE INDEX "pago_eliminado_idx" ON "pago"("eliminado");

-- CreateIndex
CREATE INDEX "devolucion_pago_id_pago_idx" ON "devolucion_pago"("id_pago");

-- CreateIndex
CREATE INDEX "devolucion_pago_fecha_devolucion_idx" ON "devolucion_pago"("fecha_devolucion");

-- CreateIndex
CREATE INDEX "devolucion_pago_estado_idx" ON "devolucion_pago"("estado");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_idioma" ADD CONSTRAINT "usuario_idioma_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_idioma" ADD CONSTRAINT "usuario_idioma_id_idioma_fkey" FOREIGN KEY ("id_idioma") REFERENCES "idioma"("id_idioma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embarcacion" ADD CONSTRAINT "embarcacion_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_tour" ADD CONSTRAINT "tipo_tour_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_tour_idioma" ADD CONSTRAINT "tipo_tour_idioma_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_tour_idioma" ADD CONSTRAINT "tipo_tour_idioma_id_idioma_fkey" FOREIGN KEY ("id_idioma") REFERENCES "idioma"("id_idioma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_tour_galeria" ADD CONSTRAINT "tipo_tour_galeria_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario_tour" ADD CONSTRAINT "horario_tour_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario_tour" ADD CONSTRAINT "horario_tour_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario_chofer" ADD CONSTRAINT "horario_chofer_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario_chofer" ADD CONSTRAINT "horario_chofer_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_programado" ADD CONSTRAINT "tour_programado_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_programado" ADD CONSTRAINT "tour_programado_id_embarcacion_fkey" FOREIGN KEY ("id_embarcacion") REFERENCES "embarcacion"("id_embarcacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_programado" ADD CONSTRAINT "tour_programado_id_horario_fkey" FOREIGN KEY ("id_horario") REFERENCES "horario_tour"("id_horario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_programado" ADD CONSTRAINT "tour_programado_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_programado" ADD CONSTRAINT "tour_programado_id_chofer_fkey" FOREIGN KEY ("id_chofer") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metodo_pago" ADD CONSTRAINT "metodo_pago_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canal_venta" ADD CONSTRAINT "canal_venta_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_pasaje" ADD CONSTRAINT "tipo_pasaje_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_pasaje" ADD CONSTRAINT "tipo_pasaje_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquete_pasajes" ADD CONSTRAINT "paquete_pasajes_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquete_pasajes" ADD CONSTRAINT "paquete_pasajes_id_tipo_tour_fkey" FOREIGN KEY ("id_tipo_tour") REFERENCES "tipo_tour"("id_tipo_tour") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquete_pasaje_detalle" ADD CONSTRAINT "paquete_pasaje_detalle_id_paquete_fkey" FOREIGN KEY ("id_paquete") REFERENCES "paquete_pasajes"("id_paquete") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paquete_pasaje_detalle" ADD CONSTRAINT "paquete_pasaje_detalle_id_tipo_pasaje_fkey" FOREIGN KEY ("id_tipo_pasaje") REFERENCES "tipo_pasaje"("id_tipo_pasaje") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_vendedor_fkey" FOREIGN KEY ("id_vendedor") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_tour_programado_fkey" FOREIGN KEY ("id_tour_programado") REFERENCES "tour_programado"("id_tour_programado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "canal_venta"("id_canal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_paquete_fkey" FOREIGN KEY ("id_paquete") REFERENCES "paquete_pasajes"("id_paquete") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pasajes_cantidad" ADD CONSTRAINT "pasajes_cantidad_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pasajes_cantidad" ADD CONSTRAINT "pasajes_cantidad_id_tipo_pasaje_fkey" FOREIGN KEY ("id_tipo_pasaje") REFERENCES "tipo_pasaje"("id_tipo_pasaje") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva"("id_reserva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodo_pago"("id_metodo_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "canal_venta"("id_canal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago" ADD CONSTRAINT "pago_id_sede_fkey" FOREIGN KEY ("id_sede") REFERENCES "sede"("id_sede") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion_pago" ADD CONSTRAINT "devolucion_pago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;
