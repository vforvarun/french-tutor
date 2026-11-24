// Reading comprehension texts. Glossary words become tappable in the text.
import { mcq, type Q } from '../lib/quiz'

export interface ReadingItem {
  id: string
  title: string
  emoji: string
  level: 9 | 10
  kind: string
  text: string // paragraphs separated by blank lines
  glossary: Record<string, string>
  translation: string
  questions: Q[]
}

const tag = (qs: Q[]) => qs.map((q) => ({ ...q, tag: 'reading' }))
const VF = (statement: string, isTrue: boolean, explain?: string) => mcq(statement, isTrue ? 'Vrai (true)' : 'Faux (false)', [isTrue ? 'Faux (false)' : 'Vrai (true)'], explain)

export const READING: ReadingItem[] = [
  {
    id: 'penpal', title: 'An email from Camille', emoji: '💌', level: 9, kind: 'Email',
    text: `Salut !

Je m'appelle Camille et j'ai quatorze ans. J'habite à Bordeaux, dans le sud-ouest de la France, avec ma mère, mon beau-père et mon demi-frère, Théo. Il a six ans et il est très bavard !

Au collège, ma matière préférée, c'est l'anglais, parce que la prof est très drôle. Je n'aime pas les maths car c'est difficile pour moi.

Le week-end, je fais de l'équitation et je joue de la guitare. Et toi, qu'est-ce que tu fais pendant ton temps libre ?

Écris-moi vite !
Camille`,
    glossary: { 'sud-ouest': 'south-west', 'beau-père': 'stepfather', 'demi-frère': 'half-brother', bavard: 'chatty', 'matière préférée': 'favourite subject', drôle: 'funny', équitation: 'horse riding', 'temps libre': 'free time', vite: 'quickly / soon' },
    translation: 'Hi! My name is Camille and I’m 14. I live in Bordeaux, in south-west France, with my mum, my stepdad and my half-brother Théo. He is six and very chatty! At school my favourite subject is English because the teacher is very funny. I don’t like maths because it’s difficult for me. At weekends I go horse riding and play guitar. What about you, what do you do in your free time? Write back soon! Camille',
    questions: tag([
      mcq('Where is Bordeaux?', 'South-west France', ['North of France', 'Near Paris', 'South-east France']),
      mcq('Who is Théo?', 'Her half-brother', ['Her stepfather', 'Her cousin', 'Her friend']),
      mcq('Why does she like English?', 'The teacher is funny', ['It is easy', 'She wants to travel', 'Her friends are in the class']),
      VF('Camille finds maths easy.', false, 'Elle dit : « c’est difficile pour moi ».'),
      mcq('What does she do at weekends?', 'Horse riding and guitar', ['Swimming and piano', 'Shopping and reading', 'Soccer and drawing']),
    ]),
  },
  {
    id: 'menu', title: 'Le menu du jour', emoji: '🍽️', level: 9, kind: 'Menu',
    text: `CAFÉ DU PORT — Menu du jour : 15 €

Entrée : soupe de tomates ou salade verte

Plat principal : poulet rôti avec frites, ou poisson grillé avec riz et légumes

Dessert : tarte aux pommes ou glace à la vanille

Boissons non comprises. Menu enfant (moins de 12 ans) : 8 €. Fermé le lundi.`,
    glossary: { entrée: 'starter', 'plat principal': 'main course', rôti: 'roast', grillé: 'grilled', tarte: 'tart / pie', 'non comprises': 'not included', 'moins de': 'under / less than', fermé: 'closed' },
    translation: 'Port Café — Menu of the day €15. Starter: tomato soup or green salad. Main: roast chicken with chips, or grilled fish with rice and vegetables. Dessert: apple tart or vanilla ice cream. Drinks not included. Children’s menu (under 12): €8. Closed on Mondays.',
    questions: tag([
      mcq('How much is the menu of the day?', '€15', ['€8', '€12', '€5']),
      mcq('What comes with the fish?', 'Rice and vegetables', ['Chips', 'Salad', 'Soup']),
      VF('Drinks are included in the price.', false),
      mcq('Who can have the €8 menu?', 'Children under 12', ['Students', 'Everyone on Mondays', 'Over 65s']),
      mcq('When is the café closed?', 'Monday', ['Sunday', 'Tuesday', 'Every evening']),
    ]),
  },
  {
    id: 'routine-blog', title: 'Ma journée typique', emoji: '📓', level: 9, kind: 'Blog',
    text: `D'habitude, je me réveille à six heures et demie, mais je me lève à sept heures parce que je suis un peu paresseux !

D'abord, je me douche, puis je m'habille. Je prends le petit-déjeuner avec ma sœur : des céréales et un jus d'orange.

Je vais au collège à vélo. Ça prend vingt minutes. Après les cours, je goûte et je fais mes devoirs.

Le soir, je dîne avec ma famille vers sept heures et demie. Après, je regarde une série ou je joue aux jeux vidéo. Je me couche à dix heures.`,
    glossary: { "d'habitude": 'usually', paresseux: 'lazy', "d'abord": 'first', puis: 'then', 'ça prend': 'it takes', goûte: 'have a snack', vers: 'around (time)', 'me couche': 'go to bed' },
    translation: 'Usually I wake up at 6:30 but I get up at 7 because I’m a bit lazy! First I shower, then I get dressed. I have breakfast with my sister: cereal and orange juice. I go to school by bike. It takes twenty minutes. After lessons I have a snack and do my homework. In the evening I have dinner with my family around 7:30. Afterwards I watch a series or play video games. I go to bed at 10.',
    questions: tag([
      mcq('What time does he get up?', '7:00', ['6:30', '7:30', '6:00']),
      mcq('Why does he stay in bed?', 'He is a bit lazy', ['He is tired', 'It is cold', 'He reads']),
      mcq('How does he get to school?', 'By bike', ['By bus', 'On foot', 'By car']),
      mcq('How long is the journey?', '20 minutes', ['10 minutes', '30 minutes', '2 minutes']),
      VF('He goes to bed at 10 pm.', true),
    ]),
  },
  {
    id: 'ad-house', title: 'Holiday house for rent', emoji: '🏡', level: 9, kind: 'Advert',
    text: `À LOUER — Maison de vacances en Provence

Grande maison à la campagne, à dix kilomètres de la mer. Trois chambres, deux salles de bains, une cuisine moderne et un grand salon.

Jardin avec piscine et barbecue. Parking gratuit. Animaux acceptés.

Prix : 900 € par semaine en juillet et août, 600 € le reste de l'année. Réservez vite !`,
    glossary: { 'à louer': 'for rent', 'à dix kilomètres': 'ten kilometres away', gratuit: 'free (no cost)', 'animaux acceptés': 'pets welcome', 'le reste de': 'the rest of', réservez: 'book' },
    translation: 'For rent — holiday house in Provence. Large house in the countryside, 10 km from the sea. Three bedrooms, two bathrooms, a modern kitchen and a big living room. Garden with pool and barbecue. Free parking. Pets welcome. Price: €900 a week in July and August, €600 the rest of the year. Book quickly!',
    questions: tag([
      mcq('Where is the house?', 'In the countryside', ['By the sea', 'In the city', 'In the mountains']),
      mcq('How many bedrooms?', '3', ['2', '4', '10']),
      VF('You can bring your dog.', true, 'Animaux acceptés = pets welcome.'),
      mcq('How much per week in August?', '€900', ['€600', '€300', '€1000']),
      mcq('What is in the garden?', 'A pool and a barbecue', ['A tennis court', 'A vegetable patch', 'A playground']),
    ]),
  },
  {
    id: 'sport-star', title: 'Une jeune championne', emoji: '🏊‍♀️', level: 10, kind: 'Article',
    text: `Léna Martin a seize ans et elle est déjà championne de France de natation. Elle s'entraîne six jours par semaine : deux heures le matin avant le lycée, et deux heures le soir.

« Quand j'étais petite, j'avais peur de l'eau ! » explique-t-elle en riant. « Mais à huit ans, j'ai commencé à nager avec mon club et j'ai adoré tout de suite. »

Ce n'est pas toujours facile. Léna n'a pas beaucoup de temps pour sortir avec ses amis et elle doit faire attention à ce qu'elle mange.

Son rêve ? Participer aux Jeux olympiques. « Si je travaille dur, je pense que c'est possible », dit-elle.`,
    glossary: { déjà: 'already', "s'entraîne": 'trains', avant: 'before', 'avait peur': 'was afraid', 'en riant': 'laughing', 'tout de suite': 'straight away', 'faire attention': 'to be careful', rêve: 'dream', 'Jeux olympiques': 'Olympic Games' },
    translation: 'Léna Martin is sixteen and already French swimming champion. She trains six days a week: two hours in the morning before school and two hours in the evening. “When I was little I was scared of water!” she explains, laughing. “But at eight I started swimming with my club and loved it straight away.” It isn’t always easy. Léna doesn’t have much time to go out with her friends and has to be careful about what she eats. Her dream? To compete in the Olympic Games. “If I work hard, I think it’s possible,” she says.',
    questions: tag([
      mcq('How many hours does Léna train per day?', '4', ['2', '6', '8']),
      mcq('How did she feel about water as a small child?', 'She was scared of it', ['She loved it', 'She was bored', 'She was a champion']),
      mcq('At what age did she join her club?', '8', ['6', '16', '10']),
      mcq('Which is a difficulty she mentions?', 'Little time with friends', ['Expensive equipment', 'Injuries', 'Bad coaches']),
      VF('She thinks the Olympics are impossible.', false),
    ]),
  },
  {
    id: 'screens', title: 'Trop d’écrans ?', emoji: '📵', level: 10, kind: 'Forum',
    text: `Zoé, 15 ans : Moi, je passe environ cinq heures par jour sur mon portable. Je sais que c'est trop, mais c'est comme ça que je reste en contact avec mes amis. Le soir, j'ai du mal à dormir.

Karim, 16 ans : Je n'ai pas de compte sur les réseaux sociaux. À mon avis, c'est une perte de temps. Je préfère faire du sport et lire. Mes amis pensent que je suis bizarre !

Manon, 14 ans : Mes parents ont des règles strictes : pas de portable à table et pas d'écrans après neuf heures. Au début, je détestais ça, mais maintenant je dors mieux et j'ai de meilleures notes.`,
    glossary: { environ: 'about / around', "j'ai du mal à": 'I find it hard to', compte: 'account', 'perte de temps': 'waste of time', bizarre: 'weird', règles: 'rules', 'au début': 'at first', mieux: 'better', notes: 'marks / grades' },
    translation: 'Zoé, 15: I spend about five hours a day on my phone. I know it’s too much, but it’s how I stay in touch with my friends. At night I find it hard to sleep. Karim, 16: I don’t have a social media account. In my opinion it’s a waste of time. I prefer doing sport and reading. My friends think I’m weird! Manon, 14: My parents have strict rules: no phone at the table and no screens after 9. At first I hated it, but now I sleep better and I have better marks.',
    questions: tag([
      mcq('Who has trouble sleeping?', 'Zoé', ['Karim', 'Manon', 'Nobody']),
      mcq('What does Karim think of social media?', 'A waste of time', ['Useful for friends', 'Dangerous', 'Fun']),
      mcq('What is one of Manon’s family rules?', 'No phone at the table', ['No phone at school', 'Only one hour a day', 'No social media']),
      mcq('What has improved for Manon?', 'Her sleep and marks', ['Her friendships', 'Her sport', 'Her pocket money']),
      VF('Karim’s friends think he is weird.', true),
    ]),
  },
  {
    id: 'quebec', title: 'Le Québec', emoji: '⚜️', level: 10, kind: 'Article',
    text: `Le Québec est une province du Canada où la langue officielle est le français. Environ huit millions de personnes y habitent. La plus grande ville est Montréal, mais la capitale est la ville de Québec.

Les hivers sont très froids : il peut faire moins trente degrés ! Les Québécois adorent le hockey sur glace et le sirop d'érable, qu'on mange avec des crêpes.

Le français du Québec est un peu différent du français de France. Par exemple, on dit « magasiner » au lieu de « faire les magasins », et « bienvenue » au lieu de « de rien ».`,
    glossary: { 'langue officielle': 'official language', environ: 'about', y: 'there', 'moins trente': 'minus thirty', 'hockey sur glace': 'ice hockey', "sirop d'érable": 'maple syrup', 'au lieu de': 'instead of' },
    translation: 'Quebec is a province of Canada where the official language is French. About eight million people live there. The biggest city is Montreal, but the capital is Quebec City. Winters are very cold: it can be minus thirty degrees! Quebecers love ice hockey and maple syrup, eaten with pancakes. Quebec French is a bit different from French in France. For example, they say “magasiner” instead of “faire les magasins”, and “bienvenue” instead of “de rien”.',
    questions: tag([
      mcq('What is the capital of Quebec?', 'Quebec City', ['Montreal', 'Ottawa', 'Toronto']),
      mcq('About how many people live in Quebec?', '8 million', ['80 million', '800,000', '18 million']),
      mcq('How cold can winter get?', '−30°', ['−3°', '−13°', '0°']),
      mcq('What is maple syrup eaten with?', 'Pancakes', ['Bread', 'Ice cream', 'Cheese']),
      mcq('How do Quebecers say "you’re welcome"?', 'Bienvenue', ['De rien', 'Merci', 'Magasiner']),
    ]),
  },
  {
    id: 'volunteer', title: 'Bénévoles pour la planète', emoji: '🌱', level: 10, kind: 'Article',
    text: `Chaque samedi matin, une vingtaine de jeunes se retrouvent sur la plage de Saint-Malo pour ramasser les déchets.

« L'année dernière, nous avons ramassé plus de deux tonnes de plastique ! » raconte Hugo, dix-sept ans, qui a créé le groupe.

Les bénévoles trouvent surtout des bouteilles, des sacs et des mégots de cigarettes. « C'est triste, mais on se sent utiles. Et c'est aussi l'occasion de se faire de nouveaux amis », dit Inès, quinze ans.

Le groupe voudrait maintenant visiter les écoles pour expliquer aux enfants comment protéger l'océan.`,
    glossary: { bénévoles: 'volunteers', 'une vingtaine': 'about twenty', 'se retrouvent': 'meet up', ramasser: 'to pick up', déchets: 'rubbish', raconte: 'says / tells', créé: 'created', surtout: 'mainly', mégots: 'cigarette butts', "l'occasion": 'the opportunity' },
    translation: 'Every Saturday morning, about twenty young people meet on the beach at Saint-Malo to pick up rubbish. “Last year we collected more than two tonnes of plastic!” says Hugo, 17, who created the group. The volunteers mainly find bottles, bags and cigarette butts. “It’s sad, but we feel useful. And it’s also a chance to make new friends,” says Inès, 15. The group would now like to visit schools to explain to children how to protect the ocean.',
    questions: tag([
      mcq('When does the group meet?', 'Saturday mornings', ['Sunday afternoons', 'Every day', 'Once a month']),
      mcq('How much plastic did they collect last year?', 'More than 2 tonnes', ['20 kg', '200 kg', '12 tonnes']),
      mcq('Who started the group?', 'Hugo', ['Inès', 'A teacher', 'The town hall']),
      mcq('What positive thing does Inès mention?', 'Making new friends', ['Earning money', 'Getting school credit', 'Going swimming']),
      mcq('What is the group’s next plan?', 'Visit schools', ['Clean a forest', 'Make a film', 'Plant trees']),
    ]),
  },
]
