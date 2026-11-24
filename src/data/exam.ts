// Writing tasks and speaking (oral) practice questions.

export interface WritingTask {
  id: string
  title: string
  emoji: string
  level: 9 | 10
  prompt: string
  bullets: string[]
  words: number // target word count
  phrases: string[]
  model: string
}

export const WRITING: WritingTask[] = [
  {
    id: 'self', title: 'All about me', emoji: '🙋', level: 9, words: 80,
    prompt: 'Write an email to a new French penfriend introducing yourself.',
    bullets: ['your name, age and where you live', 'your family (and pets)', 'what you look like and your personality', 'what you like doing and why'],
    phrases: ['Je m’appelle …', 'J’ai … ans', 'J’habite à … en Australie', 'Dans ma famille, il y a …', 'J’ai les cheveux … et les yeux …', 'Je suis assez … mais un peu …', 'J’adore … parce que c’est …'],
    model: 'Salut ! Je m’appelle Mia et j’ai quatorze ans. J’habite à Melbourne, en Australie. Dans ma famille, il y a quatre personnes : mon père, ma mère, mon petit frère et moi. Nous avons aussi un chien qui s’appelle Biscuit. J’ai les cheveux longs et bruns et les yeux verts. Je suis assez timide mais très gentille. Pendant mon temps libre, j’adore jouer au netball parce que c’est amusant. Je n’aime pas les jeux vidéo car c’est ennuyeux. Et toi ? Écris-moi vite ! Mia',
  },
  {
    id: 'school', title: 'My school', emoji: '🏫', level: 9, words: 90,
    prompt: 'Describe your school for a French exchange student.',
    bullets: ['what your school is like', 'your favourite and least favourite subjects, with reasons', 'your school day (times)', 'what you did at school yesterday'],
    phrases: ['Mon collège est grand / moderne …', 'Ma matière préférée, c’est … parce que …', 'Je n’aime pas … car …', 'Les cours commencent à …', 'Hier, j’ai …', 'À mon avis, …'],
    model: 'Mon collège s’appelle Riverside College. Il est assez grand et moderne, et il y a une belle bibliothèque. Ma matière préférée, c’est le dessin parce que je suis créative et la prof est sympa. Par contre, je n’aime pas les sciences car c’est difficile. Les cours commencent à huit heures quarante-cinq et finissent à trois heures et quart. À midi, je mange avec mes amis dans la cour. Hier, j’ai eu un contrôle de maths et j’ai joué au basket en EPS. C’était génial ! À mon avis, notre uniforme est un peu moche.',
  },
  {
    id: 'weekend', title: 'Last weekend', emoji: '🎉', level: 9, words: 90,
    prompt: 'Write a blog post about what you did last weekend and your plans for next weekend.',
    bullets: ['what you did on Saturday (passé composé)', 'what you did on Sunday', 'your opinion of the weekend', 'what you are going to do next weekend (futur proche)'],
    phrases: ['Samedi matin, j’ai …', 'Ensuite, je suis allé(e) …', 'Dimanche, …', 'C’était …', 'Le week-end prochain, je vais …', 'Je ne suis pas allé(e) …'],
    model: 'Samedi matin, je me suis levée à neuf heures. J’ai pris le petit-déjeuner avec ma famille, puis j’ai joué au netball avec mon équipe. Nous avons gagné ! L’après-midi, je suis allée au centre commercial avec mes amies et j’ai acheté un jean. Dimanche, il a plu, alors je suis restée à la maison. J’ai regardé une série et j’ai fait mes devoirs. C’était un week-end super ! Le week-end prochain, je vais aller à la plage avec ma cousine et nous allons manger une glace.',
  },
  {
    id: 'town', title: 'My town', emoji: '🏙️', level: 9, words: 80,
    prompt: 'Describe where you live for a tourist brochure.',
    bullets: ['where it is and what it is like', 'what there is to see and do', 'what there isn’t', 'your opinion with a reason'],
    phrases: ['J’habite dans une ville / un village …', 'Il y a …', 'Il n’y a pas de …', 'On peut …', 'J’aime habiter ici parce que …', 'Le seul problème, c’est …'],
    model: 'J’habite à Geelong, une ville au bord de la mer, près de Melbourne. C’est une ville assez grande et très jolie. Il y a une belle plage, un grand parc et beaucoup de restaurants. On peut nager, faire du vélo ou se promener. Il y a aussi un stade de foot australien. Cependant, il n’y a pas de patinoire et les transports en commun ne sont pas très bons. J’aime habiter ici parce que c’est calme et les gens sont sympas.',
  },
  {
    id: 'food', title: 'Healthy eating', emoji: '🥗', level: 9, words: 90,
    prompt: 'Write about your eating habits and how healthy you are.',
    bullets: ['what you usually eat and drink', 'your favourite food and what you don’t like', 'what you do to stay healthy', 'what you ate yesterday'],
    phrases: ['Pour le petit-déjeuner, je mange …', 'Je bois …', 'Je ne mange jamais de …', 'Pour être en forme, je …', 'Hier, j’ai mangé …', 'Je devrais …'],
    model: 'Pour le petit-déjeuner, je mange d’habitude des céréales avec du lait et je bois un jus d’orange. À midi, je mange un sandwich au jambon et une pomme. Mon plat préféré, ce sont les pâtes à la bolognaise. Je n’aime pas le poisson parce que c’est dégoûtant ! Pour être en forme, je fais du sport trois fois par semaine et je bois beaucoup d’eau. Hier, j’ai mangé une pizza et des frites, ce n’était pas très sain ! Je devrais manger plus de légumes.',
  },
  {
    id: 'holiday', title: 'A great holiday', emoji: '✈️', level: 10, words: 120,
    prompt: 'Write an article about a memorable holiday.',
    bullets: ['where you went, when and who with', 'how you travelled and where you stayed', 'what you did (passé composé) and what it was like (imparfait)', 'where you would like to go in the future and why'],
    phrases: ['L’année dernière, je suis allé(e) …', 'Nous avons voyagé en …', 'Nous avons logé dans …', 'Il faisait …', 'C’était inoubliable !', 'Si j’avais le choix, j’irais …'],
    model: 'L’année dernière, pendant les vacances d’été, je suis allée en Nouvelle-Calédonie avec ma famille. Nous avons voyagé en avion et le vol était assez court. Nous avons logé dans un petit hôtel au bord de la mer. Il faisait beau tous les jours et l’eau était très claire. J’ai fait de la plongée et j’ai vu des tortues, c’était inoubliable ! Le soir, nous mangions au restaurant et j’ai essayé des plats traditionnels. Le seul problème, c’était les moustiques ! À l’avenir, si j’avais le choix, j’irais en France parce que je voudrais visiter Paris et pratiquer mon français.',
  },
  {
    id: 'tech', title: 'Technology in my life', emoji: '📱', level: 10, words: 120,
    prompt: 'Write about how you use technology and its advantages and disadvantages.',
    bullets: ['how you use technology every day', 'the advantages', 'the dangers or disadvantages', 'how you used technology when you were younger (imparfait)'],
    phrases: ['J’utilise mon portable pour …', 'L’avantage, c’est que …', 'Cependant, …', 'Il ne faut pas …', 'Quand j’étais petit(e), je …', 'À l’avenir, je pense que …'],
    model: 'J’utilise mon portable tous les jours pour envoyer des messages à mes amis et pour écouter de la musique. Je l’utilise aussi pour faire mes devoirs. L’avantage, c’est qu’on peut rester en contact avec tout le monde et trouver des informations très vite. Cependant, il y a des dangers : le harcèlement en ligne est un vrai problème et on passe trop de temps devant les écrans. Il ne faut jamais partager son mot de passe. Quand j’étais petite, je n’avais pas de portable. Je jouais dehors avec mes voisins. À l’avenir, je vais essayer de passer moins de temps sur les réseaux sociaux.',
  },
  {
    id: 'environment', title: 'Protecting the planet', emoji: '🌏', level: 10, words: 120,
    prompt: 'Write a speech for your school about the environment.',
    bullets: ['the biggest environmental problems', 'what you already do to help', 'what your school should do (conditionnel)', 'what will happen if we do nothing (futur)'],
    phrases: ['À mon avis, le plus grand problème, c’est …', 'Chez moi, je …', 'Notre école devrait …', 'On pourrait …', 'Si on ne fait rien, …', 'Il faut agir maintenant !'],
    model: 'Bonjour à tous ! À mon avis, le plus grand problème, c’est le changement climatique. En Australie, il y a de plus en plus de feux de brousse et de sécheresses. Chez moi, je recycle le papier et le plastique, j’éteins toujours la lumière et je vais au collège à vélo. Notre école devrait installer des panneaux solaires et on pourrait interdire les bouteilles en plastique à la cantine. Si on ne fait rien, la planète sera en danger et beaucoup d’animaux disparaîtront. Il faut agir maintenant ! Merci de votre attention.',
  },
  {
    id: 'future', title: 'My future', emoji: '🎓', level: 10, words: 120,
    prompt: 'Write about your plans for the future.',
    bullets: ['what you want to do after school', 'the job you would like and why', 'whether you would like to live abroad', 'your ideal life in 15 years (futur / conditionnel)'],
    phrases: ['Après le lycée, je voudrais …', 'J’aimerais devenir … parce que …', 'Je ne voudrais pas …', 'Mon rêve est de …', 'Dans quinze ans, je serai …', 'J’espère que …'],
    model: 'Après le lycée, je voudrais aller à l’université pour étudier la biologie. J’aimerais devenir vétérinaire parce que j’adore les animaux et je voudrais les aider. Ce serait un métier fatigant mais très intéressant. Je ne voudrais pas travailler dans un bureau, car ce serait ennuyeux pour moi. Mon rêve est de vivre à l’étranger pendant un an, peut-être au Canada, pour améliorer mon français. Dans quinze ans, j’habiterai dans une maison à la campagne avec beaucoup d’animaux. J’espère que je serai heureuse !',
  },
  {
    id: 'festival', title: 'A celebration', emoji: '🎆', level: 10, words: 110,
    prompt: 'Describe a festival or celebration that is important to you.',
    bullets: ['which festival and when it happens', 'how you usually celebrate it', 'how you celebrated it last year', 'compare it with a French festival'],
    phrases: ['Ma fête préférée, c’est …', 'D’habitude, on …', 'L’année dernière, nous avons …', 'En France, on fête …', 'C’est plus / moins … que …'],
    model: 'Ma fête préférée, c’est Diwali, la fête des lumières. Elle a lieu en octobre ou en novembre. D’habitude, on décore la maison avec des bougies et des lumières, on porte de beaux vêtements et on mange beaucoup de bonbons. L’année dernière, nous avons invité toute la famille et nous avons regardé un feu d’artifice. C’était magnifique ! En France, la fête nationale, le quatorze juillet, est aussi célébrée avec des feux d’artifice. Mais à mon avis, Diwali est plus spéciale parce qu’on la fête en famille.',
  },
]

export interface SpeakingQ {
  q: string
  en: string
  model: string
}
export interface SpeakingSet {
  id: string
  title: string
  emoji: string
  level: 9 | 10
  questions: SpeakingQ[]
}

export const SPEAKING: SpeakingSet[] = [
  {
    id: 'me', title: 'Moi', emoji: '🙋', level: 9,
    questions: [
      { q: 'Comment tu t’appelles ?', en: 'What is your name?', model: 'Je m’appelle Mia.' },
      { q: 'Tu as quel âge ?', en: 'How old are you?', model: 'J’ai quatorze ans.' },
      { q: 'Où est-ce que tu habites ?', en: 'Where do you live?', model: 'J’habite à Melbourne, en Australie. C’est une grande ville.' },
      { q: 'C’est quand, ton anniversaire ?', en: 'When is your birthday?', model: 'Mon anniversaire, c’est le douze mars.' },
      { q: 'Décris ta famille.', en: 'Describe your family.', model: 'Dans ma famille, il y a quatre personnes : mon père, ma mère, mon frère et moi. Mon frère est drôle mais un peu pénible !' },
      { q: 'Tu as un animal ?', en: 'Do you have a pet?', model: 'Oui, j’ai un chien qui s’appelle Biscuit. Il est petit et très mignon.' },
    ],
  },
  {
    id: 'school', title: 'Le collège', emoji: '🏫', level: 9,
    questions: [
      { q: 'Quelle est ta matière préférée ? Pourquoi ?', en: 'What is your favourite subject? Why?', model: 'Ma matière préférée, c’est le français parce que c’est intéressant et la prof est sympa.' },
      { q: 'Qu’est-ce que tu n’aimes pas au collège ?', en: 'What don’t you like at school?', model: 'Je n’aime pas les maths parce que c’est difficile. Et on a trop de devoirs !' },
      { q: 'Décris ton uniforme.', en: 'Describe your uniform.', model: 'Je porte une chemise blanche, une jupe bleue et des chaussures noires. Je pense que c’est pratique mais un peu moche.' },
      { q: 'À quelle heure commencent les cours ?', en: 'What time do lessons start?', model: 'Les cours commencent à huit heures quarante-cinq et finissent à trois heures et quart.' },
      { q: 'Qu’est-ce que tu as fait au collège hier ?', en: 'What did you do at school yesterday?', model: 'Hier, j’ai eu maths et sciences. À midi, j’ai mangé avec mes amis et j’ai joué au basket.' },
    ],
  },
  {
    id: 'leisure', title: 'Les loisirs', emoji: '⚽', level: 9,
    questions: [
      { q: 'Qu’est-ce que tu fais pendant ton temps libre ?', en: 'What do you do in your free time?', model: 'Pendant mon temps libre, je joue au netball et j’écoute de la musique.' },
      { q: 'Tu fais du sport ?', en: 'Do you play sport?', model: 'Oui, je fais de la natation deux fois par semaine. J’adore ça parce que c’est relaxant.' },
      { q: 'Qu’est-ce que tu as fait le week-end dernier ?', en: 'What did you do last weekend?', model: 'Le week-end dernier, je suis allée au cinéma avec mes amis. Nous avons vu un film d’action. C’était génial !' },
      { q: 'Qu’est-ce que tu vas faire ce week-end ?', en: 'What are you going to do this weekend?', model: 'Ce week-end, je vais aller à la plage avec ma famille et je vais faire mes devoirs.' },
      { q: 'Tu aimes la musique ? Quel genre ?', en: 'Do you like music? What kind?', model: 'Oui, j’adore la musique pop. Mon chanteur préféré, c’est Stromae.' },
    ],
  },
  {
    id: 'routine', title: 'La routine', emoji: '⏰', level: 9,
    questions: [
      { q: 'À quelle heure est-ce que tu te lèves ?', en: 'What time do you get up?', model: 'Je me lève à sept heures en semaine, mais le week-end, je me lève à neuf heures.' },
      { q: 'Qu’est-ce que tu manges au petit-déjeuner ?', en: 'What do you eat for breakfast?', model: 'Je mange des céréales et je bois un jus d’orange.' },
      { q: 'Comment vas-tu au collège ?', en: 'How do you get to school?', model: 'Je vais au collège en bus. Ça prend vingt minutes.' },
      { q: 'Qu’est-ce que tu fais le soir ?', en: 'What do you do in the evening?', model: 'Le soir, je fais mes devoirs, je dîne avec ma famille et je regarde une série.' },
      { q: 'Tu aides à la maison ?', en: 'Do you help at home?', model: 'Oui, je range ma chambre et je fais la vaisselle. Je ne fais jamais la cuisine !' },
    ],
  },
  {
    id: 'holidays', title: 'Les vacances', emoji: '🏖️', level: 10,
    questions: [
      { q: 'Où es-tu allé(e) pendant les dernières vacances ?', en: 'Where did you go last holidays?', model: 'Pendant les dernières vacances, je suis allée à Sydney avec ma famille. Nous avons voyagé en avion.' },
      { q: 'C’était comment ?', en: 'What was it like?', model: 'C’était génial ! Il faisait beau et nous avons visité l’Opéra. Le seul problème, c’était le prix des hôtels.' },
      { q: 'Tu préfères les vacances à la plage ou à la montagne ?', en: 'Do you prefer beach or mountain holidays?', model: 'Je préfère les vacances à la plage parce que j’adore nager et me bronzer.' },
      { q: 'Où voudrais-tu aller à l’avenir ?', en: 'Where would you like to go in future?', model: 'Je voudrais aller en France parce que je voudrais voir la tour Eiffel et parler français.' },
      { q: 'Qu’est-ce que tu faisais pendant les vacances quand tu étais petit(e) ?', en: 'What did you do on holidays when you were little?', model: 'Quand j’étais petite, j’allais chez mes grands-parents à la campagne. Je jouais avec mes cousins.' },
    ],
  },
  {
    id: 'future', title: 'L’avenir', emoji: '🎓', level: 10,
    questions: [
      { q: 'Qu’est-ce que tu voudrais faire plus tard ?', en: 'What would you like to do later on?', model: 'Plus tard, je voudrais devenir médecin parce que j’aime aider les gens.' },
      { q: 'Tu as un petit boulot ?', en: 'Do you have a part-time job?', model: 'Oui, je travaille dans un café le dimanche. Je gagne quinze dollars de l’heure.' },
      { q: 'Tu voudrais aller à l’université ?', en: 'Would you like to go to university?', model: 'Oui, j’aimerais aller à l’université à Melbourne pour étudier les sciences.' },
      { q: 'Tu voudrais habiter à l’étranger ?', en: 'Would you like to live abroad?', model: 'Oui, si j’avais le choix, j’habiterais au Canada pendant un an.' },
      { q: 'Quel est ton rêve ?', en: 'What is your dream?', model: 'Mon rêve est de voyager partout dans le monde et d’apprendre trois langues.' },
    ],
  },
  {
    id: 'issues', title: 'La planète et la technologie', emoji: '🌏', level: 10,
    questions: [
      { q: 'Qu’est-ce que tu fais pour protéger l’environnement ?', en: 'What do you do to protect the environment?', model: 'Je recycle, j’éteins la lumière et je vais au collège à vélo.' },
      { q: 'Quel est le plus grand problème environnemental ?', en: 'What is the biggest environmental problem?', model: 'À mon avis, c’est le changement climatique, parce qu’il cause des feux de brousse et des sécheresses.' },
      { q: 'Tu utilises beaucoup ton portable ?', en: 'Do you use your phone a lot?', model: 'Oui, je l’utilise environ trois heures par jour, surtout pour parler avec mes amis.' },
      { q: 'Quels sont les dangers des réseaux sociaux ?', en: 'What are the dangers of social media?', model: 'Le harcèlement en ligne est un vrai problème, et on peut devenir accro.' },
      { q: 'Est-ce que les portables devraient être interdits au collège ?', en: 'Should phones be banned at school?', model: 'Je pense que oui, parce que les élèves se concentrent mieux sans portable.' },
    ],
  },
]

/** Exam technique tips shown in Exam Prep. */
export const TECHNIQUE: { title: string; emoji: string; tips: string[] }[] = [
  {
    title: 'Listening', emoji: '🎧',
    tips: ['Read the questions first and predict the words you might hear (numbers, days, places).', 'Listen for negatives (ne … pas, jamais) — they flip the meaning!', 'Listen for time words (hier, demain, l’année prochaine) to work out the tense.', 'Don’t panic if you miss a word: listen for the gist, then fill in details on the second hearing.'],
  },
  {
    title: 'Reading', emoji: '📖',
    tips: ['Look for cognates — words that look like English (important, la musique, intéressant).', 'Watch out for false friends: le collège = high school, la librairie = bookshop, sympathique = nice.', 'Use the context: what kind of word fits the gap?', 'Answer in the language of the question.'],
  },
  {
    title: 'Writing', emoji: '✍️',
    tips: ['Cover every bullet point — each one is worth marks.', 'Use three time frames: past (j’ai joué), present (je joue), future (je vais jouer).', 'Give opinions AND reasons: J’adore … parce que c’est …', 'Join ideas with connectives: cependant, donc, par contre, aussi.', 'Add a "wow" phrase: Si j’avais le choix, je … / Quand j’étais petit(e), je …', 'Check: verb endings, adjective agreement, accents, le/la.'],
  },
  {
    title: 'Speaking', emoji: '🎤',
    tips: ['Never answer with just oui or non — always add a detail and a reason.', 'Prepare a few all-purpose phrases: À mon avis, … / Je pense que … / C’était génial !', 'If you forget a word, describe it or use another one — keep talking!', 'Use “Euh …”, “Alors …”, “Bon …” to give yourself thinking time.', 'Ask for help in French: Vous pouvez répéter, s’il vous plaît ?'],
  },
]
