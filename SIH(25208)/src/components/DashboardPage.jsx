import React, { useMemo } from 'react';
import Card from './Card';
import ChartPanel from './ChartPanel';
import PredictiveAnalyticsPanel from './PredictiveAnalyticsPanel';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const RAKE_CHART_DATA = [
    { name: 'Bokaro', rakes: 4 },
    { name: 'Durgapur', rakes: 3 },
    { name: 'Jamshedpur', rakes: 5 },
];

const DESTINATION_CHART_DATA = [
    { name: 'Pune', value: 3500, color: '#3b82f6' },
    { name: 'Mumbai', value: 4200, color: '#10b981' },
    { name: 'Kolkata', value: 2100, color: '#f59e0b' },
    { name: 'Others', value: 1800, color: '#6b7280' },
];

const DISPATCH_TREND_DATA = [
    { date: 'Oct 7', dispatched: 12 },
    { date: 'Oct 8', dispatched: 15 },
    { date: 'Oct 9', dispatched: 10 },
    { date: 'Oct 10', dispatched: 18 },
    { date: 'Oct 11', dispatched: 22 },
    { date: 'Oct 12', dispatched: 19 },
    { date: 'Oct 13', dispatched: 25 },
];

const DashboardPage = ({ orders, stockyards, rakes, darkMode, onGenerateAIPlan, onViewAlerts, onDownloadReport, onOpenCompare, CpuIcon, TruckIcon, PlusIcon, CheckIcon }) => {
    const totalMaterial = stockyards.reduce((sum, s) => sum + s.available, 0).toLocaleString();
    const availableRakes = rakes.filter(r => r.status === 'Empty').length;
    const activeOrders = orders.filter(o => o.status !== 'Dispatched').length;
    const totalCost = '₹18.2 Cr';

    const KPIs = useMemo(() => [
        { title: 'Total Material Available', value: `${totalMaterial} tons`, icon: PackageIcon, color: 'text-green-400' },
        { title: 'Rakes Available', value: availableRakes, icon: TruckIcon, color: 'text-cyan-400' },
        { title: 'Active Orders', value: activeOrders, icon: PlusIcon, color: 'text-yellow-400' },
        { title: 'Total Estimated Cost (Today)', value: totalCost, icon: CheckIcon, color: 'text-red-400' },
    ], [totalMaterial, availableRakes, activeOrders]);

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-extrabold text-white">Logistics Command Center</h1>

            <PredictiveAnalyticsPanel stockyards={stockyards} rakes={rakes} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KPIs.map((kpi, index) => (
                    <Card key={index} {...kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartPanel title="Rakes Formed per Stockyard Today (Bar Chart)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={RAKE_CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rakes" name="Rakes Formed" radius={[10, 10, 0, 0]} fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Material Distribution per Destination (Pie Chart)">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={DESTINATION_CHART_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {DESTINATION_CHART_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Daily Dispatch Trend (Last 7 Days) (Line Graph)">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={DISPATCH_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 'auto']} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="dispatched" name="Total Dispatches" dot={{ r: 5 }} activeDot={{ r: 8 }} stroke="#10b981" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartPanel>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={onGenerateAIPlan} className="bg-blue-600 text-white px-4 py-2 rounded">Generate AI Plan</button>
                <button onClick={onViewAlerts} className="bg-yellow-600 text-white px-4 py-2 rounded">View Delay Alerts</button>
                <button onClick={onDownloadReport} className="bg-slate-700 text-white px-4 py-2 rounded">Download Daily Report</button>
                <button onClick={onOpenCompare} className="bg-green-600 text-white px-4 py-2 rounded">Compare Plans</button>
            </div>
        </div>
    );
};

// A small local import for PackageIcon used above; to avoid circular import we define it here for display only.
const PackageIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9.87 2.02c.57.12 1.05.57 1.25 1.13L20 12l-2.38 4.58c-.2.56-.68 1.01-1.25 1.13l-9.87 2.02c-.8.16-1.5-.12-1.8-.8L2 15V9l3.5-.7c.3-.68 1-1.16 1.8-1.01Z"/><path d="m11.16 2.14.77 1.87m-1.72 17.5.77-1.87"/></svg>);

export default DashboardPage;
