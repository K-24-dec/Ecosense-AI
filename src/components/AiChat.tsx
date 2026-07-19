import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles,
  User,
  Bot,
  Globe
} from 'lucide-react';
import { ChatThread, ChatMessage } from '../types';

interface AiChatProps {
  onPointsUpdate: (pts: number) => void;
}

export default function AiChat({ onPointsUpdate }: AiChatProps) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string>('');
  
  // Voice settings
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoRead, setAutoRead] = useState<boolean>(false);
  const [voiceLang, setVoiceLang] = useState<string>('en-US');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestedPrompts = [
    { title: "Compost Sizing", text: "Estimate compost biodigester yields for 40 kg food scraps" },
    { title: "Solar Inverters", text: "Size a PV solar array for a rooftop of 120 square meters" },
    { title: "Water Audits", text: "Outline leak detection tips for an industrial cooling loop" },
    { title: "Circular Loop", text: "Suggest circular packaging replacements for polystyrene containers" }
  ];

  // Fetch threads on load
  useEffect(() => {
    fetchThreads();
    initSpeechRecognition();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch messages when active thread changes
  useEffect(() => {
    if (activeThreadId) {
      fetch(`/api/messages/${activeThreadId}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data.messages || []);
          scrollToBottom();
        })
        .catch(err => console.error("Error fetching messages:", err));
    }
  }, [activeThreadId]);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
      setThreads(data.chats || []);
      if (data.chats && data.chats.length > 0) {
        setActiveThreadId(data.chats[0].id);
      } else {
        // Create initial thread
        handleCreateThread("General Sustainability Desk");
      }
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  const handleCreateThread = async (title?: string) => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || "New Eco Inquiry" })
      });
      const newThread = await res.json();
      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  const handleDeleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/chats/${id}`, { method: 'DELETE' });
      setThreads(prev => prev.filter(t => t.id !== id));
      if (activeThreadId === id) {
        const remaining = threads.filter(t => t.id !== id);
        if (remaining.length > 0) {
          setActiveThreadId(remaining[0].id);
        } else {
          setActiveThreadId('');
        }
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = voiceLang;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  };

  // Keep recognition lang in sync
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLang;
    }
  }, [voiceLang]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition API is not supported in this browser environment.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Speech Synthesis is not supported in this browser environment.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip Markdown before speaking
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .substring(0, 300); // Speak up to 300 chars first to avoid overflow

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang;
    
    // Choose voice based on language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(voiceLang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || input;
    if (!msgText.trim() || !activeThreadId || loading) return;

    if (!textToSend) setInput('');
    setLoading(true);
    
    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp_u_${Date.now()}`,
      chatId: activeThreadId,
      role: 'user',
      text: msgText,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    scrollToBottom();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeThreadId, message: msgText })
      });
      const reply = await res.json();
      
      // Replace with database persistent messages
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id).concat(reply));
      onPointsUpdate(15); // Add rewards

      // If voice read is enabled, automatically speak reply
      if (autoRead) {
        handleSpeak(reply.text);
      }
    } catch (err) {
      console.error("Chat routing error:", err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Render markdown helper
  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let content: React.ReactNode = line;
      
      // Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-extrabold text-slate-800 mt-3 mb-1.5 font-sans border-b border-slate-100 pb-1">{line.slice(4)}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-extrabold text-slate-800 mt-4 mb-2 font-sans border-b border-slate-100 pb-1">{line.slice(3)}</h3>;
      }

      // Bullet items
      if (line.startsWith('* ') || line.startsWith('- ')) {
        content = <li className="ml-4 list-disc text-slate-600 py-0.5">{parseBoldAndCode(line.slice(2))}</li>;
        return <ul key={idx} className="my-0.5">{content}</ul>;
      }
      
      // Numbered lists
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        content = <li className="ml-4 list-decimal text-slate-600 py-0.5">{parseBoldAndCode(numMatch[2])}</li>;
        return <ol key={idx} className="my-0.5">{content}</ol>;
      }

      return <p key={idx} className="text-slate-600 text-xs leading-relaxed my-1">{parseBoldAndCode(line)}</p>;
    });
  };

  const parseBoldAndCode = (str: string) => {
    // Basic bold ** and code ` parser
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-emerald-700 font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-emerald-800 font-mono border border-slate-200">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] min-h-[500px] animate-fade-in">
      
      {/* Sidebar Threads List */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between h-full shadow-sm">
        <div className="space-y-4 overflow-y-auto max-h-[70%]">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chat History</h3>
            <button 
              onClick={() => handleCreateThread()}
              className="text-[10px] font-sans font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-1 rounded"
            >
              + NEW CHAT
            </button>
          </div>

          <div className="space-y-1">
            {threads.map(t => (
              <div 
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`
                  flex justify-between items-center p-2 rounded-lg text-xs font-semibold cursor-pointer transition
                  ${activeThreadId === t.id 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-150 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                <span className="truncate flex-1 pr-2">{t.title}</span>
                <button 
                  onClick={(e) => handleDeleteThread(t.id, e)}
                  className="text-slate-400 hover:text-red-500 p-0.5 rounded transition"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Voice and Language preference widget */}
        <div className="border-t border-slate-100 pt-4 space-y-3 font-sans text-xs">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">VOICE CONTROLS</p>
          
          <div className="flex items-center justify-between text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              Accent
            </span>
            <select 
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              className="bg-transparent text-slate-700 font-bold focus:outline-none text-xs"
            >
              <option value="en-US">EN-US</option>
              <option value="en-GB">EN-GB</option>
              <option value="en-IN">EN-IN</option>
              <option value="es-ES">ES-ES</option>
            </select>
          </div>

          <button 
            onClick={() => setAutoRead(!autoRead)}
            className={`
              w-full flex items-center justify-between p-2 rounded-lg border transition text-left text-xs font-semibold
              ${autoRead 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                : 'bg-slate-50 border-slate-200 text-slate-500'}
            `}
          >
            <span className="flex items-center gap-1.5">
              {autoRead ? <Volume2 className="h-4 w-4 text-emerald-600 animate-bounce" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
              Auto-read response
            </span>
            <span className="font-bold text-[9px]">{autoRead ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Primary Chat Stage */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden h-full shadow-sm">
        {/* Header bar */}
        <div className="bg-slate-50 border-b border-slate-150 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="h-5 w-5 text-emerald-600 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-slate-800">EcoSense Generative Strategist</p>
              <p className="text-[9px] text-slate-400 font-mono">MODEL: GEMINI-3.5-FLASH COGNITION</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 border border-emerald-150 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full font-sans">
            AI Operational
          </span>
        </div>

        {/* Message scroll container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/10">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0
                  ${isUser 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-500'}
                `}>
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble contents */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-slate-700 shadow-sm text-xs leading-relaxed
                    ${isUser 
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium' 
                      : 'bg-white rounded-tl-none border border-slate-200'}
                  `}>
                    {isUser ? <p className="whitespace-pre-wrap">{m.text}</p> : renderMessageText(m.text)}
                  </div>
                  
                  {/* Action row */}
                  {!isUser && (
                    <div className="flex items-center gap-2.5 px-1 text-[9px] font-sans text-slate-400 font-semibold">
                      <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button 
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-slate-600 transition flex items-center gap-0.5"
                      >
                        {copiedId === m.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        Copy
                      </button>
                      <button 
                        onClick={() => handleSpeak(m.text)}
                        className="hover:text-slate-600 transition flex items-center gap-0.5"
                      >
                        <Volume2 className="h-3 w-3" />
                        Listen
                      </button>
                      <button 
                        onClick={() => handleSendMessage(messages[messages.indexOf(m) - 1]?.text)}
                        className="hover:text-slate-600 transition flex items-center gap-0.5"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Regenerate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-none text-slate-500 text-xs flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>Synthesizing smart eco strategies...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Section */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 space-y-3">
          {/* Suggested Prompts Pill Buttons */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p.text)}
                  className="flex items-center gap-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 text-xs px-2.5 py-1.5 rounded-full transition font-semibold"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  {p.title}
                </button>
              ))}
            </div>
          )}

          {/* Actual keyboard/mic prompt form */}
          <div className="flex gap-2">
            <button
              onClick={toggleSpeechRecognition}
              className={`
                p-2.5 rounded-xl border flex items-center justify-center transition shrink-0
                ${isListening 
                  ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}
              `}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening closely... Speak now..." : "Ask EcoSense AI regarding Clean Tech..."}
              className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center justify-center transition font-bold text-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
