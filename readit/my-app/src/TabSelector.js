import * as React from "react";

const activeStyle = {
    color: 'black',
    padding: '10px 8px 10px 5px',
    border: '1px solid',
    borderColor: '#dee2e6',
    borderRadius: '3px',
    borderBottom: 'none',
    backgroundColor: 'white',
    fontWeight: 'bold',
}

const hideStyle = {
    color: '#0d6efd',
    padding: '8px'
}

export const TabSelector = ({
    isActive, // boolean
    children, // React.ReactNode
    onClick,  // function
}) => (
    // <li
    //     className={`mr-8 group inline-flex items-center px-2 py-4 border-b-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap ${
    //     isActive
    //     ? "border-indigo-500 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700"
    //     : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 focus:text-gray-600 focus:border-gray-300"
    // }`}
    <li className= 'nav-item' style= {isActive? activeStyle : hideStyle}
    onClick={onClick}
    >
        {children}
    </li>
);