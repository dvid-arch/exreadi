import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChallengeQuestion, QuizResult } from '../types';
import { pastPapersData } from '../data/pastQuestions';

const TOTAL_QUESTIONS = 40;

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const preparePracticeQuestions = (subjects: string[]): ChallengeQuestion[] => {
    if (!subjects || subjects.length === 0) return [];
    
    let allQuestions: ChallengeQuestion[] = [];
    const questionsPerSubject = Math.floor(TOTAL_QUESTIONS / subjects.length);
    let remainder = TOTAL_QUESTIONS % subjects.length;

    subjects.forEach((subject, index) => {
        const questionsForSubject = pastPapersData
            .filter(paper => paper.subject === subject)
            .flatMap(paper => paper.questions)
            .map(q => ({ ...q, subject }));

        const shuffled = shuffleArray(questionsForSubject);
        const numToTake = questionsPerSubject + (index < remainder ? 1 : 0);
        
        allQuestions.push(...shuffled.slice(0, numToTake));
    });

    return allQuestions;
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const TakeExamination: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const practiceSubjects = location.state?.subjects as string[] | undefined;

    const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
    const [activeSubject, setActiveSubject] = useState<string>('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const handleSubmit = useCallback(() => {
        if (isFinished) return;
        
        let score = 0;
        questions.forEach(q => {
            if (userAnswers[q.id] === q.answer) {
                score++;
            }
        });
        setFinalScore(score);
        setIsFinished(true);

        // Save result
        const result: QuizResult = {
            id: new Date().toISOString(),
            paperId: 'practice-session',
            exam: 'Practice',
            subject: practiceSubjects?.join(', ') || 'Mixed',
            year: new Date().getFullYear(),
            score: score,
            totalQuestions: questions.length,
            userAnswers,
            completedAt: Date.now(),
        };
        const pastResults: QuizResult[] = JSON.parse(localStorage.getItem('quizResults') || '[]');
        pastResults.unshift(result);
        localStorage.setItem('quizResults', JSON.stringify(pastResults));

    }, [isFinished, questions, userAnswers, practiceSubjects]);

    useEffect(() => {
        if (practiceSubjects && practiceSubjects.length > 0) {
            const preparedQuestions = preparePracticeQuestions(practiceSubjects);
            setQuestions(preparedQuestions);
            setActiveSubject(practiceSubjects[0]);
            setTimeLeft(preparedQuestions.length * 60); // 1 minute per question
        }
    }, [practiceSubjects]);

    useEffect(() => {
        if (questions.length > 0 && !isFinished) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [questions, isFinished, handleSubmit]);

    useEffect(() => {
        if (questions[currentQuestionIndex]) {
            setActiveSubject(questions[currentQuestionIndex].subject);
        }
    }, [currentQuestionIndex, questions]);

    const handleSelectOption = (questionId: string, optionKey: string) => {
        if (isFinished) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };
    
    const currentQuestion = questions[currentQuestionIndex];
    const questionsInActiveSubject = useMemo(() => 
        questions.filter(q => q.subject === activeSubject),
        [questions, activeSubject]
    );
    const currentQuestionNumberInSubject = useMemo(() =>
        questions.slice(0, currentQuestionIndex + 1).filter(q => q.subject === activeSubject).length,
        [questions, currentQuestionIndex, activeSubject]
    );

    if (!practiceSubjects || practiceSubjects.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center bg-white p-12 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-slate-700">No Practice Session Found</h1>
                    <p className="text-slate-500 mt-2">Please start a new session from the practice page.</p>
                    <Link to="/practice" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                        Go to Practice
                    </Link>
                </div>
            </div>
        );
    }
    
    if (questions.length === 0) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (isFinished) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-100">
                <div className="text-center bg-white p-12 rounded-lg shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-slate-800">Session Complete!</h1>
                    <p className="text-slate-600 mt-2">Here is your score:</p>
                    <p className="text-7xl font-extrabold text-primary my-6">{finalScore} <span className="text-5xl text-slate-500">/ {questions.length}</span></p>
                    <div className="flex justify-center gap-4">
                         <Link to="/practice" className="font-semibold text-primary py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary-light transition-colors">
                            New Practice
                        </Link>
                         <Link to="/performance" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                            View Performance
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white font-sans">
            {/* Header */}
            <header className="bg-primary text-white p-3 flex justify-between items-center shadow-md flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/40" alt="profile" className="w-9 h-9 rounded-full object-cover border-2 border-white"/>
                    <span className="font-semibold">OWOIDIGHE</span>
                </div>
                <button 
                    onClick={() => { if (window.confirm('Are you sure you want to submit?')) handleSubmit(); }}
                    className="bg-red-600 hover:bg-red-700 font-bold py-2 px-8 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Submit
                </button>
                <div className="bg-orange-500 text-white font-bold text-lg tracking-wider px-4 py-1 rounded-full w-40 text-center">
                    {formatTime(timeLeft)}
                </div>
            </header>

            {/* Subject Tabs */}
            <div className="border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center -mb-px px-4 overflow-x-auto">
                    {practiceSubjects.map(subject => (
                        <button
                            key={subject}
                            onClick={() => setActiveSubject(subject)}
                            className={`py-3 px-4 font-semibold text-sm transition-colors whitespace-nowrap ${activeSubject === subject ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-700">Question {currentQuestionNumberInSubject}/{questionsInActiveSubject.length}</h2>
                    </div>
                    <p className="text-lg text-slate-800 mb-6 min-h-[60px]">{currentQuestion.question}</p>
                    <div className="space-y-4">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <label key={key} className={`p-4 rounded-lg border-2 flex items-start gap-4 transition-all cursor-pointer ${userAnswers[currentQuestion.id] === key ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name={currentQuestion.id}
                                    value={key}
                                    checked={userAnswers[currentQuestion.id] === key}
                                    onChange={() => handleSelectOption(currentQuestion.id, key)}
                                    className="mt-1 h-5 w-5 text-primary focus:ring-primary border-gray-300"
                                />
                                <span className="font-bold text-slate-800">{key}.</span>
                                <span className="text-slate-700">{value}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer Navigator */}
            <footer className="bg-white p-4 border-t shadow-inner flex-shrink-0">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} disabled={currentQuestionIndex === 0} className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg disabled:bg-gray-300 transition-colors">&lt; Previous</button>
                        <button onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))} disabled={currentQuestionIndex === questions.length - 1} className="bg-green-600 text-white font-semibold py-2 px-8 rounded-lg disabled:bg-gray-300 transition-colors">Next &gt;</button>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Attempted: {Object.keys(userAnswers).length}/{questions.length}</p>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex items-center space-x-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded font-semibold text-sm border transition-colors ${
                                        index === currentQuestionIndex 
                                            ? 'bg-blue-500 border-blue-700 text-white ring-2 ring-blue-300' 
                                            : userAnswers[q.id] 
                                            ? 'bg-gray-400 border-gray-500 text-white' 
                                            : 'bg-white border-gray-300 hover:bg-gray-100'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default TakeExamination;
