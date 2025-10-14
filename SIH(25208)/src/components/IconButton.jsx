import React from 'react';

const IconButton = ({ children, onClick, className = '' }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center p-3 text-sm font-medium rounded-2xl transition duration-300 shadow-lg ${className}`}
    >
        {children}
    </button>
);

export default IconButton;
