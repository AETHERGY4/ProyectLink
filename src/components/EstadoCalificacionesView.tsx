import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { getMesesInactividad, getEstadoAbandono, getPorcentajeTerminado } from '../utils/projectUtils';

export const EstadoCalificacionesView: React.FC = () => {
  const { proyectos, maestros, currentUser, currentRole, currentMaestro, integrantes } = useApp();

  let myProjects: typeof proyectos = [];

  if (currentRole === 'maestro' && currentMaestro) {
    myProjects = proyectos.filter(p => Number(p.maestro_id) === Number(currentMaestro.id) && !p.es_donado);
  } else if (currentRole === 'administrador') {
    myProjects = proyectos.filter(p => !p.es_donado);
  } else {
    const studentId = currentUser?.id;
    if (studentId) {
      const userProjectIds = integrantes
        .filter(i => Number(i.usuario_id) === Number(studentId))
        .map(i => Number(i.proyecto_id));

      myProjects = proyectos.filter(p => 
        !p.es_donado && (Number(p.usuario_id) === Number(studentId) || userProjectIds.includes(Number(p.id)))
      );
    } else {
      myProjects = [];
    }
  }

  const evaluatedProjects = myProjects.filter(p => p.calificacion !== null);
  const pendingProjects = myProjects.filter(p => p.calificacion === null);

  const avgCompletion = myProjects.length > 0
    ? (myProjects.reduce((acc, p) => acc + getPorcentajeTerminado(p), 0) / myProjects.length).toFixed(1)
    : '0.0';

  const bestCompletion = myProjects.length > 0
    ? Math.max(...myProjects.map(p => getPorcentajeTerminado(p))).toFixed(0)
    : '0';

  const excelente = myProjects.filter(p => getPorcentajeTerminado(p) >= 90).length;
  const bueno = myProjects.filter(p => getPorcentajeTerminado(p) >= 80 && getPorcentajeTerminado(p) < 90).length;
  const regular = myProjects.filter(p => getPorcentajeTerminado(p) >= 70 && getPorcentajeTerminado(p) < 80).length;
  const inicial = myProjects.filter(p => getPorcentajeTerminado(p) < 70).length;
  const pendientesDictamen = pendingProjects.length;

  return (
    <div className="space-y-6 pb-12">
      
      <div>
        <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Dictámenes y Avance Curricular</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
          Porcentaje de Terminado de Proyectos
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Avance real y porcentaje de terminado avalado por el asesor docente para materias de 7mo a 9no semestre.
        </p>
      </div>

      {myProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800 ring-4 ring-emerald-50/50 dark:ring-emerald-950/30">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Aún no tienes proyectos registrados
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Tu cuenta está limpia. En cuanto registres o colabores en un proyecto integrador, podrás monitorear aquí su porcentaje de terminado, revisiones y dictamen del docente.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Promedio de Terminado</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{avgCompletion}%</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Avance global del alumno</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dictaminados por Asesor</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                  {evaluatedProjects.length} <span className="text-xs text-slate-400 font-normal">/ {myProjects.length}</span>
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">{pendientesDictamen} pendientes de dictamen oficial</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center space-x-4 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mayor % Terminado</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-display mt-0.5">{bestCompletion}%</p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">Proyecto con mayor avance</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Distribución por Porcentaje de Terminado
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">90% - 100%</p>
                <p className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">{excelente}</p>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Titulación / Listo</span>
              </div>
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
                <p className="text-[11px] font-bold text-teal-800 dark:text-teal-300">80% - 89%</p>
                <p className="text-xl font-black text-teal-900 dark:text-teal-200 mt-0.5">{bueno}</p>
                <span className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">Avanzado</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">70% - 79%</p>
                <p className="text-xl font-black text-amber-900 dark:text-amber-200 mt-0.5">{regular}</p>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">En desarrollo</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
                <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300">&lt; 70%</p>
                <p className="text-xl font-black text-rose-900 dark:text-rose-200 mt-0.5">{inicial}</p>
                <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Fase inicial</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center col-span-2 sm:col-span-1">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Sin Dictamen</p>
                <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">{pendientesDictamen}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">En revisión</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Desglose de Proyectos y Porcentaje Avalado
            </h3>

            <div className="space-y-3">
              {myProjects.map((p) => {
                const advisor = maestros.find(m => Number(m.id) === Number(p.maestro_id));
                const pctTerminado = getPorcentajeTerminado(p);
                const isDictaminado = p.calificacion !== null;
                const meses = getMesesInactividad(p);
                const estado = getEstadoAbandono(p);

                return (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {p.asignatura}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{p.semestre}</span>
                        {estado === 'abandonado' && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Abandono ({meses} meses sin entregas)</span>
                          </span>
                        )}
                        {estado === 'en_riesgo' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>En Riesgo ({meses} meses sin entregas)</span>
                          </span>
                        )}
                        {estado === 'activo' && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {meses === 0 ? 'Activo este mes' : `${meses} meses sin entregas`}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{p.nombre}</h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Asesor Docente: <strong className="text-slate-800 dark:text-slate-200">{advisor ? advisor.nombre : 'Sin asignar'}</strong></span>
                      </p>

                      {p.comentario && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <p><strong className="text-slate-800 dark:text-white">Observaciones del Asesor:</strong> "{p.comentario}"</p>
                        </div>
                      )}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                          {pctTerminado}%
                        </span>
                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                          Porcentaje de Terminado
                        </span>
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1 ${
                          isDictaminado
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {isDictaminado ? 'Dictamen Acreditado' : 'Avance en Desarrollo'}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};