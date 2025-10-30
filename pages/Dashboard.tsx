import React from 'react';
import { Link } from 'react-router-dom';

const tiles = [
    { title: 'Practice For UTME', color: 'tile-blue', path: '/practice' },
    { title: 'Classroom', color: 'tile-pink', path: '/study-guides' },
    { title: 'Question Search', color: 'tile-green', path: '/take-examination' },
    { title: 'Performance Analysis', color: 'tile-orange', path: '/dashboard' },
    { title: 'Educational Games', color: 'tile-yellow', path: '/dashboard' },
    { title: 'UTME Literature Books', color: 'tile-purple', path: '/dashboard' },
    { title: 'UTME Challenge', color: 'tile-green', path: '/dashboard' },
    { title: 'Career And Institutions', color: 'tile-blue', path: '/dashboard' },
    { title: 'Dictionary', color: 'tile-pink', path: '/dashboard' },
];

const DashboardTile: React.FC<{ title: string; color: string; path: string; }> = ({ title, color, path }) => (
    <Link to={path} className={`bg-${color} p-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center items-center text-center`}>
        {/* Placeholder for icon */}
        <div className="w-10 h-10 mb-2 rounded-full bg-white flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <p className="font-semibold text-slate-800">{title}</p>
    </Link>
);

const CbtPracticeCard = () => (
     <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden transform -rotate-3 border-2 border-primary-light">
         <div className="absolute -top-4 -left-12 transform rotate-45 bg-primary-light w-32 h-16"></div>
         <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-primary">CBT PRACTICE</h2>
            <p className="text-slate-600 mt-2 font-semibold">examredi.com</p>
            <div className="w-4 h-4 bg-primary rounded-full mx-auto my-4 animate-pulse"></div>
         </div>
    </div>
);


const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {tiles.map(tile => (
                            <DashboardTile key={tile.title} {...tile} />
                        ))}
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="lg:col-span-1">
                    <CbtPracticeCard />
                </div>
            </div>
             <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                <p className="text-slate-700 text-sm">
                    <span className="font-bold text-primary mr-2">Tip:</span> Consistent practice is the key to mastering any subject. Try a new topic today!
                </p>
            </div>
        </div>
    );
};

export default Dashboard;