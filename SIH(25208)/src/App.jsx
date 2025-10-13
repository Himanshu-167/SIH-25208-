import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// --- FIREBASE IMPORTS (REQUIRED FOR PERSISTENCE) ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, query, onSnapshot, setDoc, updateDoc, deleteDoc, where } from 'firebase/firestore';

// --- ICON COMPONENTS (Lucide React style, simplified as SVG for single-file) ---
const HomeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const PackageIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9.87 2.02c.57.12 1.05.57 1.25 1.13L20 12l-2.38 4.58c-.2.56-.68 1.01-1.25 1.13l-9.87 2.02c-.8.16-1.5-.12-1.8-.8L2 15V9l3.5-.7c.3-.68 1-1.16 1.8-1.01Z"/><path d="m11.16 2.14.77 1.87m-1.72 17.5.77-1.87"/></svg>);
const TruckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-3V8h3a1 1 0 0 0 1-1V6h-4"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>);
const CpuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/><path d="M15 4h.01"/><path d="M15 20h.01"/><path d="M4 15h.01"/><path d="M20 15h.01"/></svg>);
const BellIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);
const MoonIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>);
const SunIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>);
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const FilterIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const PlusIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>);
const CheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>);
const DownloadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);

const NAV_ITEMS = [
    { name: 'Dashboard', path: 'dashboard', icon: HomeIcon },
    { name: 'Orders', path: 'orders', icon: PackageIcon },
    { name: 'Stockyards', path: 'stockyards', icon: TruckIcon },
    { name: 'AI Plan', path: 'ai_plan', icon: CpuIcon },
    { name: 'Reports', path: 'reports', icon: BellIcon },
];

const OrderStatusColors = {
    Pending: 'text-yellow-400 bg-yellow-400/10',
    Planned: 'text-blue-400 bg-blue-400/10',
    Dispatched: 'text-green-400 bg-green-400/10',
    Delayed: 'text-red-400 bg-red-400/10',
};

// --- DUMMY DATA FOR INITIAL STATE ---

const initialOrders = [
    { id: 'ORD001', customer: 'TATA Motors', destination: 'Pune', material: 'Steel Coil', quantity: 1500, priority: 'High', sla: '14 Oct 2025', status: 'Pending' },
    { id: 'ORD002', customer: 'JSW Plant', destination: 'Mumbai', material: 'Iron Ore', quantity: 2000, priority: 'Low', sla: '18 Oct 2025', status: 'Planned' },
    { id: 'ORD003', customer: 'SAIL Foundry', destination: 'Kolkata', material: 'Coal', quantity: 800, priority: 'Medium', sla: '15 Oct 2025', status: 'Pending' },
    { id: 'ORD004', customer: 'Adani Infra', destination: 'Delhi', material: 'Coke', quantity: 3500, priority: 'High', sla: '13 Oct 2025', status: 'Pending' },
    { id: 'ORD005', customer: 'Vedanta Ltd', destination: 'Chennai', material: 'Alumina', quantity: 1200, priority: 'Medium', sla: '20 Oct 2025', status: 'Dispatched' },
];

const initialStockyards = [
    { id: 'SYD01', name: 'Bokaro', material: 'Iron Ore', available: 20000, capacity: '4 Rakes/day', utilization: 80 },
    { id: 'SYD02', name: 'Durgapur', material: 'Coal', available: 15000, capacity: '3 Rakes/day', utilization: 60 },
    { id: 'SYD03', name: 'Jamshedpur', material: 'Steel Coil', available: 80000, capacity: '5 Rakes/day', utilization: 95 },
];

const initialRakes = [
    { id: 'RAK001', type: 'BOXN', status: 'Empty', capacity: 58, dispatch: '-', location: 'Bokaro' },
    { id: 'RAK002', type: 'BRN', status: 'Loaded', capacity: 56, dispatch: '13 Oct 2025', location: 'On Route to Pune' },
    { id: 'RAK003', type: 'BOBY', status: 'In Transit', capacity: 50, dispatch: '15 Oct 2025', location: 'Near Delhi' },
    { id: 'RAK004', type: 'BOXN', status: 'Empty', capacity: 58, dispatch: '-', location: 'Durgapur' },
];

const aiPlanData = [
    { id: 'RAK011', source: 'Bokaro', destination: 'Durgapur', material: 'Iron Ore', load: 3800, utilization: 95, cost: 2.5, dispatchTime: '13 Oct 2025, 16:00' },
    { id: 'RAK012', source: 'Durgapur', destination: 'Mumbai', material: 'Steel Coil', load: 4000, utilization: 100, cost: 3.1, dispatchTime: '13 Oct 2025, 20:00' },
    { id: 'RAK013', source: 'Jamshedpur', destination: 'Pune', material: 'Coal', load: 3500, utilization: 88, cost: 2.8, dispatchTime: '14 Oct 2025, 08:00' },
];

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

const ALERT_DATA = [
    { type: 'Delay', message: 'Rake RAK009 delayed by 2 hrs (engine fault).', priority: 'High', date: '12 Oct 2025', status: 'Active' },
    { type: 'Shortage', message: 'Iron Ore below threshold at Durgapur stockyard.', priority: 'Medium', date: '12 Oct 2025', status: 'Active' },
    { type: 'Maintenance', message: 'Loading bay 2 at Bokaro requires inspection.', priority: 'Low', date: '13 Oct 2025', status: 'Resolved' },
];

// --- UTILITY COMPONENTS ---

const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 border border-slate-700">
        <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-400 uppercase">{title}</h3>
            <Icon className={`w-6 h-6 ${color || 'text-blue-400'}`} />
        </div>
        <p className="text-3xl font-bold mt-2 text-white">{value}</p>
    </div>
);

const IconButton = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center p-3 text-sm font-medium rounded-2xl transition duration-300 shadow-lg 
                   ${className}`}
    >
        {children}
    </button>
);

// --- NAVIGATION BAR ---

const Navbar = ({ currentPage, setCurrentPage, darkMode, toggleDarkMode, userId, isAuthReady }) => {
    const navItemClass = (path) =>
        `flex items-center space-x-2 p-3 rounded-2xl transition duration-200 
         ${currentPage === path
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
            : 'text-slate-300 hover:bg-slate-700/50 hover:text-blue-400'
        }`;

    return (
        <header className={`sticky top-0 z-10 p-4 border-b ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-2xl font-black text-blue-500 tracking-wider">
                        RAKE<span className="text-white bg-blue-500 px-1 rounded">OPT</span>
                    </div>
                    <nav className="flex space-x-1">
                        {NAV_ITEMS.map(item => (
                            <a
                                key={item.path}
                                href="#"
                                onClick={() => setCurrentPage(item.path)}
                                className={navItemClass(item.path)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{item.name}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <IconButton
                        onClick={toggleDarkMode}
                        className={`${darkMode ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} p-2 w-10 h-10`}
                    >
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </IconButton>
                    <div className="flex items-center space-x-2 text-slate-400 border border-slate-700 p-2 rounded-2xl text-xs sm:text-sm">
                        {isAuthReady ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>User ID: {userId.substring(0, 8)}...</span>
                            </>
                        ) : (
                            <span>Authenticating...</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// --- 1. DASHBOARD PAGE ---

const DashboardPage = ({ orders, stockyards, rakes, darkMode, onGenerateAIPlan, onViewAlerts, onDownloadReport, onOpenCompare }) => {
    // KPI Calculations
    const totalMaterial = stockyards.reduce((sum, s) => sum + s.available, 0).toLocaleString();
    const availableRakes = rakes.filter(r => r.status === 'Empty').length;
    const activeOrders = orders.filter(o => o.status !== 'Dispatched').length;
    const totalCost = '₹18.2 Cr'; // Mock KPI

    const KPIs = useMemo(() => [
        { title: 'Total Material Available', value: `${totalMaterial} tons`, icon: PackageIcon, color: 'text-green-400' },
        { title: 'Rakes Available', value: availableRakes, icon: TruckIcon, color: 'text-cyan-400' },
        { title: 'Active Orders', value: activeOrders, icon: PlusIcon, color: 'text-yellow-400' },
        { title: 'Total Estimated Cost (Today)', value: totalCost, icon: CheckIcon, color: 'text-red-400' },
    ], [totalMaterial, availableRakes, activeOrders]);

    const chartConfig = {
        bar: { fill: '#3b82f6' },
        line: { stroke: '#10b981' },
        axis: { stroke: darkMode ? '#94a3b8' : '#334155' },
        grid: { stroke: darkMode ? '#475569' : '#e2e8f0' },
        tooltip: { background: darkMode ? '#1e293b' : '#f1f5f9', color: darkMode ? '#f8fafc' : '#0f172a' },
    };

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-extrabold text-white">Logistics Command Center</h1>

            {/* Predictive Analytics Panel (AI Insights) */}
            <PredictiveAnalyticsPanel stockyards={stockyards} rakes={rakes} aiPlan={aiPlanData} />

            {/* Section 1: Key KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {KPIs.map((kpi, index) => (
                    <Card key={index} {...kpi} />
                ))}
            </div>

            {/* Section 2: Data Visualization Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartPanel title="Rakes Formed per Stockyard Today (Bar Chart)" darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={RAKE_CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid.stroke} />
                            <XAxis dataKey="name" stroke={chartConfig.axis.stroke} />
                            <YAxis stroke={chartConfig.axis.stroke} />
                            <Tooltip contentStyle={{ backgroundColor: chartConfig.tooltip.background, border: 'none', borderRadius: '8px' }} itemStyle={{ color: chartConfig.tooltip.color }} />
                            <Legend />
                            <Bar dataKey="rakes" name="Rakes Formed" radius={[10, 10, 0, 0]} {...chartConfig.bar} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Material Distribution per Destination (Pie Chart)" darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={DESTINATION_CHART_DATA}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {DESTINATION_CHART_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: chartConfig.tooltip.background, border: 'none', borderRadius: '8px' }} itemStyle={{ color: chartConfig.tooltip.color }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Daily Dispatch Trend (Last 7 Days) (Line Graph)" darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={DISPATCH_TREND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.grid.stroke} />
                            <XAxis dataKey="date" stroke={chartConfig.axis.stroke} />
                            <YAxis stroke={chartConfig.axis.stroke} domain={[0, 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: chartConfig.tooltip.background, border: 'none', borderRadius: '8px' }} itemStyle={{ color: chartConfig.tooltip.color }} />
                            <Legend />
                            <Line type="monotone" dataKey="dispatched" name="Total Dispatches" dot={{ r: 5 }} activeDot={{ r: 8 }} {...chartConfig.line} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartPanel>
            </div>

            {/* Section 3: Quick Actions */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <IconButton onClick={onGenerateAIPlan} className="bg-blue-600 text-white hover:bg-blue-700">
                    <CpuIcon className="w-5 h-5 mr-2" />
                    Generate AI Plan
                </IconButton>
                <IconButton onClick={onViewAlerts} className="bg-yellow-600 text-white hover:bg-yellow-700">
                    <BellIcon className="w-5 h-5 mr-2" />
                    View Delay Alerts
                </IconButton>
                <IconButton onClick={onDownloadReport} className="bg-slate-700 text-white hover:bg-slate-600">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Download Daily Report
                </IconButton>
                <IconButton onClick={onOpenCompare} className="bg-green-600 text-white hover:bg-green-700">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Compare Plans
                </IconButton>
            </div>
        </div>
    );
};

const ChartPanel = ({ title, children, darkMode }) => (
    <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-lg font-bold mb-4 text-blue-400">{title}</h2>
        {children}
    </div>
);


// --- 2. ORDER MANAGEMENT PAGE ---

const OrderManagementPage = ({ orders, setOrders }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEditClick = (order) => {
        setEditingId(order.id);
        setEditData({ quantity: order.quantity, sla: order.sla });
    };

    const handleSaveEdit = async (id) => {
        // Mock Firestore update
        const updatedOrders = orders.map(o => o.id === id ? { ...o, quantity: editData.quantity, sla: editData.sla } : o);
        setOrders(updatedOrders);
        setEditingId(null);
        setEditData({});
        console.log(`Simulating Firestore update for Order ${id}`);
    };

    const handleAssignOrder = (id) => {
        // Mock assignment
        alert(`Order ${id} assigned to AI module for rake allocation! (Using custom modal instead of alert)`);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  order.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = filterPriority === 'All' || order.priority === filterPriority;
            return matchesSearch && matchesPriority;
        }).sort((a, b) => {
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }, [orders, searchTerm, filterPriority]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Order Management</h1>

            <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by Customer or Order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 text-white border border-slate-700 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="w-full appearance-none pl-10 pr-8 py-2 bg-slate-700/50 text-white border border-slate-700 rounded-2xl focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="All">All Priority</option>
                                <option value="High">🔴 High</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Low">🟢 Low</option>
                            </select>
                        </div>
                        <IconButton className="bg-green-600 text-white hover:bg-green-700">
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Order
                        </IconButton>
                    </div>
                </div>

                {/* Order Table */}
                <div className="overflow-x-auto rounded-xl">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-700">
                            <tr>
                                {['Order ID', 'Customer', 'Destination', 'Material', 'Quantity (Tons)', 'Priority', 'SLA', 'Status', 'Actions'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-800 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.destination}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{order.material}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {editingId === order.id ? (
                                            <input
                                                type="number"
                                                value={editData.quantity}
                                                onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                                                className="w-20 bg-slate-900 border border-blue-500 rounded p-1 text-sm"
                                            />
                                        ) : (
                                            order.quantity.toLocaleString()
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.priority === 'High' ? 'bg-red-900/50 text-red-300' :
                                              order.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                                            {order.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                        {editingId === order.id ? (
                                            <input
                                                type="text"
                                                value={editData.sla}
                                                onChange={(e) => setEditData({ ...editData, sla: e.target.value })}
                                                className="w-24 bg-slate-900 border border-blue-500 rounded p-1 text-sm"
                                            />
                                        ) : (
                                            order.sla
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${OrderStatusColors[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {editingId === order.id ? (
                                            <button onClick={() => handleSaveEdit(order.id)} className="text-green-500 hover:text-green-700">
                                                <CheckIcon className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEditClick(order)} className="text-yellow-500 hover:text-yellow-700">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button onClick={() => handleAssignOrder(order.id)} className="text-blue-500 hover:text-blue-700 disabled:opacity-50" disabled={order.status !== 'Pending'}>
                                            <CpuIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- 3. STOCKYARD & WAGON STATUS PAGE ---

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
                {/* A. Stockyard Status */}
                <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Stockyard Inventory Status</h2>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Stockyard', 'Material', 'Available (Tons)', 'Capacity', 'Utilization (%)'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            {header}
                                        </th>
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

                {/* B. Wagon/Rake Status */}
                <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Wagon / Rake Live Status</h2>
                    <div className="mb-4 flex space-x-2">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setRakeFilter(status)}
                                className={`px-4 py-1 text-sm font-semibold rounded-2xl transition ${
                                    rakeFilter === status
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="overflow-x-auto rounded-xl">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Rake ID', 'Type', 'Status', 'Capacity', 'Dispatch', 'Location'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredRakes.map(rake => (
                                    <tr key={rake.id} className="hover:bg-slate-800 transition duration-150">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-400">{rake.id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{rake.type}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${rake.status === 'Empty' ? 'bg-cyan-900/50 text-cyan-300' :
                                                  rake.status === 'Loaded' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                                                {rake.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{rake.capacity} Wagons</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{rake.dispatch}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                                            <span className="hover:text-red-400 cursor-help" title="Hover to show map location (Future Feature)">
                                                {rake.location}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Map Integration Placeholder */}
            <div className="h-64 bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center text-slate-400 text-lg">
                🗺️ Google Maps Placeholder: Rake Tracking & Geo-fencing
            </div>
        </div>
    );
};

// --- 4. AI RECOMMENDATION PAGE ---

const AIRecommendationPage = ({ planData }) => {
    const totalRakes = planData.length;
    const totalCost = planData.reduce((sum, p) => sum + p.cost, 0).toFixed(1);
    const avgUtilization = (planData.reduce((sum, p) => sum + p.utilization, 0) / totalRakes).toFixed(0);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">AI Optimization Result (Dispatch Plan)</h1>

            {/* Top Section */}
            <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex items-center space-x-4">
                    <IconButton className="bg-blue-600 text-white hover:bg-blue-700">
                        <CpuIcon className="w-5 h-5 mr-2" />
                        Run AI Optimization
                    </IconButton>
                    <div className="text-sm text-green-400 flex items-center">
                        <CheckIcon className="w-5 h-5 mr-1" />
                        Last Run: 13 Oct 2025, 15:30
                    </div>
                </div>
                <div className="text-sm text-yellow-400 flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Calculating best rake composition... (Simulated)
                </div>
            </div>

            {/* Middle Section: Table and Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-white">Recommended Dispatch Schedule</h2>
                    <div className="overflow-x-auto rounded-xl mb-6">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-700">
                                <tr>
                                    {['Rake ID', 'Source', 'Destination', 'Material', 'Load (Tons)', 'Utilization (%)', 'Est. Cost (₹)', 'Dispatch Time'].map(header => (
                                        <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                            {header}
                                        </th>
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
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{plan.load.toLocaleString()}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">{plan.utilization}%</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">₹{plan.cost} Cr</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-white">{plan.dispatchTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cost Summary Card */}
                    <div className="bg-slate-700 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                        <div>
                            <p className="text-lg font-bold text-blue-400">Cost Summary</p>
                            <p className="text-sm text-slate-300">Total rakes planned: <span className="font-semibold text-white">{totalRakes}</span></p>
                            <p className="text-sm text-slate-300">Total transport cost: <span className="font-semibold text-red-400">₹{totalCost} Cr</span></p>
                            <p className="text-sm text-slate-300">Average utilization: <span className="font-semibold text-green-400">{avgUtilization}%</span></p>
                        </div>
                        <IconButton className="bg-blue-500 text-white hover:bg-blue-600">
                            View Details
                        </IconButton>
                    </div>
                </div>

                {/* Right Sidebar: Constraints Summary */}
                <div className="lg:w-80 bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Constraints Summary</h2>
                    <ul className="space-y-3 text-slate-300">
                        <li className="flex justify-between items-center">
                            <span>Minimum Rake Size: 3500 Tons</span>
                            <CheckIcon className="w-5 h-5 text-green-500" />
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Siding Capacity Check: 4</span>
                            <CheckIcon className="w-5 h-5 text-green-500" />
                        </li>
                        <li className="flex justify-between items-center">
                            <span>Route Restrictions: None</span>
                            <CpuIcon className="w-5 h-5 text-yellow-500" />
                        </li>
                        <li className="flex justify-between items-center">
                            <span>High Priority SLA Met: 100%</span>
                            <CheckIcon className="w-5 h-5 text-green-500" />
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section: Plan Actions */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-700">
                <IconButton className="bg-green-600 text-white hover:bg-green-700">
                    <CheckIcon className="w-5 h-5 mr-2" />
                    Approve & Dispatch Plan
                </IconButton>
                <IconButton className="bg-slate-700 text-white hover:bg-slate-600">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export to Excel/PDF
                </IconButton>
            </div>
        </div>
    );
};

// --- 5. REPORTS & ALERTS PAGE ---

const ReportsAlertsPage = ({ alerts }) => {
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

            {/* A. Reports Section */}
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
                                    <th key={header} className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        {header}
                                    </th>
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

            {/* B. Alerts Section */}
            <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                <h2 className="text-xl font-bold mb-4 text-red-400">Critical Alerts Feed</h2>
                <div className="flex space-x-2 mb-4">
                    {['Active', 'Resolved', 'All'].map(status => (
                        <button
                            key={status}
                            onClick={() => setAlertFilter(status)}
                            className={`px-4 py-1 text-sm font-semibold rounded-2xl transition ${
                                alertFilter === status
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                        >
                            {status}
                        </button>
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
                                <IconButton className="bg-slate-700 text-white hover:bg-slate-600 p-2">
                                    <CheckIcon className="w-4 h-4" />
                                </IconButton>
                                <IconButton className="bg-blue-600 text-white hover:bg-blue-700 p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Predictive Analytics Panel (simple mock/rule-based) ---
const PredictiveAnalyticsPanel = ({ stockyards = [], rakes = [], aiPlan = [] }) => {
    // Simple predictions based on thresholds
    const shortages = stockyards.filter(s => s.available < 20000).map(s => `${s.material} in ${s.name} will run low in ~3 days`);
    const wagonShortage = rakes.filter(r => r.status !== 'Empty').length > (rakes.length * 0.6) ? 'High probability of wagon shortage in next 48 hrs' : 'Wagon capacity adequate';
    const etaPredictions = aiPlan.map(p => ({ id: p.id, eta: p.dispatchTime }));
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

// --- Comparison Modal (What-If) ---
const ComparisonModal = ({ open, onClose }) => {
    if (!open) return null;
    const planA = { cost: '₹27.6 Cr', utilization: '96%', delay: '1.5 hrs' };
    const planB = { cost: '₹26.4 Cr', utilization: '93%', delay: '2.1 hrs' };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg w-11/12 max-w-3xl">
                <h3 className="text-lg font-bold mb-4">Compare Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                        <h4 className="font-semibold">Option A (Max Efficiency)</h4>
                        <p>Cost: <strong>{planA.cost}</strong></p>
                        <p>Utilization: <strong>{planA.utilization}</strong></p>
                        <p>Avg Delay: <strong>{planA.delay}</strong></p>
                    </div>
                    <div className="p-4 border rounded">
                        <h4 className="font-semibold">Option B (Lower Cost)</h4>
                        <p>Cost: <strong>{planB.cost}</strong></p>
                        <p>Utilization: <strong>{planB.utilization}</strong></p>
                        <p>Avg Delay: <strong>{planB.delay}</strong></p>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- AI Chat Assistant (floating, simple rules-based) ---
const AIChatAssistant = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([{ role: 'bot', text: 'Ask about rakes, delays, or transfers.' }]);

    const getResponse = (q) => {
        const qq = q.toLowerCase();
        if (qq.includes('underutilized')) return 'Rakes #203 and #311 are underutilized today (40%).';
        if (qq.includes('delayed')) return 'ORD-1029 and ORD-1035 are delayed >4 hours.';
        if (qq.includes('cheapest') || qq.includes('route')) return 'Cheapest route for Coal→Mumbai: Central Bypass (est. ₹2.1 Cr).';
        return "I can answer logistics queries: try 'underutilized', 'delayed', or 'transfer'.";
    };

    const send = () => {
        if (!input.trim()) return;
        setHistory(h => [...h, { role: 'you', text: input }]);
        const resp = getResponse(input);
        setTimeout(() => setHistory(h => [...h, { role: 'bot', text: resp }]), 400);
        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="flex flex-col items-end">
                {open && (
                    <div className="w-80 bg-slate-800 p-3 rounded-lg shadow-lg mb-2">
                        <div className="h-40 overflow-y-auto mb-2">
                            {history.map((m, i) => (<div key={i} className={`mb-1 ${m.role==='you'?'text-right':''}`}><span className="text-sm text-white">{m.text}</span></div>))}
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

// Insert AIChatAssistant into App by adding it near the end of the file render (we will mount it inside App below)

// --- MAIN APP COMPONENT ---

const App = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [darkMode, setDarkMode] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [userId, setUserId] = useState('');
    const [db, setDb] = useState(null);

    // Persisted data state (synced with Firestore)
    const [orders, setOrders] = useState(initialOrders);
    const [stockyards, setStockyards] = useState(initialStockyards);
    const [rakes, setRakes] = useState(initialRakes);
    const [aiPlan, setAiPlan] = useState(aiPlanData);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // --- FIREBASE INITIALIZATION AND AUTH ---
    useEffect(() => {
        // Global variables provided by the Canvas environment
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-logistics-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        if (Object.keys(firebaseConfig).length === 0) {
             console.error("Firebase config is missing. Data persistence will be unavailable.");
             setIsAuthReady(true);
             return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const auth = getAuth(app);
            setDb(firestoreDb);

            // 1. Sign In
            const authenticate = async () => {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                    await signInAnonymously(auth); // Fallback to anonymous sign-in
                }
            };

            // 2. Auth State Change Listener
            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                if (user) {
                    const currentUserId = user.uid;
                    setUserId(currentUserId);
                    setIsAuthReady(true);
                    console.log(`User authenticated: ${currentUserId}`);
                } else {
                    const randomId = crypto.randomUUID();
                    setUserId(randomId);
                    setIsAuthReady(true);
                    console.log(`Anonymous user generated: ${randomId}`);
                }
            });

            authenticate();
            return () => unsubscribeAuth();
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            setIsAuthReady(true); // Mark ready even if failure, to avoid infinite loading
        }
    }, []);

    // --- FIRESTORE DATA SYNCHRONIZATION (onSnapshot) ---
    useEffect(() => {
        if (!db || !isAuthReady) return;

        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-logistics-app-id';
        const collectionPath = `artifacts/${appId}/public/data/logistics_data`;

        const collections = [
            { name: 'orders', setter: setOrders, initialData: initialOrders },
            { name: 'stockyards', setter: setStockyards, initialData: initialStockyards },
            { name: 'rakes', setter: setRakes, initialData: initialRakes },
            { name: 'ai_plan', setter: setAiPlan, initialData: aiPlanData },
        ];

        const unsubscribers = collections.map(({ name, setter, initialData }) => {
            const colRef = collection(db, `${collectionPath}/${name}`);

            // Function to check if collection is empty and initialize
            const checkAndInitialize = async (data) => {
                if (data.length === 0) {
                    console.log(`Initializing empty collection: ${name}`);
                    initialData.forEach(async (item) => {
                        // Use a specific ID if present, otherwise let Firestore generate one
                        const docRef = doc(db, `${collectionPath}/${name}`, item.id || crypto.randomUUID());
                        await setDoc(docRef, item);
                    });
                }
            };

            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setter(data);
                checkAndInitialize(data); // Re-initialize if data is somehow lost/empty
            }, (error) => {
                console.error(`Error syncing ${name}:`, error);
                setter(initialData); // Fallback to initial data on error
            });

            return unsubscribe;
        });

        return () => unsubscribers.forEach(unsub => unsub());

    }, [db, isAuthReady]);

    // --- Page Renderer ---
    const renderPage = useCallback(() => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage orders={orders} stockyards={stockyards} rakes={rakes} darkMode={darkMode}
                    onGenerateAIPlan={() => {
                        const suggestion = { id: `RAK${Math.floor(Math.random()*900)+100}`, source: 'Bokaro', destination: 'Rourkela', material: 'Coal', load: 3800, utilization: 92, cost: 2.2, dispatchTime: '14 Oct 2025, 10:00' };
                        setAiPlan(prev => [suggestion, ...prev]);
                        alert('AI Plan generated and added to AI plan list (mock).');
                    }}
                    onViewAlerts={() => {
                        alert('Showing delay alerts (mock). Check Alerts panel.');
                    }}
                    onDownloadReport={() => {
                        const csv = 'id,source,destination,material,load\n' + aiPlan.map(p=>`${p.id},${p.source},${p.destination},${p.material},${p.load}`).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = 'ai_plan_export.csv'; a.click();
                        URL.revokeObjectURL(url);
                    }}
                    onOpenCompare={() => setComparisonOpen(true)}
                />;
            case 'orders':
                return <OrderManagementPage orders={orders} setOrders={setOrders} />;
            case 'stockyards':
                return <StockyardWagonPage stockyards={stockyards} rakes={rakes} />;
            case 'ai_plan':
                return <AIRecommendationPage planData={aiPlan} />;
            case 'reports':
                return <ReportsAlertsPage alerts={ALERT_DATA} />;
            default:
                return <DashboardPage orders={orders} stockyards={stockyards} rakes={rakes} darkMode={darkMode}
                    onGenerateAIPlan={() => {
                        // simple mock: append an AI plan suggestion
                        const suggestion = { id: `RAK${Math.floor(Math.random()*900)+100}`, source: 'Bokaro', destination: 'Rourkela', material: 'Coal', load: 3800, utilization: 92, cost: 2.2, dispatchTime: '14 Oct 2025, 10:00' };
                        setAiPlan(prev => [suggestion, ...prev]);
                        alert('AI Plan generated and added to AI plan list (mock).');
                    }}
                    onViewAlerts={() => {
                        alert('Showing delay alerts (mock). Check Alerts panel.');
                    }}
                    onDownloadReport={() => {
                        // create a small CSV download as a mock export
                        const csv = 'id,source,destination,material,load\n' + aiPlan.map(p=>`${p.id},${p.source},${p.destination},${p.material},${p.load}`).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = 'ai_plan_export.csv'; a.click();
                        URL.revokeObjectURL(url);
                    }}
                    onOpenCompare={() => setComparisonOpen(true)}
                />;
        }
    }, [currentPage, orders, stockyards, rakes, aiPlan, darkMode]);

    // Comparison modal state
    const [comparisonOpen, setComparisonOpen] = useState(false);


    // Define base Tailwind classes for the chosen theme
    const baseClasses = darkMode
        ? 'bg-slate-900 text-white min-h-screen font-inter transition-colors duration-300'
        : 'bg-gray-100 text-gray-900 min-h-screen font-inter transition-colors duration-300';

    return (
        <div className={baseClasses}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                    body { font-family: 'Inter', sans-serif; }
                    .recharts-default-tooltip {
                        border-radius: 0.75rem !important; /* rounded-xl */
                        padding: 0.5rem !important; /* p-2 */
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
                        border: 1px solid #475569 !important; /* border-slate-700 */
                    }
                `}
            </style>
            <Navbar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                userId={userId}
                isAuthReady={isAuthReady}
            />
            <main className="max-w-7xl mx-auto pb-12">
                {renderPage()}
            </main>
            <AIChatAssistant />
            {comparisonOpen && <ComparisonModal open={comparisonOpen} onClose={() => setComparisonOpen(false)} />}
        </div>
    );
};

export default App;
