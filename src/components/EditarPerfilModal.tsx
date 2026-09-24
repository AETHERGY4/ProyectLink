import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Camera,
  Server,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { Usuario } from '../types';

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATARES_SUGERIDOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
];

const HABILIDADES_SUGERIDAS = [
  'PHP', 'MySQL', 'React', 'TypeScript', 'JavaScript',
  'Python', 'Java', 'Arduino / IoT', 'Git & GitHub',
  'Bases de Datos Relacionales', 'Gestión de Proyectos',
  'Linux / Ubuntu', 'XAMPP / Apache', 'Tailwind CSS', 'Node.js'
];

export const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [nombre, setNombre] = useState(currentUser.nombre);
  const [telefono, setTelefono] = useState(currentUser.telefono || '');
  const [ubicacion, setUbicacion] = useState(currentUser.ubicacion || 'Chimalhuacán, Estado de México');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [carrera, setCarrera] = useState(currentUser.carrera || 'Ingeniería en Sistemas Computacionales');
  const [semestre, setSemestre] = useState(currentUser.semestre || '8ISC21');
  const [promedio, setPromedio] = useState<number>(currentUser.promedio || 85);
  const [fotoPerfil, setFotoPerfil] = useState(currentUser.foto_perfil || '');
  const [habilidades, setHabilidades] = useState<string[]>(currentUser.habilidades || []);
  const [nuevaHabilidad, setNuevaHabilidad] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'datos' | 'academico' | 'habilidades' | 'foto'>('datos');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNombre(currentUser.nombre);
      setTelefono(currentUser.telefono || '');
      setUbicacion(currentUser.ubicacion || 'Chimalhuacán, Estado de México');
      setBio(currentUser.bio || '');
      setCarrera(currentUser.carrera || 'Ingeniería en Sistemas Computacionales');
      setSemestre(currentUser.semestre || '8ISC21');
      setPromedio(currentUser.promedio || 85);
      setFotoPerfil(currentUser.foto_perfil || '');
      setHabilidades(currentUser.habilidades || []);
      setShowSuccess(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF, WEBP, etc.).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setFotoPerfil(dataUrl);
        } else {
          setFotoPerfil(src);
        }
      };
      img.onerror = () => {
        setFotoPerfil(src);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleAddHabilidad = (hab: string) => {
    const trimmed = hab.trim();
    if (trimmed && !habilidades.includes(trimmed)) {
      setHabilidades([...habilidades, trimmed]);
      setNuevaHabilidad('');
    }
  };

  const handleRemoveHabilidad = (hab: string) => {
    setHabilidades(habilidades.filter(h => h !== hab));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData: Partial<Usuario> = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      ubicacion: ubicacion.trim(),
      bio: bio.trim(),
      carrera: carrera.trim(),
      semestre: semestre.trim(),
      promedio: Number(promedio) || 85,
      foto_perfil: fotoPerfil.trim(),
      habilidades
    };

    updateUserProfile(updatedData);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display tracking-tight text-white flex items-center space-x-2">
                <span>Modificar Perfil de Estudiante</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  {currentUser.semestre || '8ISC21'}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Actualiza tus datos de contacto, semestre, promedio y tecnologías para el repositorio TESCHI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('datos')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'datos'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Datos Personales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academico')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'academico'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Semestre y Carrera</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('habilidades')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'habilidades'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Habilidades ({habilidades.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('foto')}
            className={`pb-2.5 px-3 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'foto'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto de Perfil</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* TAB 1: DATOS PERSONALES */}
          {activeTab === 'datos' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-slate-50 dark:from-emerald-950/30 dark:to-slate-800/60 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shadow-xs shrink-0">
                      {fotoPerfil ? (
                        <img
                          src={fotoPerfil}
                          alt={nombre}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-lg font-black text-emerald-800 dark:text-emerald-300 font-display">
                          {nombre.substring(0, 2).toUpperCase() || 'AL'}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      title="Cambiar imagen de perfil"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Foto de Perfil del Alumno</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {fotoPerfil ? 'Tienes una foto personalizada activa' : 'Puedes subir cualquier foto libremente desde tu dispositivo'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagen</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo del Alumno *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Luis Roberto Martínez Gómez"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Correo Institucional / Matrícula (Solo lectura)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={currentUser.correo}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Asignado por Control Escolar TESCHI</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teléfono / WhatsApp de Contacto
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ej. 55 1234 5678"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ubicación / Campus o Municipio
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    placeholder="Ej. Chimalhuacán, Estado de México / Lab. de Cómputo 3"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Biografía / Perfil Académico & Objetivos
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe brevemente tus intereses de desarrollo, proyectos de titulación o residencia profesional..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Esta información ayuda a los docentes asesores y al módulo de IA a asignarte proyectos idóneos.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SEMESTRE Y CARRERA */}
          {activeTab === 'academico' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                <GraduationCap className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p>
                  El sistema TESPROY está enfocado para estudiantes de <strong>7mo, 8vo y 9no semestre</strong> del TESCHI para materias integradoras, residencia profesional y titulación.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Carrera Profesional
                </label>
                <select
                  value={carrera}
                  onChange={(e) => setCarrera(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                >
                  <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales (ISC)</option>
                  <option value="Ingeniería en Tecnologías de la Información">Ingeniería en Tecnologías de la Información (ITI)</option>
                  <option value="Ingeniería Mecatrónica">Ingeniería Mecatrónica</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semestre y Grupo
                  </label>
                  <select
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold"
                  >
                    <option value="7ISC11">7mo Semestre · Grupo 7ISC11</option>
                    <option value="7ISC21">7mo Semestre · Grupo 7ISC21</option>
                    <option value="8ISC11">8vo Semestre · Grupo 8ISC11</option>
                    <option value="8ISC21">8vo Semestre · Grupo 8ISC21</option>
                    <option value="9ISC11">9no Semestre · Grupo 9ISC11 (Residencia Profesional)</option>
                    <option value="9ISC21">9no Semestre · Grupo 9ISC21 (Titulación / Residencia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Promedio Académico Acumulado (0 - 100)
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      min="60"
                      max="100"
                      value={promedio}
                      onChange={(e) => setPromedio(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 font-bold text-slate-800 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Utilizado por la IA para cálculo de afinidad de adopción</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HABILIDADES Y TECNOLOGÍAS */}
          {activeTab === 'habilidades' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Habilidades Actuales del Alumno
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[60px]">
                  {habilidades.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No has agregado tecnologías aún. Agrega una abajo.</span>
                  ) : (
                    habilidades.map((hab, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800"
                      >
                        <span>{hab}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHabilidad(hab)}
                          className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={nuevaHabilidad}
                  onChange={(e) => setNuevaHabilidad(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHabilidad(nuevaHabilidad);
                    }
                  }}
                  placeholder="Escribe una tecnología o herramienta (ej. Docker, Flutter, PostgreSQL)..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddHabilidad(nuevaHabilidad)}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Sugerencias frecuentes para ISC:</p>
                <div className="flex flex-wrap gap-1.5">
                  {HABILIDADES_SUGERIDAS.map((sug, i) => {
                    const isSelected = habilidades.includes(sug);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddHabilidad(sug)}
                        disabled={isSelected}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-default'
                            : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FOTO DE PERFIL */}
          {activeTab === 'foto' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-2.5 ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 scale-[1.01]'
                    : 'border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Sube la foto o imagen que quieras desde tu dispositivo
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Arrastra aquí tu archivo o <span className="text-emerald-700 dark:text-emerald-400 font-bold underline">haz clic para explorar</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Formatos compatibles: JPG, PNG, WEBP, GIF, SVG (sin límite de resolución)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0 shadow-xs">
                    {fotoPerfil ? (
                      <img
                        src={fotoPerfil}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 font-display">
                        {nombre.substring(0, 2).toUpperCase() || 'AL'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
                      <span>Vista Previa Actual</span>
                      {fotoPerfil && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          Foto Cargada
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Se mostrará en el menú superior, en tus proyectos y en las solicitudes de adopción.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Cambiar</span>
                  </button>

                  {fotoPerfil && (
                    <button
                      type="button"
                      onClick={() => setFotoPerfil('')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center space-x-1 transition-colors"
                      title="Quitar foto actual y volver a iniciales"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  O pega una URL de imagen externa (opcional):
                </label>
                <input
                  type="url"
                  value={fotoPerfil}
                  onChange={(e) => setFotoPerfil(e.target.value)}
                  placeholder="https://ejemplo.com/mi-foto.jpg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">O elige un avatar sugerido:</p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATARES_SUGERIDOS.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFotoPerfil(url)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        fotoPerfil === url ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {fotoPerfil === url && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {showSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>¡Perfil de estudiante guardado exitosamente! Los cambios ya se reflejan en tu espacio.</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
              <Server className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sincronizado con API MySQL (api/perfil.php)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};