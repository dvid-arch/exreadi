
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card';
import { PastPaper } from '../types';
import { pastPapersData } from '../data/pastQuestions';

const TakeExamination: React.FC = () => {
    const location = useLocation();
    const practiceSettings = location.state as { exam: string; subject: string; year: string } | undefined;

    const [selectedExam, setSelectedExam] = useState<string>(practiceSettings?.exam || '');
    const [selectedSubject, setSelectedSubject] = useState<string>(practiceSettings?.subject || '');
    const [selectedYear, setSelectedYear] = useState<string>(practiceSettings?.year || '');
    
    const [currentPaper, setCurrentPaper] = useState<PastPaper | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
    const [showAnswers, setShowAnswers] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds

    const examOptions = useMemo(() => [...new Set(pastPapersData.map(p => p.exam))], []);
    const subjectOptions = useMemo(() => {
        if (!selectedExam) return [];
        return [...new Set(pastPapersData.filter(p => p.exam === selectedExam).map(p => p.subject))];
    }, [selectedExam]);
    const yearOptions = useMemo(() => {
        if (!selectedExam || !selectedSubject) return [];
        return [...new Set(pastPapersData.filter(p => p.exam === selectedExam && p.subject === selectedSubject).map(p => p.year))];
    }, [selectedExam, selectedSubject]);

    useEffect(() => {
        if (practiceSettings) {
            const paper = pastPapersData.find(p => p.exam === practiceSettings.exam && p.subject === practiceSettings.subject && p.year.toString() === practiceSettings.year);
            if (paper) {
                setCurrentPaper(paper);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setShowAnswers(false);
                setTimeLeft(paper.questions.length * 60); // 1 min per question
            }
        }
    }, [practiceSettings]);

    useEffect(() => {
        if (!currentPaper || showAnswers) return;
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentPaper, showAnswers]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const paper = pastPapersData.find(p => p.exam === selectedExam && p.subject === selectedSubject && p.year.toString() === selectedYear);
        if (paper) {
            setCurrentPaper(paper);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setShowAnswers(false);
            setTimeLeft(paper.questions.length * 60); // 1 min per question
        } else {
            setCurrentPaper(null);
        }
    };
    
    const handleSelectOption = (questionId: string, optionKey: string) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };

    const currentQuestion = currentPaper?.questions[currentQuestionIndex];

    if (currentPaper && currentQuestion) {
        return (
            <div className="flex flex-col h-full">
                <div className="bg-white p-3 border-b shadow-sm rounded-t-lg flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="font-bold text-lg text-primary">{currentPaper.subject}</div>
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-red-500 text-lg bg-red-100 px-3 py-1 rounded">{formatTime(timeLeft)}</span>
                        <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700">Submit</button>
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-700">Question {currentQuestionIndex + 1}/{currentPaper.questions.length}</h3>
                        {/* Speaker Icon */}
                    </div>
                    <p className="text-lg text-slate-800 mb-6">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => {
                             const isSelected = userAnswers[currentQuestion.id] === key;
                             const isCorrect = key === currentQuestion.answer;
                             let optionClass = 'border-gray-300 bg-white hover:bg-gray-100';
                             if (isSelected) {
                                optionClass = 'border-blue-500 bg-blue-100 ring-2 ring-blue-300';
                             }
                             if(showAnswers) {
                                 if(isCorrect) optionClass = 'border-green-500 bg-green-100';
                                 else if(isSelected) optionClass = 'border-red-500 bg-red-100';
                             }

                            return (
                                <div key={key} onClick={() => !showAnswers && handleSelectOption(currentQuestion.id, key)} className={`p-4 rounded-lg border flex items-center cursor-pointer transition-all duration-200 ${optionClass}`}>
                                    <span className="font-bold mr-3">{key}.</span>
                                    <span>{value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="bg-white p-4 border-t shadow-inner rounded-b-lg">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded disabled:bg-gray-300">Previous</button>
                        <button onClick={() => setCurrentQuestionIndex(Math.min(currentPaper.questions.length - 1, currentQuestionIndex + 1))} disabled={currentQuestionIndex === currentPaper.questions.length - 1} className="bg-green-600 text-white font-semibold py-2 px-8 rounded disabled:bg-gray-300">Next</button>
                    </div>
                     <p className="text-sm font-semibold text-slate-600 mb-2">Attempted: {Object.keys(userAnswers).length}/{currentPaper.questions.length}</p>
                     <div className="grid grid-cols-10 gap-2">
                        {currentPaper.questions.map((q, index) => {
                            const isAttempted = userAnswers[q.id];
                            const isCurrent = index === currentQuestionIndex;
                            let gridClass = 'bg-gray-200 hover:bg-gray-300';
                            if (isAttempted) gridClass = 'bg-primary text-white';
                            if (isCurrent) gridClass = 'bg-yellow-400 text-black ring-2 ring-yellow-600';

                            return (
                                <button key={q.id} onClick={() => setCurrentQuestionIndex(index)} className={`w-full text-center py-1 rounded font-semibold text-sm transition-colors ${gridClass}`}>
                                    {index + 1}
                                </button>
                            );
                        })}
                     </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Past Questions</h1>
                <p className="text-slate-600">Find and review past examination papers to prepare for your tests.</p>
            </div>
            <Card>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="examBody" className="block text-sm font-medium text-slate-700 mb-1">Exam Body</label>
                        <select id="examBody" value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setSelectedSubject(''); setSelectedYear(''); }} className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2" required>
                            <option value="" disabled>Select Exam</option>
                            {examOptions.map(exam => <option key={exam} value={exam}>{exam}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                        <select id="subject" value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setSelectedYear(''); }} disabled={!selectedExam} className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 disabled:bg-gray-200" required>
                            <option value="" disabled>Select Subject</option>
                            {subjectOptions.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                        <select id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={!selectedSubject} className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 disabled:bg-gray-200" required>
                            <option value="" disabled>Select Year</option>
                            {yearOptions.sort((a, b) => b - a).map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">Start Test</button>
                </form>
            </Card>
            {currentPaper === null && selectedYear && (
                 <Card className="text-center py-12">
                    <h2 className="text-xl font-bold text-slate-700">No Paper Found</h2>
                    <p className="text-slate-600 mt-2">We couldn't find a past paper that matches your selection. Please try different options.</p>
                </Card>
            )}
        </div>
    );
};

export default TakeExamination;
