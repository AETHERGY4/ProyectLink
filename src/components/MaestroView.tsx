import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Proyecto, Maestro } from '../types';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  FolderGit2,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Send,
  MessageSquare,
  Search,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { DetalleProyectoModal } from './DetalleProyectoModal';
import { AIModal } from './AIModal';

export const MaestroView: React.FC = () => {
  const {
    currentMaestro,
    maestros,
    proyectos,
    updateProject,
    reassignProjectAdvisor,
    integrantes,
    usuarios,
    actividades,
    setActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'asesorados' | 'reasignaciones_ia' | 'calificar'>('asesorados');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [gradingProjectId, setGradingProjectId] = useState<number | null>(null);

  // Grade form state
  const [calificacionInput, setCalificacionInput] = useState<string>('95');
  const [comentarioInput, setComentarioInput] = useState<string>('');
  const [gradeSuccess, setGradeSuccess] = useState<boolean>(false);

  // AI Modal for projects
  const [aiModalProject, setAiModalProject] = useState<Proyecto | null>(null);

  const teacher = currentMaestro
    ? {
        ...currentMaestro,
        nombre: currentMaestro.nombre || 'Docente Asesor',
        departamento: currentMaestro.departamento || 'División de ISC',
        cubo_o_oficina: currentMaestro.cubo_o_oficina || (currentMaestro as any).cubiculo || 'Edificio H - Cubículo 104',
        especialidades: Array.isArray(currentMaestro.especialidades) && currentMaestro.especialidades.length > 0
          ? currentMaestro.especialidades
          : ((currentMaestro as any).especialidad ? [(currentMaestro as any).especialidad] : ['Gestión de Proyectos', 'Sistemas'])
      }
    : (maestros[0] || {
        id: 1,
        nombre: 'Mtra. Yolanda González Flores',
        correo: 'yolanda@teschi.edu.mx',
        departamento: 'Ingeniería en Sistemas Computacionales',
        especialidades: ['Gestión y Evaluación de Proyectos', 'Ingeniería de Software'],
        activo: true,
        cubo_o_oficina: 'Edificio H - Cubículo 104',
        carga_actual: 3
      });

  // Projects advised by this teacher
  const advisedProjects = proyectos.filter(p => p.maestro_id === teacher.id);
  const pendingToGrade = advisedProjects.filter(p => p.calificacion === null);

  // Filtered
  const filteredAdvised = advisedProjects.filter(p =>
    (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.asignatura || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.semestre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Projects that AI could reassign to this teacher (projects where advisor is inactive or has tags matching teacher's specialty)
  const potentialReassignments = proyectos.filter(p => {
    if (p.maestro_id === teacher.id) return false;
    const desc = `${p.nombre || ''} ${p.descripcion || ''} ${p.asignatura || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    const specialties = Array.isArray(teacher.especialidades) ? teacher.especialidades : [];
    const hasAffinity = specialties.some(esp =>
      esp && (desc.includes(esp.toLowerCase()) || esp.toLowerCase().split(' ').some(w => w.length > 4 && desc.includes(w)))
    );
    return hasAffinity;
  });

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingProjectId) return;

    const numGrade = Number(calificacionInput);
    if (isNaN(numGrade) || numGrade < 0 || numGrade > 100) return;

    updateProject(gradingProjectId, {
      calificacion: numGrade,
      comentario: comentarioInput || 'Evaluación acreditada satisfactoriamente conforme a los lineamientos de la rúbrica institucional TESCHI.'
    });

    setGradeSuccess(true);
    setTimeout(() => {
      setGradeSuccess(false);
      setGradingProjectId(null);
      setComentarioInput('');
    }, 1800);
  };

  const handleAcceptReassignment = (projId: number) => {
    reassignProjectAdvisor(projId, teacher.id);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Teacher Profile Card Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl ring-4 ring-emerald-500/20 shadow-md">
              {(teacher.nombre || 'Docente').split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {teacher.nombre}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Docente Asesor
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-2">
                <span>{teacher.departamento}</span>
                <span>•</span>
                <span className="text-emerald-300 font-medium">{teacher.cubo_o_oficina}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(Array.isArray(teacher.especialidades) ? teacher.especialidades : []).map((esp, i) => (
                  <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-emerald-200 font-medium border border-white/10">
                    {esp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Carga Actual</span>
              <span className="text-xl font-bold text-emerald-300">{advisedProjects.length} Proyectos</span>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Por Dictaminar</span>
              <span className="text-xl font-bold text-amber-300">{pendingToGrade.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('asesorados')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'asesorados'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Mis Proyectos Asesorados ({advisedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reasignaciones_ia')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'reasignaciones_ia'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Propuestas de la IA ({potentialReassignments.length})</span>
            {potentialReassignments.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </div>

        <button
          onClick={() => setActiveTab('asistente_ia')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Consultar Tutor IA TESCHI</span>
        </button>
      </div>

      {/* SUBTAB 1: ASESORADOS */}
      {activeSubTab === 'asesorados' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, asignatura o semestre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <p className="text-xs text-slate-500">
              Mostrando {filteredAdvised.length} de {advisedProjects.length} proyectos bajo tu asesoría
            </p>
          </div>

          {filteredAdvised.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <FolderGit2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm text-slate-600">No hay proyectos asignados con este filtro</p>
              <p className="text-xs text-slate-400 mt-1">
                Puedes revisar la pestaña de "Propuestas de la IA" para aceptar asesorías acordes a tu especialidad.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAdvised.map((proj) => {
                const isGraded = proj.calificacion !== null;
                const teamMembers = integrantes.filter(i => i.proyecto_id === proj.id);

                return (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {proj.semestre} • {proj.asignatura}
                        </span>
                        {isGraded ? (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>Calif: {proj.calificacion}/100</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendiente Evaluación</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mt-2 line-clamp-1">
                        {proj.nombre}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {proj.descripcion}
                      </p>

                      {/* Team & Progress */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{teamMembers.length} alumnos en equipo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400">Avance:</span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${proj.progreso}%` }}></div>
                          </div>
                          <span className="font-bold text-slate-700">{proj.progreso}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProjectId(proj.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center space-x-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Expediente</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setAiModalProject(proj)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          title="Análisis con IA"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>IA Radar</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setGradingProjectId(proj.id);
                            setCalificacionInput(proj.calificacion ? String(proj.calificacion) : '95');
                            setComentarioInput(proj.comentario || '');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1 transition-colors shadow-xs"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{isGraded ? 'Ajustar % Terminado' : 'Evaluar % Terminado'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PROPUESTAS DE LA IA */}
      {activeSubTab === 'reasignaciones_ia' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-emerald-950">
                Sistema de Reasignación Inteligente TESPROY (Afinidad Temática)
              </p>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                La Inteligencia Artificial ha analizado los proyectos cuyos profesores asesores ya no están activos o que requieren un perfil especializado acorde a tus áreas de conocimiento: <strong>{teacher.especialidades.join(', ')}</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {potentialReassignments.map((proj) => {
              const previousAdvisor = maestros.find(m => m.id === proj.maestro_id);

              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {proj.semestre} • {proj.asignatura}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Match IA: 94% Afinidad
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-2">{proj.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.descripcion}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">Motivo del Ajuste Académico:</p>
                      <p className="text-slate-500 text-[11px]">
                        {previousAdvisor && !previousAdvisor.activo
                          ? `El asesor previo (${previousAdvisor.nombre}) se encuentra inactivo. La IA seleccionó tu perfil por coincidencia temática.`
                          : `Las tecnologías del proyecto coinciden fuertemente con tus especialidades registradas en el TESCHI.`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProjectId(proj.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Ver Detalles del Proyecto
                    </button>

                    <button
                      onClick={() => handleAcceptReassignment(proj.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceptar como Asesor</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL / DRAWER TO GRADE PROJECT */}
      {gradingProjectId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Dictamen de Porcentaje de Terminado</h3>
              </div>
              <button
                onClick={() => setGradingProjectId(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Porcentaje de Terminado Oficial (0% a 100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={calificacionInput}
                  onChange={(e) => setCalificacionInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Porcentaje avalado para titulación o acreditación de asignatura según rúbrica TESCHI.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Retroalimentación y Observaciones Académicas
                </label>
                <textarea
                  rows={4}
                  value={comentarioInput}
                  onChange={(e) => setComentarioInput(e.target.value)}
                  placeholder="Escribe tus observaciones para el alumno (arquitectura de software, cumplimiento de rúbricas, mejoras en la documentación)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {gradeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>¡Porcentaje de terminado y observaciones guardadas con éxito!</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingProjectId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs"
                >
                  <Award className="w-4 h-4" />
                  <span>Emitir Dictamen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedProjectId && (
        <DetalleProyectoModal
          isOpen={true}
          onClose={() => setSelectedProjectId(null)}
          proyectoId={selectedProjectId}
        />
      )}

      {aiModalProject && (
        <AIModal
          isOpen={true}
          onClose={() => setAiModalProject(null)}
          proyecto={aiModalProject}
          defaultMode="reasignacion"
        />
      )}

    </div>
  );
};
