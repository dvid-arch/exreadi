import React from 'react';
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
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Logo />
                        <nav className="hidden md:flex items-center space-x-4">
                             {NAV_ITEMS.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
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
                <nav className="flex justify-around p-2">
                    {NAV_ITEMS.map((item) => (
                         <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex flex-col items-center space-y-1 p-2 rounded-md text-xs font-medium transition-colors duration-200 ${
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