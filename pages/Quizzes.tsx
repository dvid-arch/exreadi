
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { pastPapersData } from '../data/pastQuestions';

// A static list of common UTME subjects
const subjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Government', 'Literature', 'CRS'];

const Quizzes: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const handleSubjectChange = (subject: string) => {
        setSelectedSubjects(prev => 
            prev.includes(subject) 
                ? prev.filter(s => s !== subject) 
                : [...prev, subject]
        );
    };

    const handleGetStarted = () => {
        if (selectedSubjects.length === 0) {
            alert('Please select a subject to start.');
            return;
        }
        
        // Take the first selected subject to start the exam
        const subjectToStart = selectedSubjects[0];

        // Find the most recent JAMB paper for that subject
        const papersForSubject = pastPapersData
            .filter(p => p.exam === 'JAMB' && p.subject === subjectToStart)
            .sort((a, b) => b.year - a.year);

        if (papersForSubject.length === 0) {
            alert(`Sorry, no JAMB practice papers found for ${subjectToStart}. Please try another subject.`);
            return;
        }

        const latestPaper = papersForSubject[0];

        // Navigate to the examination page with the test details
        navigate('/take-examination', {
            state: {
                exam: 'JAMB',
                subject: latestPaper.subject,
                year: latestPaper.year.toString(),
            },
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-3xl font-bold text-slate-800">Practice For UTME</h1>
                <p className="text-slate-600 mt-2">Select the subjects you want to practice for the Unified Tertiary Matriculation Examination (UTME).</p>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Choose Your Subjects</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subjects.map(subject => (
                        <label key={subject} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-primary-light has-[:checked]:border-primary transition-colors">
                            <input 
                                type="checkbox"
                                checked={selectedSubjects.includes(subject)}
                                onChange={() => handleSubjectChange(subject)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="font-medium text-slate-700">{subject}</span>
                        </label>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleGetStarted}
                    disabled={selectedSubjects.length === 0}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Quizzes;
