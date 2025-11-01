
import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuIcon, NAV_ITEMS } from '../constants';

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

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;

        // Special cases that are not in NAV_ITEMS or need an override
        if (path.startsWith('/games/memory-match')) return 'Memory Match';
        if (path === '/challenge') return 'UTME Challenge';
        if (path === '/literature') return 'UTME Literature Books';
        if (path === '/dictionary') return 'Dictionary';
        
        // Find matching nav item, prioritizing more specific paths
        const matchingNavItems = NAV_ITEMS
            .filter(item => path.startsWith(item.path))
            .sort((a, b) => b.path.length - a.path.length);

        if (matchingNavItems.length > 0) {
            return matchingNavItems[0].name;
        }

        return 'Dashboard'; // Default fallback
    };
    
    const pageTitle = getPageTitle();

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 flex-shrink-0">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button 
                            onClick={onMenuClick} 
                            className="md:hidden mr-4 text-gray-600 hover:text-primary transition-colors"
                            aria-label="Open navigation menu"
                        >
                            <MenuIcon />
                        </button>
                        <div className="md:hidden">
                            <Logo />
                        </div>
                        {/* Display Page Title on Desktop */}
                        <h1 className="hidden md:block text-xl font-bold text-slate-800">
                           {pageTitle}
                        </h1>
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
        </header>
    );
};

export default Header;
