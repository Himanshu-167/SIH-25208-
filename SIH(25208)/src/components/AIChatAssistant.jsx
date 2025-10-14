import React, { useEffect, useState } from 'react';

const AIChatAssistant = ({ aiPlan = [], rakes = [], onGenerateAIPlan, onViewAlerts, onOpenCompare, setCurrentPage, onDownloadReport }) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState(() => {
        try { const raw = localStorage.getItem('ai_chat_history'); return raw ? JSON.parse(raw) : [{ role: 'bot', text: 'Hi — I can generate plans, show alerts, or navigate.' }]; } catch (e) { return [{ role: 'bot', text: 'Hi — I can generate plans, show alerts, or navigate.' }]; }
    });
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => { try { localStorage.setItem('ai_chat_history', JSON.stringify(history)); } catch (e) {} }, [history]);

    const findUnderutilized = () => {
        const list = rakes.filter(r => (r.capacity && r.capacity < 58) || r.status === 'Empty').slice(0,5);
        if (!list.length) return 'No underutilized rakes detected.';
        return `Underutilized: ${list.map(r=>r.id).join(', ')}.`;
    };

    const getResponse = async (q) => {
        const qq = q.toLowerCase();
        if (qq.includes('generate plan') || qq.includes('create plan') || qq.includes('run ai')) { onGenerateAIPlan && onGenerateAIPlan(); return 'Generating a new AI plan now. I added it to the AI Plan list.'; }
        if (qq.includes('show alert') || qq.includes('alerts') || qq.includes('delay')) { onViewAlerts && onViewAlerts(); return 'Showing delay alerts. Check the Reports & Alerts page.'; }
        if (qq.includes('ai plan') || qq.includes('open ai plan') || qq.includes('open plan')) { setCurrentPage && setCurrentPage('ai_plan'); return 'Navigated to AI Plan page.'; }
        if (qq.includes('compare')) { onOpenCompare && onOpenCompare(); return 'Opening the Compare Plans modal.'; }
        if (qq.includes('download') || qq.includes('export')) { onDownloadReport && onDownloadReport(); return 'Preparing AI plan export (CSV). File should download shortly.'; }
        if (qq.includes('underutilized')) { return findUnderutilized(); }
        return "I can generate plans, show alerts, compare plans, or navigate to the AI Plan page. Try 'generate plan' or 'compare'.";
    };

    const send = async () => {
        if (!input.trim()) return;
        const message = input.trim();
        setHistory(h => [...h, { role: 'you', text: message }]);
        setInput('');
        setIsTyping(true);
        setTimeout(async () => {
            const resp = await getResponse(message);
            setHistory(h => [...h, { role: 'bot', text: resp }]);
            setIsTyping(false);
        }, 600);
    };

    const quickAction = (action) => {
        if (action === 'generate') { onGenerateAIPlan && onGenerateAIPlan(); setHistory(h => [...h, { role: 'bot', text: 'Generated a new plan (quick action).' }]); }
        if (action === 'alerts') { onViewAlerts && onViewAlerts(); setHistory(h => [...h, { role: 'bot', text: 'Displayed alerts (quick action).' }]); }
        if (action === 'compare') { onOpenCompare && onOpenCompare(); setHistory(h => [...h, { role: 'bot', text: 'Opened comparison modal (quick action).' }]); }
        if (action === 'export') { onDownloadReport && onDownloadReport(); setHistory(h => [...h, { role: 'bot', text: 'Started export (quick action).' }]); }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="flex flex-col items-end">
                {open && (
                    <div className="w-80 bg-slate-800 p-3 rounded-lg shadow-lg mb-2">
                        <div className="h-40 overflow-y-auto mb-2">
                            {history.map((m, i) => (
                                <div key={i} className={`mb-1 ${m.role==='you'?'text-right':''}`}><span className="text-sm text-white">{m.text}</span></div>
                            ))}
                            {isTyping && <div className="text-sm text-slate-400">Assistant is typing...</div>}
                        </div>
                        <div className="flex mb-2 space-x-1">
                            <button onClick={()=>quickAction('generate')} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Generate Plan</button>
                            <button onClick={()=>quickAction('alerts')} className="px-2 py-1 bg-yellow-600 text-white rounded text-xs">View Alerts</button>
                            <button onClick={()=>quickAction('compare')} className="px-2 py-1 bg-green-600 text-white rounded text-xs">Compare</button>
                            <button onClick={()=>quickAction('export')} className="px-2 py-1 bg-slate-700 text-white rounded text-xs">Export CSV</button>
                        </div>
                        <div className="flex">
                            <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter' && send()} className="flex-grow p-2 rounded-l bg-slate-700 text-white text-sm" />
                            <button onClick={send} className="px-3 bg-blue-600 text-white rounded-r">Send</button>
                        </div>
                    </div>
                )}
                <button onClick={()=>setOpen(o=>!o)} className="p-3 rounded-full bg-blue-600 text-white shadow-lg">🤖</button>
            </div>
        </div>
    );
};

export default AIChatAssistant;
