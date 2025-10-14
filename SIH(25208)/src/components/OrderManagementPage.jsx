import React, { useState, useMemo } from 'react';

const OrderManagementPage = ({ orders, setOrders, SearchIcon, FilterIcon, EditIcon, CheckIcon, CpuIcon, PlusIcon }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('All');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEditClick = (order) => {
        setEditingId(order.id);
        setEditData({ quantity: order.quantity, sla: order.sla });
    };

    const handleSaveEdit = async (id) => {
        const updatedOrders = orders.map(o => o.id === id ? { ...o, quantity: editData.quantity, sla: editData.sla } : o);
        setOrders(updatedOrders);
        setEditingId(null);
        setEditData({});
        console.log(`Simulating Firestore update for Order ${id}`);
    };

    const handleAssignOrder = (id) => {
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

    const OrderStatusColors = {
        Pending: 'text-yellow-400 bg-yellow-400/10',
        Planned: 'text-blue-400 bg-blue-400/10',
        Dispatched: 'text-green-400 bg-green-400/10',
        Delayed: 'text-red-400 bg-red-400/10',
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-white">Order Management</h1>

            <div className="bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-700">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                    <div className="relative flex-grow">
                        {SearchIcon && <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />}
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
                            {FilterIcon && <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />}
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
                        <button className="bg-green-600 text-white hover:bg-green-700 p-3 rounded-2xl flex items-center">
                            {PlusIcon && <PlusIcon className="w-5 h-5 mr-2" />}
                            Add Order
                        </button>
                    </div>
                </div>

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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.priority === 'High' ? 'bg-red-900/50 text-red-300' : order.priority === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
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
                                                {CheckIcon && <CheckIcon className="w-5 h-5" />}
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEditClick(order)} className="text-yellow-500 hover:text-yellow-700">
                                                {EditIcon && <EditIcon className="w-5 h-5" />}
                                            </button>
                                        )}
                                        <button onClick={() => handleAssignOrder(order.id)} className="text-blue-500 hover:text-blue-700 disabled:opacity-50" disabled={order.status !== 'Pending'}>
                                            {CpuIcon && <CpuIcon className="w-5 h-5" />}
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

export default OrderManagementPage;
