import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AGENTES_IA_IMPLEMENTACION, AgenteIAConfig } from '../data/aiAgents';
import { AgenteIATipo } from '../types';
import {
  Send,
  Loader2,
  Copy,
  Check,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Cpu,
  Code2,
  ShieldCheck,
  LifeBuoy,
  FileText,
  Download,
  Terminal,
  FolderGit2,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  agenteId: AgenteIATipo;
  agenteNombre: string;
  agenteAvatar: string;
  rol: 'user' | 'assistant';
  texto: string;
  fecha: string;
}

export const AsistenteIAAlumno: React.FC = () => {
  const {
    currentUser,
    proyectos,
    selectedProjectId,
    setSelectedProjectId,
    askStudentAssistant,
    isAiLoading
  } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState<AgenteIATipo>('metodologia');
  const activeAgent = AGENTES_IA_IMPLEMENTACION.find(a => a.id === selectedAgentId) || AGENTES_IA_IMPLEMENTACION[0];

  const currentProject = proyectos.find(p => p.id === selectedProjectId) || proyectos[0];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      agenteId: activeAgent.id,
      agenteNombre: activeAgent.nombre,
      agenteAvatar: activeAgent.avatar,
      rol: 'assistant',
      texto: activeAgent.mensajeBienvenida,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiLoading]);

  const handleSelectAgent = (agent: AgenteIAConfig) => {
    setSelectedAgentId(agent.id);
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        agenteId: agent.id,
        agenteNombre: agent.nombre,
        agenteAvatar: agent.avatar,
        rol: 'assistant',
        texto: `👋 **${agent.nombre}** (${agent.titulo}) se ha incorporado a tu asesoría:\n\n${agent.mensajeBienvenida}`,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (customText?: string) => {
    const text = (customText || inputQuery).trim();
    if (!text || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      agenteId: activeAgent.id,
      agenteNombre: currentUser.nombre,
      agenteAvatar: currentUser.foto_perfil || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rol: 'user',
      texto: text,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    const historyForAi = messages.slice(-6).map(m => ({
      rol: m.rol,
      texto: m.texto
    }));

    try {
      const reply = await askStudentAssistant(
        text,
        currentProject?.id,
        historyForAi,
        activeAgent.id
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        agenteId: activeAgent.id,
        agenteNombre: activeAgent.nombre,
        agenteAvatar: activeAgent.avatar,
        rol: 'assistant',
        texto: reply,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        agenteId: activeAgent.id,
        agenteNombre: activeAgent.nombre,
        agenteAvatar: activeAgent.avatar,
        rol: 'assistant',
        texto: `Como ${activeAgent.titulo} del TESCHI, te recomiendo revisar la rúbrica oficial y verificar la congruencia de los requerimientos de tu proyecto "${currentProject?.nombre || 'Académico'}". Si tienes dudas específicas de código o diagramación, plantéalas detalladamente.`,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownloadTranscript = () => {
    const textContent = messages.map(m => `[${m.fecha}] ${m.rol === 'user' ? 'ALUMNO' : m.agenteNombre.toUpperCase()}:\n${m.texto}\n\n----------------------------------------\n`).join('\n');
    const blob = new Blob([textContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Asesoria_5_Agentes_IA_Proyecto_${currentProject?.id || 'TESCHI'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAgentIcon = (id: AgenteIATipo) => {
    switch (id) {
      case 'metodologia':
        return <BookOpen className="w-4 h-4" />;
      case 'arquitectura':
        return <Cpu className="w-4 h-4" />;
      case 'desarrollo':
        return <Code2 className="w-4 h-4" />;
      case 'qa_seguridad':
        return <ShieldCheck className="w-4 h-4" />;
      case 'rescate_donacion':
        return <LifeBuoy className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  Centro de 5 Agentes de IA para Implementación
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  TESCHI 7°-9°
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5 max-w-2xl">
                Célula colegiada de 5 asesores virtuales especializados en metodología de residencia, arquitectura de software/hardware, desarrollo de código, QA y rescate de proyectos.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadTranscript}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all border border-white/20"
              title="Descargar historial de asesoría en Markdown"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>Exportar Dictamen (.md)</span>
            </button>
          </div>
        </div>

        {/* Project Context Selector */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200/90 font-medium">Contexto del Proyecto Seleccionado:</span>
            <select
              value={currentProject?.id || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="bg-emerald-950/80 border border-emerald-400/40 rounded-lg px-2.5 py-1 text-white font-semibold text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
            >
              {proyectos.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  #{p.id} - {p.nombre} ({p.carrera || 'TESCHI'} | {p.semestre})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3 text-emerald-200/70 text-[11px]">
            <span>Carrera: <strong className="text-white">{currentProject?.carrera || 'ISC'}</strong></span>
            <span>•</span>
            <span>Progreso: <strong className="text-emerald-300">{currentProject?.progreso || 0}%</strong></span>
            <span>•</span>
            <span>Riesgo: <strong className="text-amber-300 uppercase">{currentProject?.nivel_riesgo || 'bajo'}</strong></span>
          </div>
        </div>
      </div>

      {/* 5 AI Agents Selection Carousel / Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-2.5 px-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Selecciona el Agente Especialista para tu Consulta
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            5 perfiles integrados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {AGENTES_IA_IMPLEMENTACION.map((agente) => {
            const isSelected = agente.id === selectedAgentId;
            return (
              <button
                key={agente.id}
                onClick={() => handleSelectAgent(agente)}
                className={`relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <div className="relative shrink-0">
                    <img
                      src={agente.avatar}
                      alt={agente.nombre}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-2xs">
                      <div className={`p-0.5 rounded-full ${agente.colorTema.badge}`}>
                        {getAgentIcon(agente.id)}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        #{agente.numero}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {agente.nombre}
                      </h3>
                    </div>
                    <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 truncate">
                      {agente.titulo}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {agente.especialidad}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">
                    {agente.carrerasAfines.length} carreras afines
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Activo</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Agent Detail Banner & Quick Prompts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative shrink-0">
              <img
                src={activeAgent.avatar}
                alt={activeAgent.nombre}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <div className="absolute -top-1.5 -left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-2xs">
                Agente #{activeAgent.numero}
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeAgent.nombre}
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeAgent.colorTema.bgBadge} ${activeAgent.colorTema.badge}`}>
                  {activeAgent.titulo}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {activeAgent.cargo}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {activeAgent.habilidadesClave.slice(0, 4).map((hab, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {hab}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs w-full lg:w-auto lg:max-w-md">
            <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
              🎯 Entregables que puede estructurar para ti:
            </span>
            <ul className="text-[11px] text-slate-500 dark:text-slate-300 space-y-0.5 list-disc list-inside">
              {activeAgent.entregablesGenerables.slice(0, 3).map((ent, i) => (
                <li key={i} className="truncate">{ent}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Prompts for Active Agent */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Consultas Rápidas Recomendadas para {activeAgent.nombre.split(' ')[1]}:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeAgent.promptsRecomendados.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                disabled={isAiLoading}
                className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-xs group"
              >
                <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                  <span className="truncate">{item.titulo}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 ml-1 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {item.descripcion}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px] transition-colors">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.rol === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}
              >
                <div className="shrink-0 mt-0.5">
                  <img
                    src={msg.agenteAvatar}
                    alt={msg.agenteNombre}
                    referrerPolicy="no-referrer"
                    className={`w-9 h-9 rounded-xl object-cover border ${
                      isAI
                        ? 'border-emerald-400/50 shadow-xs'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                </div>

                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm shadow-xs ${
                  isAI
                    ? 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                    : 'bg-emerald-700 text-white'
                }`}>
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-black/5 dark:border-white/10">
                    <span className="font-bold text-[11px]">
                      {isAI ? msg.agenteNombre : 'Tú (Estudiante)'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] ${isAI ? 'text-slate-400' : 'text-emerald-200'}`}>
                        {msg.fecha}
                      </span>
                      {isAI && (
                        <button
                          onClick={() => handleCopy(msg.texto, msg.id)}
                          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                          title="Copiar texto"
                        >
                          {copiedIndex === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                    {msg.texto}
                  </div>
                </div>
              </div>
            );
          })}

          {isAiLoading && (
            <div className="flex items-start space-x-3 animate-in fade-in duration-200">
              <img
                src={activeAgent.avatar}
                alt={activeAgent.nombre}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-400/50 shadow-xs"
              />
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 flex items-center space-x-2 text-slate-600 dark:text-slate-300 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span>{activeAgent.nombre} está formulando su recomendación técnica y metodológica...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl transition-colors">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Formula tu consulta a ${activeAgent.nombre} sobre tu proyecto "${currentProject?.nombre || 'Académico'}"...`}
              disabled={isAiLoading}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isAiLoading}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-xs shrink-0"
            >
              {isAiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Consultar</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 px-1">
            <span>💡 Asistencia de los 5 agentes adaptada al protocolo de titulación y asignaturas de 7° a 9° semestre</span>
            <span>Agente actual: <strong className="text-emerald-700 dark:text-emerald-400">{activeAgent.nombre}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};