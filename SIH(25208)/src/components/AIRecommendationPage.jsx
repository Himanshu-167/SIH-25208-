import React from 'react';
import IconButton from './IconButton';

const AIRecommendationPage = ({ planData = [], CpuIcon, CheckIcon, DownloadIcon }) => {
    const totalRakes = planData.length;
    const totalCost = planData.reduce((sum, p) => sum + (Number(p.cost) || 0), 0).toFixed(1);
    const avgUtilization = totalRakes ? (planData.reduce((sum, p) => sum + (Number(p.utilization) || 0), 0) / totalRakes).toFixed(0) : 0;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">AI Optimization Result (Dispatch Plan)</h1>

            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-4">
                    <IconButton className="bg-blue-600 text-white hover:bg-blue-700">
                        {CpuIcon && <CpuIcon className="w-5 h-5 mr-2" />}
                        Run AI Optimization
                    </IconButton>
                    <div className="text-sm text-green-400 flex items-center">
                        {CheckIcon && <CheckIcon className="w-5 h-5 mr-1" />}
                        Last Run: 13 Oct 2025, 15:30
                    </div>
                </div>
                <div className="text-sm text-yellow-400 flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Calculating best rake composition... (Simulated)
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-white">Recommended Dispatch Schedule</h2>
                    <div className="overflow-x-auto rounded-xl mb-6">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Rake ID', 'Source', 'Destination', 'Material', 'Load (Tons)', 'Utilization (%)', 'Est. Cost (₹)', 'Dispatch Time'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {planData.map(plan => (
                                    <tr key={plan.id} className="hover:bg-slate-800 transition duration-150">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{plan.id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{plan.source}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{plan.destination}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{plan.material}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{Number(plan.load).toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">{plan.utilization}%</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">₹{plan.cost} Cr</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{plan.dispatchTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-slate-700 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-lg font-bold text-blue-400">Cost Summary</p>
                            <p className="text-sm text-slate-300">Total rakes planned: <span className="font-semibold text-white">{totalRakes}</span></p>
                            <p className="text-sm text-slate-300">Total transport cost: <span className="font-semibold text-red-400">₹{totalCost} Cr</span></p>
                            <p className="text-sm text-slate-300">Average utilization: <span className="font-semibold text-green-400">{avgUtilization}%</span></p>
                        </div>
                        <IconButton className="bg-blue-500 text-white hover:bg-blue-600">View Details</IconButton>
                    </div>
                </div>

                <div className="lg:w-80 bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Constraints Summary</h2>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex justify-between items-center"><span>Minimum Rake Size: 3500 Tons</span><CheckIcon className="w-5 h-5 text-green-500" /></li>
                        <li className="flex justify-between items-center"><span>Siding Capacity Check: 4</span><CheckIcon className="w-5 h-5 text-green-500" /></li>
                        <li className="flex justify-between items-center"><span>Route Restrictions: None</span><CpuIcon className="w-5 h-5 text-yellow-500" /></li>
                        <li className="flex justify-between items-center"><span>High Priority SLA Met: 100%</span><CheckIcon className="w-5 h-5 text-green-500" /></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-700">
                <button className="bg-green-600 text-white px-4 py-2 rounded"><CheckIcon className="w-4 h-4 inline mr-2" />Approve & Dispatch Plan</button>
                <button className="bg-slate-700 text-white px-4 py-2 rounded"><DownloadIcon className="w-4 h-4 inline mr-2" />Export to Excel/PDF</button>
            </div>
        </div>
    );
};

export default AIRecommendationPage;
