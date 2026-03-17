'use client'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, Zap, Search, Image, Mic, Settings } from 'lucide-react'

interface Message { role: 'user'|'assistant'; content: string; model?: string }

const MODELS = [
  { id: 'grok-4.20-beta-0309-reasoning', label: 'Grok 4.20 Reasoning', badge: '🧠' },
  { id: 'grok-4.20-beta-0309-non-reasoning', label: 'Grok 4.20 Fast', badge: '⚡' },
  { id: 'grok-4-1-fast-reasoning', label: 'Grok 4.1 Fast', badge: '🚀' },
  { id: 'grok-code-fast-1', label: 'Grok Code', badge: '💻' },
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(MODELS[0].id)
  const [webSearch, setWebSearch] = useState(false)
  const [useMemory, setUseMemory] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], model, webSearch, useMemory })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, model: data.model }])
    } catch(e) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error: ' + String(e) }])
    }
    setLoading(false)
  }

  return (
    <div className="flex h-screen" style={{background:'#0a0a0f'}}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r" style={{background:'#0d0d14',borderColor:'#1e1e2e'}}>
        <div className="p-4 border-b" style={{borderColor:'#1e1e2e'}}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#7c3aed,#06b6d4)'}}>
              <Zap size={16} className="text-white"/>
            </div>
            <div>
              <div className="font-bold text-sm" style={{color:'#e2e8f0'}}>GigaGrok</div>
              <div className="text-xs" style={{color:'#64748b'}}>nexus-oc.pl</div>
            </div>
          </div>
        </div>
        <div className="p-3 flex-1">
          <button onClick={()=>setMessages([])} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80" style={{background:'#1e1e2e',color:'#e2e8f0'}}>
            + New Chat
          </button>
          <div className="mt-4">
            <div className="text-xs font-medium mb-2 px-1" style={{color:'#64748b'}}>MODEL</div>
            {MODELS.map(m => (
              <button key={m.id} onClick={()=>setModel(m.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs mb-1 transition-colors"
                style={{background: model===m.id ? '#1e1e2e' : 'transparent', color: model===m.id ? '#e2e8f0' : '#64748b'}}>
                {m.badge} {m.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-xs font-medium mb-2 px-1" style={{color:'#64748b'}}>TOOLS</div>
            <label className="flex items-center gap-2 px-1 py-1 cursor-pointer">
              <input type="checkbox" checked={webSearch} onChange={e=>setWebSearch(e.target.checked)}
                className="rounded" style={{accentColor:'#7c3aed'}}/>
              <Search size={12} style={{color:'#64748b'}}/>
              <span className="text-xs" style={{color:'#64748b'}}>Web Search</span>
            </label>
            <label className="flex items-center gap-2 px-1 py-1 cursor-pointer">
              <input type="checkbox" checked={useMemory} onChange={e=>setUseMemory(e.target.checked)}
                className="rounded" style={{accentColor:'#7c3aed'}}/>
              <Bot size={12} style={{color:'#64748b'}}/>
              <span className="text-xs" style={{color:'#64748b'}}>Memory Search</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="px-6 py-3 border-b flex items-center justify-between" style={{borderColor:'#1e1e2e',background:'#0d0d14'}}>
          <div className="text-sm" style={{color:'#64748b'}}>
            {MODELS.find(m=>m.id===model)?.badge} {MODELS.find(m=>m.id===model)?.label}
            {webSearch && <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{background:'#1e1e2e',color:'#06b6d4'}}>🌐 Search</span>}
            {useMemory && <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{background:'#1e1e2e',color:'#7c3aed'}}>🧠 Memory</span>}
          </div>
          <div className="text-xs" style={{color:'#64748b'}}>grok.nexus-oc.pl</div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full" style={{color:'#64748b'}}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background:'linear-gradient(135deg,#7c3aed20,#06b6d420)',border:'1px solid #1e1e2e'}}>
                <Zap size={32} style={{color:'#7c3aed'}}/>
              </div>
              <div className="text-xl font-bold mb-2" style={{color:'#e2e8f0'}}>GigaGrok</div>
              <div className="text-sm text-center max-w-sm">Powered by Grok 4.20 · Web Search · Memory</div>
            </div>
          )}
          {messages.map((m,i) => (
            <div key={i} className={`flex gap-3 mb-6 ${m.role==='user'?'justify-end':''}`}>
              {m.role==='assistant' && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#7c3aed,#06b6d4)'}}>
                  <Bot size={16} className="text-white"/>
                </div>
              )}
              <div className={`max-w-2xl rounded-2xl px-4 py-3 ${m.role==='user'?'rounded-tr-sm':'rounded-tl-sm'}`}
                style={{background: m.role==='user'?'#1e1e2e':'#13131a', border:'1px solid #1e1e2e'}}>
                {m.role==='assistant' ? (
                  <div className="prose prose-invert text-sm" style={{color:'#e2e8f0'}}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm" style={{color:'#e2e8f0'}}>{m.content}</p>
                )}
                {m.model && <div className="text-xs mt-1" style={{color:'#64748b'}}>{m.model}</div>}
              </div>
              {m.role==='user' && (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#1e1e2e'}}>
                  <User size={16} style={{color:'#64748b'}}/>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#7c3aed,#06b6d4)'}}>
                <Bot size={16} className="text-white"/>
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3" style={{background:'#13131a',border:'1px solid #1e1e2e'}}>
                <div className="flex gap-1">
                  {[0,1,2].map(i=>(<div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{background:'#7c3aed',animationDelay:`${i*0.15}s`}}/>))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{borderColor:'#1e1e2e',background:'#0d0d14'}}>
          <div className="flex gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-3" style={{background:'#1e1e2e',border:'1px solid #2a2a3e'}}>
              <textarea value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
                placeholder="Message GigaGrok..."
                rows={1} className="flex-1 bg-transparent resize-none outline-none text-sm"
                style={{color:'#e2e8f0',maxHeight:'120px'}}/>
            </div>
            <button onClick={send} disabled={loading||!input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-opacity"
              style={{background:'linear-gradient(135deg,#7c3aed,#06b6d4)',opacity:loading||!input.trim()?0.5:1}}>
              <Send size={16} className="text-white"/>
            </button>
          </div>
          <div className="text-center text-xs mt-2" style={{color:'#64748b'}}>GigaGrok may make mistakes. Verify important info.</div>
        </div>
      </main>
    </div>
  )
}
