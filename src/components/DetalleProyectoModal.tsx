import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  HeartHandshake,
  Users,
  Calendar,
  Clock,
  GraduationCap,
  FileCode,
  FileText,
  Video,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Vote,
  ShieldCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { AIModal } from './AIModal';
import { getMesesInactividad, getEstadoAbandono, getPorcentajeTerminado } from '../utils/projectUtils';

interface DetalleProyectoModalProps {
  projectId: number;
  onClose: () => void;
}

export const DetalleProyectoModal: React.FC<DetalleProyectoModalProps> = ({
  projectId,
  onClose
}) => {
  const {
    proyectos,
    usuarios,
    maestros,
    integrantes,
    actividades,
    fetchActividadesProyecto,
    archivos,
    votaciones,
    currentUser,
    addActivity,
    toggleActivityStatus,
    voteDonation,
    iniciarVotacionDonacion,
    reassignProjectAdvisor
  } = useApp() as any;

  const [activeTab, setActiveTab] = useState<'info' | 'actividades' | 'archivos' | 'votacion'>('info');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiMode, setAiMode] = useState<'abandono' | 'reasignacion' | 'matching_alumno'>('abandono');
  const [newActivityName, setNewActivityName] = useState('');
  const [alertaVotacionIniciada, setAlertaVotacionIniciada] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchActividadesProyecto(projectId);
    }
  }, [projectId]);

  const proyecto = proyectos.find((p: any) => p.id === projectId);
  if (!proyecto) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full text-center space-y-3">
          <p className="text-sm font-bold text-slate-800 dark:text-white">No se encontró el proyecto seleccionado en el repositorio.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    );
  }

  const rawMembers = (Array.isArray(proyecto.integrantes) && proyecto.integrantes.length > 0)
    ? proyecto.integrantes
    : integrantes.filter((i: any) => Number(i.proyecto_id) === Number(projectId));

  const memberIdsMap = new Set(rawMembers.map((m: any) => Number(m.usuario_id || m.id || m)));
  if (proyecto.usuario_id && !memberIdsMap.has(Number(proyecto.usuario_id))) {
    rawMembers.unshift({ usuario_id: proyecto.usuario_id });
  }

  const projectMembers = rawMembers.map((m: any) => {
    const targetId = Number(m.usuario_id || m.id || (typeof m === 'number' ? m : 0));
    const foundUser = usuarios.find((u: any) => Number(u.id) === targetId) || (m.nombre ? m : null);
    
    return {
      usuario_id: targetId,
      user: foundUser || {
        id: targetId,
        nombre: m.nombre || `Estudiante #${targetId}`,
        correo: m.correo || '',
        carrera: m.carrera || 'Ingeniería en Sistemas Computacionales',
        semestre: m.semestre || proyecto.semestre || '8ISC21',
        foto_perfil: m.foto_perfil || ''
      }
    };
  });

  const projectActivities = actividades.filter((a: any) => Number(a.proyecto_id) === Number(projectId));
  const projectFiles = archivos.filter((f: any) => Number(f.proyecto_id) === Number(projectId));
  const projectVotes = votaciones.filter((v: any) => Number(v.proyecto_id) === Number(projectId));
  const advisor = maestros.find((m: any) => Number(m.id) === Number(proyecto.maestro_id));

  const myVote = projectVotes.find((v: any) => Number(v.usuario_id) === Number(currentUser.id))?.voto;

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) return;
    await addActivity({
      proyecto_id: projectId,
      nombre: newActivityName.trim(),
      miembro: currentUser.nombre,
      fecha_inicio: new Date().toISOString().substring(0, 10),
      fecha_fin: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().substring(0, 10),
      estado: 'pendiente'
    });
    setNewActivityName('');
    await fetchActividadesProyecto(projectId);
  };

  const openAiWithMode = (mode: 'abandono' | 'reasignacion' | 'matching_alumno') => {
    setAiMode(mode);
    setShowAiModal(true);
  };

  const handleIniciarVotacionNotificar = async () => {
    if (iniciarVotacionDonacion) {
      await iniciarVotacionDonacion(projectId);
    }
    setAlertaVotacionIniciada(true);
    setTimeout(() => setAlertaVotacionIniciada(false), 4000);
  };

  const favorableVotes = projectVotes.filter((v: any) => v.voto === 'a_favor').length;
  const totalNeeded = Math.max(1, Math.ceil(projectMembers.length * 0.5));

  const estado = getEstadoAbandono(proyecto);
  const meses = getMesesInactividad(proyecto);
  const pctTerminado = getPorcentajeTerminado(proyecto);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-5 sm:p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {proyecto.asignatura}
            </span>
            <span className="text-xs text-slate-300 px-2 py-0.5 rounded-md bg-slate-800">
              {proyecto.semestre}
            </span>
            {proyecto.es_donado && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Proyecto Donado al Repositorio</span>
              </span>
            )}
            {estado === 'abandonado' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alerta de Abandono (≥ 5 meses sin actividad)</span>
              </span>
            )}
            {estado === 'en_riesgo' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>En Riesgo ({meses} meses sin entregas)</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
            {proyecto.nombre}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 max-w-2xl">
            {proyecto.descripcion}
          </p>

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => openAiWithMode('abandono')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auditar Riesgo de Abandono</span>
            </button>

            <button
              onClick={() => openAiWithMode('reasignacion')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Reasignar Asesor por Temática</span>
            </button>

            <button
              onClick={() => setActiveTab('votacion')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <Vote className="w-3.5 h-3.5 text-teal-400" />
              <span>Votación de Donación ({favorableVotes}/{totalNeeded})</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Información & Equipo
          </button>
          <button
            onClick={() => setActiveTab('actividades')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'actividades'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <span>Actividades & Entregables</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {projectActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('archivos')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'archivos'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <span>Código & Archivos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {projectFiles.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('votacion')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'votacion'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Votación de Donación</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
          
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Fechas de Desarrollo</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {proyecto.fecha_inicio} al {proyecto.fecha_fin}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Inactividad / Commits</span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {proyecto.ultimo_commit || 'Sin commits recientes'}
                  </p>
                  <span className={`text-[10px] font-bold block mt-0.5 ${
                    meses >= 5 ? 'text-rose-600 dark:text-rose-400' : meses >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {meses === 0 ? 'Activo este mes' : `${meses} meses sin subir entregas ${meses >= 5 ? '(Abandono)' : ''}`}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Porcentaje de Terminado</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{pctTerminado}%</span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pctTerminado}%` }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">
                    {proyecto.calificacion !== null ? 'Dictaminado por asesor' : 'En desarrollo'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Estado Académico</span>
                  <p className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-1">
                    {proyecto.calificacion !== null ? `${proyecto.calificacion}% Terminado` : 'Revisión en Proceso'}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {proyecto.calificacion !== null ? 'Dictamen acreditado' : 'Pendiente de dictamen'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800 dark:to-emerald-950/40 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Profesor Asesor Asignado (TESCHI)
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {advisor ? advisor.nombre : 'Sin profesor asesor asignado'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {advisor ? `${advisor.cubo_o_oficina || advisor.cubiculo || 'Cubículo General'} · ${advisor.correo}` : 'Se requiere vincular a un docente'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openAiWithMode('reasignacion')}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Reasignar con IA</span>
                  </button>
                </div>

                {advisor && Array.isArray(advisor.especialidades) && advisor.especialidades.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Especialidades del Asesor:</span>
                    {advisor.especialidades.map((esp, i) => (
                      <span key={i} className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                        {esp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Equipo de Trabajo ({projectMembers.length} integrantes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {projectMembers.map((m: any, idx: number) => {
                    const isLeader = Number(m.usuario_id) === Number(proyecto.usuario_id);
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                        <img
                          src={m.user?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={m.user?.nombre || 'Integrante'}
                          className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{m.user?.nombre || 'Estudiante'}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{m.user?.carrera || 'Ingeniería en Sistemas Computacionales'} · {m.user?.semestre || proyecto.semestre}</p>
                        </div>
                        {isLeader && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            Líder
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {Array.isArray(proyecto.tags) && proyecto.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Stack Tecnológico & Etiquetas
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {proyecto.tags.map((tag, i) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'actividades' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateActivity} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar nueva actividad o hito del proyecto..."
                  value={newActivityName}
                  onChange={(e) => setNewActivityName(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </form>

              <div className="space-y-2">
                {projectActivities.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No hay actividades registradas en este proyecto.
                  </p>
                ) : (
                  projectActivities.map((act) => (
                    <div
                      key={act.id}
                      onClick={async () => {
                        await toggleActivityStatus(act.id);
                        await fetchActividadesProyecto(projectId);
                      }}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all flex items-center justify-between cursor-pointer bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        <button className="shrink-0 text-slate-400 hover:text-emerald-600" type="button">
                          {act.estado === 'completada' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500" />
                          )}
                        </button>
                        <div>
                          <p className={`text-xs font-semibold text-slate-800 dark:text-white ${act.estado === 'completada' ? 'line-through text-slate-400' : ''}`}>
                            {act.nombre || act.titulo}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            Responsable: <span className="font-medium text-slate-700 dark:text-slate-300">{act.miembro || 'Equipo'}</span>
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        act.estado === 'completada' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                        act.estado === 'en_progreso' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {act.estado}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'archivos' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Archivos fuente, documentación técnica y video demostrativo.</span>
                <span className="font-bold text-slate-800 dark:text-white">{projectFiles.length} entregables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectFiles.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300 transition-all flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                      {f.tipo === 'codigo' ? (
                        <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      ) : f.tipo === 'video' ? (
                        <Video className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{f.nombre_archivo}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{f.tamano} · {f.fecha_subida}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 rounded-sm">
                      {f.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'votacion' && (
            <div className="space-y-5">
              
              {alertaVotacionIniciada && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Proceso de votación iniciado! Se ha notificado a todos los integrantes para que voten al iniciar sesión.</span>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <HeartHandshake className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                        Proceso de Donación al Repositorio TESCHI
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {proyecto.es_donado
                        ? '¡Proyecto Donado y Transferible a Estudiantes!'
                        : 'Votación Democrática del Equipo en Curso'}
                    </h3>
                  </div>

                  <button
                    onClick={handleIniciarVotacionNotificar}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Iniciar Votación y Notificar a Todos</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  Para que un proyecto abandonado o finalizado pueda ser donado al repositorio general de alumnos de 7mo a 9no semestre, al menos el 50% de los integrantes originales deben votar favorablemente.
                </p>

                {!proyecto.es_donado && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Tu voto actual: <span className="font-bold uppercase text-slate-900 dark:text-white">{myVote || 'Pendiente'}</span>
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => voteDonation(projectId, currentUser.id, 'a_favor')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          myVote === 'a_favor'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        Votar A Favor de Donar
                      </button>
                      <button
                        onClick={() => voteDonation(projectId, currentUser.id, 'en_contra')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          myVote === 'en_contra'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        Votar En Contra
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Registro de Votos del Equipo
                </h4>
                <div className="space-y-2">
                  {projectMembers.map((m: any, idx: number) => {
                    const userId = m.usuario_id;
                    const v = projectVotes.find(vote => Number(vote.usuario_id) === Number(userId));
                    const status = v?.voto || 'pendiente';
                    return (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={m.user?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                            alt={m.user?.nombre || 'Integrante'}
                            className="w-7 h-7 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-white">{m.user?.nombre || 'Estudiante'}</p>
                            <p className="text-[10px] text-slate-400">{v?.fecha_voto || 'Aún no ha votado'}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          status === 'a_favor' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                          status === 'en_contra' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' :
                          'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}>
                          {status === 'a_favor' ? 'A favor' : status === 'en_contra' ? 'En contra' : 'Pendiente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => openAiWithMode('abandono')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Diagnóstico IA</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>

      {showAiModal && (
        <AIModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          proyecto={proyecto}
          defaultMode={aiMode}
        />
      )}
    </div>
  );
};