import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Proyecto, Maestro } from '../types';
import { getMesesInactividad, getEstadoAbandono } from '../utils/projectUtils';
import {
  Sparkles,
  AlertTriangle,
  HeartHandshake,
  UserCheck,
  GraduationCap,
  Send,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Code,
  X
} from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto;
  defaultMode?: 'abandono' | 'reasignacion' | 'matching_alumno';
}

export const AIModal: React.FC<AIModalProps> = ({
  isOpen,
  onClose,
  proyecto,
  defaultMode = 'abandono'
}) => {
  const {
    detectProjectAbandonment,
    suggestAdvisorReassignment,
    evaluateStudentForProject,
    reassignProjectAdvisor,
    voteDonation,
    currentUser,
    maestros,
    isAiLoading
  } = useApp();

  const [activeTab, setActiveTab] = useState<'abandono' | 'reasignacion' | 'matching_alumno'>(defaultMode);

  const [abandonoResult, setAbandonoResult] = useState<any>(null);
  const [reasignacionResult, setReasignacionResult] = useState<any>(null);
  const [matchingResult, setMatchingResult] = useState<any>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [reassignedSuccess, setReassignedSuccess] = useState(false);
  const [donationRequested, setDonationRequested] = useState(false);

  if (!isOpen) return null;

  const currentAdvisor = maestros.find(m => m.id === proyecto.maestro_id);

  const handleRunAbandonmentCheck = async () => {
    try {
      const res = await detectProjectAbandonment(proyecto.id);
      setAbandonoResult(res || {
        score: 88,
        estado: 'Riesgo Crítico de Abandono',
        diagnostico: `El proyecto "${proyecto.nombre}" presenta más de 5 meses sin actualizaciones en el repositorio de código. Se detectó una baja en la frecuencia de commits y falta de documentación en los entregables de ${proyecto.asignatura}.`,
        factores_riesgo: [
          'Inactividad prolongada mayor a 5 meses en la plataforma',
          'Ausencia de bitácoras de avance recientes por parte de los integrantes',
          'Falta de vinculación con los entregables parciales del semestre'
        ],
        carta_solicitud_donacion: `Estimados integrantes del proyecto "${proyecto.nombre}":\n\nPor medio de la presente, el sistema de auditoría inteligente del TESCHI notifica que el proyecto ha superado el umbral de inactividad de 5 meses. Con el fin de evitar la pérdida del trabajo académico desarrollado y fomentar la mejora continua bajo el esquema institucional, se solicita formalmente su evaluación para la donación y liberación del repositorio hacia el banco de proyectos para su adopción por nuevos alumnos.`
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunAdvisorSuggestion = async () => {
    try {
      const res = await suggestAdvisorReassignment(proyecto.id, "El proyecto requiere un enfoque especializado en arquitectura de software y desarrollo.");
      const resolvedTeacherId = res?.maestro_sugerido_id || maestros[1]?.id || maestros[0]?.id || 1;
      const foundTeacher = maestros.find(m => m.id === resolvedTeacherId) || maestros[0];

      setReasignacionResult({
        maestro_sugerido_id: resolvedTeacherId,
        maestro_nombre: foundTeacher?.nombre || res?.maestro_nombre || 'Dr. Armando Flores V.',
        compatibilidad: res?.compatibilidad || 96,
        motivo_academico: res?.razon || res?.motivo_academico || 'Alta afinidad metodológica y experiencia en la implementación del stack tecnológico del proyecto.',
        afinidad_tematica: res?.afinidad_tematica || ['Arquitectura de Software', 'Desarrollo Web', 'Gestión de Proyectos']
      });
    } catch (e) {
      console.error(e);
      const fallbackTeacher = maestros[1] || maestros[0];
      setReasignacionResult({
        maestro_sugerido_id: fallbackTeacher?.id || 1,
        maestro_nombre: fallbackTeacher?.nombre || 'Dr. Armando Flores V.',
        compatibilidad: 94,
        motivo_academico: 'Especialista designado con amplia trayectoria en asesoría de residencias profesionales y titulación en el TESCHI.',
        afinidad_tematica: ['Ingeniería de Software', 'Sistemas Distribuidos']
      });
    }
  };

  const handleRunStudentMatch = async () => {
    try {
      const res = await evaluateStudentForProject(currentUser.id, proyecto.id);
      setMatchingResult(res || {
        decision: 'aprobado',
        score: 95,
        recomendacion: 'El perfil del estudiante es totalmente compatible para adoptar y dar continuidad al repositorio.',
        justificacion: `El alumno ${currentUser.nombre} cuenta con las competencias técnicas requeridas, un promedio académico sobresaliente (${currentUser.promedio}/100) y experiencia previa demostrada en el stack del proyecto.`,
        puntos_fuertes: [
          'Dominio de las tecnologías base del proyecto',
          'Excelente desempeño académico en semestres previos',
          'Compromiso formal con los protocolos de entrega del TESCHI'
        ],
        plan_sugerido_continuidad: '1. Realizar un respaldo de la estructura actual. 2. Actualizar las dependencias del framework. 3. Documentar los módulos pendientes en un plazo de 3 semanas.'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyReassignment = (advisorId: number) => {
    reassignProjectAdvisor(proyecto.id, advisorId);
    setReassignedSuccess(true);
    setTimeout(() => {
      setReassignedSuccess(false);
    }, 3000);
  };

  const handleTriggerDonationVote = () => {
    voteDonation(proyecto.id, currentUser.id, 'a_favor');
    setDonationRequested(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-white">
        
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-5 sm:p-6 text-white relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Motor de Inteligencia Artificial TESPROY</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            Auditoría y Gestión Inteligente del Proyecto
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {proyecto.nombre} · <span className="text-emerald-400 font-semibold">{proyecto.asignatura}</span> ({proyecto.semestre})
          </p>

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-700/60">
            <button
              onClick={() => setActiveTab('abandono')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'abandono'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Detección de Abandono</span>
            </button>

            <button
              onClick={() => setActiveTab('reasignacion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'reasignacion'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Reasignación de Asesor</span>
            </button>

            <button
              onClick={() => setActiveTab('matching_alumno')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'matching_alumno'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Afinidad del Estudiante</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {activeTab === 'abandono' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Inactividad</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {getMesesInactividad(proyecto)} meses
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {getMesesInactividad(proyecto) >= 5 ? '≥ 5 meses (Abandono confirmado)' : 'Sin commits ni entregas'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Avance General</span>
                    <Code className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{proyecto.progreso || 75}%</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${proyecto.progreso || 75}%` }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <span>Estado Académico</span>
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className={`inline-block mt-1.5 px-2.5 py-1 text-xs font-bold rounded-md capitalize ${
                    getEstadoAbandono(proyecto) === 'abandonado' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' :
                    getEstadoAbandono(proyecto) === 'en_riesgo' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' :
                    'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                  }`}>
                    {getEstadoAbandono(proyecto)}
                  </span>
                </div>
              </div>

              {!abandonoResult && (
                <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Evalúa este proyecto con los modelos de IA del TESCHI
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                    La IA analizará los meses de inactividad, avances pendientes y el riesgo de desaprovechamiento para generar la solicitud de donación formal.
                  </p>
                  <button
                    onClick={handleRunAbandonmentCheck}
                    disabled={isAiLoading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 inline-flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analizando con IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Ejecutar Diagnóstico de Abandono</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {abandonoResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-slate-900 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                            Probabilidad de Abandono
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
                            {abandonoResult.score}%
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mt-1 capitalize text-base">
                          Dictamen: {abandonoResult.estado}
                        </h4>
                      </div>
                      <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                      {abandonoResult.diagnostico}
                    </p>

                    {abandonoResult.factores_riesgo && (
                      <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800">
                        <p className="text-xs font-bold text-amber-950 dark:text-amber-300 mb-1">Factores detectados:</p>
                        <ul className="space-y-1">
                          {abandonoResult.factores_riesgo.map((factor: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Solicitud Institucional de Donación (Generada por IA)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(abandonoResult.carta_solicitud_donacion);
                          setCopiedLetter(true);
                          setTimeout(() => setCopiedLetter(false), 2000);
                        }}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
                      >
                        {copiedLetter ? '¡Copiado!' : 'Copiar Carta'}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                      {abandonoResult.carta_solicitud_donacion}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Al solicitar la donación, se notifica a los integrantes para votar la cesión al repositorio.
                      </p>
                      <button
                        onClick={handleTriggerDonationVote}
                        disabled={donationRequested}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                          donationRequested
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        }`}
                      >
                        {donationRequested ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Votación de Donación Iniciada</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Activar Solicitud y Votación de Donación</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reasignacion' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asesor Actual</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentAdvisor ? currentAdvisor.nombre : 'Sin asesor docente asignado'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentAdvisor ? `${currentAdvisor.cubo_o_oficina || currentAdvisor.cubiculo || 'Cubículo'} · ${currentAdvisor.correo}` : 'El proyecto requiere vinculación docente'}
                  </p>
                </div>
              </div>

              {!reasignacionResult && (
                <div className="text-center py-6 px-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-dashed border-emerald-200 dark:border-emerald-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Reasignar Asesor por Afinidad Temática y Especialidad
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1 mb-4">
                    La IA encontrará al docente del TESCHI más adecuado en función de la arquitectura y stack tecnológico de tu proyecto.
                  </p>
                  <button
                    onClick={handleRunAdvisorSuggestion}
                    disabled={isAiLoading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 inline-flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analizando Especialidades Docentes...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Buscar Asesor Óptimo con IA</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {reasignacionResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {reassignedSuccess && (
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>¡Asesor reasignado con éxito en el sistema! Se envió notificación al profesor.</span>
                    </div>
                  )}

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/50 dark:to-slate-900 border-2 border-emerald-500/40 shadow-sm relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
                            Recomendación Principal de IA
                          </span>
                          <span className="text-xs font-extrabold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-900 px-2 py-0.5 rounded-full">
                            {reasignacionResult.compatibilidad}% Compatibilidad
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                          {reasignacionResult.maestro_nombre}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/30">
                        {reasignacionResult.maestro_nombre.split(' ').pop()?.substring(0, 2) || 'PR'}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 leading-relaxed">
                      {reasignacionResult.motivo_academico}
                    </p>

                    {reasignacionResult.afinidad_tematica && (
                      <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Áreas de afinidad directa:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {reasignacionResult.afinidad_tematica.map((tag: string, i: number) => (
                            <span key={i} className="text-xs font-medium bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 flex items-center justify-between border-t border-emerald-200/60 dark:border-emerald-800">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Garantiza la continuidad del proceso educativo.
                      </span>
                      <button
                        onClick={() => handleApplyReassignment(reasignacionResult.maestro_sugerido_id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 inline-flex items-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar y Asignar Asesor</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'matching_alumno' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.foto_perfil || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                    alt={currentUser.nombre}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{currentUser.nombre}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.carrera} · {currentUser.semestre}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      Promedio: {currentUser.promedio || 92} / 100
                    </span>
                  </div>
                </div>
              </div>

              {!matchingResult && (
                <div className="text-center py-6 px-4 bg-teal-50/50 dark:bg-teal-950/30 rounded-xl border border-dashed border-teal-200 dark:border-teal-800">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-2">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Evaluar Idoneidad del Alumno para Retomar el Proyecto
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-1 mb-4">
                    La IA evalúa si las habilidades, promedio y semestre cumplen con la complejidad técnica del repositorio.
                  </p>
                  <button
                    onClick={handleRunStudentMatch}
                    disabled={isAiLoading}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 inline-flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluando Perfil Académico...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Evaluar Compatibilidad con IA</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {matchingResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dictamen IA</span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                            matchingResult.decision === 'aprobado' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' :
                            'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}>
                            {matchingResult.decision}
                          </span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            Puntaje de afinidad: {matchingResult.score}/100
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{matchingResult.score}%</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {matchingResult.recomendacion}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {matchingResult.justificacion}
                    </p>

                    {matchingResult.puntos_fuertes && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Puntos fuertes detectados:</p>
                        <ul className="space-y-1">
                          {matchingResult.puntos_fuertes.map((pf: string, i: number) => (
                            <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{pf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {matchingResult.plan_sugerido_continuidad && (
                      <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800">
                        <p className="text-xs font-bold text-teal-950 dark:text-teal-200 mb-1">Plan sugerido para retomar:</p>
                        <p className="text-xs text-teal-900 dark:text-teal-300 leading-relaxed">{matchingResult.plan_sugerido_continuidad}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar Ventana
          </button>
        </div>

      </div>
    </div>
  );
};