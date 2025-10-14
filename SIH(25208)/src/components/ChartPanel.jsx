import React from 'react';

const ChartPanel = ({ title, children }) => (
    <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-lg font-bold mb-4 text-blue-400">{title}</h2>
        {children}
    </div>
);

export default ChartPanel;
