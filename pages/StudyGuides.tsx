
import React, { useState } from 'react';
import Card from '../components/Card';
import { generateStudyGuide } from '../services/geminiService';
import { allStudyGuides, featuredGuideIds } from '../data/studyGuides';
import { StudyGuide } from '../types';

// Loading spinner component
const Spinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

// Icon for the AI generator header
const GuideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const FormattedGuideContent = ({ content }: { content: string }) => {
    return <div className="text-slate-700 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.replace(/# (.*)/g, '<h1 class="text-2xl font-bold text-slate-800 my-4">$1</h1>').replace(/## (.*)/g, '<h2 class="text-xl font-bold text-slate-700 my-3">$1</h2>').replace(/\*   /g, '• ') }} />;
};

const GuideModal: React.FC<{ guide: StudyGuide, onClose: () => void }> = ({ guide, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{guide.title}</h2>
                        <p className="text-sm text-slate-500">{guide.subject}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <FormattedGuideContent content={guide.content.trim()} />
                </div>
            </div>
        </div>
    );
};

const AccordionItem: React.FC<{
    subject: string;
    guides: StudyGuide[];
    onGuideClick: (guide: StudyGuide) => void;
}> = ({ subject, guides, onGuideClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const subjectId = subject.replace(/\s+/g, '-');

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${subjectId}`}
            >
                <h3 className="font-bold text-lg text-slate-800">{subject}</h3>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 text-slate-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                id={`accordion-content-${subjectId}`}
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="p-4 border-t border-gray-200 bg-white">
                    <ul className="space-y-2">
                        {guides.map(guide => (
                            <li key={guide.id}>
                                <button
                                    onClick={() => onGuideClick(guide)}
                                    className="w-full text-left p-3 rounded text-slate-700 hover:bg-primary-light hover:text-primary transition-colors duration-200 flex items-center gap-3"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <span>{guide.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const StudyGuides: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [generatedGuide, setGeneratedGuide] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasGenerated, setHasGenerated] = useState(false);
    const [viewingGuide, setViewingGuide] = useState<StudyGuide | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !topic.trim()) {
            setError('Please provide both a subject and a topic.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setGeneratedGuide('');
        setHasGenerated(true);

        try {
            const guideContent = await generateStudyGuide(subject, topic);
            setGeneratedGuide(guideContent);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setGeneratedGuide('');
        } finally {
            setIsLoading(false);
        }
    };

    const featuredGuides = allStudyGuides.filter(guide => featuredGuideIds.includes(guide.id));
    const guidesBySubject = allStudyGuides.reduce((acc, guide) => {
        if (!acc[guide.subject]) {
            acc[guide.subject] = [];
        }
        acc[guide.subject].push(guide);
        return acc;
    }, {} as Record<string, StudyGuide[]>);

    return (
        <div className="space-y-8">
            <Card>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Featured Study Guides</h2>
                    <p className="text-slate-600 mb-4">Browse our curated handbooks for key subjects.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredGuides.map(guide => (
                            <div key={guide.id} onClick={() => setViewingGuide(guide)} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                <h3 className="font-bold text-primary">{guide.title}</h3>
                                <p className="text-sm text-slate-500">{guide.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card>
                <div className="p-4">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">General Study Guides</h2>
                    <p className="text-slate-600 mb-4">Explore a collection of guides for various subjects.</p>
                    <div className="space-y-4">
                        {Object.entries(guidesBySubject).sort(([subjectA], [subjectB]) => subjectA.localeCompare(subjectB)).map(([subject, guides]) => (
                            <AccordionItem
                                key={subject}
                                subject={subject}
                                guides={guides}
                                onGuideClick={setViewingGuide}
                            />
                        ))}
                    </div>
                </div>
            </Card>

            <Card>
                <form onSubmit={handleGenerate} className="space-y-6 p-4">
                    <div className="text-center">
                         <div className="inline-block p-3 bg-primary-light rounded-full mb-3">
                            <GuideIcon />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">AI Guide Generator</h1>
                        <p className="text-slate-600 mt-2">Can't find what you need? Create a custom study guide on any topic.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <input
                                id="subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g., Biology"
                                className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                            <input
                                id="topic"
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Photosynthesis"
                                className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-center pt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full md:w-1/2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? 'Generating...' : 'Generate Guide'}
                        </button>
                    </div>
                </form>
            </Card>

            {hasGenerated && (
                <Card className="mt-6">
                    <div className="p-6">
                        {isLoading && <Spinner />}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                        {generatedGuide && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 border-b pb-3 mb-4 capitalize">{topic}</h2>
                                <FormattedGuideContent content={generatedGuide} />
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {viewingGuide && <GuideModal guide={viewingGuide} onClose={() => setViewingGuide(null)} />}
        </div>
    );
};

export default StudyGuides;
