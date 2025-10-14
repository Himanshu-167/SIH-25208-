import React, { useEffect } from 'react';

const ComparisonModal = ({ open, onClose, aiPlan = [], onApplyPlan }) => {
    const [selected, setSelected] = React.useState([]);

    useEffect(() => {
        if (!open) setSelected([]);
    }, [open]);

    if (!open) return null;

    const toggleSelect = (id) => {
        setSelected(prev => {
            if (prev.includes(id)) return prev.filter(p => p !== id);
            if (prev.length >= 2) return prev; // limit to 2
            return [...prev, id];
        });
    };

    const getPlanById = (id) => aiPlan.find(p => p.id === id) || null;

    const planLeft = selected[0] ? getPlanById(selected[0]) : null;
    const planRight = selected[1] ? getPlanById(selected[1]) : null;

    const computeDelta = (a, b, key) => {
        if (!a || !b) return '—';
        const na = Number(a[key]) || parseFloat(String(a[key]).replace(/[₹,\sCr]/g, '')) || 0;
        const nb = Number(b[key]) || parseFloat(String(b[key]).replace(/[₹,\sCr]/g, '')) || 0;
        const diff = na - nb;
        return (diff > 0 ? `+${diff}` : `${diff}`) + (Number.isFinite(diff) ? '' : '');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg w-11/12 max-w-4xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Compare AI Plans</h3>
                    <div className="text-sm text-slate-400">Select up to 2 plans to compare</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            {aiPlan.map(plan => (
                                <div key={plan.id} className={`p-3 rounded border cursor-pointer ${selected.includes(plan.id) ? 'border-blue-500 bg-blue-50 dark:bg-slate-800' : 'bg-white/0'}`} onClick={() => toggleSelect(plan.id)}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="text-sm font-semibold text-blue-600">{plan.id}</div>
                                            <div className="text-xs text-slate-500">{plan.source} → {plan.destination} · {plan.material}</div>
                                        </div>
                                        <div className="text-sm font-bold">{plan.load.toLocaleString()}t</div>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">Util: {plan.utilization}% · Cost: ₹{plan.cost} Cr</div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border rounded bg-slate-50 dark:bg-slate-800">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-xs text-slate-400">Metric</div>
                                    <div className="font-semibold mt-2">Load (T)</div>
                                    <div className="font-semibold mt-2">Utilization (%)</div>
                                    <div className="font-semibold mt-2">Est. Cost (Cr)</div>
                                    <div className="font-semibold mt-2">Dispatch Time</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Plan A</div>
                                    <div className="mt-2">{planLeft ? planLeft.load.toLocaleString() : '—'}</div>
                                    <div className="mt-2">{planLeft ? `${planLeft.utilization}%` : '—'}</div>
                                    <div className="mt-2">{planLeft ? `₹${planLeft.cost} Cr` : '—'}</div>
                                    <div className="mt-2">{planLeft ? planLeft.dispatchTime : '—'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400">Plan B</div>
                                    <div className="mt-2">{planRight ? planRight.load.toLocaleString() : '—'}</div>
                                    <div className="mt-2">{planRight ? `${planRight.utilization}%` : '—'}</div>
                                    <div className="mt-2">{planRight ? `₹${planRight.cost} Cr` : '—'}</div>
                                    <div className="mt-2">{planRight ? planRight.dispatchTime : '—'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="p-3 border rounded mb-3">
                            <div className="text-sm font-semibold">Comparison Summary</div>
                            <div className="text-xs text-slate-400 mt-2">Deltas (A - B)</div>
                            <div className="mt-3 text-sm">
                                <div>Load Δ: {computeDelta(planLeft || {}, planRight || {}, 'load')}</div>
                                <div>Utilization Δ: {computeDelta(planLeft || {}, planRight || {}, 'utilization')}</div>
                                <div>Cost Δ: {computeDelta(planLeft || {}, planRight || {}, 'cost')}</div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <button disabled={selected.length !== 1 && selected.length !== 2} onClick={() => {
                                const usePlan = selected.length === 1 ? getPlanById(selected[0]) : (planLeft && planRight ? (planLeft.utilization >= planRight.utilization ? planLeft : planRight) : null);
                                if (usePlan) {
                                    onApplyPlan && onApplyPlan(usePlan);
                                    onClose();
                                } else {
                                    alert('Please select at least one plan to apply.');
                                }
                            }} className={`px-4 py-2 rounded ${selected.length === 0 ? 'bg-slate-400 text-slate-700 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                                Apply Selected Plan
                            </button>
                            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-slate-700">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonModal;
