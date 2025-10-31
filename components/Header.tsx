
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { NavItemType } from '../types';

const Logo = () => (
    <div className="flex items-center space-x-2">
        <div className="grid grid-cols-2 gap-1">
            <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
            <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
            <span className="w-4 h-4 bg-yellow-400 rounded-sm"></span>
            <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
        </div>
        <span className="font-bold text-xl text-slate-800">ExamRedi</span>
    </div>
);

const NavItem: React.FC<{ item: NavItemType }> = ({ item }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) =>
            `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-primary-light text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`
        }
    >
        {item.icon}
        <span>{item.name}</span>
    </NavLink>
);


const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const PRIMARY_NAV_COUNT = 6;
    const primaryNavItems = NAV_ITEMS.slice(0, PRIMARY_NAV_COUNT);
    const dropdownNavItems = NAV_ITEMS.slice(PRIMARY_NAV_COUNT);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Logo />
                        <nav className="hidden md:flex items-center space-x-1">
                             {primaryNavItems.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                            {dropdownNavItems.length > 0 && (
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <span>More</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                                            {dropdownNavItems.map((item) => (
                                                 <NavLink
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className={({ isActive }) =>
                                                        `flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                                                        isActive
                                                            ? 'bg-primary-light text-primary font-semibold'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                        }`
                                                    }
                                                >
                                                    {item.icon}
                                                    <span>{item.name}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                            <img
                                src="https://picsum.photos/40"
                                alt="profile"
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <div className="hidden md:block">
                                <span className="font-semibold text-sm text-gray-700">Owoidighe-1</span>
                                <p className="text-xs text-slate-600">Student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
                <nav className="flex items-center p-2 space-x-2 overflow-x-auto">
                    {NAV_ITEMS.map((item) => (
                         <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium transition-colors duration-200 flex-shrink-0 ${
                                isActive
                                    ? 'bg-primary-light text-primary'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;