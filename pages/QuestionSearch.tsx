
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/Card.tsx';
import { pastPapersData } from '../data/pastQuestions.ts';
import { PastQuestion } from '../types.ts';

interface SearchResult extends PastQuestion {
    subject: string;
    year: number;
    exam: string;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

const QuestionSearch: React.FC = () => {
    const location = useLocation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const performSearch = (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        const lowerCaseQuery = searchQuery.toLowerCase();
        const allQuestions: SearchResult[] = pastPapersData.flatMap(paper =>
            paper.questions.map(q => ({
                ...q,
                subject: paper.subject,
                year: paper.year,
                exam: paper.exam,
            }))
        );

        const filteredResults = allQuestions.filter(q =>
            q.question.toLowerCase().includes(lowerCaseQuery)
        );

        setResults(filteredResults);
        setHasSearched(true);
    };
    
    useEffect(() => {
        const initialQuery = location.state?.query;
        if (typeof initialQuery === 'string') {
            setQuery(initialQuery);
            performSearch(initialQuery);
        }
    }, [location.state]);


    const handleSearchFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };
    
    const highlightQuery = (text: string, highlight: string) => {
        if (!highlight.trim()) {
            return <span>{text}</span>;
        }
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span> { parts.map((part, i) => 
            part.toLowerCase() === highlight.toLowerCase() ? <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark> : part
        ) } </span>;
    };


    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-3xl font-bold text-slate-800">Question Search</h1>
                <p className="text-slate-600 mt-2">Find specific questions by searching for a keyword or topic.</p>
                <form onSubmit={handleSearchFormSubmit} className="mt-4 flex gap-2">
                    <div className="relative flex-grow">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., photosynthesis, gravity, simile..."
                            className="w-full bg-gray-100 border-gray-200 border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label="Search for questions"
                        />
                    </div>
                    <button type="submit" className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-accent transition-colors">
                        Search
                    </button>
                </form>
            </Card>

            <Card>
                <div className="p-4 min-h-[400px]">
                    {!hasSearched ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-primary-light text-primary rounded-full p-4 inline-block mb-6">
                                <BookOpenIcon />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Questions Instantly</h2>
                            <p className="text-slate-600 max-w-md">
                                Enter a topic, keyword, or phrase in the search bar above to find relevant past questions from our database.
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                Found {results.length} question{results.length > 1 ? 's' : ''} for "{query}"
                            </h2>
                            <div className="space-y-6">
                                {results.map((q, index) => (
                                    <div key={q.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start text-sm text-slate-500 mb-2">
                                            <span>Question {index + 1}</span>
                                            <span className="font-semibold">{q.subject} - {q.exam} {q.year}</span>
                                        </div>
                                        <p className="text-lg text-slate-800 mb-4">{highlightQuery(q.question, query)}</p>
                                        <div className="space-y-2">
                                            {Object.entries(q.options).map(([key, value]) => {
                                                const isCorrect = key === q.answer;
                                                return (
                                                    <div key={key} className={`p-3 rounded-md flex items-start gap-3 text-sm ${isCorrect ? 'bg-green-100 text-green-900 font-semibold' : 'bg-white'}`}>
                                                        <span className={`font-bold ${isCorrect ? 'text-green-900' : 'text-slate-800'}`}>{key}.</span>
                                                        <span className={isCorrect ? 'text-green-900' : 'text-slate-700'}>{value}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                             <h2 className="text-2xl font-bold text-slate-700">No Results Found</h2>
                            <p className="text-slate-500 mt-2">We couldn't find any questions matching "{query}". Try a different search term.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QuestionSearch;