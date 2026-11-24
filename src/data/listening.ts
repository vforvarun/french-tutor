// Listening comprehension clips (read aloud by the device's French voice).
import { mcq, type Q } from '../lib/quiz'

export interface Line {
  s: 'A' | 'B'
  fr: string
  en: string
}
export interface ListeningItem {
  id: string
  title: string
  emoji: string
  level: 9 | 10
  theme: string
  kind: string
  lines: Line[]
  questions: Q[]
}

const L = (s: 'A' | 'B', fr: string, en: string): Line => ({ s, fr, en })
const tag = (qs: Q[]) => qs.map((q) => ({ ...q, tag: 'listening' }))

export const LISTENING: ListeningItem[] = [
  {
    id: 'intro', title: 'Meet Lucas', emoji: '🙋‍♂️', level: 9, theme: 'family', kind: 'Monologue',
    lines: [
      L('A', 'Salut ! Je m’appelle Lucas. J’ai quatorze ans et j’habite à Lyon, en France.', 'Hi! My name is Lucas. I’m 14 and I live in Lyon, in France.'),
      L('A', 'Dans ma famille, il y a cinq personnes : mon père, ma mère, mes deux sœurs et moi.', 'In my family there are five people: my dad, my mum, my two sisters and me.'),
      L('A', 'J’ai aussi un chat qui s’appelle Caramel. Il est très paresseux !', 'I also have a cat called Caramel. He’s very lazy!'),
      L('A', 'Mon anniversaire, c’est le dix-huit juin.', 'My birthday is 18 June.'),
    ],
    questions: tag([
      mcq('How old is Lucas?', '14', ['4', '15', '13']),
      mcq('Where does he live?', 'Lyon', ['Paris', 'Lille', 'Nice']),
      mcq('How many people are in his family?', '5', ['4', '3', '6']),
      mcq('What is his cat like?', 'Lazy', ['Naughty', 'Small', 'Old']),
      mcq('When is his birthday?', '18 June', ['8 June', '18 July', '10 June']),
    ]),
  },
  {
    id: 'cafe', title: 'At the café', emoji: '☕', level: 9, theme: 'food', kind: 'Dialogue',
    lines: [
      L('B', 'Bonjour mademoiselle, vous désirez ?', 'Hello miss, what would you like?'),
      L('A', 'Bonjour ! Je voudrais un chocolat chaud et un croissant, s’il vous plaît.', 'Hello! I’d like a hot chocolate and a croissant, please.'),
      L('B', 'Désolé, il n’y a plus de croissants. Vous voulez un pain au chocolat ?', 'Sorry, there are no more croissants. Would you like a pain au chocolat?'),
      L('A', 'Oui, d’accord. Ça fait combien ?', 'Yes, OK. How much is that?'),
      L('B', 'Ça fait six euros cinquante.', 'That’s six euros fifty.'),
    ],
    questions: tag([
      mcq('What drink does she order?', 'Hot chocolate', ['Coffee', 'Orange juice', 'Tea']),
      mcq('Why can’t she have a croissant?', 'There are none left', ['They are too expensive', 'The café is closing', 'She changes her mind']),
      mcq('What does she have instead?', 'A pain au chocolat', ['A cake', 'Bread and jam', 'Nothing']),
      mcq('How much does it cost?', '€6.50', ['€5.60', '€16.50', '€7.50']),
    ]),
  },
  {
    id: 'school-day', title: 'My school day', emoji: '🏫', level: 9, theme: 'school', kind: 'Monologue',
    lines: [
      L('A', 'Je m’appelle Inès. Les cours commencent à huit heures et finissent à cinq heures.', 'My name is Inès. Lessons start at 8 and finish at 5.'),
      L('A', 'Le lundi, j’ai maths, anglais et sciences. J’adore les sciences parce que le prof est sympa.', 'On Mondays I have maths, English and science. I love science because the teacher is nice.'),
      L('A', 'Par contre, je déteste l’histoire. C’est ennuyeux et on a trop de devoirs.', 'On the other hand, I hate history. It’s boring and we have too much homework.'),
      L('A', 'À midi, je mange à la cantine avec ma meilleure amie, Sarah.', 'At midday I eat in the canteen with my best friend, Sarah.'),
    ],
    questions: tag([
      mcq('What time do lessons finish?', '5:00', ['8:00', '4:00', '3:30']),
      mcq('Why does Inès love science?', 'The teacher is nice', ['It is easy', 'She has friends there', 'It is useful']),
      mcq('Which subject does she hate?', 'History', ['Maths', 'English', 'Geography']),
      mcq('Name one reason she dislikes it.', 'Too much homework', ['The teacher is strict', 'It is difficult', 'It is too early']),
      mcq('Where does she eat lunch?', 'In the canteen', ['At home', 'In the park', 'In the classroom']),
    ]),
  },
  {
    id: 'weather', title: 'Weather forecast', emoji: '🌦️', level: 9, theme: 'weather', kind: 'Announcement',
    lines: [
      L('A', 'Voici la météo pour demain.', 'Here is the weather for tomorrow.'),
      L('A', 'Dans le nord, il va pleuvoir toute la journée et il fera froid : huit degrés.', 'In the north it will rain all day and it will be cold: eight degrees.'),
      L('A', 'Dans le sud, il fera beau et chaud, avec du soleil et vingt-six degrés.', 'In the south it will be fine and hot, with sunshine and 26 degrees.'),
      L('A', 'Attention : à la montagne, il y aura de la neige.', 'Be careful: in the mountains there will be snow.'),
    ],
    questions: tag([
      mcq('What will the weather be like in the north?', 'Rainy and cold', ['Sunny', 'Snowy', 'Windy and hot']),
      mcq('What temperature in the north?', '8°', ['18°', '6°', '28°']),
      mcq('What temperature in the south?', '26°', ['16°', '22°', '36°']),
      mcq('What will happen in the mountains?', 'Snow', ['Storms', 'Fog', 'Wind']),
    ]),
  },
  {
    id: 'directions', title: 'Finding the station', emoji: '🗺️', level: 9, theme: 'town', kind: 'Dialogue',
    lines: [
      L('A', 'Excusez-moi, monsieur. Où est la gare, s’il vous plaît ?', 'Excuse me, sir. Where is the station, please?'),
      L('B', 'La gare ? Allez tout droit, puis prenez la deuxième rue à droite.', 'The station? Go straight ahead, then take the second street on the right.'),
      L('B', 'La gare est en face du cinéma, à côté de la banque.', 'The station is opposite the cinema, next to the bank.'),
      L('A', 'C’est loin ?', 'Is it far?'),
      L('B', 'Non, c’est à cinq minutes à pied.', 'No, it’s five minutes on foot.'),
    ],
    questions: tag([
      mcq('Where does she want to go?', 'The station', ['The bank', 'The cinema', 'The beach']),
      mcq('Which street should she take?', 'Second on the right', ['First on the left', 'Second on the left', 'First on the right']),
      mcq('What is it opposite?', 'The cinema', ['The bank', 'The park', 'The church']),
      mcq('How far is it?', '5 minutes on foot', ['15 minutes on foot', '5 minutes by bus', 'Very far']),
    ]),
  },
  {
    id: 'weekend', title: 'Weekend plans', emoji: '🎬', level: 9, theme: 'leisure', kind: 'Dialogue',
    lines: [
      L('A', 'Salut Hugo ! Qu’est-ce que tu vas faire ce week-end ?', 'Hi Hugo! What are you going to do this weekend?'),
      L('B', 'Samedi matin, je vais jouer au basket avec mon équipe. Et toi ?', 'Saturday morning I’m going to play basketball with my team. And you?'),
      L('A', 'Moi, je vais faire les magasins avec ma mère. Tu veux aller au cinéma samedi soir ?', 'I’m going shopping with my mum. Do you want to go to the cinema on Saturday evening?'),
      L('B', 'Je ne peux pas, je dois garder mon petit frère. Dimanche après-midi, peut-être ?', 'I can’t, I have to look after my little brother. Sunday afternoon, maybe?'),
      L('A', 'D’accord ! Rendez-vous à deux heures devant le cinéma.', 'OK! Meet at two o’clock in front of the cinema.'),
    ],
    questions: tag([
      mcq('What is Hugo doing on Saturday morning?', 'Playing basketball', ['Going shopping', 'Going to the cinema', 'Looking after his brother']),
      mcq('Why can’t he go out on Saturday evening?', 'He must babysit his brother', ['He has homework', 'He is sick', 'He has a match']),
      mcq('When will they go to the cinema?', 'Sunday afternoon', ['Saturday evening', 'Sunday morning', 'Saturday afternoon']),
      mcq('Where will they meet?', 'In front of the cinema', ['At Hugo’s house', 'At the shops', 'At the bus stop']),
    ]),
  },
  {
    id: 'shop', title: 'Buying clothes', emoji: '👕', level: 9, theme: 'shopping', kind: 'Dialogue',
    lines: [
      L('B', 'Bonjour, je peux vous aider ?', 'Hello, can I help you?'),
      L('A', 'Oui, je cherche une veste noire, taille trente-huit.', 'Yes, I’m looking for a black jacket, size 38.'),
      L('B', 'Voilà. Elle coûte quarante-cinq euros.', 'Here you are. It costs 45 euros.'),
      L('A', 'Je peux l’essayer ? … Hmm, elle est un peu trop petite. Vous l’avez en quarante ?', 'Can I try it on? … Hmm, it’s a bit too small. Do you have it in a 40?'),
      L('B', 'Désolée, en quarante, il y a seulement la veste bleue.', 'Sorry, in a 40 there’s only the blue jacket.'),
      L('A', 'Ce n’est pas grave, je prends la bleue.', 'Never mind, I’ll take the blue one.'),
    ],
    questions: tag([
      mcq('What is she looking for?', 'A jacket', ['A dress', 'A jumper', 'Shoes']),
      mcq('How much does it cost?', '€45', ['€55', '€38', '€40']),
      mcq('What is the problem?', 'It is too small', ['It is too expensive', 'It is the wrong colour', 'It is too big']),
      mcq('What does she buy in the end?', 'The blue jacket', ['The black jacket', 'Nothing', 'A size 38']),
    ]),
  },
  {
    id: 'voicemail', title: 'A voicemail', emoji: '📞', level: 9, theme: 'routine', kind: 'Message',
    lines: [
      L('A', 'Allô Maman, c’est Chloé. Je suis chez Emma.', 'Hello Mum, it’s Chloé. I’m at Emma’s house.'),
      L('A', 'On fait nos devoirs de français ensemble. Je vais rentrer à sept heures et quart.', 'We’re doing our French homework together. I’ll be home at a quarter past seven.'),
      L('A', 'Je ne vais pas prendre le bus, le père d’Emma va me ramener en voiture.', 'I’m not going to take the bus, Emma’s dad is going to drive me home.'),
      L('A', 'Est-ce que tu peux garder mon dîner, s’il te plaît ? Bisous !', 'Can you keep my dinner, please? Love!'),
    ],
    questions: tag([
      mcq('Where is Chloé?', 'At her friend’s house', ['At school', 'At the library', 'On the bus']),
      mcq('What is she doing?', 'French homework', ['Watching a film', 'Cooking dinner', 'Maths homework']),
      mcq('What time will she be home?', '7:15', ['7:45', '6:15', '7:30']),
      mcq('How is she getting home?', 'By car', ['By bus', 'On foot', 'By bike']),
      mcq('What does she ask her mum to do?', 'Keep her dinner', ['Pick her up', 'Call Emma’s dad', 'Help with homework']),
    ]),
  },
  {
    id: 'holiday', title: 'Last holidays', emoji: '🏖️', level: 10, theme: 'holidays', kind: 'Monologue',
    lines: [
      L('A', 'L’été dernier, je suis allée en Bretagne avec mes grands-parents.', 'Last summer I went to Brittany with my grandparents.'),
      L('A', 'Nous avons voyagé en train et nous avons logé dans un petit hôtel au bord de la mer.', 'We travelled by train and stayed in a small hotel by the sea.'),
      L('A', 'Le premier jour, il faisait beau, alors j’ai nagé et j’ai fait de la voile.', 'On the first day the weather was nice, so I swam and went sailing.'),
      L('A', 'Malheureusement, après, il a plu pendant trois jours ! On a visité des musées.', 'Unfortunately, after that, it rained for three days! We visited museums.'),
      L('A', 'L’année prochaine, je voudrais aller en Espagne parce qu’il fait plus chaud.', 'Next year I’d like to go to Spain because it’s hotter.'),
    ],
    questions: tag([
      mcq('Who did she go on holiday with?', 'Her grandparents', ['Her parents', 'Her friends', 'Her school']),
      mcq('How did they travel?', 'By train', ['By car', 'By plane', 'By boat']),
      mcq('What did she do on the first day?', 'Swimming and sailing', ['Visited museums', 'Went shopping', 'Stayed in the hotel']),
      mcq('How long did it rain?', '3 days', ['1 day', 'The whole week', '2 days']),
      mcq('Why does she want to go to Spain?', 'It is hotter', ['It is cheaper', 'Her friend lives there', 'To learn Spanish']),
    ]),
  },
  {
    id: 'healthy', title: 'At the doctor’s', emoji: '🩺', level: 10, theme: 'health', kind: 'Dialogue',
    lines: [
      L('B', 'Bonjour. Qu’est-ce qui ne va pas ?', 'Hello. What’s wrong?'),
      L('A', 'J’ai mal à la gorge et à la tête depuis deux jours. Et j’ai de la fièvre.', 'I’ve had a sore throat and a headache for two days. And I have a temperature.'),
      L('B', 'Vous avez la grippe, je pense. Il faut rester au lit et boire beaucoup d’eau.', 'You have the flu, I think. You must stay in bed and drink lots of water.'),
      L('B', 'Prenez ce médicament trois fois par jour, après les repas.', 'Take this medicine three times a day, after meals.'),
      L('A', 'Est-ce que je peux aller au collège demain ?', 'Can I go to school tomorrow?'),
      L('B', 'Non, restez à la maison jusqu’à vendredi.', 'No, stay at home until Friday.'),
    ],
    questions: tag([
      mcq('How long has she been ill?', '2 days', ['2 weeks', '1 day', '3 days']),
      mcq('Which is NOT one of her symptoms?', 'Stomach ache', ['Sore throat', 'Headache', 'Temperature']),
      mcq('What does the doctor think she has?', 'The flu', ['A cold', 'Food poisoning', 'An allergy']),
      mcq('How often should she take the medicine?', '3 times a day after meals', ['Twice a day', 'Before every meal', 'Once at night']),
      mcq('When can she go back to school?', 'After Friday', ['Tomorrow', 'Monday next week', 'Wednesday']),
    ]),
  },
  {
    id: 'phone-debate', title: 'Phones at school', emoji: '📱', level: 10, theme: 'tech', kind: 'Debate',
    lines: [
      L('A', 'À mon avis, les portables devraient être interdits au collège. Les élèves ne se concentrent pas.', 'In my opinion, phones should be banned at school. Students don’t concentrate.'),
      L('B', 'Je ne suis pas d’accord. Le portable est utile pour faire des recherches et pour contacter ses parents.', 'I disagree. A phone is useful for research and for contacting your parents.'),
      L('A', 'Oui, mais il y a aussi le harcèlement sur les réseaux sociaux. C’est un vrai problème.', 'Yes, but there is also bullying on social media. It’s a real problem.'),
      L('B', 'C’est vrai. Peut-être qu’on pourrait utiliser les portables seulement pendant les cours, avec le prof ?', 'That’s true. Maybe we could use phones only during lessons, with the teacher?'),
    ],
    questions: tag([
      mcq('What does the first speaker think?', 'Phones should be banned', ['Phones are useful', 'Phones are too expensive', 'Phones should be free']),
      mcq('Give one reason the second speaker likes phones.', 'For research', ['For games', 'For music', 'For photos']),
      mcq('What problem is mentioned?', 'Bullying on social media', ['Phones get stolen', 'Phones are expensive', 'Phones break easily']),
      mcq('What compromise is suggested?', 'Use phones in lessons with the teacher', ['Use phones only at lunch', 'Ban all phones', 'Buy school phones']),
    ]),
  },
  {
    id: 'environment', title: 'Green school', emoji: '♻️', level: 10, theme: 'environment', kind: 'Speech',
    lines: [
      L('A', 'Bonjour à tous. Notre collège veut devenir plus écologique.', 'Hello everyone. Our school wants to become more environmentally friendly.'),
      L('A', 'Depuis septembre, nous recyclons le papier et le plastique dans toutes les salles de classe.', 'Since September we have been recycling paper and plastic in all the classrooms.'),
      L('A', 'Le mois prochain, nous allons installer des panneaux solaires sur le toit du gymnase.', 'Next month we are going to install solar panels on the gym roof.'),
      L('A', 'Nous demandons aussi aux élèves de venir au collège à vélo ou à pied.', 'We are also asking students to come to school by bike or on foot.'),
      L('A', 'Si tout le monde fait un petit effort, on pourra protéger la planète !', 'If everyone makes a small effort, we’ll be able to protect the planet!'),
    ],
    questions: tag([
      mcq('Since when has the school been recycling?', 'September', ['December', 'Last year', 'Next month']),
      mcq('What will be installed next month?', 'Solar panels', ['Recycling bins', 'Bike racks', 'Water fountains']),
      mcq('Where?', 'On the gym roof', ['In the canteen', 'In the classrooms', 'In the car park']),
      mcq('How are students asked to travel?', 'By bike or on foot', ['By bus', 'By train', 'By car share']),
    ]),
  },
  {
    id: 'future-job', title: 'Future plans', emoji: '🎓', level: 10, theme: 'future', kind: 'Interview',
    lines: [
      L('B', 'Alors Malik, qu’est-ce que tu voudrais faire plus tard ?', 'So Malik, what would you like to do later on?'),
      L('A', 'Je voudrais devenir ingénieur, parce que j’adore les maths et la technologie.', 'I would like to become an engineer, because I love maths and technology.'),
      L('A', 'Après le lycée, j’irai à l’université à Montréal, au Canada.', 'After senior school I will go to university in Montreal, in Canada.'),
      L('B', 'Et tu as un petit boulot en ce moment ?', 'And do you have a part-time job at the moment?'),
      L('A', 'Oui, je travaille dans un supermarché le samedi. Ce n’est pas très intéressant, mais je gagne de l’argent pour mes études.', 'Yes, I work in a supermarket on Saturdays. It’s not very interesting, but I earn money for my studies.'),
    ],
    questions: tag([
      mcq('What job does Malik want?', 'Engineer', ['Teacher', 'Doctor', 'IT specialist']),
      mcq('Why?', 'He loves maths and technology', ['It is well paid', 'His dad is one', 'He likes travelling']),
      mcq('Where will he study?', 'Montreal', ['Paris', 'Quebec City', 'Lyon']),
      mcq('Where does he work now?', 'In a supermarket', ['In a café', 'In a garage', 'In an office']),
      mcq('What does he think of his job?', 'Not very interesting', ['Brilliant', 'Too tiring', 'Badly paid']),
    ]),
  },
  {
    id: 'childhood', title: 'When I was little', emoji: '🧸', level: 10, theme: 'relationships', kind: 'Monologue',
    lines: [
      L('A', 'Quand j’étais petite, j’habitais à la campagne, dans une grande maison avec un jardin.', 'When I was little, I lived in the countryside in a big house with a garden.'),
      L('A', 'Je jouais dehors tous les jours avec mon frère. Nous avions deux chiens.', 'I played outside every day with my brother. We had two dogs.'),
      L('A', 'Mais quand j’avais dix ans, nous avons déménagé en ville pour le travail de mon père.', 'But when I was ten, we moved to the city for my dad’s work.'),
      L('A', 'Au début, j’étais triste. Maintenant, je préfère la ville parce qu’il y a plus de choses à faire.', 'At first I was sad. Now I prefer the city because there are more things to do.'),
    ],
    questions: tag([
      mcq('Where did she live when she was little?', 'In the countryside', ['In the city', 'By the sea', 'In the mountains']),
      mcq('How many dogs did they have?', '2', ['1', '3', 'None']),
      mcq('Why did they move?', 'For her dad’s work', ['For school', 'The house was too small', 'To be near family']),
      mcq('How old was she when they moved?', '10', ['8', '12', '6']),
      mcq('Why does she now prefer the city?', 'More things to do', ['Her friends are there', 'It is quieter', 'Better school']),
    ]),
  },
]
