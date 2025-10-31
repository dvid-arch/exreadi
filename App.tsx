import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
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

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
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
        </Routes>
      </main>
    </div>
  );
};

export default App;