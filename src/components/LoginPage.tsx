import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  UserPlus,
  LogIn,
  CheckCircle2,
  Phone,
  Hash,
  Code
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerStudent } = useApp();

  const [selectedRole, setSelectedRole] = useState<'estudiante' | 'maestro' | 'administrador'>('estudiante');
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regNombre, setRegNombre] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regSemestre, setRegSemestre] = useState('7mo Semestre (7ISC21)');
  const [regTelefono, setRegTelefono] = useState('');
  const [regHabilidades, setRegHabilidades] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectRole = (newRole: 'estudiante' | 'maestro' | 'administrador') => {
    setSelectedRole(newRole);
    setErrorMessage('');
    setSuccessMessage('');
    setShowPassword(false);
    setLoginIdentifier('');
    setLoginPassword('');
  };

  // Manejo estricto del inicio de sesión con la ruta correcta en public/api/login.php
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Por favor ingresa tu correo institucional o matrícula.');
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/tesproy/public/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'login',
          identifier: loginIdentifier.trim(),
          password: loginPassword.trim(),
          rol: selectedRole
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const loggedIn = login(loginIdentifier.trim(), loginPassword.trim(), selectedRole);
        if (!loggedIn) {
          if (data.data && data.data.usuario) {
            useApp().setCurrentUser(data.data.usuario);
          }
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMessage(data.error || 'Credenciales incorrectas o usuario no encontrado en la base de datos.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Error de conexión con el servidor MySQL en XAMPP. Verifica que Apache y MySQL estén activos.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regNombre.trim()) {
      setErrorMessage('Ingresa el nombre completo del alumno.');
      return;
    }

    if (!regCorreo.trim() || !regCorreo.includes('@')) {
      setErrorMessage('Ingresa un correo institucional válido (ej. nombre@teschi.edu.mx).');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden. Verifícalas cuidadosamente.');
      return;
    }

    setIsLoading(true);

    const newUserData = {
      nombre: regNombre.trim(),
      correo: regCorreo.trim(),
      matricula: regMatricula.trim(),
      semestre: regSemestre,
      telefono: regTelefono.trim(),
      habilidades: regHabilidades.trim(),
      password: regPassword.trim(),
      rol: 'estudiante'
    };

    try {
      const response = await fetch('http://localhost/tesproy/public/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accion: 'registro',
          ...newUserData
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        registerStudent(newUserData);
        setSuccessMessage('¡Usuario registrado con éxito en MySQL y en el repositorio!');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setErrorMessage(data.error || 'Error al guardar el usuario en MySQL.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Error de conexión con MySQL al registrar la cuenta.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-between text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      
      <header className="w-full border-b border-white/10 bg-slate-900/70 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-white/20 shadow-md flex items-center justify-center p-0.5 overflow-hidden ring-2 ring-emerald-500/30 shrink-0">
              <img
                src="/logo.png"
                alt="Logo TESPROY TESCHI"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-black text-xl tracking-tight text-white">ProyecLink</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  TESCHI OFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tecnológico de Estudios Superiores de Chimalhuacán • Repositorio de Proyectos 7° a 9° Semestre
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 my-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden text-slate-900 flex flex-col transition-all">
          
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 p-6 sm:p-8 text-white relative">
            <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              <BookOpen className="w-4 h-4" />
              <span>División de Ingeniería en Sistemas Computacionales</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              {selectedRole === 'estudiante'
                ? studentMode === 'login'
                  ? 'Portal de Acceso para Alumnos'
                  : 'Registro de Nuevo Alumno'
                : selectedRole === 'maestro'
                ? 'Portal del Docente Asesor'
                : 'Portal de Coordinación y Administración'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {selectedRole === 'estudiante'
                ? 'Accede a tu espacio de proyecto, registra avances de código, consulta tu dictamen y recibe asesoría con el Tutor IA.'
                : selectedRole === 'maestro'
                ? 'Seguimiento, evaluación y dictamen oficial de proyectos integradores y de titulación asignados.'
                : 'Auditorías de abandono institucional, reasignación docente y administración del repositorio.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-100/90 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Selecciona tu Portal Institucional:
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {selectedRole === 'estudiante' ? '7° a 9° Semestre' : selectedRole === 'maestro' ? 'Asesoría' : 'Coordinación'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectRole('estudiante')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 transition-all ${
                  selectedRole === 'estudiante'
                    ? 'bg-white text-emerald-800 shadow-sm border-2 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'
                }`}
              >
                <GraduationCap className={`w-4 h-4 ${selectedRole === 'estudiante' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Alumno</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('maestro')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 transition-all ${
                  selectedRole === 'maestro'
                    ? 'bg-white text-emerald-800 shadow-sm border-2 border-emerald-700 ring-2 ring-emerald-700/20'
                    : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${selectedRole === 'maestro' ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span>Docente Asesor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('administrador')}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 transition-all ${
                  selectedRole === 'administrador'
                    ? 'bg-slate-900 text-amber-300 shadow-sm ring-2 ring-amber-500/20 border-2 border-amber-400'
                    : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${selectedRole === 'administrador' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>Administrador</span>
              </button>
            </div>

            {selectedRole === 'estudiante' && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    studentMode === 'login'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    studentMode === 'register'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Registrar Nueva Cuenta</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 space-y-4">

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-snug font-medium">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="leading-snug font-medium">{successMessage}</span>
              </div>
            )}

            {selectedRole === 'estudiante' && studentMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-emerald-700 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    <strong>Registro Institucional MySQL:</strong> Al darte de alta se guardarán tus datos directamente en la base de datos de MySQL.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={regNombre}
                      onChange={(e) => setRegNombre(e.target.value)}
                      placeholder="ej. Mariana Reyes López"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Correo Institucional *</label>
                    <input
                      type="email"
                      required
                      value={regCorreo}
                      onChange={(e) => setRegCorreo(e.target.value)}
                      placeholder="ej. mariana.reyes@teschi.edu.mx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Matrícula Institucional</label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regMatricula}
                        onChange={(e) => setRegMatricula(e.target.value)}
                        placeholder="ej. 2022459012"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Semestre & Grupo *</label>
                    <select
                      value={regSemestre}
                      onChange={(e) => setRegSemestre(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    >
                      <option value="7mo Semestre (7ISC21)">7mo Semestre (7ISC21)</option>
                      <option value="8vo Semestre (8ISC21)">8vo Semestre (8ISC21)</option>
                      <option value="9no Semestre (9ISC21)">9no Semestre (9ISC21)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Teléfono de Contacto</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={regTelefono}
                        onChange={(e) => setRegTelefono(e.target.value)}
                        placeholder="ej. 55 1234 5678"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Habilidades / Tecnologías</label>
                    <div className="relative">
                      <Code className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={regHabilidades}
                        onChange={(e) => setRegHabilidades(e.target.value)}
                        placeholder="ej. React, PHP, MySQL, Git"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Contraseña *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Mínimo 4 caracteres"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Confirmar Contraseña *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-md mt-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Guardando en MySQL...</span>
                    </span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Completar Registro y Entrar a Mi Espacio</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStudentMode('login')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                  >
                    ¿Ya tienes cuenta de alumno? Haz clic aquí para iniciar sesión
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div
                  className={`p-3.5 rounded-2xl text-xs border flex items-center space-x-3 transition-colors ${
                    selectedRole === 'estudiante'
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : selectedRole === 'maestro'
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      : 'bg-slate-900 text-white border-slate-800'
                  }`}
                >
                  <div className="shrink-0">
                    {selectedRole === 'estudiante' && <GraduationCap className="w-5 h-5 text-emerald-700" />}
                    {selectedRole === 'maestro' && <UserCheck className="w-5 h-5 text-emerald-700" />}
                    {selectedRole === 'administrador' && <ShieldCheck className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div className="text-[11px] leading-tight">
                    {selectedRole === 'estudiante' && (
                      <p><strong>Espacio de Alumno:</strong> Podrás ver tu proyecto, entregas, equipo asignado, estado de calificación y Tutor IA.</p>
                    )}
                    {selectedRole === 'maestro' && (
                      <p><strong>Panel de Asesoría Docente:</strong> Verás exclusivamente el seguimiento y calificación de los proyectos a tu cargo.</p>
                    )}
                    {selectedRole === 'administrador' && (
                      <p className="text-slate-200"><strong>Coordinación General:</strong> Verás exclusivamente la administración del repositorio, auditorías IA y docentes.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {selectedRole === 'estudiante'
                      ? 'Correo Institucional o Matrícula'
                      : selectedRole === 'maestro'
                      ? 'Correo del Docente Asesor'
                      : 'Correo de Coordinación Académica'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'estudiante'
                          ? 'ej. luis27@gmail.com o tu matrícula'
                          : selectedRole === 'maestro'
                          ? 'ej. yolanda@teschi.edu.mx'
                          : 'serviciosocial@teschi.edu.mx'
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Introduce tu contraseña"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 text-white transition-all shadow-md mt-2 ${
                    selectedRole === 'administrador'
                      ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 ring-1 ring-amber-400/40'
                      : 'bg-emerald-700 hover:bg-emerald-800'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Autenticando en TESPROY...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>
                        Ingresar como{' '}
                        {selectedRole === 'estudiante'
                          ? 'Alumno'
                          : selectedRole === 'maestro'
                          ? 'Docente Asesor'
                          : 'Administrador'}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>

                {selectedRole === 'estudiante' && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentMode('register');
                        setErrorMessage('');
                        setSuccessMessage('');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold hover:underline inline-flex items-center space-x-1"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      <span>¿Nuevo alumno? Regístrate aquí para crear tu proyecto</span>
                    </button>
                  </div>
                )}
              </form>
            )}

          </div>

        </div>
      </main>

      <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-4 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI) · División de Ingeniería en Sistemas Computacionales
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Repositorio Académico y Titulación ProyecLink
        </p>
      </footer>
    </div>
  );
};