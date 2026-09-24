import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Proyecto } from '../types';
import {
  HeartHandshake,
  Sparkles,
  Search,
  UserCheck,
  CheckCircle2,
  Send,
  Loader2,
  X
} from 'lucide-react';
import { DetalleProyectoModal } from './DetalleProyectoModal';

export const ProyectosDonadosView: React.FC = () => {
  const { usuarios, maestros, currentUser, evaluateStudentForProject, proyectosDonadosGlobal, fetchProyectosDonadosGlobal } = useApp();

  const [subTab, setSubTab] = useState<'disponibles' | 'solicitudes' | 'mis_donados'>('disponibles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [misSolicitudes, setMisSolicitudes] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const [adoptingProject, setAdoptingProject] = useState<Proyecto | null>(null);
  const [adoptionMessage, setAdoptionMessage] = useState('');
  const [submittedSolicitud, setSubmittedSolicitud] = useState<any | null>(null);

  const API_URL = 'http://localhost/tesproy/public/api/donaciones.php';

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch(`${API_URL}?action=solicitudes`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const userId = Number(currentUser?.id || 0);
        setMisSolicitudes(data.data.filter((s: any) => userId === 0 || Number(s.usuario_id || 0) === userId));
      } else {
        setMisSolicitudes([]);
      }
    } catch (err) {
      console.error("Error al consultar solicitudes:", err);
      setMisSolicitudes([]);
    }
  };

  useEffect(() => {
    fetchProyectosDonadosGlobal();
    fetchSolicitudes();
  }, [currentUser?.id]);

  const currentUserId = Number(currentUser?.id || 0);

  const dataSource = proyectosDonadosGlobal.length > 0 
    ? proyectosDonadosGlobal 
    : JSON.parse(localStorage.getItem('tesproy_donados_global') || '[]');

  const availableProjects = dataSource.filter((p: Proyecto) => {
    const ownerId = Number(p.usuario_id || 0);
    if (!currentUserId) return true;
    return ownerId !== currentUserId;
  });

  const myDonatedProjects = dataSource.filter((p: Proyecto) => {
    const ownerId = Number(p.usuario_id || 0);
    if (!currentUserId) return false;
    return ownerId === currentUserId;
  });

  const listDisponibles = availableProjects.length > 0 ? availableProjects : dataSource;
  const listMisDonados = myDonatedProjects;

  const activeCategoryList = 
    subTab === 'mis_donados' ? listMisDonados : 
    subTab === 'disponibles' ? listDisponibles : [];

  const filteredProjects = activeCategoryList.filter((p: Proyecto) =>
    (p.nombre && p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.asignatura && p.asignatura.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdoptionModal = (proj: Proyecto) => {
    setAdoptingProject(proj);
    setAdoptionMessage(`Me comprometo formalmente a dar mantenimiento a la arquitectura de este proyecto, actualizar los entregables técnicos y asegurar su continuidad en el TESCHI para evitar el abandono.`);
    setSubmittedSolicitud(null);
  };

  const handleSendAdoption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptingProject || !adoptionMessage.trim()) return;

    setIsSending(true);

    try {
      let aiEval = null;
      try {
        aiEval = await evaluateStudentForProject(currentUserId || 1, adoptingProject.id);
      } catch (e) {
        console.warn("Evaluación IA local", e);
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'solicitar_adopcion',
          proyecto_id: Number(adoptingProject.id),
          usuario_id: currentUserId || 1,
          mensaje: adoptionMessage.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSubmittedSolicitud({ ...data.data, evaluacion_ia: aiEval });
        await fetchSolicitudes();
      } else {
        alert("Error devuelto por MySQL: " + (data.error || "No se pudo registrar la solicitud."));
      }
    } catch (err) {
      console.error("Error enviando solicitud:", err);
      alert("Error de conexión con la base de datos MySQL en XAMPP.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <HeartHandshake className="w-4 h-4" />
            <span>Banco de Proyectos Donados TESCHI (MySQL)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Adopción y Reasignación de Proyectos Donados
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Explora repositorios donados guardados directamente en MySQL. Revisa la compatibilidad por IA y firma tu compromiso de seguimiento.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('disponibles')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            subTab === 'disponibles'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Proyectos Disponibles</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
            subTab === 'disponibles' ? 'bg-emerald-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
          }`}>
            {listDisponibles.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('solicitudes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            subTab === 'solicitudes'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Mis solicitudes en MySQL</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
            subTab === 'solicitudes' ? 'bg-emerald-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
          }`}>
            {misSolicitudes.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('mis_donados')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            subTab === 'mis_donados'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Proyectos Donados por Mi</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${
            subTab === 'mis_donados' ? 'bg-emerald-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
          }`}>
            {listMisDonados.length}
          </span>
        </button>
      </div>

      {(subTab === 'disponibles' || subTab === 'mis_donados') && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por tecnología, nombre o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-12 text-slate-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin mr-2 text-emerald-600" />
              <span>Cargando datos de MySQL...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
              <UserCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay proyectos para mostrar en esta categoría</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredProjects.map((proj: Proyecto) => {
                const originalOwner = usuarios.find(u => Number(u.id) === Number(proj.usuario_id));
                const advisor = maestros.find(m => Number(m.id) === Number(proj.maestro_id));

                return (
                  <div
                    key={proj.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {proj.asignatura || 'PROYECTO INTEGRADOR'}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center space-x-1">
                          <HeartHandshake className="w-3 h-3" />
                          <span>Donado</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 font-display">
                        {proj.nombre}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.descripcion || 'Sin descripción disponible.'}
                      </p>

                      <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Autor Original:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{(proj as any).autor_original_nombre || originalOwner?.nombre || 'Alumno TESCHI'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">Profesor Asesor:</span>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300">{(proj as any).maestro_nombre || advisor?.nombre || 'Por Asignar'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedProjectId(proj.id)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      >
                        Ver Detalles
                      </button>

                      {subTab === 'disponibles' && (
                        <button
                          onClick={() => handleOpenAdoptionModal(proj)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center space-x-1 transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Solicitar Adopción</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {subTab === 'solicitudes' && (
        <div className="space-y-4">
          {misSolicitudes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
              <UserCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay solicitudes registradas en MySQL</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {misSolicitudes.map((sol: any) => (
                <div key={sol.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {sol.asignatura || 'Materia'}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{sol.proyecto_nombre || `Proyecto #${sol.proyecto_id}`}</h4>
                    </div>

                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      sol.estado === 'aprobado' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                      sol.estado === 'rechazado' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300' :
                      'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}>
                      {sol.estado}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <strong className="text-slate-800 dark:text-white">Carta de Compromiso / Mensaje:</strong> "{sol.mensaje}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adoptingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold font-display">Adopción y Compromiso Anti-Abandono (IA Match)</h3>
              </div>
              <button onClick={() => setAdoptingProject(null)} className="p-1.5 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Proyecto a Retomar</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{adoptingProject.nombre}</h4>
              </div>

              {!submittedSolicitud ? (
                <form onSubmit={handleSendAdoption} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Carta de Compromiso y Seguimiento (Obligatorio)
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                      Para prevenir el abandono del repositorio, describe tus habilidades técnicas actuales y tu compromiso explícito de darle continuidad y mantenimiento al proyecto.
                    </p>
                    <textarea
                      rows={4}
                      required
                      value={adoptionMessage}
                      onChange={(e) => setAdoptionMessage(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>La Inteligencia Artificial evaluará tu perfil y tus habilidades para certificar la compatibilidad con este proyecto antes de enviarlo a la base de datos.</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setAdoptingProject(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Evaluando IA y Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Firmar Compromiso y Guardar</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>¡Compromiso y Solicitud Registrados en MySQL!</span>
                    </div>

                    {submittedSolicitud.evaluacion_ia && (
                      <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 space-y-1">
                        <p className="font-bold">Dictamen de Afinidad por IA:</p>
                        <p>Nivel de Compatibilidad: <span className="font-bold text-emerald-700 dark:text-emerald-400">{submittedSolicitud.evaluacion_ia.score}%</span></p>
                        <p className="text-slate-600 dark:text-slate-300 italic">"{submittedSolicitud.evaluacion_ia.justificacion || submittedSolicitud.evaluacion_ia.decision}"</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setAdoptingProject(null);
                        setSubTab('solicitudes');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Ver mis Solicitudes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedProjectId && (
        <DetalleProyectoModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};