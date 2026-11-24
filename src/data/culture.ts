export interface CultureCard {
  id: string
  title: string
  emoji: string
  hue: string
  text: string
  words: [string, string][]
  fact: string
  quiz: { q: string; options: string[]; answer: number }
}

export const CULTURE: CultureCard[] = [
  {
    id: 'bisous', title: 'La bise', emoji: '😘', hue: 'rose',
    text: 'In France, friends and family greet each other with **la bise** — light kisses on the cheeks. How many? It depends on the region: 2 in Paris, 3 in the south, and even 4 in some northern areas! Adults who don’t know each other usually shake hands.',
    words: [['faire la bise', 'to greet with kisses'], ['se serrer la main', 'to shake hands'], ['salut', 'hi']],
    fact: 'Tu (informal “you”) is for friends, family and kids. Vous is for adults you don’t know and teachers.',
    quiz: { q: 'Which “you” should you use with your teacher?', options: ['vous', 'tu', 'toi'], answer: 0 },
  },
  {
    id: 'food', title: 'Les repas', emoji: '🥖', hue: 'orange',
    text: 'French people buy fresh bread every day — around 6 billion **baguettes** are sold each year! Lunch is traditionally the main meal, and school lunches often have a starter, a main course, cheese and dessert. Snack time after school is called **le goûter**.',
    words: [['la baguette', 'French stick'], ['le goûter', 'afternoon snack'], ['bon appétit', 'enjoy your meal']],
    fact: 'France has over 1,000 different types of cheese.',
    quiz: { q: 'What is “le goûter”?', options: ['Afternoon snack', 'Breakfast', 'A type of cheese'], answer: 0 },
  },
  {
    id: 'school', title: 'L’école en France', emoji: '🎒', hue: 'sky',
    text: 'French students go to **le collège** from age 11 to 15 and then **le lycée**. The years count down: 6e (sixième) is the first year of collège and 3e (troisième) is the last — about the same as Year 9! Many students have Wednesday afternoons off, and there is no school uniform in most schools.',
    words: [['le collège', 'junior high school'], ['le lycée', 'senior high school'], ['le bac', 'final exam (like VCE)']],
    fact: 'Marks in France are out of 20. 10/20 is a pass and 16/20 is excellent!',
    quiz: { q: 'What are French school marks out of?', options: ['20', '100', '10'], answer: 0 },
  },
  {
    id: 'bastille', title: 'Le 14 juillet', emoji: '🎆', hue: 'indigo',
    text: 'France’s national day is **le quatorze juillet**, remembering the storming of the Bastille prison in 1789 at the start of the French Revolution. There is a huge military parade on the Champs-Élysées in Paris and fireworks over the Eiffel Tower.',
    words: [['la fête nationale', 'national day'], ['le défilé', 'parade'], ['le feu d’artifice', 'fireworks']],
    fact: 'France’s motto is “Liberté, Égalité, Fraternité” — Liberty, Equality, Brotherhood.',
    quiz: { q: 'What happened on 14 July 1789?', options: ['The storming of the Bastille', 'The Eiffel Tower opened', 'The first Tour de France'], answer: 0 },
  },
  {
    id: 'francophonie', title: 'La Francophonie', emoji: '🌍', hue: 'teal',
    text: 'French is spoken by more than **320 million people** on five continents. It’s an official language in 29 countries, including Canada, Belgium, Switzerland, Senegal and Madagascar. By 2050, most French speakers will live in Africa!',
    words: [['francophone', 'French-speaking'], ['la langue', 'language'], ['le monde', 'world']],
    fact: 'Our neighbour New Caledonia, only 2.5 hours’ flight from Brisbane, is French-speaking!',
    quiz: { q: 'Which Pacific neighbour of Australia speaks French?', options: ['New Caledonia', 'Fiji', 'Samoa'], answer: 0 },
  },
  {
    id: 'tour', title: 'Le Tour de France', emoji: '🚴', hue: 'amber',
    text: 'The **Tour de France** is the world’s most famous bike race. Every July, riders cycle about 3,500 km over three weeks, through the Alps and the Pyrenees, finishing in Paris. The overall leader wears the **maillot jaune** (yellow jersey).',
    words: [['le vélo', 'bike'], ['le maillot jaune', 'yellow jersey'], ['la course', 'race']],
    fact: 'Australian Cadel Evans won the Tour de France in 2011.',
    quiz: { q: 'What does the race leader wear?', options: ['A yellow jersey', 'A red cap', 'A green jersey'], answer: 0 },
  },
  {
    id: 'music', title: 'La musique', emoji: '🎵', hue: 'violet',
    text: 'French-language music is hugely popular. Try **Stromae** (Belgium), **Angèle** (Belgium), **Aya Nakamura**, or classics like Édith Piaf. Listening to songs with lyrics is a brilliant way to improve your pronunciation and pick up new words.',
    words: [['la chanson', 'song'], ['le chanteur / la chanteuse', 'singer'], ['les paroles', 'lyrics']],
    fact: 'Since 1996, French radio stations must play at least 35–40% French-language songs.',
    quiz: { q: 'What are “les paroles” of a song?', options: ['The lyrics', 'The singers', 'The tickets'], answer: 0 },
  },
  {
    id: 'quebec', title: 'Le Québec', emoji: '⚜️', hue: 'sky',
    text: 'In Quebec, Canada, French is the official language. Quebecers have their own expressions: a weekend is **la fin de semaine**, to go shopping is **magasiner**, and you say **bienvenue** for “you’re welcome”. In winter, people skate on frozen rivers and eat **poutine** — chips with cheese curds and gravy!',
    words: [['la fin de semaine', 'weekend (Quebec)'], ['magasiner', 'to shop (Quebec)'], ['la poutine', 'chips, cheese & gravy']],
    fact: 'Quebec’s motto is “Je me souviens” — I remember.',
    quiz: { q: 'What is “la poutine”?', options: ['Chips with cheese and gravy', 'A maple cake', 'A winter hat'], answer: 0 },
  },
  {
    id: 'false-friends', title: 'Faux amis', emoji: '🎭', hue: 'pink',
    text: 'Watch out for **false friends** — words that look English but mean something different! **Une librairie** is a bookshop (a library is une bibliothèque). **Sympathique** means nice, not sympathetic. **Le raisin** is a grape. **Actuellement** means currently, not actually.',
    words: [['la librairie', 'bookshop'], ['sympathique', 'nice'], ['le raisin', 'grape'], ['actuellement', 'currently']],
    fact: 'About 30% of English words come from French — so many words really are friends!',
    quiz: { q: 'What is “une librairie”?', options: ['A bookshop', 'A library', 'A laboratory'], answer: 0 },
  },
  {
    id: 'bd', title: 'La BD', emoji: '💬', hue: 'orange',
    text: 'Comics — **les bandes dessinées** (BD) — are a serious art form in France and Belgium, nicknamed “the ninth art”. Famous series include **Tintin** and **Astérix**. Angoulême hosts one of the world’s biggest comic festivals every January.',
    words: [['la bande dessinée', 'comic book'], ['le dessin', 'drawing'], ['la bulle', 'speech bubble']],
    fact: 'Reading simple BD is a fun way to practise — the pictures help you guess new words!',
    quiz: { q: 'What is “une BD”?', options: ['A comic book', 'A birthday', 'A bedroom'], answer: 0 },
  },
]
