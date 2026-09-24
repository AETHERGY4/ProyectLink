import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, FolderPlus, Users } from 'lucide-react';

interface NuevoProyectoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NuevoProyectoModal: React.FC<NuevoProyectoModalProps> = ({ isOpen, onClose }) => {
  const { addProject, maestros, usuarios, currentUser, fetchProyectos } = useApp();

  const [nombre, setNombre] = useState('');
  const [asignatura, setAsignatura] = useState('Ingeniería de Software');
  const [semestre, setSemestre] = useState('8ISC21');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().substring(0, 10));
  const [fechaFin, setFechaFin] = useState(new Date(Date.now() + 120 * 24 * 3600 * 1000).toISOString().substring(0, 10));
  
  const [maestroId, setMaestroId] = useState<number | ''>(maestros[0]?.id ? Number(maestros[0].id) : 1);
  const [selectedIntegrantes, setSelectedIntegrantes] = useState<number[]>([currentUser.id]);
  const [tagsInput, setTagsInput] = useState('React, TypeScript, MySQL, API');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleToggleIntegrante = (userId: number) => {
    if (userId === currentUser.id) return;
    setSelectedIntegrantes(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await addProject({
      usuario_id: Number(currentUser.id),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      semestre,
      asignatura,
      maestro_id: maestroId !== '' ? Number(maestroId) : null,
      calificacion: null,
      comentario: null,
      es_donado: false,
      fecha_donacion: null,
      usuario_id_actual: null,
      listo_para_donar: false,
      tags: tags.length > 0 ? tags : ['Proyecto'],
      dias_inactividad: 0,
      meses_inactividad: 0,
      estado_abandono: 'activo',
      integrantes: selectedIntegrantes
    } as any);

    await fetchProyectos();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
        
        <div className="bg-slate-900 dark:bg-slate-950 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">Registrar Nuevo Proyecto</h3>
              <p className="text-xs text-slate-400">Repositorio Académico TESCHI (MySQL)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Sistema de Monitoreo de Calidad de Aire con IoT"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Asignatura
              </label>
              <select
                value={asignatura}
                onChange={(e) => setAsignatura(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Sistemas programables">Sistemas Programables</option>
                <option value="Gestion de proyectos">Gestión de Proyectos</option>
                <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                <option value="Ingeniería de Software">Ingeniería de Software</option>
                <option value="Taller de Bases de Datos">Taller de Bases de Datos</option>
                <option value="Lenguajes y Autómatas II">Lenguajes y Autómatas II</option>
                <option value="Residencia Profesional">Residencia Profesional</option>
                <option value="Titulación">Titulación / Tesina</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Semestre / Grupo
              </label>
              <input
                type="text"
                value={semestre}
                onChange={(e) => setSemestre(e.target.value)}
                placeholder="Ej: 7ISC21, 8ISC21, 9ISC21"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Profesor Asesor (Registrado en Base de Datos)
            </label>
            <select
              value={maestroId}
              onChange={(e) => setMaestroId(e.target.value ? Number(e.target.value) : '')}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">-- Seleccionar Asesor (Opcional) --</option>
              {maestros.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nombre} - Cubículo {m.cubiculo || 'General'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Integrantes del Equipo (Selecciona compañeros)</span>
            </label>
            <div className="max-h-36 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 bg-slate-50 dark:bg-slate-800 space-y-1.5">
              <div className="text-xs text-slate-500 dark:text-slate-300 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg font-medium">
                ✓ {currentUser.nombre} (Tú - Autor principal)
              </div>
              {usuarios
                .filter(u => u.id !== currentUser.id)
                .map(u => {
                  const isSelected = selectedIntegrantes.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleToggleIntegrante(u.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors ${
                        isSelected ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold' : 'hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{u.nombre} ({u.correo})</span>
                      <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Fecha de Entrega
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Descripción General
            </label>
            <textarea
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Objetivos y alcance técnico..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Stack Tecnológico (separado por comas)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ej: Python, FastAPI, Docker"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en MySQL...' : 'Guardar Proyecto'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};