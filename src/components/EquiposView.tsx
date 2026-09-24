import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  FolderGit2,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  Plus,
  Sparkles,
  Award
} from 'lucide-react';
import { DetalleProyectoModal } from './DetalleProyectoModal';
import { NuevoProyectoModal } from './NuevoProyectoModal';
import { getMesesInactividad, getEstadoAbandono, getPorcentajeTerminado } from '../utils/projectUtils';

export const EquiposView: React.FC = () => {
  const {
    proyectos,
    usuarios,
    integrantes,
    actividades,
    currentUser,
    currentRole,
    currentMaestro,
    setIntegrantes
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [addMemberProjectId, setAddMemberProjectId] = useState<number | null>(null);
  const [selectedStudentIdToAdd, setSelectedStudentIdToAdd] = useState<string>('');
  const [memberSuccessMessage, setMemberSuccessMessage] = useState<string | null>(null);

  // Filtrado estricto de equipos excluyendo proyectos donados
  let teamProjects: typeof proyectos = [];

  if (currentRole === 'maestro' && currentMaestro) {
    teamProjects = proyectos.filter(p => Number(p.maestro_id) === Number(currentMaestro.id) && !p.es_donado);
  } else if (currentRole === 'administrador') {
    teamProjects = proyectos.filter(p => !p.es_donado);
  } else {
    const studentId = currentUser?.id;
    if (studentId) {
      const myTeamProjectIds = Array.from(
        new Set([
          ...proyectos.filter(p => Number(p.usuario_id) === Number(studentId)).map(p => p.id),
          ...integrantes.filter(i => Number(i.usuario_id) === Number(studentId)).map(i => i.proyecto_id)
        ])
      );
      teamProjects = proyectos.filter(p => myTeamProjectIds.includes(p.id) && !p.es_donado);
    } else {
      teamProjects = [];
    }
  }

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMemberProjectId || !selectedStudentIdToAdd) return;

    const studentIdNum = Number(selectedStudentIdToAdd);
    const exists = integrantes.some(
      i => Number(i.proyecto_id) === Number(addMemberProjectId) && Number(i.usuario_id) === studentIdNum
    );

    if (exists) {
      alert('Este estudiante ya forma parte del equipo.');
      return;
    }

    const newMemberRecord = {
      id: Date.now(),
      proyecto_id: addMemberProjectId,
      usuario_id: studentIdNum,
      fecha_agregado: new Date().toISOString().substring(0, 10)
    };

    setIntegrantes(prev => [...prev, newMemberRecord]);
    const addedUser = usuarios.find(u => Number(u.id) === studentIdNum);
    setMemberSuccessMessage(`¡${addedUser?.nombre || 'El integrante'} ha sido agregado al equipo con éxito!`);
    setTimeout(() => {
      setMemberSuccessMessage(null);
      setAddMemberProjectId(null);
      setSelectedStudentIdToAdd('');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Colaboración Estudiantil TESCHI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            Equipos y Células de Desarrollo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentRole === 'estudiante'
              ? 'Proyectos donde eres líder o colaborador de equipo. Tu vista es exclusiva y privada.'
              : 'Supervisión de equipos y distribución de integrantes en proyectos de ingeniería.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            {teamProjects.length} {teamProjects.length === 1 ? 'Equipo' : 'Equipos'}
          </span>
          {currentRole === 'estudiante' && (
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Proyecto y Equipo</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Slate Empty State */}
      {teamProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800 ring-4 ring-emerald-50/50 dark:ring-emerald-950/30">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Aún no tienes equipos de proyecto
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Tu cuenta está limpia. En esta sección únicamente aparecerán los equipos de los proyectos en los que participes como titular o colaborador.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar mi Primer Proyecto</span>
            </button>
          </div>
        </div>
      ) : (
        /* Teams List */
        <div className="space-y-6">
          {teamProjects.map((proj) => {
            // --- RESOLUCIÓN ROBUSTA DE INTEGRANTES Y FOTOS EN EQUIPOS ---
            const rawMembers = (Array.isArray(proj.integrantes) && proj.integrantes.length > 0)
              ? proj.integrantes
              : integrantes.filter(i => Number(i.proyecto_id) === Number(proj.id));

            const memberIdsMap = new Set(rawMembers.map((m: any) => Number(m.usuario_id || m.id || m)));
            if (proj.usuario_id && !memberIdsMap.has(Number(proj.usuario_id))) {
              rawMembers.unshift({ usuario_id: proj.usuario_id });
            }

            const members = rawMembers.map((m: any) => {
              const targetId = Number(m.usuario_id || m.id || (typeof m === 'number' ? m : 0));
              const foundUser = usuarios.find(u => Number(u.id) === targetId) || (m.nombre ? m : null);
              return foundUser || {
                id: targetId,
                nombre: m.nombre || `Estudiante #${targetId}`,
                correo: m.correo || '',
                carrera: m.carrera || 'Ingeniería en Sistemas Computacionales',
                semestre: m.semestre || proj.semestre || '8ISC21',
                foto_perfil: m.foto_perfil || ''
              };
            });

            const projectTasks = actividades.filter(a => Number(a.proyecto_id) === Number(proj.id));
            const completedTasks = projectTasks.filter(a => a.estado === 'completada').length;
            const pctTerminado = getPorcentajeTerminado(proj);
            const meses = getMesesInactividad(proj);
            const estado = getEstadoAbandono(proj);
            const isAbandoned = estado === 'abandonado';
            const isAtRisk = estado === 'en_riesgo';

            return (
              <div
                key={proj.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
              >
                {/* Team Card Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                        {proj.asignatura}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{proj.semestre}</span>
                      
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>{pctTerminado}% Terminado</span>
                      </span>

                      {isAbandoned ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Abandono ({meses} meses sin actividad)</span>
                        </span>
                      ) : isAtRisk ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>En Riesgo ({meses} meses sin entregas)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {meses === 0 ? 'Activo este mes' : `${meses} meses sin entregas`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                      {proj.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                      {proj.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
                    <button
                      onClick={() => {
                        setAddMemberProjectId(proj.id);
                        setSelectedStudentIdToAdd('');
                      }}
                      className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Agregar Integrante</span>
                    </button>

                    <button
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Ver Entregables del Equipo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Members grid */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Integrantes del Equipo ({members.length})
                    </h4>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Tareas: {completedTasks} de {projectTasks.length} completadas</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member: any, idx: number) => {
                      const isLeader = Number(member.id || member.usuario_id) === Number(proj.usuario_id);
                      const isCurrentUser = Number(member.id || member.usuario_id) === Number(currentUser?.id);

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                            isCurrentUser
                              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/30 ring-1 ring-emerald-400/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-emerald-300 dark:hover:border-emerald-700'
                          }`}
                        >
                          <img
                            src={member?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                            alt={member?.nombre || 'Integrante'}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {member?.nombre || 'Estudiante'} {isCurrentUser && '(Tú)'}
                              </p>
                              {isLeader && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shrink-0">
                                  Líder
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              Matrícula: {member?.matricula || 'TESCHI'}
                            </p>
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                              {member?.semestre || proj.semestre} · {member?.carrera || 'Ing. en Sistemas'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal to add teammate */}
      {addMemberProjectId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Agregar Compañero al Equipo</h3>
              </div>
              <button
                onClick={() => setAddMemberProjectId(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Selecciona a un alumno del TESCHI:
                </label>
                <select
                  value={selectedStudentIdToAdd}
                  onChange={(e) => setSelectedStudentIdToAdd(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Seleccionar Alumno por Matrícula o Nombre --</option>
                  {usuarios
                    .filter(u => u.rol === 'estudiante')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} - Mat: {u.matricula || 'N/A'} ({u.semestre})
                      </option>
                    ))}
                </select>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
                  El alumno tendrá acceso colaborativo al repositorio y entregables del equipo.
                </span>
              </div>

              {memberSuccessMessage && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{memberSuccessMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddMemberProjectId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudentIdToAdd}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50"
                >
                  Confirmar Integración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProjectId && (
        <DetalleProyectoModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* New Project Modal */}
      {showNewModal && (
        <NuevoProyectoModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
        />
      )}

    </div>
  );
};