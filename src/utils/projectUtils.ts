import { Proyecto } from '../types';

/**
 * Calcula los meses de inactividad de un proyecto conforme a la regla institucional:
 * El abandono se considera a partir de los 5 meses que no se suba nada (commits o entregas).
 */
export const getMesesInactividad = (proyecto: Partial<Proyecto>): number => {
  if (typeof proyecto.meses_inactividad === 'number') {
    return Math.max(0, proyecto.meses_inactividad);
  }

  if (typeof proyecto.dias_inactividad === 'number') {
    return Math.max(0, Math.floor(proyecto.dias_inactividad / 30));
  }

  if (proyecto.ultimo_commit) {
    const commitDate = new Date(proyecto.ultimo_commit);
    if (!isNaN(commitDate.getTime())) {
      const diffMs = Math.max(0, Date.now() - commitDate.getTime());
      return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));
    }
  }

  return 0;
};

/**
 * Determina el estado de abandono del proyecto en meses:
 * - donado: si ya fue donado
 * - abandonado: >= 5 meses sin subir nada
 * - en_riesgo: entre 3 y 4 meses sin subir nada
 * - activo: < 3 meses
 */
export const getEstadoAbandono = (proyecto: Partial<Proyecto>): 'activo' | 'en_riesgo' | 'abandonado' | 'donado' => {
  if (proyecto.es_donado || proyecto.estado_abandono === 'donado') {
    return 'donado';
  }

  const meses = getMesesInactividad(proyecto);
  if (meses >= 5) {
    return 'abandonado';
  }
  if (meses >= 3) {
    return 'en_riesgo';
  }
  return 'activo';
};

/**
 * Devuelve el texto legible de inactividad en meses
 */
export const getTextoInactividad = (proyecto: Partial<Proyecto>): string => {
  const meses = getMesesInactividad(proyecto);
  if (meses === 0) {
    return 'Activo este mes (al corriente)';
  }
  if (meses === 1) {
    return '1 mes sin actividad';
  }
  if (meses >= 5) {
    return `${meses} meses sin entregas (Abandono)`;
  }
  return `${meses} meses sin entregas (En riesgo)`;
};

/**
 * Obtiene el porcentaje de terminado del proyecto (reemplaza la terminología de calificación)
 */
export const getPorcentajeTerminado = (proyecto: Partial<Proyecto>): number => {
  if (typeof proyecto.calificacion === 'number') {
    return Math.min(100, Math.max(0, Math.round(proyecto.calificacion)));
  }
  return Math.min(100, Math.max(0, Math.round(proyecto.progreso || 0)));
};
