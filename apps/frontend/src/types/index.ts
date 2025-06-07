export interface User {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  tipo: 'usuario' | 'cliente';
  sede?: {
    id_sede: number;
    nombre: string;
  };
}

export interface Tour {
  id_tipo_tour: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  cantidad_pasajeros: number;
  url_imagen?: string;
  sede: {
    id_sede: number;
    nombre: string;
    distrito: string;
  };
  tipo_tour_galerias: {
    imagen_url: string;
    descripcion?: string;
  }[];
  tipos_pasaje: TipoPasaje[];
}

export interface TipoPasaje {
  id_tipo_pasaje: number;
  nombre: string;
  costo: number;
  edad?: string;
  es_feriado: boolean;
}

export interface TourProgramado {
  id_tour_programado: number;
  fecha: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: string;
  id_sede: number; // Agregamos esta propiedad
  tipo_tour: Tour;
  embarcacion: {
    nombre: string;
    capacidad: number;
  };
  horario: {
    hora_inicio: string;
    hora_fin: string;
  };
  sede: {
    id_sede: number;
    nombre: string;
    distrito: string;
  };
}

export interface Reserva {
  id_reserva: number;
  fecha_reserva: string;
  total_pagar: number;
  estado: string;
  notas?: string;
  cliente: {
    nombres: string;
    apellidos: string;
    correo?: string;
  };
  tour_programado: {
    fecha: string;
    tipo_tour: {
      nombre: string;
    };
    embarcacion: {
      nombre: string;
    };
    horario: {
      hora_inicio: string;
      hora_fin: string;
    };
  };
  pasajes_cantidad: {
    cantidad: number;
    tipo_pasaje: {
      nombre: string;
      costo: number;
    };
  }[];
}

export interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo?: string;
  eliminado: boolean;
}

export interface Sede {
  id_sede: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  distrito: string;
  provincia?: string;
  pais: string;
  image_url?: string;
  eliminado: boolean;
}

export interface Embarcacion {
  id_embarcacion: number;
  id_sede: number;
  nombre: string;
  capacidad: number;
  descripcion?: string;
  estado: string;
  eliminado: boolean;
  sede: Sede;
}