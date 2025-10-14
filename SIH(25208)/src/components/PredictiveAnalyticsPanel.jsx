import React from 'react';

const PredictiveAnalyticsPanel = ({ stockyards = [], rakes = [], aiPlan = [] }) => {
    const shortages = stockyards.filter(s => s.available < 20000).map(s => `${s.material} in ${s.name} will run low in ~3 days`);
    const wagonShortage = rakes.filter(r => r.status !== 'Empty').length > (rakes.length * 0.6) ? 'High probability of wagon shortage in next 48 hrs' : 'Wagon capacity adequate';
    const suggestedTransfers = [{ from: 'Bokaro', to: 'Rourkela', material: 'Coal', qty: 500 }];

    return (
        <div className="bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-lg font-bold text-blue-400 mb-2">⚙️ Predictive AI Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-700 rounded">
                    <p className="text-sm text-slate-300">📈 Predicted Material Shortage</p>
                    {shortages.length ? shortages.map((s,i)=>(<p key={i} className="text-white text-sm">• {s}</p>)) : <p className="text-white text-sm">No immediate shortages predicted</p>}
                </div>
                <div className="p-3 bg-slate-700 rounded">
                    <p className="text-sm text-slate-300">🚂 Wagon Shortage Assessment</p>
                    <p className="text-white text-sm">{wagonShortage}</p>
                </div>
                <div className="p-3 bg-slate-700 rounded">
                    <p className="text-sm text-slate-300">📦 Suggested Transfers</p>
                    {suggestedTransfers.map((t, i) => (
                        <p key={i} className="text-white text-sm">Move <strong>{t.qty} tons</strong> {t.material} from {t.from} to {t.to}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PredictiveAnalyticsPanel;
