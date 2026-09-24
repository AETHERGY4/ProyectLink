import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Proyecto, Maestro, Usuario } from '../types';
import {
  ShieldCheck,
  HeartHandshake,
  Users,
  GraduationCap,
  FolderGit2,
  AlertTriangle,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Send,
  Loader2,
  ChevronRight,
  Filter,
  Eye,
  Trash2
} from 'lucide-react';
import { AIModal } from './AIModal';
import { DetalleProyectoModal } from './DetalleProyectoModal';
import { getMesesInactividad, getEstadoAbandono, getPorcentajeTerminado } from '../utils/projectUtils';

export const AdminPanelView: React.FC = () => {
  const {
    proyectos,
    usuarios,
    maestros,
    solicitudes,
    integrantes,
    deleteProject,
    respondToAdoptionRequest,
    reassignProjectAdvisor,
    voteDonation,
    updateProject
  } = useApp();

  // Tab state: Note that "Proyectos Donados" replaces "Colaboraciones" as requested!
  const [adminTab, setAdminTab] = useState<'donados' | 'auditoria_ia' | 'usuarios' | 'maestros' | 'proyectos'>('donados');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  // AI Modal trigger from admin
  const [aiModalProject, setAiModalProject] = useState<Proyecto | null>(null);
  const [aiModalMode, setAiModalMode] = useState<'abandono' | 'reasignacion' | 'matching_alumno'>('abandono');

  // Stats
  const donatedProjects = proyectos.filter(p => p.es_donado);
  const abandonedProjects = proyectos.filter(p => getEstadoAbandono(p) === 'abandonado' || getEstadoAbandono(p) === 'en_riesgo');
  const pendingRequests = solicitudes.filter(s => s.estado === 'pendiente');

  // Toggle teacher active status (to test AI reassignment when teacher is absent!)
  const [facultyList, setFacultyList] = useState<Maestro[]>(maestros);

  const toggleTeacherAvailability = (teacherId: number) => {
    setFacultyList(prev => prev.map(m => m.id === teacherId ? { ...m, activo: !m.activo } : m));
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Admin Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Coordinación Académica y Servicio Social TESCHI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Panel de Administración del Repositorio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Supervisa el ciclo de vida de los proyectos de 7mo a 9no semestre. Monitorea repositorios donados, ejecuta auditorías de abandono con IA y garantiza la reasignación de asesores docentes por especialidad.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Metric 1: Proyectos Donados (Renamed from Colaboraciones) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Proyectos Donados</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{donatedProjects.length}</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">En banco de continuidad</p>
        </div>

        {/* Metric 2: Abandonados / En Riesgo */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alertas Abandono</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{abandonedProjects.length}</p>
          <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Inactividad ≥ 5 meses</p>
        </div>

        {/* Metric 3: Total Proyectos */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Proyectos Registrados</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{proyectos.length}</p>
          <p className="text-[10px] text-indigo-700 font-semibold mt-0.5">7mo a 9no semestre</p>
        </div>

        {/* Metric 4: Usuarios */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Alumnos Registrados</span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{usuarios.length}</p>
          <p className="text-[10px] text-teal-700 font-semibold mt-0.5">Ingenierías TESCHI</p>
        </div>

        {/* Metric 5: Maestros */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Maestros Asesores</span>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-display">{maestros.length}</p>
          <p className="text-[10px] text-purple-700 font-semibold mt-0.5">Docentes de carrera</p>
        </div>

      </div>

      {/* Navigation Tabs for Admin */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        
        {/* "Proyectos Donados" replacing "Colaboraciones" */}
        <button
          onClick={() => setAdminTab('donados')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            adminTab === 'donados'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Proyectos Donados</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
            {donatedProjects.length}
          </span>
        </button>

        {/* AI Abandonment & Reassignment Center */}
        <button
          onClick={() => setAdminTab('auditoria_ia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            adminTab === 'auditoria_ia'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Auditoría IA & Reasignaciones</span>
        </button>

        {/* Projects Tab */}
        <button
          onClick={() => setAdminTab('proyectos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            adminTab === 'proyectos'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Catálogo de Proyectos</span>
        </button>

        {/* Teachers Tab */}
        <button
          onClick={() => setAdminTab('maestros')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            adminTab === 'maestros'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Maestros & Asesorías</span>
        </button>

        {/* Students Tab */}
        <button
          onClick={() => setAdminTab('usuarios')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            adminTab === 'usuarios'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Alumnos</span>
        </button>
      </div>

      {/* SECTION 1: PROYECTOS DONADOS (EX-COLABORACIONES) */}
      {adminTab === 'donados' && (
        <div className="space-y-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Gestión de Proyectos Donados al TESCHI
              </h3>
              <p className="text-xs text-slate-500">
                Inventario de repositorios donados formalmente mediante consenso del equipo para reasignación académica.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar proyectos donados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Donated Projects Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Proyecto Donado</th>
                    <th className="py-3 px-4">Asignatura</th>
                    <th className="py-3 px-4">Equipo Donante</th>
                    <th className="py-3 px-4">Alumno Asignado Actual</th>
                    <th className="py-3 px-4">Fecha Donación</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donatedProjects
                    .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.asignatura.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((p) => {
                      const originalCreator = usuarios.find(u => u.id === p.usuario_id);
                      const currentAssignee = usuarios.find(u => u.id === p.usuario_id_actual);
                      const advisor = maestros.find(m => m.id === p.maestro_id);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-400">#{p.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900">{p.nombre}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{p.descripcion}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {p.asignatura}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={originalCreator?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                                alt={originalCreator?.nombre}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-medium text-slate-800">{originalCreator?.nombre || `Usuario #${p.usuario_id}`}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {currentAssignee ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                {currentAssignee.nombre}
                              </span>
                            ) : (
                              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                Disponible en Banco
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {p.fecha_donacion || '2025-11-04'}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => setSelectedProjectId(p.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => {
                                setAiModalProject(p);
                                setAiModalMode('reasignacion');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-[11px] transition-colors"
                            >
                              Reasignar Asesor
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Adoption Requests to Approve */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Solicitudes de Alumnos para Adoptar Proyectos Donados</h4>
                <p className="text-xs text-slate-500">Dictámenes generados por el algoritmo de afinidad técnica</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {solicitudes.length} solicitudes registradas
              </span>
            </div>

            <div className="space-y-3">
              {solicitudes.map((sol) => {
                const proj = proyectos.find(p => p.id === sol.proyecto_id);
                const applicant = usuarios.find(u => u.id === sol.usuario_id);

                return (
                  <div key={sol.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={applicant?.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={applicant?.nombre}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">{applicant?.nombre}</h5>
                          <p className="text-xs text-slate-500">
                            {applicant?.carrera} · {applicant?.semestre} · Promedio: <strong>{applicant?.promedio}/100</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          sol.estado === 'aprobado' ? 'bg-emerald-100 text-emerald-800' :
                          sol.estado === 'rechazado' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {sol.estado}
                        </span>

                        {sol.estado === 'pendiente' && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => respondToAdoptionRequest(sol.id, 'aprobado')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors"
                            >
                              Aprobar y Asignar
                            </button>
                            <button
                              onClick={() => respondToAdoptionRequest(sol.id, 'rechazado')}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition-colors"
                            >
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <strong>Proyecto Solicitado:</strong> {proj?.nombre} ({proj?.asignatura})<br />
                      <strong>Mensaje del alumno:</strong> "{sol.mensaje}"
                    </p>

                    {sol.evaluacion_ia && (
                      <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-teal-900">Dictamen IA: </span>
                          <span className="text-teal-800">{sol.evaluacion_ia.justificacion}</span>
                        </div>
                        <span className="font-black text-teal-800 bg-white px-2 py-0.5 rounded-md shadow-2xs shrink-0 ml-2">
                          {sol.evaluacion_ia.score}% Afin
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: AUDITORÍA IA DE ABANDONO Y REASIGNACIÓN */}
      {adminTab === 'auditoria_ia' && (
        <div className="space-y-5">
          
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-2xl text-white shadow-md">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Centro de Automatización Académica TESCHI</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Detección de Proyectos Abandonados y Reasignación Docente
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              El motor de IA inspecciona la tasa de inactividad de commits, actividades sin cerrar y el semestre de origen. Permite activar votaciones de donación masivas y buscar profesores sustitutos de acuerdo al área de especialidad.
            </p>
          </div>

          {/* Abandoned Projects Scan List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Proyectos con Riesgo de Abandono Detectados</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proyectos
                .filter(p => getMesesInactividad(p) >= 3 || getEstadoAbandono(p) === 'abandonado' || getEstadoAbandono(p) === 'en_riesgo')
                .map((p) => {
                  const advisor = maestros.find(m => m.id === p.maestro_id);
                  const meses = getMesesInactividad(p);
                  const isAbandono = meses >= 5;

                  return (
                    <div key={p.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isAbandono ? 'bg-rose-200 text-rose-950' : 'bg-amber-200 text-amber-950'
                          }`}>
                            {meses} meses sin actividad {isAbandono ? '(Abandono)' : '(En riesgo)'}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm mt-1">{p.nombre}</h5>
                          <p className="text-xs text-slate-500">{p.asignatura} ({p.semestre})</p>
                        </div>
                        <AlertTriangle className={`w-5 h-5 shrink-0 ${isAbandono ? 'text-rose-600' : 'text-amber-600'}`} />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-amber-100">
                        {p.diagnostico_ia || 'Inactividad severa detectada por los monitores del repositorio. Se recomienda invitar al equipo a donar el código.'}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-600">
                          Asesor: <strong>{advisor ? advisor.nombre : 'Sin profesor'}</strong>
                        </span>
                        <div className="flex space-x-1.5">
                          <button
                            onClick={() => {
                              setAiModalProject(p);
                              setAiModalMode('abandono');
                            }}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Solicitar Donación
                          </button>
                          <button
                            onClick={() => {
                              setAiModalProject(p);
                              setAiModalMode('reasignacion');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Reasignar Asesor
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: MAESTROS ASESORES */}
      {adminTab === 'maestros' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Directorio de Profesores Asesores del TESCHI
              </h3>
              <p className="text-xs text-slate-500">
                Especialidades temáticas utilizadas por la IA para reasignar proyectos cuando el asesor original se ausenta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyList.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all ${
                  m.activo ? 'bg-white border-slate-200' : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <button
                    onClick={() => toggleTeacherAvailability(m.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      m.activo
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {m.activo ? 'Docente Activo' : 'Ausente / Inactivo'}
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mt-3">{m.nombre}</h4>
                <p className="text-xs text-slate-500">{m.correo}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{m.cubo_o_oficina}</p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Especialidades Temáticas:</span>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(m.especialidades) ? m.especialidades : []).map((esp, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: USUARIOS ESTUDIANTES */}
      {adminTab === 'usuarios' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Alumnos Inscritos en el Repositorio</h3>
            <p className="text-xs text-slate-500">Historial académico, semestres (7mo a 9no) y habilidades para matching de proyectos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Alumno</th>
                  <th className="py-3 px-4">Carrera & Semestre</th>
                  <th className="py-3 px-4">Promedio</th>
                  <th className="py-3 px-4">Habilidades Principales</th>
                  <th className="py-3 px-4">Correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={u.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={u.nombre}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="font-bold text-slate-900">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{u.semestre || '8ISC21'}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{u.promedio}/100</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.habilidades.slice(0, 3).map((h, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-sm">
                            {h}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{u.correo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: TODOS LOS PROYECTOS */}
      {adminTab === 'proyectos' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Catálogo General de Repositorios</h3>
            <span className="text-xs font-semibold text-slate-500">{proyectos.length} proyectos</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nombre del Proyecto</th>
                  <th className="py-3 px-4">Materia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Avance</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proyectos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-400">#{p.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.nombre}</td>
                    <td className="py-3 px-4 text-slate-700">{p.asignatura}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        p.es_donado ? 'bg-purple-100 text-purple-800' :
                        p.estado_abandono === 'abandonado' ? 'bg-rose-100 text-rose-800' :
                        p.estado_abandono === 'en_riesgo' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.es_donado ? 'Donado' : p.estado_abandono}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">{p.progreso}%</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedProjectId(p.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md text-[11px] font-bold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project detail modal */}
      {selectedProjectId && (
        <DetalleProyectoModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* AI Modal */}
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
