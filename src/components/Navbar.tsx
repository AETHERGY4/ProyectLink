import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Bell,
  CheckCircle2,
  Users,
  FolderGit2,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  Layers,
  HeartHandshake,
  Bot,
  User,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Award,
  Camera,
  Upload,
  Code2,
  ArrowRight,
  Sun,
  Moon,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentMaestro,
    currentAdmin,
    activeTab,
    setActiveTab,
    notificaciones,
    markNotificationRead,
    markAllNotificationsRead,
    maestros,
    setSelectedProjectId,
    setShowEditProfileModal,
    updateUserProfile,
    logout,
    theme,
    toggleTheme
  } = useApp();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
          updateUserProfile({ foto_perfil: dataUrl });
        } else {
          updateUserProfile({ foto_perfil: src });
        }
      };
      img.onerror = () => {
        updateUserProfile({ foto_perfil: src });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const unreadNotifs = notificaciones.filter(n => !n.leida);

  const handleSelectTab = (tab: 'espacio' | 'equipos' | 'estado' | 'donados' | 'admin' | 'asistente_ia' | 'maestro') => {
    setSelectedProjectId(null);
    setActiveTab(tab);
  };

  const displayName = currentRole === 'maestro'
    ? (currentMaestro?.nombre || 'Docente Asesor')
    : currentRole === 'administrador'
    ? (currentAdmin?.nombre || 'Coordinador TESCHI')
    : (currentUser?.nombre || 'Alumno');

  const displaySubtitle = currentRole === 'maestro'
    ? 'Docente Asesor'
    : currentRole === 'administrador'
    ? 'Admin General'
    : (currentUser?.semestre || '8ISC21');

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand - Ampliado y rediseñado para que luzca grande */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer select-none group py-1"
            onClick={() => handleSelectTab(currentRole === 'maestro' ? 'maestro' : currentRole === 'administrador' ? 'admin' : 'espacio')}
          >
            <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-slate-900/10 dark:from-emerald-500/20 dark:to-slate-900/40 border-2 border-emerald-500/60 shadow-lg flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/logo.jpeg"
                alt="Logo TESPROY TESCHI"
                className="w-full h-full object-contain drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl lg:text-2xl text-slate-900 dark:text-white tracking-tight">ProyecLink</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  TESCHI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Repositorio de Proyectos 7° - 9° Semestre</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {currentRole === 'administrador' && (
              <button
                onClick={() => handleSelectTab('admin')}
                className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-sm ring-1 ring-amber-400/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Administrador</span>
              </button>
            )}

            {currentRole === 'maestro' && (
              <button
                onClick={() => handleSelectTab('maestro')}
                className={`px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center space-x-2 ${
                  activeTab === 'maestro'
                    ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Seguimiento de Proyectos Asignados</span>
              </button>
            )}

            {currentRole === 'estudiante' && (
              <>
                <button
                  onClick={() => handleSelectTab('espacio')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'espacio'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Mi Espacio</span>
                </button>

                <button
                  onClick={() => handleSelectTab('equipos')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'equipos'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Equipos</span>
                </button>

                <button
                  onClick={() => handleSelectTab('estado')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'estado'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Porcentaje de Terminado</span>
                </button>

                <button
                  onClick={() => handleSelectTab('donados')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'donados'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Proyectos Donados</span>
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    IA Match
                  </span>
                </button>

                <button
                  onClick={() => handleSelectTab('asistente_ia')}
                  className={`px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'asistente_ia'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>5 Agentes IA</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Implementación
                  </span>
                </button>
              </>
            )}
          </nav>

          {/* Right side: Theme Toggle, Notifications & User profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              aria-label="Cambiar tema de color"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white">Notificaciones</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                        {unreadNotifs.length} nuevas
                      </span>
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium"
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notificaciones.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No tienes notificaciones pendientes
                      </div>
                    ) : (
                      notificaciones.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-3 flex items-start space-x-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                            !notif.leida ? 'bg-emerald-50/40 dark:bg-emerald-950/40' : ''
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {notif.tipo === 'donacion' ? (
                              <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                <HeartHandshake className="w-4 h-4" />
                              </div>
                            ) : notif.tipo === 'profesor' ? (
                              <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{notif.titulo}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">{notif.mensaje}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.fecha_creacion}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <div className="relative">
              <input
                type="file"
                ref={quickFileInputRef}
                accept="image/*"
                onChange={handleQuickPhotoChange}
                className="hidden"
              />

              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left bg-white dark:bg-slate-900 shadow-2xs"
              >
                <div
                  className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold text-white shadow-2xs shrink-0 ${
                    currentRole === 'maestro'
                      ? 'bg-blue-600'
                      : currentRole === 'administrador'
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-emerald-600'
                  }`}
                >
                  {currentRole === 'estudiante' && currentUser?.foto_perfil ? (
                    <img
                      src={currentUser.foto_perfil}
                      alt={currentUser.nombre}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : currentRole === 'maestro' ? (
                    <UserCheck className="w-4 h-4" />
                  ) : currentRole === 'administrador' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[140px]">{displayName}</p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold capitalize">
                    {displaySubtitle}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-[340px] sm:w-[420px] max-w-[95vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[90vh] overflow-y-auto space-y-3.5">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        Mi Perfil Institucional
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        currentRole === 'maestro'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : currentRole === 'administrador'
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {currentRole === 'maestro' ? 'Docente Asesor' : currentRole === 'administrador' ? 'Administrador TESCHI' : `Alumno (${currentUser?.semestre || '8ISC21'})`}
                    </span>
                  </div>

                  {/* 1. STUDENT PROFILE CARD */}
                  {currentRole === 'estudiante' && currentUser && (
                    <div className="bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3.5">
                      
                      <div className="flex items-start space-x-3.5">
                        <div className="relative group shrink-0">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shadow-xs">
                            {currentUser.foto_perfil ? (
                              <img
                                src={currentUser.foto_perfil}
                                alt={currentUser.nombre}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 font-display">
                                {(currentUser.nombre || 'AL').substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => quickFileInputRef.current?.click()}
                            className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[9px] font-bold"
                            title="Haz clic para subir cualquier imagen libremente desde tu equipo"
                          >
                            <Camera className="w-4 h-4 mb-0.5" />
                            <span>Subir Foto</span>
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display truncate">
                              {currentUser.nombre}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                              {currentUser.semestre || '8ISC21'}
                            </span>
                          </div>

                          <div className="mt-1 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <p className="flex items-center space-x-1.5 truncate">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{currentUser.correo}</span>
                            </p>
                            {currentUser.telefono && (
                              <p className="flex items-center space-x-1.5">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{currentUser.telefono}</span>
                              </p>
                            )}
                            {currentUser.ubicacion && (
                              <p className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{currentUser.ubicacion}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload Shortcut Button */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]">
                        <span className="text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Foto de perfil libre:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => quickFileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center space-x-1 transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{currentUser.foto_perfil ? 'Cambiar imagen' : 'Subir imagen'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          setShowEditProfileModal(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modificar Perfil y Tecnologías</span>
                      </button>

                      {/* Academic Info Grid */}
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Carrera & Especialidad
                          </span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center space-x-1 text-[11px] leading-tight">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{currentUser.carrera || 'Ing. Sistemas Computacionales'}</span>
                          </p>
                        </div>

                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Promedio Ponderado Acumulado
                          </span>
                          <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center space-x-1 text-[11px]">
                            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{currentUser.promedio || 85.0} / 100 pts</span>
                          </p>
                        </div>
                      </div>

                      {/* Stack Tecnológico */}
                      <div className="pt-1.5 border-t border-slate-200/80 dark:border-slate-700">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Stack Tecnológico / Habilidades
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {currentUser.habilidades && currentUser.habilidades.length > 0 ? (
                            currentUser.habilidades.map((hab, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-[10px] border border-slate-200 dark:border-slate-700 shadow-2xs"
                              >
                                {hab}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">Sin habilidades registradas</span>
                          )}
                        </div>
                      </div>

                      {currentUser.bio && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          <span className="font-bold text-slate-800 dark:text-white">Objetivo / Bio: </span>
                          <span>{currentUser.bio}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. TEACHER PROFILE CARD */}
                  {currentRole === 'maestro' && (
                    <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/80 dark:from-blue-950/40 dark:to-slate-900 rounded-2xl p-4 border border-blue-200 dark:border-blue-900/60 shadow-2xs space-y-3.5">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                          {((currentMaestro?.nombre || maestros[0]?.nombre || 'DA').substring(0, 2).toUpperCase())}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {currentMaestro?.nombre || maestros[0]?.nombre}
                          </h3>
                          <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                            {currentMaestro?.departamento || maestros[0]?.departamento || 'División de ISC'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {currentMaestro?.correo || maestros[0]?.correo}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                        <p className="flex items-center space-x-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">Cubículo / Oficina:</span>
                          <span className="text-blue-700 dark:text-blue-400 font-medium">
                            {currentMaestro?.cubo_o_oficina || (currentMaestro as any)?.cubiculo || 'Edificio H - Cubículo 104'}
                          </span>
                        </p>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block mb-1">Especialidades Asignadas:</span>
                          <div className="flex flex-wrap gap-1">
                            {((Array.isArray(currentMaestro?.especialidades) && currentMaestro!.especialidades.length > 0)
                              ? currentMaestro!.especialidades
                              : maestros[0]?.especialidades || ['Gestión de Proyectos', 'Sistemas']).map((esp, i) => (
                              <span key={i} className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-medium px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                                {esp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          handleSelectTab('maestro');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Abrir Panel Asesor Docente</span>
                      </button>
                    </div>
                  )}

                  {/* 3. ADMIN PROFILE CARD */}
                  {currentRole === 'administrador' && (
                    <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 space-y-3 shadow-lg border border-slate-800">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm shadow-md">
                          TESCHI
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-bold text-amber-300">Coordinación de Residencias y Proyectos</h3>
                          <p className="text-[11px] text-slate-300">División de Ingeniería en Sistemas Computacionales</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{currentAdmin?.correo || 'serviciosocial@teschi.edu.mx'}</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 bg-slate-800/90 p-3 rounded-xl border border-slate-700 leading-relaxed">
                        Control total sobre el repositorio institucional: autorizaciones de proyectos, balance de carga docente, validación de calificaciones y gestión de repositorios donados.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          handleSelectTab('admin');
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Abrir Panel de Administración General</span>
                      </button>
                    </div>
                  )}

                  {/* Theme Switcher within Menu */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        {theme === 'dark' ? (
                          <Moon className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Tema visual
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            if (theme !== 'light') toggleTheme();
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center space-x-1 ${
                            theme === 'light'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Sun className="w-3 h-3" />
                          <span>Claro</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (theme !== 'dark') toggleTheme();
                          }}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center space-x-1 ${
                            theme === 'dark'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          <Moon className="w-3 h-3" />
                          <span>Oscuro</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* System & Auth Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleMenu(false);
                        logout();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-rose-200 dark:border-rose-800 shadow-2xs"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 px-1 text-[10px]">
        {currentRole === 'administrador' && (
          <button
            onClick={() => handleSelectTab('admin')}
            className={`flex flex-col items-center py-1 px-4 ${
              activeTab === 'admin' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5 text-amber-500" />
            <span>Administrador</span>
          </button>
        )}

        {currentRole === 'maestro' && (
          <button
            onClick={() => handleSelectTab('maestro')}
            className={`flex flex-col items-center py-1 px-4 ${
              activeTab === 'maestro' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5 text-emerald-600" />
            <span>Proyectos Asignados</span>
          </button>
        )}

        {currentRole === 'estudiante' && (
          <>
            <button
              onClick={() => handleSelectTab('espacio')}
              className={`flex flex-col items-center py-1 px-1.5 ${
                activeTab === 'espacio' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Layers className="w-4 h-4 mb-0.5" />
              <span>Mi Espacio</span>
            </button>

            <button
              onClick={() => handleSelectTab('equipos')}
              className={`flex flex-col items-center py-1 px-1.5 ${
                activeTab === 'equipos' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span>Equipos</span>
            </button>

            <button
              onClick={() => handleSelectTab('estado')}
              className={`flex flex-col items-center py-1 px-1.5 ${
                activeTab === 'estado' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <FileCheck className="w-4 h-4 mb-0.5" />
              <span>% Terminado</span>
            </button>

            <button
              onClick={() => handleSelectTab('donados')}
              className={`flex flex-col items-center py-1 px-1.5 ${
                activeTab === 'donados' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <HeartHandshake className="w-4 h-4 mb-0.5" />
              <span>Donados</span>
            </button>

            <button
              onClick={() => handleSelectTab('asistente_ia')}
              className={`flex flex-col items-center py-1 px-1.5 ${
                activeTab === 'asistente_ia' ? 'text-emerald-800 dark:text-emerald-300 font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Bot className="w-4 h-4 mb-0.5" />
              <span>Tutor IA</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};