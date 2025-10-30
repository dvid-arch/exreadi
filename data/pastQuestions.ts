import { PastPaper } from '../types';

export const pastPapersData: PastPaper[] = [
  {
    exam: 'JAMB',
    subject: 'English',
    year: 2014,
    questions: [
      {
        id: 'eng1',
        question: 'Choose the option that is nearest in meaning to the word "ephemeral".',
        options: { A: 'Everlasting', B: 'Short-lived', C: 'Beautiful', D: 'Powerful' },
        answer: 'B',
      },
      {
        id: 'eng2',
        question: 'From the words lettered A to D, choose the word that best completes the sentence: The suspect was ____ of all charges.',
        options: { A: 'acquitted', B: 'convicted', C: 'accused', D: 'sentenced' },
        answer: 'A',
      },
      {
        id: 'eng3',
        question: 'Which of the following sentences is grammatically correct?',
        options: { A: 'He have gone to the market.', B: 'They is playing football now.', C: 'The book is laying on the table.', D: 'She has eaten her food.' },
        answer: 'D',
      },
      {
        id: 'eng4',
        question: 'Identify the figure of speech in the sentence: "The wind whispered through the trees."',
        options: { A: 'Metaphor', B: 'Simile', C: 'Personification', D: 'Hyperbole' },
        answer: 'C',
      },
      {
        id: 'eng5',
        question: 'Choose the word opposite in meaning to "candid".',
        options: { A: 'Frank', B: 'Honest', C: 'Secretive', D: 'Open' },
        answer: 'C',
      },
      {
        id: 'eng6',
        question: 'The story was so captivating. The word "captivating" means...',
        options: { A: 'Boring', B: 'Long', C: 'Interesting', D: 'Scary' },
        answer: 'C',
      },
      {
        id: 'eng7',
        question: 'Select the correctly spelt word.',
        options: { A: 'Embarass', B: 'Embarrass', C: 'Embarasss', D: 'Embaras' },
        answer: 'B',
      },
      {
        id: 'eng8',
        question: 'He is _________ to his studies.',
        options: { A: 'devoted', B: 'downcast', C: 'deported', D: 'declined' },
        answer: 'A',
      },
      {
        id: 'eng9',
        question: 'The chairman’s speech was greeted with a _________ applause.',
        options: { A: 'tumultuous', B: 'quiet', C: 'sad', D: 'hostile' },
        answer: 'A',
      },
      {
        id: 'eng10',
        question: 'Which of these is not a synonym for "happy"?',
        options: { A: 'Joyful', B: 'Cheerful', C: 'Sorrowful', D: 'Elated' },
        answer: 'C',
      },
    ],
  },
  {
    exam: 'JAMB',
    subject: 'Mathematics',
    year: 2014,
    questions: [
      {
        id: 'math1',
        question: 'If 2x + 5 = 15, what is the value of x?',
        options: { A: '5', B: '10', C: '7.5', D: '2.5' },
        answer: 'A',
      },
      {
        id: 'math2',
        question: 'What is the area of a circle with a radius of 7cm? (Use π = 22/7)',
        options: { A: '154 cm²', B: '44 cm²', C: '49 cm²', D: '144 cm²' },
        answer: 'A',
      },
    ]
  },
  {
    exam: 'WAEC',
    subject: 'Biology',
    year: 2015,
    questions: [
        {
            id: 'bio1',
            question: 'Which of these is NOT a characteristic of living things?',
            options: { A: 'Respiration', B: 'Movement', C: 'Crystallization', D: 'Reproduction' },
            answer: 'C'
        }
    ]
  }
];