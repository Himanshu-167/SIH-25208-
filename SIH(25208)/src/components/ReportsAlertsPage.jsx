import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import IconButton from './IconButton';

const ReportsAlertsPage = ({ alerts = [] }) => {
    const [alertFilter, setAlertFilter] = useState('Active');

    const filteredAlerts = useMemo(() => {
        if (alertFilter === 'All') return alerts;
        return alerts.filter(alert => alert.status === alertFilter);
    }, [alerts, alertFilter]);

    const reportData = [
        { date: 'Oct 7', formed: 12, utilization: 88, onTime: 95, cost: 15.2 },
        { date: 'Oct 8', formed: 15, utilization: 92, onTime: 90, cost: 18.5 },
        { date: 'Oct 9', formed: 10, utilization: 85, onTime: 98, cost: 12.1 },
        { date: 'Oct 10', formed: 18, utilization: 98, onTime: 85, cost: 21.9 },
        { date: 'Oct 11', formed: 22, utilization: 94, onTime: 92, cost: 26.5 },
    ];

    const alertStatusColors = {
        Active: 'bg-red-900/50 text-red-300 border-red-500',
        Resolved: 'bg-green-900/50 text-green-300 border-green-500',
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Reports & Critical Alerts</h1>

            <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-400">Dispatch Efficiency Report</h2>
                    <select className="bg-slate-700 text-white border border-slate-600 rounded-2xl p-2 text-sm">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Custom Range</option>
                    </select>
                </div>

                <div className="h-72 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={reportData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis yAxisId="cost" orientation="left" stroke="#ef4444" domain={[10, 'auto']} label={{ value: 'Cost (Cr)', angle: -90, position: 'insideLeft', fill: '#ef4444' }} />
                            <YAxis yAxisId="util" orientation="right" stroke="#10b981" domain={[80, 100]} label={{ value: 'Utilization (%)', angle: 90, position: 'insideRight', fill: '#10b981' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc' }} />
                            <Legend />
                            <Line yAxisId="cost" type="monotone" dataKey="cost" stroke="#ef4444" name="Cost (₹ Cr)" />
                            <Line yAxisId="util" type="monotone" dataKey="utilization" stroke="#10b981" name="Avg. Utilization (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-700">
                            <tr>
                                {['Date', 'Rakes Formed', 'Avg. Utilization', 'On-Time Dispatch (%)', 'Cost (₹ Cr)'].map(header => (
                                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {reportData.map(report => (
                                <tr key={report.date} className="hover:bg-slate-800 transition duration-150">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{report.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{report.formed}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">{report.utilization}%</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-400">{report.onTime}%</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">₹{report.cost} Cr</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                <h2 className="text-xl font-bold mb-4 text-red-400">Critical Alerts Feed</h2>
                <div className="flex space-x-2 mb-4">
                    {['Active', 'Resolved', 'All'].map(status => (
                        <button key={status} onClick={() => setAlertFilter(status)} className={`px-4 py-1 text-sm font-semibold rounded-2xl transition ${alertFilter === status ? 'bg-red-600 text-white shadow-md' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{status}</button>
                    ))}
                </div>
                <div className="space-y-3">
                    {filteredAlerts.map((alert, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border-l-4 ${alertStatusColors[alert.status]} transition duration-150`}>
                            <div className="flex-grow">
                                <div className={`font-bold ${alert.priority === 'High' ? 'text-red-300' : 'text-yellow-300'}`}>{alert.type} - {alert.priority}</div>
                                <p className="text-sm text-white">{alert.message}</p>
                                <span className="text-xs text-slate-400 mt-1 block">{alert.date}</span>
                            </div>
                            <div className="space-x-2">
                                <IconButton className="bg-slate-700 text-white hover:bg-slate-600 p-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg></IconButton>
                                <IconButton className="bg-blue-600 text-white hover:bg-blue-700 p-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg></IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsAlertsPage;
