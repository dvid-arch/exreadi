import React, { useState } from 'react';
import Card from '../components/Card';
import { Flashcard as FlashcardType, FlashcardDeck } from '../types';

// --- ICONS ---
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const FlipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const XIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const CompletionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- INITIAL DATA ---
const initialDecks: FlashcardDeck[] = [
    { id: '1', name: 'Organic Chemistry Reactions', subject: 'Chemistry', cards: [{id: '101', front: 'What is a Grignard Reaction?', back: 'An organometallic chemical reaction in which alkyl, vinyl, or aryl-magnesium halides (Grignard reagents) add to a carbonyl group in an aldehyde or ketone.'}, {id: '102', front: 'What is a Diels-Alder reaction?', back: 'A chemical reaction between a conjugated diene and a substituted alkene, commonly termed the dienophile, to form a substituted cyclohexene derivative.'}] },
    { id: '2', name: 'World War II Key Events', subject: 'History', cards: [] },
    { id: '3', name: 'JavaScript Fundamentals', subject: 'Computer Science', cards: [] },
    { id: '4', name: 'Human Anatomy: Bones', subject: 'Biology', cards: [] },
];


// --- STUDY SESSION COMPONENT ---
interface StudySessionProps {
    deck: FlashcardDeck;
    onFinish: () => void;
}
const StudySession: React.FC<StudySessionProps> = ({ deck, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [knownCards, setKnownCards] = useState<string[]>([]);
    const [needsReviewCards, setNeedsReviewCards] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const currentCard = deck.cards[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);
    
    const handleNextCard = (knewIt: boolean) => {
        const cardId = currentCard.id;
        if (knewIt) {
            setKnownCards(prev => [...prev, cardId]);
        } else {
            setNeedsReviewCards(prev => [...prev, cardId]);
        }

        if (currentIndex < deck.cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        } else {
            setIsComplete(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownCards([]);
        setNeedsReviewCards([]);
        setIsComplete(false);
    };

    if (isComplete) {
        return (
            <Card className="flex flex-col items-center justify-center text-center p-8">
                <CompletionIcon />
                <h2 className="text-3xl font-bold text-slate-800 mt-4">Session Complete!</h2>
                <p className="text-slate-600 mt-2">Great job! Here's your summary:</p>
                <div className="flex gap-8 my-6 text-lg">
                    <div>
                        <span className="font-bold text-green-600 text-3xl block">{knownCards.length}</span>
                        <span className="text-slate-600">Knew This</span>
                    </div>
                    <div>
                        <span className="font-bold text-yellow-600 text-3xl block">{needsReviewCards.length}</span>
                        <span className="text-slate-600">Needs Review</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="font-semibold text-primary py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary-light transition-colors duration-200">
                        Study Again
                    </button>
                    <button onClick={onFinish} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                        Finish
                    </button>
                </div>
            </Card>
        );
    }
    
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <button onClick={onFinish} className="flex items-center gap-2 text-slate-600 font-semibold hover:text-primary transition-colors">
                    <BackArrowIcon />
                    <span>Back to Deck</span>
                </button>
                <div className="font-semibold text-slate-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                    Card {currentIndex + 1} / {deck.cards.length}
                </div>
            </div>

            <div 
                onClick={handleFlip} 
                className={`w-full aspect-video rounded-2xl p-6 flex items-center justify-center text-center shadow-lg transition-transform duration-500 cursor-pointer select-none ${isFlipped ? 'bg-primary-light [transform:rotateY(180deg)]' : 'bg-white'}`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800">{currentCard.front}</p>
                </div>
                <div className={`absolute top-0 left-0 w-full h-full p-6 flex items-center justify-center opacity-0 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <p className="text-xl md:text-2xl text-slate-700">{currentCard.back}</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
                {isFlipped ? (
                    <>
                        <button onClick={() => handleNextCard(false)} className="flex-1 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 font-bold py-4 rounded-lg hover:bg-yellow-200 transition-colors duration-200">
                           <XIcon />
                           <span>Needs Review</span>
                        </button>
                        <button onClick={() => handleNextCard(true)} className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-800 font-bold py-4 rounded-lg hover:bg-green-200 transition-colors duration-200">
                           <CheckIcon />
                           <span>I Knew This</span>
                        </button>
                    </>
                ) : (
                    <button onClick={handleFlip} className="w-full md:w-1/2 flex items-center justify-center gap-2 bg-white text-primary font-bold py-4 rounded-lg border-2 border-primary hover:bg-primary-light transition-colors duration-200">
                        <FlipIcon />
                        <span>Flip Card</span>
                    </button>
                )}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const Flashcards: React.FC = () => {
    const [decks, setDecks] = useState<FlashcardDeck[]>(initialDecks);
    const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
    const [isDeckFormVisible, setDeckFormVisible] = useState(false);
    const [isCardFormVisible, setCardFormVisible] = useState(false);
    const [isStudying, setIsStudying] = useState(false);

    // --- DECK HANDLERS ---
    const handleSaveDeck = (deckData: { name: string, subject: string }) => {
        const newDeck: FlashcardDeck = {
            id: Date.now().toString(),
            name: deckData.name,
            subject: deckData.subject,
            cards: [],
        };
        setDecks([newDeck, ...decks]);
        setDeckFormVisible(false);
    };

    // --- CARD HANDLERS ---
    const handleSaveCard = (cardData: { front: string, back: string }) => {
        if (!selectedDeck) return;
        const newCard: FlashcardType = {
            id: Date.now().toString(),
            front: cardData.front,
            back: cardData.back,
        };
        const updatedDeck = {
            ...selectedDeck,
            cards: [...selectedDeck.cards, newCard]
        };
        const updatedDecks = decks.map(d => d.id === selectedDeck.id ? updatedDeck : d);
        setDecks(updatedDecks);
        setSelectedDeck(updatedDeck);
        setCardFormVisible(false);
    };

    const handleDeleteCard = (cardId: string) => {
        if (!selectedDeck) return;
        if (window.confirm('Are you sure you want to delete this card?')) {
            const updatedDeck = {
                ...selectedDeck,
                cards: selectedDeck.cards.filter(c => c.id !== cardId)
            };
            const updatedDecks = decks.map(d => d.id === selectedDeck.id ? updatedDeck : d);
            setDecks(updatedDecks);
            setSelectedDeck(updatedDeck);
        }
    }


    // --- RENDER LOGIC ---
    if (selectedDeck) {
        if (isStudying) {
            return <StudySession deck={selectedDeck} onFinish={() => setIsStudying(false)} />
        }
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedDeck(null)} className="flex items-center gap-2 text-slate-600 font-semibold hover:text-primary transition-colors">
                    <BackArrowIcon />
                    <span>All Decks</span>
                </button>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{selectedDeck.name}</h1>
                        <p className="text-slate-600">{selectedDeck.subject}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => {
                                if (selectedDeck.cards.length === 0) {
                                    alert("This deck has no cards. Please add some before studying.");
                                    return;
                                }
                                setIsStudying(true);
                            }} 
                            className="font-semibold text-primary py-3 px-6 rounded-lg border-2 border-primary hover:bg-primary-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedDeck.cards.length === 0}
                            aria-disabled={selectedDeck.cards.length === 0}
                        >
                           Study Deck
                        </button>
                        <button onClick={() => setCardFormVisible(true)} className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                            <PlusIcon />
                            <span>Add Card</span>
                        </button>
                    </div>
                </div>

                {isCardFormVisible && <CardForm onSave={handleSaveCard} onCancel={() => setCardFormVisible(false)} />}
                
                <Card>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Cards in this Deck ({selectedDeck.cards.length})</h2>
                    <div className="space-y-4">
                        {selectedDeck.cards.length > 0 ? selectedDeck.cards.map((card) => (
                            <div key={card.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-700">{card.front}</p>
                                    <p className="text-slate-600 mt-1">{card.back}</p>
                                </div>
                                <button onClick={() => handleDeleteCard(card.id)} className="text-slate-500 hover:text-red-500 transition-colors" aria-label="Delete card">
                                    <TrashIcon />
                                </button>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-8">This deck is empty. Add your first card!</p>
                        )}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Flashcard Decks</h1>
                    <p className="text-slate-600">Select a deck to start studying or create a new one.</p>
                </div>
                <button onClick={() => setDeckFormVisible(true)} className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-200 w-full md:w-auto">
                    <PlusIcon />
                    <span>Create New Deck</span>
                </button>
            </div>

            {isDeckFormVisible && <DeckForm onSave={handleSaveDeck} onCancel={() => setDeckFormVisible(false)} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck) => (
                    <div key={deck.id} onClick={() => setSelectedDeck(deck)} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                        <h3 className="font-bold text-lg text-slate-800">{deck.name}</h3>
                        <p className="text-sm text-slate-600">{deck.subject}</p>
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-slate-600">{deck.cards.length} cards</span>
                            <span className="font-semibold text-primary">View Deck</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- FORM SUB-COMPONENTS ---

interface DeckFormProps {
    onSave: (data: { name: string, subject: string }) => void;
    onCancel: () => void;
}
const DeckForm: React.FC<DeckFormProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { alert('Deck name is required.'); return; }
        onSave({ name, subject });
    };
    
    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Create New Deck</h2>
                <div>
                    <label htmlFor="deckName" className="block text-sm font-medium text-slate-700 mb-1">Deck Name</label>
                    <input id="deckName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Biology Chapter 5" className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                    <label htmlFor="deckSubject" className="block text-sm font-medium text-slate-700 mb-1">Subject (Optional)</label>
                    <input id="deckSubject" type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Science" className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="font-semibold px-4 py-2">Cancel</button>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">Save Deck</button>
                </div>
            </form>
        </Card>
    );
}

interface CardFormProps {
    onSave: (data: { front: string, back: string }) => void;
    onCancel: () => void;
}
const CardForm: React.FC<CardFormProps> = ({ onSave, onCancel }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!front.trim() || !back.trim()) { alert('Both front and back content are required.'); return; }
        onSave({ front, back });
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Add New Card</h2>
                <div>
                    <label htmlFor="cardFront" className="block text-sm font-medium text-slate-700 mb-1">Front</label>
                    <textarea id="cardFront" value={front} onChange={e => setFront(e.target.value)} placeholder="e.g., What is the powerhouse of the cell?" rows={3} className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div>
                    <label htmlFor="cardBack" className="block text-sm font-medium text-slate-700 mb-1">Back</label>
                    <textarea id="cardBack" value={back} onChange={e => setBack(e.target.value)} placeholder="e.g., The Mitochondria" rows={3} className="w-full bg-gray-100 border-gray-200 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" required />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="font-semibold px-4 py-2">Cancel</button>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">Save Card</button>
                </div>
            </form>
        </Card>
    );
};

export default Flashcards;