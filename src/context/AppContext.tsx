import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Usuario,
  Maestro,
  Proyecto,
  Integrante,
  Actividad,
  Archivo,
  VotacionDonacion,
  SolicitudProyecto,
  Notificacion,
  EvaluacionIAAlumno,
  ReasignacionMaestroIA,
  Administrador
} from '../types';
import {
  INITIAL_USUARIOS,
  INITIAL_MAESTROS,
  INITIAL_PROYECTOS,
  INITIAL_INTEGRANTES,
  INITIAL_ACTIVIDADES,
  INITIAL_ARCHIVOS,
  INITIAL_VOTACIONES,
  INITIAL_SOLICITUDES,
  INITIAL_NOTIFICACIONES,
  INITIAL_ADMINISTRADORES
} from '../data/initialData';

export const safeJsonParse = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export const sanitizeMaestro = (m: any): Maestro => {
  if (!m) return INITIAL_MAESTROS[0];
  return {
    ...m,
    cubo_o_oficina: m.cubo_o_oficina || m.cubiculo || 'Edificio H - Cubículo 104',
    especialidades: Array.isArray(m.especialidades) && m.especialidades.length > 0
      ? m.especialidades
      : (m.especialidad ? [m.especialidad] : ['Gestión y Evaluación de Proyectos', 'Ingeniería Web'])
  };
};

interface AppContextType {
  isAuthenticated: boolean;
  currentUser: Usuario;
  setCurrentUser: (user: Usuario) => void;
  currentRole: 'estudiante' | 'maestro' | 'administrador';
  setCurrentRole: (role: 'estudiante' | 'maestro' | 'administrador') => void;
  currentMaestro: Maestro | null;
  setCurrentMaestro: (maestro: Maestro | null) => void;
  currentAdmin: Administrador | null;
  login: (identifier: string, password?: string, preferredRole?: 'estudiante' | 'maestro' | 'administrador') => boolean;
  registerStudent: (data: {
    nombre: string;
    correo: string;
    matricula?: string;
    semestre: string;
    telefono?: string;
    password?: string;
  }) => Usuario;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  
  activeTab: 'espacio' | 'equipos' | 'estado' | 'donados' | 'admin' | 'maestro' | 'asistente_ia';
  setActiveTab: (tab: 'espacio' | 'equipos' | 'estado' | 'donados' | 'admin' | 'maestro' | 'asistente_ia') => void;
  selectedProjectId: number | null;
  setSelectedProjectId: (id: number | null) => void;
  showXamppGuide: boolean;
  setShowXamppGuide: (show: boolean) => void;
  showEditProfileModal: boolean;
  setShowEditProfileModal: (show: boolean) => void;

  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  proyectos: Proyecto[];
  fetchProyectos: () => Promise<void>;
  proyectosDonadosGlobal: Proyecto[];
  fetchProyectosDonadosGlobal: () => Promise<void>;
  usuarios: Usuario[];
  maestros: Maestro[];
  fetchMaestros: () => Promise<void>;
  integrantes: Integrante[];
  actividades: Actividad[];
  fetchActividadesProyecto: (proyectoId: number) => Promise<void>;
  archivos: Archivo[];
  votaciones: VotacionDonacion[];
  fetchVotacionesProyecto: (proyectoId: number) => Promise<void>;
  solicitudes: SolicitudProyecto[];
  notificaciones: Notificacion[];
  administradores: Administrador[];

  updateUserProfile: (updatedData: Partial<Usuario>) => void;
  addProject: (p: Omit<Proyecto, 'id' | 'fecha_creacion' | 'ultimo_commit' | 'progreso'> & { integrantes?: number[] }) => Promise<void>;
  updateProject: (id: number, updates: Partial<Proyecto>) => void;
  deleteProject: (id: number) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  addActivity: (actividad: Omit<Actividad, 'id'>) => Promise<void>;
  toggleActivityStatus: (id: number) => Promise<void>;
  voteDonation: (projectId: number, userId: number, vote: 'a_favor' | 'en_contra') => Promise<void>;
  iniciarVotacionDonacion: (projectId: number) => Promise<void>;
  requestProjectAdoption: (projectId: number, message: string) => Promise<SolicitudProyecto>;
  respondToAdoptionRequest: (solicitudId: number, status: 'aprobado' | 'rechazado') => void;
  
  isAiLoading: boolean;
  detectProjectAbandonment: (projectId: number) => Promise<any>;
  evaluateStudentForProject: (studentId: number, projectId: number) => Promise<EvaluacionIAAlumno>;
  suggestAdvisorReassignment: (projectId: number, reason?: string) => Promise<ReasignacionMaestroIA>;
  reassignProjectAdvisor: (projectId: number, newAdvisorId: number) => void;
  askStudentAssistant: (pregunta: string, proyectoId?: number, historial?: { rol: 'user' | 'assistant'; texto: string }[], agenteId?: import('../types').AgenteIATipo) => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const raw = safeJsonParse<Usuario[]>('tesproy_usuarios', INITIAL_USUARIOS);
    return Array.isArray(raw) && raw.length > 0 ? raw : INITIAL_USUARIOS;
  });

  const [maestros, setMaestros] = useState<Maestro[]>(() => {
    const raw = safeJsonParse<Maestro[]>('tesproy_maestros', INITIAL_MAESTROS);
    return Array.isArray(raw) && raw.length > 0 ? raw.map(sanitizeMaestro) : INITIAL_MAESTROS;
  });

  const fetchMaestros = async () => {
    try {
      const res = await fetch('http://localhost/tesproy/public/api/maestros.php');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const sanitized = data.data.map(sanitizeMaestro);
        setMaestros(sanitized);
        localStorage.setItem('tesproy_maestros', JSON.stringify(sanitized));
      }
    } catch (err) {
      console.warn("No se pudieron cargar maestros desde MySQL, usando caché:", err);
    }
  };

  useEffect(() => {
    fetchMaestros();
  }, []);

  const [administradores] = useState<Administrador[]>(INITIAL_ADMINISTRADORES);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return safeJsonParse<boolean>('tesproy_auth', false);
  });

  const [currentUser, setCurrentUser] = useState<Usuario>(() => {
    const raw = safeJsonParse<Usuario>('tesproy_current_user', INITIAL_USUARIOS[0]);
    return raw && raw.id ? raw : INITIAL_USUARIOS[0];
  });

  const [currentRole, setCurrentRole] = useState<'estudiante' | 'maestro' | 'administrador'>(() => {
    const saved = localStorage.getItem('tesproy_role');
    if (saved === 'estudiante' || saved === 'maestro' || saved === 'administrador') {
      return saved;
    }
    return 'estudiante';
  });

  const [currentMaestro, setCurrentMaestro] = useState<Maestro | null>(() => {
    const raw = safeJsonParse<Maestro | null>('tesproy_current_maestro', INITIAL_MAESTROS[0]);
    return raw ? sanitizeMaestro(raw) : INITIAL_MAESTROS[0];
  });

  const [currentAdmin] = useState<Administrador | null>(administradores[0]);

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showXamppGuide, setShowXamppGuide] = useState<boolean>(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('tesproy_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('tesproy_theme', newTheme);
    } catch {}
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [activeTab, setActiveTab] = useState<'espacio' | 'equipos' | 'estado' | 'donados' | 'admin' | 'maestro' | 'asistente_ia'>('espacio');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [proyectos, setProyectos] = useState<Proyecto[]>(() => {
    const raw = safeJsonParse<Proyecto[]>('tesproy_proyectos', INITIAL_PROYECTOS);
    return Array.isArray(raw) && raw.length > 0 ? raw : INITIAL_PROYECTOS;
  });

  const fetchProyectos = async () => {
    try {
      const res = await fetch(`http://localhost/tesproy/public/api/proyectos.php?usuario_id=${currentUser.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProyectos(data.data);
      }
    } catch (err) {
      console.warn("No se pudieron cargar proyectos desde MySQL, usando caché local:", err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchProyectos();
    }
  }, [currentUser?.id]);

  const [proyectosDonadosGlobal, setProyectosDonadosGlobal] = useState<Proyecto[]>(() => {
    return safeJsonParse<Proyecto[]>('tesproy_donados_global', []);
  });

  const fetchProyectosDonadosGlobal = async () => {
    try {
      const API_URL = 'http://localhost/tesproy/public/api/donaciones.php';
      const res = await fetch(`${API_URL}?action=proyectos_donados`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setProyectosDonadosGlobal(data.data);
        localStorage.setItem('tesproy_donados_global', JSON.stringify(data.data));
      }
    } catch (err) {
      console.error("Fallo al sincronizar proyectos donados globales:", err);
    }
  };

  useEffect(() => {
    fetchProyectosDonadosGlobal();
  }, []);

  const [integrantes, setIntegrantes] = useState<Integrante[]>(() => {
    const raw = safeJsonParse<Integrante[]>('tesproy_integrantes', INITIAL_INTEGRANTES);
    return Array.isArray(raw) ? raw : INITIAL_INTEGRANTES;
  });

  const [actividades, setActividades] = useState<Actividad[]>(() => {
    const raw = safeJsonParse<Actividad[]>('tesproy_actividades', INITIAL_ACTIVIDADES);
    return Array.isArray(raw) ? raw : INITIAL_ACTIVIDADES;
  });

  const fetchActividadesProyecto = async (proyectoId: number) => {
    try {
      const res = await fetch(`http://localhost/tesproy/public/api/actividades.php?proyecto_id=${proyectoId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setActividades(prev => {
          const filtered = prev.filter(a => a.proyecto_id !== proyectoId);
          return [...filtered, ...data.data];
        });
      }
    } catch (err) {
      console.error("Error sincronizando actividades desde MySQL:", err);
    }
  };

  const [archivos, setArchivos] = useState<Archivo[]>(() => {
    const raw = safeJsonParse<Archivo[]>('tesproy_archivos', INITIAL_ARCHIVOS);
    return Array.isArray(raw) ? raw : INITIAL_ARCHIVOS;
  });

  const [votaciones, setVotaciones] = useState<VotacionDonacion[]>(() => {
    const raw = safeJsonParse<VotacionDonacion[]>('tesproy_votaciones', INITIAL_VOTACIONES);
    return Array.isArray(raw) ? raw : INITIAL_VOTACIONES;
  });

  // Función para consultar votos reales desde MySQL
  const fetchVotacionesProyecto = async (proyectoId: number) => {
    try {
      const res = await fetch(`http://localhost/tesproy/public/api/votaciones.php?proyecto_id=${proyectoId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setVotaciones(prev => {
          const filtered = prev.filter(v => Number(v.proyecto_id) !== Number(proyectoId));
          return [...filtered, ...data.data];
        });
      }
    } catch (err) {
      console.warn("No se pudieron cargar votaciones desde MySQL:", err);
    }
  };

  const [solicitudes, setSolicitudes] = useState<SolicitudProyecto[]>(() => {
    const raw = safeJsonParse<SolicitudProyecto[]>('tesproy_solicitudes', INITIAL_SOLICITUDES);
    return Array.isArray(raw) ? raw : INITIAL_SOLICITUDES;
  });

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(() => {
    const raw = safeJsonParse<Notificacion[]>('tesproy_notificaciones', INITIAL_NOTIFICACIONES);
    return Array.isArray(raw) ? raw : INITIAL_NOTIFICACIONES;
  });

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('tesproy_auth', JSON.stringify(isAuthenticated));
    localStorage.setItem('tesproy_role', currentRole);
    localStorage.setItem('tesproy_current_user', JSON.stringify(currentUser));
    if (currentMaestro) {
      localStorage.setItem('tesproy_current_maestro', JSON.stringify(currentMaestro));
    }
  }, [isAuthenticated, currentRole, currentUser, currentMaestro]);

  useEffect(() => {
    localStorage.setItem('tesproy_proyectos', JSON.stringify(proyectos));
  }, [proyectos]);

  useEffect(() => {
    localStorage.setItem('tesproy_actividades', JSON.stringify(actividades));
  }, [actividades]);

  useEffect(() => {
    localStorage.setItem('tesproy_votaciones', JSON.stringify(votaciones));
  }, [votaciones]);

  useEffect(() => {
    localStorage.setItem('tesproy_solicitudes', JSON.stringify(solicitudes));
  }, [solicitudes]);

  useEffect(() => {
    localStorage.setItem('tesproy_notificaciones', JSON.stringify(notificaciones));
  }, [notificaciones]);

  useEffect(() => {
    localStorage.setItem('tesproy_maestros', JSON.stringify(maestros));
  }, [maestros]);

  useEffect(() => {
    localStorage.setItem('tesproy_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const login = (identifier: string, password?: string, preferredRole?: 'estudiante' | 'maestro' | 'administrador'): boolean => {
    const idClean = identifier.trim().toLowerCase();
    const passClean = (password || '').trim();

    if (!idClean || !passClean) {
      return false;
    }

    if (preferredRole === 'maestro') {
      const foundTeacher = maestros.find(m => 
        m.correo.toLowerCase() === idClean || 
        m.nombre.toLowerCase() === idClean ||
        m.id.toString() === idClean
      );

      if (!foundTeacher) return false;

      if ((foundTeacher as any).contrasena && (foundTeacher as any).contrasena !== passClean) {
        return false;
      }

      const safeTeacher = sanitizeMaestro(foundTeacher);
      setCurrentMaestro(safeTeacher);
      setCurrentRole('maestro');
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setActiveTab('maestro');
      localStorage.setItem('tesproy_auth', 'true');
      localStorage.setItem('tesproy_role', 'maestro');
      localStorage.setItem('tesproy_current_maestro', JSON.stringify(safeTeacher));
      return true;
    }

    if (preferredRole === 'administrador') {
      const isAdminMatch = idClean === 'serviciosocial@teschi.edu.mx' ||
                           idClean === 'admin' ||
                           idClean === 'coordinacion';

      if (!isAdminMatch) return false;

      setCurrentRole('administrador');
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setActiveTab('admin');
      localStorage.setItem('tesproy_auth', 'true');
      localStorage.setItem('tesproy_role', 'administrador');
      return true;
    }

    const foundStudent = usuarios.find(u => 
      u.correo.toLowerCase() === idClean || 
      (u.matricula && u.matricula.toLowerCase() === idClean)
    );

    if (!foundStudent) {
      return false;
    }

    const customCreds = safeJsonParse<Record<string, string>>('tesproy_custom_creds', {});
    const registeredPass = customCreds[idClean] || customCreds[(foundStudent.matricula || '').toLowerCase()];

    if (registeredPass && registeredPass !== passClean) {
      return false;
    }

    const dbHash = (foundStudent as any).contrasena;
    if (dbHash && dbHash.startsWith('$2y$') && passClean.length < 4) {
      return false;
    }

    setCurrentUser(foundStudent);
    setCurrentRole('estudiante');
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setActiveTab('espacio');
    localStorage.setItem('tesproy_auth', 'true');
    localStorage.setItem('tesproy_role', 'estudiante');
    localStorage.setItem('tesproy_current_user', JSON.stringify(foundStudent));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setShowLoginModal(false);
    localStorage.setItem('tesproy_auth', 'false');
    setActiveTab('espacio');
  };

  const registerStudent = (data: {
    nombre: string;
    correo: string;
    matricula?: string;
    semestre: string;
    telefono?: string;
    password?: string;
  }): Usuario => {
    const cleanEmail = data.correo.trim().toLowerCase();
    const cleanMatricula = (data.matricula || '').trim().toLowerCase();
    const cleanSemestre = data.semestre || '8vo Semestre (8ISC21)';
    const newId = Math.max(...usuarios.map(u => u.id), 100) + 1;

    const newUser: Usuario = {
      id: newId,
      nombre: data.nombre.trim(),
      correo: cleanEmail,
      matricula: data.matricula?.trim(),
      telefono: data.telefono?.trim() || '55' + Math.floor(10000000 + Math.random() * 90000000),
      ubicacion: 'Chimalhuacán, Estado de México',
      bio: `Estudiante de ${cleanSemestre} de la carrera de Ingeniería en Sistemas Computacionales del TESCHI.`,
      carrera: 'Ingeniería en Sistemas Computacionales',
      semestre: cleanSemestre,
      promedio: 89.0,
      habilidades: ['JavaScript', 'Git', 'Bases de Datos', 'Desarrollo de Software'],
      foto_perfil: '',
      rol: 'estudiante',
    };

    const customCreds = safeJsonParse<Record<string, string>>('tesproy_custom_creds', {});
    const pass = (data.password && data.password.trim().length >= 4) ? data.password.trim() : '123456';
    customCreds[cleanEmail] = pass;
    if (cleanMatricula) {
      customCreds[cleanMatricula] = pass;
    }
    localStorage.setItem('tesproy_custom_creds', JSON.stringify(customCreds));

    const welcomeNotif: Notificacion = {
      id: Date.now(),
      usuario_id: newId,
      titulo: '¡Registro Exitoso en TESPROY!',
      mensaje: `Bienvenido(a) ${newUser.nombre}. Tu cuenta institucional ha sido creada exitosamente.`,
      proyecto_id: null,
      leida: false,
      tipo: 'sistema',
      fecha_creacion: 'Hace un momento'
    };

    const updatedUsers = [newUser, ...usuarios];
    const updatedNotifs = [welcomeNotif, ...notificaciones];

    setUsuarios(updatedUsers);
    setNotificaciones(updatedNotifs);

    setCurrentUser(newUser);
    setCurrentRole('estudiante');
    setIsAuthenticated(true);
    setActiveTab('espacio');
    setShowLoginModal(false);

    localStorage.setItem('tesproy_auth', 'true');
    localStorage.setItem('tesproy_role', 'estudiante');
    localStorage.setItem('tesproy_current_user', JSON.stringify(newUser));

    return newUser;
  };

  const updateUserProfile = (updatedData: Partial<Usuario>) => {
    const updatedUser: Usuario = {
      ...currentUser,
      ...updatedData
    };
    setCurrentUser(updatedUser);
    setUsuarios(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addProject = async (p: Omit<Proyecto, 'id' | 'fecha_creacion' | 'ultimo_commit' | 'progreso'> & { integrantes?: number[] }) => {
    try {
      const res = await fetch('http://localhost/tesproy/public/api/proyectos.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (data.success) {
        await fetchProyectos();
      } else {
        alert("Error de MySQL: " + (data.error || "No se pudo registrar el proyecto"));
      }
    } catch (err) {
      console.error("Error de conexión al registrar proyecto en MySQL, respaldando localmente:", err);
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newId = Math.max(...proyectos.map(x => x.id), 0) + 1;
      const newProject: Proyecto = {
        ...p,
        id: newId,
        progreso: 0,
        fecha_creacion: now,
        ultimo_commit: now,
        estado_abandono: 'activo',
        dias_inactividad: 0,
        meses_inactividad: 0,
        es_donado: false,
        fecha_donacion: null,
        usuario_id_actual: null,
        listo_para_donar: false,
      };
      setProyectos(prev => [newProject, ...prev]);
    }
  };

  const updateProject = (id: number, updates: Partial<Proyecto>) => {
    setProyectos(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteProject = (id: number) => {
    setProyectos(prev => prev.filter(item => item.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
  };

  const markNotificationRead = (id: number) => {
    setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  };

  const addActivity = async (actividad: Omit<Actividad, 'id'>) => {
    try {
      const res = await fetch('http://localhost/tesproy/public/api/actividades.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actividad)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setActividades(prev => [...prev, data.data]);
      } else {
        const fallbackAct: Actividad = { ...actividad, id: Date.now() };
        setActividades(prev => [...prev, fallbackAct]);
      }
    } catch (err) {
      console.error("Error al guardar actividad en MySQL, guardando localmente:", err);
      const fallbackAct: Actividad = { ...actividad, id: Date.now() };
      setActividades(prev => [...prev, fallbackAct]);
    }
  };

  const toggleActivityStatus = async (id: number) => {
    const act = actividades.find(a => a.id === id);
    if (!act) return;

    const nextState: 'pendiente' | 'en_progreso' | 'completada' = 
      act.estado === 'pendiente' ? 'en_progreso' :
      act.estado === 'en_progreso' ? 'completada' : 'pendiente';

    setActividades(prev => prev.map(a => a.id === id ? { ...a, estado: nextState } : a));

    try {
      await fetch('http://localhost/tesproy/public/api/actividades.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado: nextState })
      });
    } catch (err) {
      console.error("Error al actualizar estado en MySQL:", err);
    }
  };

  // Guardar voto directo en la base de datos a través de votaciones.php
  const voteDonation = async (projectId: number, userId: number, vote: 'a_favor' | 'en_contra') => {
    try {
      const res = await fetch('http://localhost/tesproy/public/api/votaciones.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proyecto_id: projectId, usuario_id: userId, voto })
      });
      const data = await res.json();
      if (data.success) {
        await fetchVotacionesProyecto(projectId);
      } else {
        console.error("Error al registrar voto en MySQL:", data.error);
      }
    } catch (err) {
      console.error("Error de conexión al guardar voto:", err);
      // Fallback local
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setVotaciones(prev => {
        const existing = prev.find(v => v.proyecto_id === projectId && v.usuario_id === userId);
        if (existing) {
          return prev.map(v => v.id === existing.id ? { ...v, voto: vote, fecha_voto: now } : v);
        } else {
          return [...prev, { id: Date.now(), proyecto_id: projectId, usuario_id: userId, voto: vote, fecha_voto: now }];
        }
      });
    }
  };

  const iniciarVotacionDonacion = async (projectId: number) => {
    const proj = proyectos.find(p => p.id === projectId);
    const nombreProj = proj ? proj.nombre : 'Proyecto';
    const miembros = integrantes.filter(i => Number(i.proyecto_id) === Number(projectId));
    
    const nuevasNotificaciones: Notificacion[] = miembros.map(m => ({
      id: Date.now() + Math.random(),
      usuario_id: Number(m.usuario_id || m.id),
      titulo: '🗳️ Proceso de Votación Iniciado',
      mensaje: `Se ha abierto la votación oficial para la donación y liberación del proyecto "${nombreProj}". Por favor emite tu voto a favor o en contra.`,
      proyecto_id: projectId,
      leida: false,
      tipo: 'sistema',
      fecha_creacion: 'Hace un momento'
    }));

    setNotificaciones(prev => [...nuevasNotificaciones, ...prev]);
    updateProject(projectId, { listo_para_donar: true });
  };

  const requestProjectAdoption = async (projectId: number, message: string): Promise<SolicitudProyecto> => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const proj = proyectos.find(p => p.id === projectId);

    let aiEvaluation: EvaluacionIAAlumno | undefined = undefined;
    try {
      if (proj) {
        aiEvaluation = await evaluateStudentForProject(currentUser.id, projectId);
      }
    } catch (e) {
      console.warn("AI evaluation error:", e);
    }

    const newSolicitud: SolicitudProyecto = {
      id: Date.now(),
      proyecto_id: projectId,
      usuario_id: currentUser.id,
      mensaje: message,
      estado: 'pendiente',
      fecha_solicitud: now,
      fecha_respuesta: null,
      evaluacion_ia: aiEvaluation
    };

    setSolicitudes(prev => [newSolicitud, ...prev]);
    return newSolicitud;
  };

  const respondToAdoptionRequest = (solicitudId: number, status: 'aprobado' | 'rechazado') => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const sol = solicitudes.find(s => s.id === solicitudId);
    if (!sol) return;

    setSolicitudes(prev => prev.map(s => s.id === solicitudId ? { ...s, estado: status, fecha_respuesta: now } : s));

    if (status === 'aprobado') {
      updateProject(sol.proyecto_id, {
        usuario_id_actual: sol.usuario_id,
        es_donado: true,
        estado_abandono: 'donado'
      });
    }
  };

  const detectProjectAbandonment = async (projectId: number) => {
    const proj = proyectos.find(p => p.id === projectId);
    if (!proj) throw new Error("Proyecto no encontrado");
    
    return {
      score: 85,
      estado: proj.estado_abandono || 'En Riesgo de Abandono',
      diagnostico: `El proyecto "${proj.nombre}" de la asignatura "${proj.asignatura}" presenta indicios de baja frecuencia en los reportes de avance y actualización del repositorio local.`,
      factores_riesgo: [
        'Falta de sincronización semanal en los entregables del repositorio',
        'Inactividad prolongada en las bitácoras de actividades del equipo',
        'Ausencia de validación con el asesor docente asignado'
      ],
      carta_solicitud_donacion: `Estimados integrantes del proyecto "${proj.nombre}":\n\nPor medio del sistema institucional TESPROY, se notifica que el proyecto ha superado el tiempo estimado sin actualizaciones formales. Con el objetivo de salvaguardar el valor académico y permitir su continuidad, se solicita su evaluación para la liberación y donación del repositorio hacia el banco institucional.`
    };
  };

  const evaluateStudentForProject = async (studentId: number, projectId: number): Promise<EvaluacionIAAlumno> => {
    return {
      score: 92,
      decision: 'Aprobado con alta afinidad técnica',
      justificacion: 'El perfil cuenta con las habilidades necesarias requeridas en el repositorio.'
    };
  };

  const suggestAdvisorReassignment = async (projectId: number, reason?: string): Promise<ReasignacionMaestroIA> => {
    return {
      maestro_sugerido_id: maestros[0].id,
      razon: 'Afinidad en la especialidad del proyecto.'
    };
  };

  const reassignProjectAdvisor = (projectId: number, newAdvisorId: number) => {
    updateProject(projectId, { maestro_id: newAdvisorId });
  };

  const askStudentAssistant = async (
    pregunta: string,
    proyectoId?: number,
    historial?: { rol: 'user' | 'assistant'; texto: string }[],
    agenteId?: import('../types').AgenteIATipo
  ): Promise<string> => {
    setIsAiLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const proyectoObj = proyectos.find(p => p.id === proyectoId);
      const nombreProyecto = proyectoObj ? proyectoObj.nombre : 'Proyecto Académico';
      const pLower = pregunta.toLowerCase();

      if (pLower.includes('python')) {
        return `### 🐍 Script en Python para *${nombreProyecto}*\n\n\`\`\`python\nfrom flask import Flask, request, jsonify\n\napp = Flask(__name__)\n\n@app.route('/api/procesar', methods=['POST'])\ndef procesar_datos():\n    data = request.get_json()\n    return jsonify({\n        'success': True,\n        'mensaje': 'Datos procesados correctamente con Python',\n        'datos_recibidos': data\n    })\n\nif __name__ == '__main__':\n    app.run(debug=True, port=5000)\n\`\`\`\n\nEste script cumple con los estándares institucionales de desarrollo backend en Python.`;
      }

      if (pLower.includes('diagrama') || pLower.includes('mermaid') || pLower.includes('plantuml') || pLower.includes('caso de uso')) {
        return `### 📊 Diagrama del Sistema (*${nombreProyecto}*)\n\n\`\`\`mermaid\ngraph TD;\n    A[Estudiante] -->|Consulta| B(Asistente IA TESCHI);\n    B -->|Genera| C[Documentación Técnica];\n\`\`\`\n\nEstructura validada conforme a los requerimientos de titulación.`;
      }

      if (pLower.includes('php') || pLower.includes('endpoint') || pLower.includes('pdo')) {
        return `### 💻 Script en PHP con PDO\n\n\`\`\`php\n<?php\nheader('Content-Type: application/json');\nrequire_once 'conexion.php';\n\ntry {\n    \$input = json_decode(file_get_contents('php://input'), true);\n    echo json_encode(['success' => true, 'mensaje' => 'Petición procesada en PHP para ${nombreProyecto}']);\n} catch (Exception \$e) {\n    echo json_encode(['success' => false, 'error' => \$e->getMessage()]);\n}\n?>\n\`\`\`\n\nConexión segura y estructurada mediante PDO.`;
      }

      return `### 💡 Asesoría Especializada del TESCHI\n\nEn respuesta a tu consulta sobre **"${pregunta}"** para el proyecto *${nombreProyecto}*:\n\n- Se ha analizado la solicitud bajo los protocolos de 7° a 9° semestre.\n- **Recomendación:** Asegúrate de aplicar las buenas prácticas de desarrollo y documentar cada cambio en tu repositorio local con XAMPP.\n\n¿Deseas que profundice en algún aspecto específico del código o la arquitectura?`;
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        currentMaestro,
        setCurrentMaestro,
        currentAdmin,
        login,
        registerStudent,
        logout,
        showLoginModal,
        setShowLoginModal,
        activeTab,
        setActiveTab,
        selectedProjectId,
        setSelectedProjectId,
        showXamppGuide,
        setShowXamppGuide,
        showEditProfileModal,
        setShowEditProfileModal,
        theme,
        setTheme,
        toggleTheme,
        proyectos,
        fetchProyectos,
        proyectosDonadosGlobal,
        fetchProyectosDonadosGlobal,
        usuarios,
        maestros,
        fetchMaestros,
        integrantes,
        actividades,
        fetchActividadesProyecto,
        archivos,
        votaciones,
        fetchVotacionesProyecto,
        solicitudes,
        notificaciones,
        administradores,
        updateUserProfile,
        addProject,
        updateProject,
        deleteProject,
        markNotificationRead,
        markAllNotificationsRead,
        addActivity,
        toggleActivityStatus,
        voteDonation,
        iniciarVotacionDonacion,
        requestProjectAdoption,
        respondToAdoptionRequest,
        isAiLoading,
        detectProjectAbandonment,
        evaluateStudentForProject,
        suggestAdvisorReassignment,
        reassignProjectAdvisor,
        askStudentAssistant
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};