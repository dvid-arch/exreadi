
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card.tsx';

// A static list of common UTME subjects
const subjects = ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Government', 'Literature', 'CRS'];

const Quizzes: React.FC = () => {
    const navigate = useNavigate();
    // English is selected by default for UTME practice simulation
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['English']);

    const handleSubjectChange = (subject: string) => {
        // English is compulsory and cannot be deselected
        if (subject === 'English') {
            return;
        }

        setSelectedSubjects(prev => {
            if (prev.includes(subject)) {
                // If the subject is already selected, remove it
                return prev.filter(s => s !== subject);
            } else if (prev.length < 4) {
                // If less than 4 subjects are selected, add the new one
                return [...prev, subject];
            }
            // If 4 subjects are already selected, do nothing
            return prev;
        });
    };

    const handleGetStarted = () => {
        if (selectedSubjects.length !== 4) {
            alert('Please select exactly 4 subjects (including the compulsory English subject).');
            return;
        }

        // Navigate to the examination page with the selected subjects
        navigate('/take-examination', {
            state: {
                subjects: selectedSubjects,
            },
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-3xl font-bold text-slate-800">Practice For UTME</h1>
                <p className="text-slate-600 mt-2">English is compulsory for a simulated exam. Please select 3 other subjects to make a total of 4.</p>
            </Card>

            <Card>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Choose Your Subjects ({selectedSubjects.length}/4 Selected)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {subjects.map(subject => (
                        <label 
                            key={subject} 
                            className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors 
                                ${subject === 'English' ? 'cursor-not-allowed bg-primary-light border-primary' : 'cursor-pointer hover:bg-gray-50 has-[:checked]:bg-primary-light has-[:checked]:border-primary'}
                                ${selectedSubjects.length === 4 && !selectedSubjects.includes(subject) ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <input 
                                type="checkbox"
                                checked={selectedSubjects.includes(subject)}
                                // English is always checked and disabled
                                disabled={subject === 'English'}
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
                    disabled={selectedSubjects.length !== 4}
                    className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Quizzes;