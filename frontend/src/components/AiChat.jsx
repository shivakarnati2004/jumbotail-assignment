import { useState, useRef, useEffect } from 'react';
import { aiChat } from '../api';

const quickStarters = [
    'How is shipping cost calculated?',
    'Which warehouses do we have?',
    'Compare Mini Van vs Truck shipping',
    'Tips to reduce shipping charges',
];

export default function AiChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I\'m the **Jumbotail AI Assistant** 🤖\n\nI can help you with shipping costs, warehouse info, product recommendations, and logistics insights.\n\nTry asking me anything!' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(quickStarters);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    const send = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput('');
        setSuggestions([]);

        const history = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, text: m.text }));
        setMessages(prev => [...prev, { role: 'user', text: msg }]);
        setLoading(true);

        try {
            const res = await aiChat(msg, history);
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
            if (res.data.suggestions?.length) setSuggestions(res.data.suggestions);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: `⚠️ ${e.message}` }]);
        }
        setLoading(false);
    };

    const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

    // Simple markdown-like rendering
    const renderText = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:#f0f2f8;padding:2px 5px;border-radius:3px;font-size:0.82em">$1</code>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            {/* FAB */}
            <button onClick={() => setOpen(o => !o)} style={{
                position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d8e3c, #f5841f)',
                border: 'none', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(45,142,60,0.4)',
                transition: 'all 0.2s ease', color: 'white', fontSize: '1.5rem',
            }}>
                {open ? '✕' : '🤖'}
            </button>

            {/* Chat panel */}
            {open && (
                <div style={{
                    position: 'fixed', bottom: 92, right: 24, zIndex: 8999,
                    width: 400, maxHeight: 560,
                    background: 'white', borderRadius: 16,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', animation: 'slideUp 0.3s ease',
                    border: '1px solid #e5e7eb',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
                        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                        color: 'white',
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2d8e3c, #f5841f)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem',
                        }}>🤖</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Jumbotail AI</div>
                            <div style={{ fontSize: '0.68rem', opacity: 0.6 }}>Powered by Google Gemini</div>
                        </div>
                        <div style={{
                            marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
                            background: '#4ade80', boxShadow: '0 0 6px #4ade80',
                        }}></div>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflow: 'auto', padding: '16px',
                        display: 'flex', flexDirection: 'column', gap: 12,
                        maxHeight: 360, minHeight: 200,
                    }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                            }}>
                                <div style={{
                                    padding: '10px 14px', borderRadius: 12,
                                    background: m.role === 'user'
                                        ? 'linear-gradient(135deg, #2d8e3c, #4caf50)'
                                        : '#f4f5f9',
                                    color: m.role === 'user' ? 'white' : '#1a1a2e',
                                    fontSize: '0.84rem', lineHeight: 1.55,
                                    borderBottomRightRadius: m.role === 'user' ? 4 : 12,
                                    borderBottomLeftRadius: m.role === 'user' ? 12 : 4,
                                }} dangerouslySetInnerHTML={{ __html: renderText(m.text) }} />
                            </div>
                        ))}
                        {loading && (
                            <div style={{
                                alignSelf: 'flex-start', padding: '10px 14px',
                                background: '#f4f5f9', borderRadius: 12,
                                fontSize: '0.84rem', color: '#9ca3af',
                                borderBottomLeftRadius: 4,
                            }}>
                                <span style={{ display: 'inline-flex', gap: 4 }}>
                                    <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                                    <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
                                    <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
                                </span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && !loading && (
                        <div style={{
                            padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 6,
                        }}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => send(s)} style={{
                                    padding: '5px 10px', border: '1px solid #e5e7eb',
                                    borderRadius: 20, background: 'white', cursor: 'pointer',
                                    fontSize: '0.7rem', color: '#2d8e3c', fontWeight: 500,
                                    transition: 'all 0.15s', fontFamily: 'inherit',
                                }}>{s}</button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: '12px 16px', borderTop: '1px solid #e5e7eb',
                        display: 'flex', gap: 8, alignItems: 'center',
                    }}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask about shipping, products..."
                            style={{
                                flex: 1, padding: '10px 14px', border: '1px solid #e5e7eb',
                                borderRadius: 24, outline: 'none', fontSize: '0.84rem',
                                fontFamily: 'inherit', background: '#f4f5f9',
                                transition: 'border 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#2d8e3c'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: input.trim() ? 'linear-gradient(135deg, #2d8e3c, #f5841f)' : '#e5e7eb',
                            border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '1rem', transition: 'all 0.2s',
                        }}>➤</button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
        </>
    );
}
