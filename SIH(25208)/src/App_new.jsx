import React, { useState, useEffect, useCallback } from 'react';
import DashboardPage from './components/DashboardPage';
import OrderManagementPage from './components/OrderManagementPage';
import StockyardWagonPage from './components/StockyardWagonPage';
import AIRecommendationPage from './components/AIRecommendationPage';
import ReportsAlertsPage from './components/ReportsAlertsPage';
import ComparisonModal from './components/ComparisonModal';
import AIChatAssistant from './components/AIChatAssistant';
import Navbar from './components/Navbar';

// Firebase (optional) - keep imports for integration but App works without config
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

// Small set of SVG icon components (kept minimal)
const HomeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const PackageIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9.87 2.02c.57.12 1.05.57 1.25 1.13L20 12l-2.38 4.58c-.2.56-.68 1.01-1.25 1.13l-9.87 2.02c-.8.16-1.5-.12-1.8-.8L2 15V9l3.5-.7c.3-.68 1-1.16 1.8-1.01Z"/></svg>);
const TruckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>);
const CpuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>);
const BellIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>);
const SearchIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const FilterIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>);
const PlusIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const EditIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>);
const CheckIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"/></svg>);
const DownloadIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>);

// NAV & initial data
const NAV_ITEMS = [
  { name: 'Dashboard', path: 'dashboard', icon: HomeIcon },
  { name: 'Orders', path: 'orders', icon: PackageIcon },
  { name: 'Stockyards', path: 'stockyards', icon: TruckIcon },
  { name: 'AI Plan', path: 'ai_plan', icon: CpuIcon },
  { name: 'Reports', path: 'reports', icon: BellIcon },
];

const initialOrders = [
  { id: 'ORD001', customer: 'TATA Motors', destination: 'Pune', material: 'Steel Coil', quantity: 1500, priority: 'High', sla: '14 Oct 2025', status: 'Pending' },
  { id: 'ORD002', customer: 'JSW Plant', destination: 'Mumbai', material: 'Iron Ore', quantity: 2000, priority: 'Low', sla: '18 Oct 2025', status: 'Planned' },
];

const initialStockyards = [
  { id: 'SYD01', name: 'Bokaro', material: 'Iron Ore', available: 20000 },
  { id: 'SYD02', name: 'Durgapur', material: 'Coal', available: 15000 },
];

const initialRakes = [
  { id: 'RAK001', type: 'BOXN', status: 'Empty', capacity: 58, location: 'Bokaro' },
  { id: 'RAK002', type: 'BRN', status: 'Loaded', capacity: 56, location: 'On Route to Pune' },
];

const aiPlanData = [
  { id: 'RAK011', source: 'Bokaro', destination: 'Durgapur', material: 'Iron Ore', load: 3800, utilization: 95, cost: 2.5, dispatchTime: '13 Oct 2025, 16:00' },
];

const ALERT_DATA = [
  { type: 'Delay', message: 'Rake RAK009 delayed by 2 hrs (engine fault).', priority: 'High', date: '12 Oct 2025', status: 'Active' },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState('');
  const [db, setDb] = useState(null);

  const [orders, setOrders] = useState(initialOrders);
  const [stockyards, setStockyards] = useState(initialStockyards);
  const [rakes, setRakes] = useState(initialRakes);
  const [aiPlan, setAiPlan] = useState(aiPlanData);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  useEffect(() => {
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    if (!firebaseConfig || Object.keys(firebaseConfig).length === 0) { setIsAuthReady(true); return; }
    try {
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const auth = getAuth(app);
      setDb(firestoreDb);

      const authenticate = async () => {
        try { await signInAnonymously(auth); } catch (e) { console.warn('Auth fallback', e); }
      };
      const unsub = onAuthStateChanged(auth, user => { if (user) setUserId(user.uid); else setUserId(crypto.randomUUID()); setIsAuthReady(true); });
      authenticate();
      return () => unsub();
    } catch (e) { console.error('Firebase init failed', e); setIsAuthReady(true); }
  }, []);

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
      const unsub = onSnapshot(colRef, snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setter(data && data.length ? data : initialData);
      }, err => { console.error(`Sync error ${name}:`, err); setter(initialData); });
      return unsub;
    });

    return () => unsubscribers.forEach(u => typeof u === 'function' && u());
  }, [db, isAuthReady]);

  const genPlan = () => {
    const suggestion = { id: `RAK${Math.floor(Math.random() * 900) + 100}`, source: 'Bokaro', destination: 'Rourkela', material: 'Coal', load: 3800, utilization: 92, cost: 2.2, dispatchTime: '14 Oct 2025, 10:00' };
    setAiPlan(p => [suggestion, ...p]);
    alert('AI Plan generated (mock)');
  };

  const downloadCsv = () => {
    const csv = 'id,source,destination,material,load\n' + aiPlan.map(p => `${p.id},${p.source},${p.destination},${p.material},${p.load}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'ai_plan_export.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage orders={orders} stockyards={stockyards} rakes={rakes} darkMode={darkMode} onGenerateAIPlan={genPlan} onViewAlerts={() => setCurrentPage('reports')} onDownloadReport={downloadCsv} onOpenCompare={() => setComparisonOpen(true)} />;
      case 'orders':
        return <OrderManagementPage orders={orders} setOrders={setOrders} SearchIcon={SearchIcon} FilterIcon={FilterIcon} EditIcon={EditIcon} CheckIcon={CheckIcon} CpuIcon={CpuIcon} PlusIcon={PlusIcon} />;
      case 'stockyards':
        return <StockyardWagonPage stockyards={stockyards} rakes={rakes} />;
      case 'ai_plan':
        return <AIRecommendationPage planData={aiPlan} CpuIcon={CpuIcon} CheckIcon={CheckIcon} DownloadIcon={DownloadIcon} />;
      case 'reports':
        return <ReportsAlertsPage alerts={ALERT_DATA} />;
      default:
        return <DashboardPage orders={orders} stockyards={stockyards} rakes={rakes} darkMode={darkMode} onGenerateAIPlan={genPlan} onViewAlerts={() => setCurrentPage('reports')} onDownloadReport={downloadCsv} onOpenCompare={() => setComparisonOpen(true)} />;
    }
  }, [currentPage, orders, stockyards, rakes, aiPlan, darkMode]);

  const baseClasses = darkMode ? 'bg-slate-900 text-white min-h-screen' : 'bg-gray-100 text-gray-900 min-h-screen';

  return (
    <div className={baseClasses}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'); body { font-family: Inter, sans-serif; }`}</style>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} userId={userId} isAuthReady={isAuthReady} />
      <main className="max-w-7xl mx-auto pb-12">{renderPage()}</main>

      <AIChatAssistant aiPlan={aiPlan} rakes={rakes} onGenerateAIPlan={genPlan} onViewAlerts={() => setCurrentPage('reports')} onOpenCompare={() => setComparisonOpen(true)} setCurrentPage={setCurrentPage} onDownloadReport={downloadCsv} />

      {comparisonOpen && (
        <ComparisonModal open={comparisonOpen} onClose={() => setComparisonOpen(false)} aiPlan={aiPlan} onApplyPlan={(plan) => {
          const applied = { ...plan, appliedAt: new Date().toLocaleString(), note: 'Applied via Compare Modal' };
          setAiPlan(prev => [applied, ...prev.filter(p => p.id !== plan.id)]);
          alert(`Applied plan ${plan.id}`);
        }} />
      )}
    </div>
  );
};

export default App;
