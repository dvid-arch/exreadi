import React, { useState } from 'react';
import Card from '../components/Card';
import { researchTopic } from '../services/geminiService';
import { CareerIcon } from '../constants';
import MarkdownRenderer from '../components/MarkdownRenderer';

const Spinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const CareerInstitutions: React.FC = () => {
    const [searchType, setSearchType] = useState<'university' | 'course'>('university');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a search term.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult('');
        setHasSearched(true);

        try {
            const response = await researchTopic(searchType, query);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const placeholderText = searchType === 'university' 
        ? "e.g., University of Lagos" 
        : "e.g., Computer Science";
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Search Controls */}
            <div className="lg:col-span-1 lg:sticky top-24">
                <Card>
                    <div className="p-2">
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">Research Center</h1>
                        
                        <div className="flex border border-gray-200 rounded-lg p-1 mb-4 bg-gray-50">
                            <button
                                onClick={() => setSearchType('university')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${searchType === 'university' ? 'bg-primary text-white shadow' : 'text-slate-600'}`}
                            >
                                University
                            </button>
                            <button
                                onClick={() => setSearchType('course')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${searchType === 'course' ? 'bg-primary text-white shadow' : 'text-slate-600'}`}
                            >
                                Course
                            </button>
                        </div>
                        
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label htmlFor="searchQuery" className="block text-sm font-medium text-slate-700 mb-1 capitalize">{searchType} Name</label>
                                <input
                                    id="searchQuery"
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={placeholderText}
                                    className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-accent transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Researching...' : 'Research'}
                            </button>
                        </form>
                    </div>
                </Card>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-2">
                <Card>
                    <div className="p-6 min-h-[60vh]">
                        {!hasSearched ? (
                             <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="bg-primary-light text-primary rounded-full p-4 inline-block mb-6">
                                   <CareerIcon/>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Explore Your Future</h2>
                                <p className="text-slate-600 max-w-md">
                                    Use the panel on the left to search for detailed information about Nigerian universities or specific courses to guide your academic and career decisions.
                                </p>
                            </div>
                        ) : isLoading ? (
                            <Spinner />
                        ) : error ? (
                            <p className="text-red-500 text-center">{error}</p>
                        ) : (
                            <MarkdownRenderer content={result} />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CareerInstitutions;