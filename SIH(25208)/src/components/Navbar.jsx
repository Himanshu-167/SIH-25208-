import React from 'react';

const Navbar = ({ NAV_ITEMS, currentPage, setCurrentPage, darkMode, toggleDarkMode, userId, isAuthReady, SunIcon, MoonIcon }) => {
    const navItemClass = (path) =>
        `flex items-center space-x-2 p-3 rounded-2xl transition duration-200 ${currentPage === path ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'text-slate-300 hover:bg-slate-700/50 hover:text-blue-400'}`;

    return (
        <header className={`sticky top-0 z-10 p-4 border-b ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-2xl font-black text-blue-500 tracking-wider">RAKE<span className="text-white bg-blue-500 px-1 rounded">OPT</span></div>
                    <nav className="flex space-x-1">
                        {NAV_ITEMS.map(item => (
                            <a key={item.path} href="#" onClick={() => setCurrentPage(item.path)} className={navItemClass(item.path)}>
                                <item.icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{item.name}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <button onClick={toggleDarkMode} className={`${darkMode ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} p-2 w-10 h-10 rounded-2xl`}>
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <div className="flex items-center space-x-2 text-slate-400 border border-slate-700 p-2 rounded-2xl text-xs sm:text-sm">
                        {isAuthReady ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>User ID: {userId.substring(0,8)}...</span>
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

export default Navbar;
