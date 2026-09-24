import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Proyecto } from '../types';
import {
  Search,
  Plus,
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  Clock,
  Layers,
  GraduationCap,
  Users,
  CheckCircle2,
  Filter,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Trash2,
  User,
  Edit3,
  UserCog,
  Phone,
  Mail,
  MapPin,
  Award,
  Code2
} from 'lucide-react';
import { DetalleProyectoModal } from './DetalleProyectoModal';
import { NuevoProyectoModal } from './NuevoProyectoModal';
import { AIModal } from './AIModal';
import { getMesesInactividad, getEstadoAbandono, getPorcentajeTerminado, getTextoInactividad } from '../utils/projectUtils';

export const MiEspacioView: React.FC = () => {
  const {
    proyectos,
    usuarios,
    maestros,
    integrantes,
    currentUser,
    setShowEditProfileModal,
    deleteProject
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('todos');
  const [selectedSemester, setSelectedSemester] = useState('todos');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<number | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [aiModalProject, setAiModalProject] = useState<Proyecto | null>(null);
  const [aiModalMode, setAiModalMode] = useState<'abandono' | 'reasignacion' | 'matching_alumno'>('abandono');

  const userProjectIds = integrantes
    .filter(i => Number(i.usuario_id) === Number(currentUser.id))
    .map(i => Number(i.proyecto_id));

  const myProjects = proyectos.filter(p => {
    if (p.es_donado) return false;

    const isOwner = Number(p.usuario_id) === Number(currentUser.id);
    const isMemberByRel = userProjectIds.includes(Number(p.id));
    const isMemberInArray = Array.isArray(p.integrantes) && p.integrantes.some((m: any) => Number(m.id || m.usuario_id) === Number(currentUser.id));
    
    return isOwner || isMemberByRel || isMemberInArray;
  });

  const filteredProjects = myProjects.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.asignatura.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === 'todos' || p.asignatura === selectedSubject;
    const matchesSemester = selectedSemester === 'todos' || p.semestre.includes(selectedSemester);

    return matchesSearch && matchesSubject && matchesSemester;
  });

  const activeCount = myProjects.filter(p => getEstadoAbandono(p) === 'activo').length;
  const inRiskCount = myProjects.filter(p => getEstadoAbandono(p) === 'abandonado' || getEstadoAbandono(p) === 'en_riesgo').length;
  const avgProgress = myProjects.length > 0 
    ? Math.round(myProjects.reduce((acc, p) => acc + getPorcentajeTerminado(p), 0) / myProjects.length) 
    : 0;

  const handleOpenAi = (proj: Proyecto, mode: 'abandono' | 'reasignacion') => {
    setAiModalProject(proj);
    setAiModalMode(mode);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome adaptativo para Modo Claro y Oscuro con Logotipo Integrado */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors duration-200">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold mb-3 border border-white/20">
            <GraduationCap className="w-4 h-4" />
            <span>Repositorio Central TESCHI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Bienvenido a tu Espacio Académico, {currentUser.nombre.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 dark:text-slate-300 mt-2 leading-relaxed">
            Gestiona tus proyectos de 7mo a 9no semestre, monitorea su porcentaje de terminado, detecta inactividad y mantén tus entregables al día.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-5">
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Registrar Nuevo Proyecto</span>
            </button>
            <button
              onClick={() => {
                const abandoned = myProjects.find(p => getEstadoAbandono(p) === 'abandonado' || getEstadoAbandono(p) === 'en_riesgo') || myProjects[0];
                if (abandoned) handleOpenAi(abandoned, 'abandono');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs flex items-center space-x-1.5 transition-all border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Escanear Proyectos Inactivos con IA</span>
            </button>
          </div>
        </div>

        {/* LOGOTIPO GRANDE ADAPTADO */}
        <div className="relative z-10 flex items-center justify-center p-3 rounded-2xl bg-black/20 dark:bg-slate-950/40 backdrop-blur-md border border-white/20 shadow-2xl shrink-0">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden flex items-center justify-center p-1 bg-slate-950 border border-emerald-500/50 shadow-inner">
            <img
              src="/logo.jpeg"
              alt="Logo Insignia TESPROY TESCHI"
              className="w-full h-full object-contain mix-blend-screen filter brightness-125 contrast-125"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 via-transparent to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Proyectos en Curso</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{myProjects.length}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">{activeCount} activos este mes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">% de Terminado Promedio</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{avgProgress}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${avgProgress}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Alertas de Abandono (≥5m)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">{inRiskCount}</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">Inactivos o en riesgo</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Materias Vinculadas</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-display">
            {Array.from(new Set(myProjects.map(p => p.asignatura))).length || 4}
          </p>
          <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold mt-0.5">Asignaturas en desarrollo</p>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por proyecto, stack o materia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todas las Asignaturas</option>
            <option value="Sistemas programables">Sistemas Programables</option>
            <option value="Gestion de proyectos">Gestión de Proyectos</option>
            <option value="Inteligencia Artificial">Inteligencia Artificial</option>
            <option value="Ingeniería de Software">Ingeniería de Software</option>
            <option value="Taller de Bases de Datos">Taller de Bases de Datos</option>
            <option value="Titulación">Titulación / Residencia</option>
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="todos">Todos los Semestres</option>
            <option value="7">7mo Semestre</option>
            <option value="8">8vo Semestre</option>
            <option value="9">9no Semestre</option>
          </select>

          <span className="text-xs font-semibold text-slate-400 px-2">
            {filteredProjects.length} proyectos
          </span>
        </div>

      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No se encontraron proyectos</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No hay proyectos que coincidan con los filtros seleccionados o aún no has registrado proyectos para esta materia.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
          >
            Crear un Proyecto Ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredProjects.map((p) => {
            const advisor = maestros.find(m => Number(m.id) === Number(p.maestro_id));
            
            const rawMembers = (Array.isArray(p.integrantes) && p.integrantes.length > 0)
              ? p.integrantes
              : integrantes.filter(i => Number(i.proyecto_id) === Number(p.id));

            const memberIdsMap = new Set(rawMembers.map((m: any) => Number(m.usuario_id || m.id || m)));
            if (p.usuario_id && !memberIdsMap.has(Number(p.usuario_id))) {
              rawMembers.unshift({ usuario_id: p.usuario_id });
            }

            const teamMembers = rawMembers.map((m: any) => {
              const targetId = Number(m.usuario_id || m.id || (typeof m === 'number' ? m : 0));
              const foundUser = usuarios.find(u => Number(u.id) === targetId) || (m.nombre ? m : null);
              return foundUser || {
                nombre: m.nombre || `Estudiante #${targetId}`,
                foto_perfil: m.foto_perfil || ''
              };
            });

            const estado = getEstadoAbandono(p);
            const isAbandoned = estado === 'abandonado';
            const isAtRisk = estado === 'en_riesgo';
            const pctTerminado = getPorcentajeTerminado(p);
            const meses = getMesesInactividad(p);

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3">
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-800 truncate max-w-[170px]">
                      {p.asignatura}
                    </span>

                    {isAbandoned ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center space-x-1 shrink-0">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Abandono (≥5m)</span>
                      </span>
                    ) : isAtRisk ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center space-x-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>En Riesgo ({meses}m)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                        Activo
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 font-display">
                      {p.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {p.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">
                      Asesor: <strong className="text-slate-800 dark:text-white">{advisor ? advisor.nombre : 'Sin Asignar'}</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      <span>Porcentaje de Terminado</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-black">{pctTerminado}% Terminado</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pctTerminado >= 80 ? 'bg-emerald-500' :
                          pctTerminado >= 40 ? 'bg-teal-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${pctTerminado}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {teamMembers.slice(0, 4).map((m: any, idx: number) => (
                        <img
                          key={idx}
                          src={m?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={m?.nombre || 'Miembro'}
                          title={m?.nombre}
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                      {teamMembers.length > 4 && (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900">
                          +{teamMembers.length - 4}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {meses === 0 ? 'Activo este mes' : `${meses} ${meses === 1 ? 'mes' : 'meses'} sin subir`}
                    </span>
                  </div>

                </div>

                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenAi(p, 'abandono')}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center space-x-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Auditar IA</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedProjectForDetail(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center space-x-1 transition-all"
                    >
                      <span>Ver Detalle</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {selectedProjectForDetail && (
        <DetalleProyectoModal
          projectId={selectedProjectForDetail}
          onClose={() => setSelectedProjectForDetail(null)}
        />
      )}

      {showNewModal && (
        <NuevoProyectoModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
        />
      )}

      {aiModalProject && (
        <AIModal
          isOpen={!!aiModalProject}
          onClose={() => setAiModalProject(null)}
          proyecto={aiModalProject}
          defaultMode={aiModalMode}
        />
      )}

    </div>
  );
};