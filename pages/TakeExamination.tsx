
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChallengeQuestion, QuizResult } from '../types.ts';
import { pastPapersData } from '../data/pastQuestions.ts';

const QUESTIONS_PER_SUBJECT = 10;

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

const preparePracticeQuestions = (subjects: string[]): ChallengeQuestion[] => {
    if (!subjects || subjects.length === 0) return [];

    // Prioritize English if selected, then sort others for consistency
    const sortedSubjects = [...subjects].sort((a, b) => {
        if (a === 'English') return -1;
        if (b === 'English') return 1;
        return a.localeCompare(b);
    });
    
    let allQuestions: ChallengeQuestion[] = [];

    sortedSubjects.forEach((subject) => {
        const questionsForSubject = pastPapersData
            .filter(paper => paper.subject === subject)
            .flatMap(paper => paper.questions)
            .map(q => ({ ...q, subject }));

        const shuffled = shuffleArray(questionsForSubject);
        allQuestions.push(...shuffled.slice(0, QUESTIONS_PER_SUBJECT));
    });

    return allQuestions; // Questions are now ordered by subject
};


const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};


const TakeExamination: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const practiceSubjectsFromState = location.state?.subjects as string[] | undefined;

    const [questions, setQuestions] = useState<ChallengeQuestion[]>([]);
    const [activeSubject, setActiveSubject] = useState<string>('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const subjects = useMemo(() => {
        if (!questions.length) return [];
        // This creates a unique, sorted list of subjects based on their order in the questions array
        const orderedSubjects = questions.map(q => q.subject);
        return [...new Set(orderedSubjects)];
    }, [questions]);
    
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

        const result: QuizResult = {
            id: new Date().toISOString(),
            paperId: 'practice-session',
            exam: 'Practice',
            subject: subjects.join(', '),
            year: new Date().getFullYear(),
            score: score,
            totalQuestions: questions.length,
            userAnswers,
            completedAt: Date.now(),
        };
        const pastResults: QuizResult[] = JSON.parse(localStorage.getItem('quizResults') || '[]');
        pastResults.unshift(result);
        localStorage.setItem('quizResults', JSON.stringify(pastResults));

    }, [isFinished, questions, userAnswers, subjects]);

    useEffect(() => {
        if (practiceSubjectsFromState && practiceSubjectsFromState.length > 0) {
            const preparedQuestions = preparePracticeQuestions(practiceSubjectsFromState);
            setQuestions(preparedQuestions);
            if (preparedQuestions.length > 0) {
                setActiveSubject(preparedQuestions[0].subject);
                setTimeLeft(preparedQuestions.length * 60);
            }
        }
    }, [practiceSubjectsFromState]);


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
    
    const subjectBoundaries = useMemo(() => {
        const boundaries: Record<string, { start: number, end: number }> = {};
        if (!questions.length || !subjects.length) return boundaries;
    
        subjects.forEach(subject => {
            const start = questions.findIndex(q => q.subject === subject);
            let end = start;
            // Since questions are grouped, find where the subject changes or array ends
            for (let i = start; i < questions.length; i++) {
                if (questions[i].subject === subject) {
                    end = i;
                } else {
                    break;
                }
            }
            if (start !== -1) {
                boundaries[subject] = { start, end };
            }
        });
        return boundaries;
    }, [questions, subjects]);

    const currentSubjectBounds = subjectBoundaries[activeSubject] || { start: 0, end: 0 };
    
    const { localQuestionIndex, totalQuestionsInSubject } = useMemo(() => {
        if (!activeSubject || !subjectBoundaries[activeSubject]) {
            return { localQuestionIndex: 0, totalQuestionsInSubject: 0 };
        }

        const bounds = subjectBoundaries[activeSubject];
        const localIndex = currentQuestionIndex - bounds.start;
        const totalInSubject = bounds.end - bounds.start + 1;
        
        return { localQuestionIndex: localIndex, totalQuestionsInSubject: totalInSubject };
    }, [currentQuestionIndex, activeSubject, subjectBoundaries]);


    const handleSubjectChange = (subject: string) => {
        setActiveSubject(subject);
        const firstQuestionIndex = subjectBoundaries[subject]?.start;
        if (firstQuestionIndex !== undefined) {
            setCurrentQuestionIndex(firstQuestionIndex);
        }
    };

    const handleQuestionJump = (questionIndex: number) => {
        const question = questions[questionIndex];
        if (question) {
            setActiveSubject(question.subject);
            setCurrentQuestionIndex(questionIndex);
        }
    };
    
    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prev => Math.min(prev + 1, currentSubjectBounds.end));
    };

    const handlePrevQuestion = () => {
        setCurrentQuestionIndex(prev => Math.max(prev - 1, currentSubjectBounds.start));
    };

    const handleSelectOption = (questionId: string, optionKey: string) => {
        if (isFinished) return;
        setUserAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    };
    
    const currentQuestion = questions[currentQuestionIndex];
    const canSubmit = Object.keys(userAnswers).length > 0;

    if (!practiceSubjectsFromState || practiceSubjectsFromState.length === 0) {
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
            <div className="flex items-center justify-center h-full bg-slate-100 p-4">
                <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-xl max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-slate-800">Session Complete!</h1>
                    <p className="text-slate-600 mt-2">Here is your score:</p>
                    <p className="text-7xl font-extrabold text-primary my-6">{finalScore} <span className="text-5xl text-slate-500">/ {questions.length}</span></p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
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
            <header className="bg-primary text-white p-3 flex justify-between items-center shadow-md flex-shrink-0">
                <div className="font-bold text-xl">ExamRedi Practice</div>
                <div className="bg-orange-500 text-white font-bold text-lg tracking-wider px-4 py-1 rounded-full w-32 text-center">
                    {formatTime(timeLeft)}
                </div>
                 <div className="relative group">
                    <button 
                        onClick={() => { if (window.confirm('Are you sure you want to submit?')) handleSubmit(); }}
                        disabled={!canSubmit}
                        className="bg-red-600 hover:bg-red-700 font-bold py-2 px-6 rounded-lg transition-colors text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                        aria-describedby="submit-tooltip"
                    >
                        Submit
                    </button>
                    {!canSubmit && (
                        <div id="submit-tooltip" role="tooltip" className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                            Please answer at least one question to submit.
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Main Content (scrollable) */}
                <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
                    {/* Subject Tabs */}
                    <div className="border-b border-gray-200 bg-white flex-shrink-0 sticky top-0 z-10">
                        <div className="flex items-center -mb-px px-4 overflow-x-auto">
                            {subjects.map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => handleSubjectChange(subject)}
                                    className={`py-3 px-4 font-semibold text-sm transition-colors whitespace-nowrap ${activeSubject === subject ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {subject}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Question Area */}
                     <div className="flex-1 p-4 sm:p-6 lg:p-8">
                        <div className="max-w-4xl mx-auto">
                            <p className="font-semibold text-slate-700 mb-2">
                                Question {localQuestionIndex + 1}
                                <span className="text-sm text-slate-500"> of {totalQuestionsInSubject}</span>
                            </p>
                            <p className="text-lg text-slate-800 mb-6 min-h-[60px]">{currentQuestion.question}</p>
                            <div className="space-y-4">
                                {Object.entries(currentQuestion.options).map(([key, value]) => (
                                    <label key={key} className={`p-4 rounded-lg border-2 flex items-start gap-4 transition-all cursor-pointer ${userAnswers[currentQuestion.id] === key ? 'border-primary bg-primary-light' : 'border-gray-200 bg-white hover:border-primary-light'}`}>
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
                    </div>
                </main>

                {/* Sticky Footer Control Panel */}
                <footer className="bg-white p-2 border-t shadow-inner flex-shrink-0 z-10">
                    <div className="flex justify-between items-center max-w-4xl mx-auto">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === currentSubjectBounds.start}
                            className="font-semibold text-slate-600 py-2 px-4 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            &lt; Prev
                        </button>
                        <div className="grid grid-cols-10 gap-1 mx-2 overflow-x-auto py-1">
                            {Array.from({ length: totalQuestionsInSubject }, (_, i) => i).map((localIndex) => {
                                const globalIndex = currentSubjectBounds.start + localIndex;
                                const question = questions[globalIndex];
                                const isCurrent = currentQuestionIndex === globalIndex;
                                const isAnswered = userAnswers[question.id];

                                let buttonClass = 'border-gray-300 bg-white hover:bg-gray-100 text-slate-700';
                                if (isCurrent) {
                                    buttonClass = 'border-primary bg-primary-light text-primary ring-1 ring-primary';
                                } else if (isAnswered) {
                                    buttonClass = 'border-gray-400 bg-gray-400 text-white';
                                }
                                
                                return (
                                    <button
                                        key={`${activeSubject}-${localIndex}`}
                                        onClick={() => handleQuestionJump(globalIndex)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md border font-semibold text-sm transition-colors flex-shrink-0 ${buttonClass}`}
                                        aria-label={`Go to question ${localIndex + 1}`}
                                    >
                                        {localIndex + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === currentSubjectBounds.end}
                            className="font-semibold text-slate-600 py-2 px-4 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            Next &gt;
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default TakeExamination;