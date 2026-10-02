import lecomImg from '../assets/products/lecom.webp';
import boowaImg from '../assets/products/boowa.webp';
import auraImg from '../assets/products/aura.webp';
import eydImg from '../assets/products/eyd.webp';

// Real products. `pattern` is only a fallback for the procedural artwork; `image` is used whenever present.
// `year` carries the product's category, shown in the case study as "Focus".
export const projects = [
  {
    id: 'lecom', title: 'LECOM', year: 'Communication & Learning', role: 'Product Builder',
    image: lecomImg,
    short: 'A communication and learning platform designed to help people communicate better, learn effectively, and continuously improve.',
    tags: ['Communication', 'Learning', 'Personal Development'], pattern: 'community', tone: '#0C0F0A',
    overview: 'Communication. Learning. Growth.',
    challenge: 'Communication and learning usually stay things you mean to do. Progress gets hard to see, so motivation fades before the habit forms.',
    solution: 'LECOM puts both on one surface: structured communication practice alongside guided learning, so improvement comes from regular use instead of one long session.',
    outcome: 'A product built around a simple loop — show up, practise, notice the change.',
    hidden: ['Guided practice', 'Structured learning paths', 'Progress you can see'],
  },
  {
    id: 'boowa', title: 'BOOWA', year: 'Hyperlocal Delivery', role: 'Product Builder',
    image: boowaImg,
    short: 'A hyperlocal scheduled-delivery platform connecting customers, local businesses, and delivery operations through a more organized and predictable delivery experience.',
    tags: ['Hyperlocal Commerce', 'Scheduled Delivery', 'Local Businesses'], pattern: 'boowa', tone: '#0B0B0F',
    overview: 'Local delivery, on your schedule.',
    challenge: 'Hyperlocal delivery tends to run on guesswork — unclear timing, hand-offs that need chasing, and nobody owning the whole trip.',
    solution: 'One platform for customers, local businesses and delivery operations, with scheduling as the core idea so every side knows what happens next and when.',
    outcome: 'A delivery experience designed to be predictable instead of improvised.',
    hidden: ['Scheduled slots', 'Operations for local businesses', 'Shared delivery view'],
  },
  {
    id: 'aura', title: 'AURA', year: 'Health Awareness', role: 'Product Builder',
    image: auraImg,
    short: 'A proactive healthcare assistant designed to help people become more aware of their health through continuous assistance and intelligent insights.',
    tags: ['Health Awareness', 'Intelligent Assistance', 'Preventive Care'], pattern: 'aura', tone: '#0E0C0A',
    overview: 'Your proactive health companion.',
    challenge: 'Most health help arrives after something is already wrong, and most of the time people get is reactive rather than continuous.',
    solution: 'AURA stays present between appointments, using intelligent assistance to surface insights early so health becomes something you are aware of, not something you react to.',
    outcome: 'A companion built around awareness and prevention rather than diagnosis.',
    hidden: ['Continuous assistance', 'Early insights', 'Awareness-first design'],
  },
  {
    id: 'eyd', title: 'EYD', year: 'Property & 3D', role: 'Product Builder',
    image: eydImg,
    short: 'A digital ecosystem for discovering, buying, building, and selling homes through immersive 3D property experiences.',
    tags: ['3D Property Viewing', 'Buy & Sell', 'Construction', 'Materials', 'Professionals'], pattern: 'crm', tone: '#0A0C0F',
    overview: 'Explore your dreams.',
    challenge: 'Buying or building a home means judging spaces from flat photos and scattered listings, which hides far more than it shows.',
    solution: 'An ecosystem where properties are explored in immersive 3D, with buying, selling, construction, materials and the professionals involved all in the same place.',
    outcome: 'A single digital ecosystem for discovering, buying, building and selling homes.',
    hidden: ['Immersive 3D viewing', 'Buy & sell flow', 'Materials + professionals'],
  },
];
