import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Quizzes from './pages/Quizzes';
import ExamWithAI from './pages/ExamWithAI';
import StudyGuides from './pages/StudyGuides';
import TakeExamination from './pages/TakeExamination';
import EducationalGames from './pages/EducationalGames';
import Performance from './pages/Performance';
import MemoryMatchGame from './pages/MemoryMatchGame';
import CareerInstitutions from './pages/CareerInstitutions';
import UtmeChallenge from './pages/UtmeChallenge';
import ComingSoon from './pages/ComingSoon';

const App: React.FC = () => {
  const location = useLocation();
  const showHeaderAndSidebar = location.pathname !== '/take-examination';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {showHeaderAndSidebar && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <div className={`flex-1 flex flex-col ${showHeaderAndSidebar ? 'md:ml-64' : ''}`}>
        {showHeaderAndSidebar && <Header onMenuClick={() => setIsSidebarOpen(true)} />}
        <main className={`flex-1 overflow-y-auto ${showHeaderAndSidebar ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/practice" element={<Quizzes />} />
            <Route path="/ai-buddy" element={<ExamWithAI />} />
            <Route path="/take-examination" element={<TakeExamination />} />
            <Route path="/study-guides" element={<StudyGuides />} />
            <Route path="/games" element={<EducationalGames />} />
            <Route path="/games/memory-match" element={<MemoryMatchGame />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/career-institutions" element={<CareerInstitutions />} />
            <Route path="/challenge" element={<UtmeChallenge />} />
            <Route path="/literature" element={<ComingSoon title="UTME Literature Books" />} />
            <Route path="/dictionary" element={<ComingSoon title="Dictionary" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
