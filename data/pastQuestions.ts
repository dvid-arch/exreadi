
import { PastPaper } from '../types.ts';

export const pastPapersData: PastPaper[] = [
  {
    id: 'jamb-english-2014',
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
    id: 'jamb-mathematics-2014',
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
      {
        id: 'math3',
        question: 'Simplify the expression: 3a - 2b + 4a + 5b',
        options: { A: '7a + 3b', B: 'a + 3b', C: '7a - 3b', D: 'a - 3b' },
        answer: 'A',
      },
      {
        id: 'math4',
        question: 'A bag contains 5 red balls and 3 blue balls. What is the probability of picking a blue ball?',
        options: { A: '5/8', B: '3/8', C: '1/2', D: '3/5' },
        answer: 'B',
      },
      {
        id: 'math5',
        question: 'Find the next number in the sequence: 2, 5, 10, 17, ...',
        options: { A: '24', B: '25', C: '26', D: '27' },
        answer: 'C',
      },
    ]
  },
  {
    id: 'waec-biology-2015',
    exam: 'WAEC',
    subject: 'Biology',
    year: 2015,
    questions: [
        {
            id: 'bio1',
            question: 'Which of these is NOT a characteristic of living things?',
            options: { A: 'Respiration', B: 'Movement', C: 'Crystallization', D: 'Reproduction' },
            answer: 'C'
        },
        {
            id: 'bio2',
            question: 'The part of the cell that controls all its activities is the?',
            options: { A: 'Mitochondrion', B: 'Nucleus', C: 'Cell wall', D: 'Cytoplasm' },
            answer: 'B'
        },
        {
            id: 'bio3',
            question: 'Which of the following is a producer in an ecosystem?',
            options: { A: 'Lion', B: 'Goat', C: 'Grass', D: 'Mushroom' },
            answer: 'C'
        },
        {
            id: 'bio4',
            question: 'The process by which plants lose water through their leaves is called?',
            options: { A: 'Photosynthesis', B: 'Respiration', C: 'Transpiration', D: 'Osmosis' },
            answer: 'C'
        },
        {
            id: 'bio5',
            question: 'Which of these blood components is responsible for clotting?',
            options: { A: 'Red blood cells', B: 'White blood cells', C: 'Plasma', D: 'Platelets' },
            answer: 'D'
        }
    ]
  },
   {
    id: 'jamb-physics-2014',
    exam: 'JAMB',
    subject: 'Physics',
    year: 2014,
    questions: [
      {
        id: 'phy1',
        question: 'Which of the following is a vector quantity?',
        options: { A: 'Speed', B: 'Mass', C: 'Velocity', D: 'Temperature' },
        answer: 'C',
      },
      {
        id: 'phy2',
        question: 'A car accelerates uniformly from rest to a speed of 20 m/s in 5 seconds. Calculate its acceleration.',
        options: { A: '2 m/s²', B: '4 m/s²', C: '5 m/s²', D: '10 m/s²' },
        answer: 'B',
      },
      {
        id: 'phy3',
        question: 'The unit of electrical resistance is?',
        options: { A: 'Volt', B: 'Ampere', C: 'Watt', D: 'Ohm' },
        answer: 'D',
      },
      {
        id: 'phy4',
        question: 'Which law states that for every action, there is an equal and opposite reaction?',
        options: { A: "Newton's First Law", B: "Newton's Second Law", C: "Newton's Third Law", D: "Ohm's Law" },
        answer: 'C',
      },
      {
        id: 'phy5',
        question: 'Light travels fastest in which medium?',
        options: { A: 'Water', B: 'Glass', C: 'Air', D: 'Vacuum' },
        answer: 'D',
      },
    ]
  },
  {
    id: 'jamb-chemistry-2014',
    exam: 'JAMB',
    subject: 'Chemistry',
    year: 2014,
    questions: [
      {
        id: 'chem1',
        question: 'The chemical symbol for Gold is?',
        options: { A: 'Ag', B: 'Au', C: 'Go', D: 'Gd' },
        answer: 'B',
      },
      {
        id: 'chem2',
        question: 'Which of the following is an acid?',
        options: { A: 'NaOH', B: 'H2O', C: 'NaCl', D: 'HCl' },
        answer: 'D',
      },
      {
        id: 'chem3',
        question: 'The process of a solid turning directly into a gas is called?',
        options: { A: 'Melting', B: 'Evaporation', C: 'Sublimation', D: 'Condensation' },
        answer: 'C',
      },
      {
        id: 'chem4',
        question: 'What is the atomic number of an element with 11 protons and 12 neutrons?',
        options: { A: '11', B: '12', C: '23', D: '1' },
        answer: 'A',
      },
      {
        id: 'chem5',
        question: 'Which gas is most abundant in the Earth\'s atmosphere?',
        options: { A: 'Oxygen', B: 'Carbon Dioxide', C: 'Nitrogen', D: 'Argon' },
        answer: 'C',
      },
    ]
  }
];