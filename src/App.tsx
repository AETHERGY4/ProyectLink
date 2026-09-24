import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MiEspacioView } from './components/MiEspacioView';
import { EquiposView } from './components/EquiposView';
import { EstadoCalificacionesView } from './components/EstadoCalificacionesView';
import { ProyectosDonadosView } from './components/ProyectosDonadosView';
import { AdminPanelView } from './components/AdminPanelView';
import { MaestroView } from './components/MaestroView';
import { AsistenteIAAlumno } from './components/AsistenteIAAlumno';
import { LoginPage } from './components/LoginPage';
import { XamppGuideModal } from './components/XamppGuideModal';
import { EditarPerfilModal } from './components/EditarPerfilModal';
import {
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Bot,
  UserCheck
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    showXamppGuide,
    setShowXamppGuide,
    showEditProfileModal,
    setShowEditProfileModal,
    theme
  } = useApp();

  // Strict role-based activeTab synchronization
  React.useEffect(() => {
    if (currentRole === 'administrador') {
      if (activeTab !== 'admin') {
        setActiveTab('admin');
      }
    } else if (currentRole === 'maestro') {
      if (activeTab !== 'maestro') {
        setActiveTab('maestro');
      }
    } else if (currentRole === 'estudiante') {
      if (activeTab === 'admin' || activeTab === 'maestro') {
        setActiveTab('espacio');
      }
    }
  }, [currentRole, activeTab, setActiveTab]);

  // Render view strictly isolated by role
  const renderActiveView = () => {
    if (currentRole === 'administrador') {
      return <AdminPanelView />;
    }

    if (currentRole === 'maestro') {
      return <MaestroView />;
    }

    // Role is estudiante
    switch (activeTab) {
      case 'equipos':
        return <EquiposView />;
      case 'estado':
        return <EstadoCalificacionesView />;
      case 'donados':
        return <ProyectosDonadosView />;
      case 'asistente_ia':
        return <AsistenteIAAlumno />;
      case 'espacio':
      default:
        return <MiEspacioView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderActiveView()}
      </main>

      {/* Institutional Academic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 py-6 mt-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                ProyecLink · Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {currentRole === 'administrador'
                  ? 'Portal de Coordinación Académica y Administración del Repositorio'
                  : currentRole === 'maestro'
                  ? 'Portal de Asesoría Docente y Seguimiento de Proyectos'
                  : 'Repositorio de Proyectos 7° a 9° Semestre • Módulo de Alumnos'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {currentRole === 'estudiante' && (
              <>
                <button
                  onClick={() => setActiveTab('asistente_ia')}
                  className="text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors flex items-center space-x-1"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tutor Académico IA</span>
                </button>

                <button
                  onClick={() => setActiveTab('donados')}
                  className="text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors flex items-center space-x-1"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Proyectos Donados</span>
                </button>
              </>
            )}

            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} TESCHI</span>
          </div>
        </div>
      </footer>

      {/* XAMPP Guide Modal */}
      <XamppGuideModal
        isOpen={showXamppGuide}
        onClose={() => setShowXamppGuide(false)}
      />

      {/* Student Edit Profile Modal */}
      <EditarPerfilModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
