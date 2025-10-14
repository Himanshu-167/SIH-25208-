import React, { useState, useMemo } from 'react';

const StockyardWagonPage = ({ stockyards, rakes }) => {
    const [rakeFilter, setRakeFilter] = useState('All');

    const filteredRakes = useMemo(() => {
        if (rakeFilter === 'All') return rakes;
        return rakes.filter(rake => rake.status === rakeFilter);
    }, [rakes, rakeFilter]);

    const statusOptions = ['All', 'Empty', 'Loaded', 'In Transit'];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Stockyard & Wagon Status (Real-Time)</h1>
            <p className="text-sm text-slate-400">🔄 Data auto-refreshes every 30 seconds (simulated by Firestore update listener)</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Stockyard Inventory Status</h2>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Stockyard', 'Material', 'Available (Tons)', 'Capacity', 'Utilization (%)'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {stockyards.map(stockyard => (
                                    <tr key={stockyard.id} className="hover:bg-slate-800 transition duration-150">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{stockyard.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{stockyard.material}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{stockyard.available.toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-400">{stockyard.capacity}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center">
                                                <div className="w-24 bg-slate-700 rounded-full h-2.5 mr-2">
                                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stockyard.utilization}%` }}></div>
                                                </div>
                                                <span className="text-white text-xs">{stockyard.utilization}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Wagon / Rake Live Status</h2>
                    <div className="mb-4 flex space-x-2">
                        {statusOptions.map(status => (
                            <button key={status} onClick={() => setRakeFilter(status)} className={`px-4 py-1 text-sm font-semibold rounded-2xl transition ${rakeFilter === status ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{status}</button>
                        ))}
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Rake ID', 'Type', 'Status', 'Capacity', 'Dispatch', 'Location'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredRakes.map(rake => (
                                    <tr key={rake.id} className="hover:bg-slate-800 transition duration-150">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{rake.id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{rake.type}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rake.status === 'Empty' ? 'bg-cyan-900/50 text-cyan-300' : rake.status === 'Loaded' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>{rake.status}</span></td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{rake.capacity} Wagons</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{rake.dispatch}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white"><span className="hover:text-red-400 cursor-help" title="Hover to show map location (Future Feature)">{rake.location}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="h-64 bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center text-slate-400 text-lg">🗺️ Google Maps Placeholder: Rake Tracking & Geo-fencing</div>
        </div>
    );
};

export default StockyardWagonPage;
