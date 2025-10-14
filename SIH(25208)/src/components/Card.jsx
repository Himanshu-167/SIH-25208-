import React from 'react';

const Card = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl hover:shadow-blue-500/50 transition duration-300 transform hover:-translate-y-1 border border-slate-700">
        <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-slate-400 uppercase">{title}</h3>
            {Icon && <Icon className={`w-6 h-6 ${color || 'text-blue-400'}`} />}
        </div>
        <p className="text-3xl font-bold mt-2 text-white">{value}</p>
    </div>
);

export default Card;
