export interface Usuario {
  id: number;
  correo: string;
  matricula?: string;
  nombre: string;
  telefono: string;
  ubicacion: string;
  bio: string;
  carrera: string;
  semestre: string;
  promedio: number;
  habilidades: string[];
  foto_perfil?: string;
  rol: 'estudiante' | 'maestro' | 'administrador';
}

export interface Maestro {
  id: number;
  nombre: string;
  correo: string;
  departamento: string;
  especialidades: string[];
  activo: boolean; // para simular cuando el asesor original ya no está presente
  cubo_o_oficina: string;
  carga_actual: number; // número de proyectos que asesora
}

export interface Proyecto {
  id: number;
  usuario_id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  semestre: string;
  asignatura: string;
  fecha_creacion: string;
  ultimo_commit: string;
  maestro_id: number | null;
  calificacion: number | null; // Porcentaje de terminado evaluado (0-100%)
  comentario: string | null;
  es_donado: boolean;
  fecha_donacion: string | null;
  usuario_id_actual: number | null;
  listo_para_donar: boolean;
  progreso: number;
  porcentaje_terminado?: number;
  tags: string[];
  dias_inactividad?: number;
  meses_inactividad?: number;
  estado_abandono?: 'activo' | 'en_riesgo' | 'abandonado' | 'donado';
  diagnostico_ia?: string;
  carrera?: string;
  linea_investigacion?: string;
  objetivo_general?: string;
  resumen_ejecutivo?: string;
  requerimientos_software?: string[] | string;
  requerimientos_hardware?: string[] | string;
  repositorio_url?: string;
  demo_url?: string;
  nivel_riesgo?: 'bajo' | 'medio' | 'alto' | 'critico';
  rubrica_evaluacion?: {
    metodologia: number;
    implementacion: number;
    documentacion: number;
    innovacion: number;
  };
}

export type AgenteIATipo =
  | 'metodologia'
  | 'arquitectura'
  | 'desarrollo'
  | 'qa_seguridad'
  | 'rescate_donacion';

export interface Integrante {
  id: number;
  proyecto_id: number;
  usuario_id: number;
  fecha_agregado: string;
}

export interface Actividad {
  id: number;
  proyecto_id: number;
  nombre: string;
  miembro: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
}

export interface Archivo {
  id: number;
  proyecto_id: number;
  nombre_archivo: string;
  tipo: 'codigo' | 'documento' | 'video' | 'otro';
  tamano: string;
  fecha_subida: string;
}

export interface VotacionDonacion {
  id: number;
  proyecto_id: number;
  usuario_id: number;
  voto: 'a_favor' | 'en_contra' | 'pendiente';
  fecha_voto: string | null;
}

export interface EvaluacionIAAlumno {
  score: number; // 0 a 100
  decision: 'aprobado' | 'condicional' | 'no_recomendado';
  recomendacion: string;
  justificacion: string;
  puntos_fuertes: string[];
  aspectos_a_cubrir: string[];
  plan_sugerido_continuidad: string;
}

export interface SolicitudProyecto {
  id: number;
  proyecto_id: number;
  usuario_id: number;
  mensaje: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fecha_solicitud: string;
  fecha_respuesta: string | null;
  evaluacion_ia?: EvaluacionIAAlumno;
}

export interface ReasignacionMaestroIA {
  maestro_sugerido_id: number;
  maestro_nombre: string;
  compatibilidad: number; // 0 a 100
  motivo_academico: string;
  afinidad_tematica: string[];
  experiencia_relevante: string;
}

export interface Notificacion {
  id: number;
  usuario_id: number;
  tipo: 'votacion' | 'donacion' | 'asignacion' | 'alerta_abandono' | 'sistema' | 'profesor';
  titulo: string;
  mensaje: string;
  proyecto_id: number | null;
  leida: boolean;
  fecha_creacion: string;
}

export interface Administrador {
  id: number;
  correo: string;
  nombre: string;
  estado: number;
}
