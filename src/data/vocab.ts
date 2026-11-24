// Vocabulary bank for Victorian Curriculum French, Levels 9–10.
// Line format:  french | english | emoji | gender (only needed for l' and plural nouns: m / f / pl)

export type Gender = 'm' | 'f' | 'pl' | undefined

export interface Word {
  id: string
  fr: string
  en: string
  emoji: string
  gender: Gender
  theme: string
  answers: string[] // accepted typed answers
}

export interface Phrase {
  fr: string
  en: string
}

export interface Theme {
  id: string
  title: string
  en: string
  emoji: string
  level: 9 | 10
  hue: string // gradient key
  words: Word[]
  phrases: Phrase[]
}

interface RawTheme {
  id: string
  title: string
  en: string
  emoji: string
  level: 9 | 10
  hue: string
  words: string
  phrases: string
}

const RAW: RawTheme[] = [
  {
    id: 'essentials', title: 'Les essentiels', en: 'Greetings & classroom', emoji: '👋', level: 9, hue: 'sky',
    words: `
bonjour|hello / good morning|👋
salut|hi / bye (informal)|🙋
bonsoir|good evening|🌆
au revoir|goodbye|👋
à bientôt|see you soon|⏳
à demain|see you tomorrow|📅
merci|thank you|🙏
merci beaucoup|thank you very much|💐
s'il vous plaît|please (polite)|🙇
s'il te plaît|please (to a friend)|🤝
de rien|you're welcome|😊
pardon|sorry / excuse me|😬
excusez-moi|excuse me|🙋
oui|yes|✅
non|no|❌
d'accord|OK / agreed|👌
je ne sais pas|I don't know|🤷
je ne comprends pas|I don't understand|😕
Comment dit-on … en français ?|How do you say … in French?|❓
Vous pouvez répéter ?|Can you repeat that?|🔁
Comment ça va ?|How are you?|🙂
ça va bien|I'm fine|😄
pas mal|not bad|😐
Je m'appelle …|My name is …|📛
J'ai … ans|I am … years old|🎂
J'habite à …|I live in …|🏠
le professeur|teacher|🧑‍🏫
le cahier|exercise book|📓
le stylo|pen|🖊️
la trousse|pencil case|👝
le livre|book|📖
la règle|ruler|📏`,
    phrases: `
Bonjour ! Je m'appelle Léa et j'ai quatorze ans.|Hello! My name is Léa and I am fourteen.
J'habite à Melbourne, en Australie.|I live in Melbourne, in Australia.
Comment ça va ? Ça va très bien, merci.|How are you? Very well, thanks.
Pardon, je ne comprends pas.|Sorry, I don't understand.
Vous pouvez répéter, s'il vous plaît ?|Can you repeat, please?
Comment dit-on « homework » en français ?|How do you say "homework" in French?`,
  },
  {
    id: 'family', title: 'Ma famille et mes amis', en: 'Family & friends', emoji: '👨‍👩‍👧', level: 9, hue: 'rose',
    words: `
la famille|family|👨‍👩‍👧‍👦
les parents|parents|👫|pl
la mère|mother|👩
le père|father|👨
le frère|brother|👦
la sœur|sister|👧
le demi-frère|half-brother / stepbrother|👦
la demi-sœur|half-sister / stepsister|👧
le beau-père|stepfather|👨
la belle-mère|stepmother|👩
les grands-parents|grandparents|👴|pl
le grand-père|grandfather|👴
la grand-mère|grandmother|👵
l'oncle|uncle|🧔|m
la tante|aunt|👩‍🦰
le cousin|cousin (boy)|🧒
la cousine|cousin (girl)|👧
le fils|son|👦
la fille|daughter / girl|👧
l'enfant|child|🧒|m
le bébé|baby|👶
le mari|husband|🤵
la femme|wife / woman|👰
enfant unique|only child|☝️
l'ami|friend (boy)|🧑|m
l'amie|friend (girl)|👩|f
le copain|mate / boyfriend|🧑
la copine|mate / girlfriend|👩
le meilleur ami|best friend (boy)|🤜
la meilleure amie|best friend (girl)|💞
le chien|dog|🐕
le chat|cat|🐈
l'animal|pet / animal|🐾|m
le poisson rouge|goldfish|🐠
le lapin|rabbit|🐇
l'oiseau|bird|🐦|m`,
    phrases: `
Dans ma famille, il y a quatre personnes.|In my family there are four people.
J'ai un frère et une sœur.|I have a brother and a sister.
Je suis enfant unique.|I am an only child.
Je m'entends bien avec ma mère.|I get on well with my mum.
Ma meilleure amie s'appelle Chloé.|My best friend is called Chloé.
J'ai un chien qui s'appelle Max.|I have a dog called Max.`,
  },
  {
    id: 'describe', title: 'Les descriptions', en: 'Looks & personality', emoji: '🪞', level: 9, hue: 'violet',
    words: `
grand / grande|tall / big|🦒
petit / petite|small / short|🐭
gros / grosse|fat / large|🐘
mince|slim|🧍
beau / belle|beautiful / handsome|✨
joli / jolie|pretty|🌸
jeune|young|👶
vieux / vieille|old|👴
les cheveux|hair|💇|pl
les yeux|eyes|👀|pl
blond / blonde|blond|👱
brun / brune|dark-haired / brown|🟫
roux / rousse|red-haired|🧑‍🦰
court / courte|short (length)|✂️
long / longue|long|📏
frisé / frisée|curly|➰
raide|straight (hair)|〰️
bleu / bleue|blue|🔵
vert / verte|green|🟢
marron|brown (eyes)|🟤
les lunettes|glasses|👓|pl
la barbe|beard|🧔
gentil / gentille|kind|💗
sympa|nice / friendly|😊
drôle|funny|😂
marrant / marrante|funny (informal)|🤣
intelligent / intelligente|intelligent|🧠
sportif / sportive|sporty|⚽
paresseux / paresseuse|lazy|🦥
timide|shy|🙈
bavard / bavarde|chatty|🗣️
méchant / méchante|mean / nasty|😠
travailleur / travailleuse|hard-working|💪
égoïste|selfish|🙄
généreux / généreuse|generous|🎁
sérieux / sérieuse|serious|🧐
calme|calm|😌
pénible|annoying|😤`,
    phrases: `
J'ai les cheveux longs et bruns.|I have long brown hair.
J'ai les yeux bleus.|I have blue eyes.
Ma sœur est petite et très drôle.|My sister is short and very funny.
Mon père est grand et un peu sérieux.|My dad is tall and a bit serious.
Je suis assez timide mais gentille.|I am quite shy but kind.
Mon frère porte des lunettes.|My brother wears glasses.`,
  },
  {
    id: 'home', title: 'La maison', en: 'Home', emoji: '🏠', level: 9, hue: 'amber',
    words: `
la maison|house|🏠
l'appartement|flat / apartment|🏢|m
la chambre|bedroom|🛏️
la cuisine|kitchen|🍳
le salon|living room|🛋️
la salle à manger|dining room|🍽️
la salle de bains|bathroom|🛁
les toilettes|toilet|🚽|pl
le jardin|garden / backyard|🌳
le garage|garage|🚗
l'escalier|stairs|🪜|m
le premier étage|first floor (upstairs)|⬆️
le rez-de-chaussée|ground floor|⬇️
le lit|bed|🛏️
l'armoire|wardrobe|🚪|f
le bureau|desk / office|🖥️
la chaise|chair|🪑
la table|table|🟫
la fenêtre|window|🪟
la porte|door|🚪
la lampe|lamp|💡
le canapé|sofa|🛋️
le frigo|fridge|🧊
la douche|shower|🚿
le tapis|rug|🟥
le mur|wall|🧱
en ville|in town|🏙️
à la campagne|in the countryside|🌾
au bord de la mer|by the sea|🌊
la banlieue|suburbs|🏘️
ranger ma chambre|to tidy my room|🧹
faire la vaisselle|to do the dishes|🍽️
mettre la table|to set the table|🍴
passer l'aspirateur|to vacuum|🧽`,
    phrases: `
J'habite dans une maison en banlieue.|I live in a house in the suburbs.
Il y a trois chambres et un grand jardin.|There are three bedrooms and a big garden.
Dans ma chambre, il y a un lit et un bureau.|In my bedroom there is a bed and a desk.
Ma chambre est petite mais confortable.|My room is small but comfortable.
Je range ma chambre le samedi.|I tidy my room on Saturdays.
Je fais la vaisselle après le dîner.|I do the dishes after dinner.`,
  },
  {
    id: 'school', title: 'Le collège', en: 'School', emoji: '🏫', level: 9, hue: 'sky',
    words: `
le collège|high school (Years 7–10)|🏫
le lycée|senior high school|🎓
l'école|school|🏫|f
la salle de classe|classroom|🚪
la cantine|canteen|🍱
la bibliothèque|library|📚
la cour|playground / yard|⛹️
le gymnase|gym|🏀
l'emploi du temps|timetable|🗓️|m
la matière|subject|📘
les maths|maths|➗|pl
le français|French|🇫🇷
l'anglais|English|🇬🇧|m
les sciences|science|🔬|pl
l'histoire|history|🏛️|f
la géographie|geography|🌍
l'informatique|computing / IT|💻|f
le dessin|art|🎨
la musique|music|🎵
l'EPS|PE (sport)|🏃|f
le théâtre|drama|🎭
les devoirs|homework|📝|pl
le contrôle|test|✏️
la note|mark / grade|💯
la récré|recess / break|🍎
la pause déjeuner|lunch break|🥪
l'élève|student|🧑‍🎓|m
l'uniforme|uniform|👔|m
le cours|lesson / class|📖
facile|easy|😎
difficile|difficult|😵
utile|useful|🛠️
ennuyeux / ennuyeuse|boring|🥱
intéressant / intéressante|interesting|🤩
strict / stricte|strict|☝️`,
    phrases: `
Ma matière préférée, c'est le dessin.|My favourite subject is art.
J'aime les maths parce que c'est utile.|I like maths because it's useful.
Je n'aime pas l'histoire car c'est ennuyeux.|I don't like history because it's boring.
Les cours commencent à huit heures et demie.|Lessons start at half past eight.
Je mange à la cantine avec mes amis.|I eat in the canteen with my friends.
On a trop de devoirs !|We have too much homework!`,
  },
  {
    id: 'routine', title: 'La routine', en: 'Daily routine & time', emoji: '⏰', level: 9, hue: 'teal',
    words: `
se réveiller|to wake up|⏰
se lever|to get up|🛏️
se doucher|to have a shower|🚿
se laver|to wash (yourself)|🧼
s'habiller|to get dressed|👕
se brosser les dents|to brush your teeth|🪥
se coiffer|to do your hair|💇
prendre le petit-déjeuner|to have breakfast|🥐
partir|to leave|🚪
aller au collège|to go to school|🏫
prendre le bus|to take the bus|🚌
rentrer|to go home|🏠
goûter|to have an afternoon snack|🍪
faire ses devoirs|to do (your) homework|📝
dîner|to have dinner|🍝
se coucher|to go to bed|😴
dormir|to sleep|💤
le matin|(in the) morning|🌅
l'après-midi|(in the) afternoon|☀️|m
le soir|(in the) evening|🌙
la nuit|night|🌌
d'abord|first|1️⃣
ensuite|next|2️⃣
puis|then|➡️
après|after|⏩
enfin|finally|🏁
tous les jours|every day|📆
d'habitude|usually|🔄
quelquefois|sometimes|🎲
toujours|always|♾️
jamais|never|🚫
à sept heures|at seven o'clock|🕖
et demie|half past|🕡
et quart|quarter past|🕒
moins le quart|quarter to|🕤
midi|midday|🕛
minuit|midnight|🌃`,
    phrases: `
D'habitude, je me réveille à sept heures.|Usually I wake up at seven o'clock.
D'abord, je me douche, puis je m'habille.|First I shower, then I get dressed.
Je prends le petit-déjeuner à sept heures et demie.|I have breakfast at half past seven.
Je vais au collège en bus.|I go to school by bus.
Le soir, je fais mes devoirs.|In the evening I do my homework.
Je me couche vers dix heures.|I go to bed around ten o'clock.`,
  },
  {
    id: 'food', title: 'La nourriture', en: 'Food & drink', emoji: '🥐', level: 9, hue: 'orange',
    words: `
le pain|bread|🍞
le croissant|croissant|🥐
le fromage|cheese|🧀
le beurre|butter|🧈
la confiture|jam|🍓
les céréales|cereal|🥣|pl
l'œuf|egg|🥚|m
le lait|milk|🥛
le jus d'orange|orange juice|🧃
l'eau|water|💧|f
le café|coffee|☕
le chocolat chaud|hot chocolate|☕
le thé|tea|🍵
la viande|meat|🥩
le poulet|chicken|🍗
le poisson|fish|🐟
le jambon|ham|🍖
les frites|chips / fries|🍟|pl
les pâtes|pasta|🍝|pl
le riz|rice|🍚
la salade|salad / lettuce|🥗
les légumes|vegetables|🥦|pl
les fruits|fruit|🍎|pl
la pomme|apple|🍎
la banane|banana|🍌
la fraise|strawberry|🍓
l'orange|orange|🍊|f
la pomme de terre|potato|🥔
la carotte|carrot|🥕
la tomate|tomato|🍅
le gâteau|cake|🎂
la glace|ice cream|🍦
le bonbon|lolly / sweet|🍬
le petit-déjeuner|breakfast|🍳
le déjeuner|lunch|🥪
le dîner|dinner|🍽️
délicieux / délicieuse|delicious|😋
sain / saine|healthy|🥗
sucré / sucrée|sweet / sugary|🍭
J'ai faim|I'm hungry|😋
J'ai soif|I'm thirsty|🥤`,
    phrases: `
Pour le petit-déjeuner, je mange des céréales.|For breakfast I eat cereal.
Je bois du jus d'orange.|I drink orange juice.
Je ne mange pas de viande.|I don't eat meat.
Mon plat préféré, ce sont les pâtes.|My favourite dish is pasta.
Je voudrais un croissant, s'il vous plaît.|I'd like a croissant, please.
Les fruits sont sains et délicieux.|Fruit is healthy and delicious.`,
  },
  {
    id: 'shopping', title: 'Les magasins', en: 'Shopping & clothes', emoji: '🛍️', level: 9, hue: 'pink',
    words: `
le magasin|shop|🏬
le centre commercial|shopping centre|🛍️
la boulangerie|bakery|🥖
la pâtisserie|cake shop|🧁
la boucherie|butcher's|🥩
le supermarché|supermarket|🛒
le marché|market|🧺
l'argent|money|💰|m
l'euro|euro|💶|m
le prix|price|🏷️
cher / chère|expensive|💸
bon marché|cheap|🪙
les vêtements|clothes|👗|pl
le tee-shirt|T-shirt|👕
le pantalon|trousers / pants|👖
le jean|jeans|👖
la jupe|skirt|👗
la robe|dress|👗
la chemise|shirt|👔
le pull|jumper|🧶
la veste|jacket|🧥
le manteau|coat|🧥
le short|shorts|🩳
les chaussures|shoes|👞|pl
les baskets|sneakers / runners|👟|pl
les chaussettes|socks|🧦|pl
la casquette|cap|🧢
le chapeau|hat|👒
l'écharpe|scarf|🧣|f
le sac|bag|👜
la taille|size|📐
essayer|to try (on)|🪞
acheter|to buy|🛍️
Je voudrais …|I would like …|🙋
Ça coûte combien ?|How much does it cost?|💲
C'est trop cher.|It's too expensive.|😱
à la mode|fashionable|💃`,
    phrases: `
Je vais au centre commercial le samedi.|I go to the shopping centre on Saturdays.
Je voudrais essayer cette robe.|I would like to try on this dress.
Ce pantalon coûte combien ?|How much do these trousers cost?
C'est trop cher pour moi.|It's too expensive for me.
D'habitude, je porte un jean et un pull.|Usually I wear jeans and a jumper.
Au collège, on porte un uniforme.|At school we wear a uniform.`,
  },
  {
    id: 'town', title: 'En ville', en: 'Town & directions', emoji: '🏙️', level: 9, hue: 'indigo',
    words: `
la ville|town / city|🏙️
le village|village|🏡
le quartier|neighbourhood|🏘️
la rue|street|🛣️
la place|square|⛲
le cinéma|cinema|🎬
le parc|park|🌳
la piscine|swimming pool|🏊
la plage|beach|🏖️
le musée|museum|🖼️
l'église|church|⛪|f
la gare|train station|🚉
l'hôpital|hospital|🏥|m
la poste|post office|📮
la banque|bank|🏦
le restaurant|restaurant|🍽️
l'hôtel|hotel|🏨|m
le stade|stadium|🏟️
la mairie|town hall|🏛️
le commissariat|police station|🚓
le pont|bridge|🌉
les feux|traffic lights|🚦|pl
le carrefour|crossroads / intersection|✖️
tournez à gauche|turn left|⬅️
tournez à droite|turn right|➡️
allez tout droit|go straight ahead|⬆️
à côté de|next to|↔️
en face de|opposite|🔁
près de|near|📍
loin de|far from|🗺️
entre|between|↕️
devant|in front of|⏫
derrière|behind|⏬
Où est … ?|Where is …?|❓
Il y a …|There is / there are …|👉`,
    phrases: `
Pardon, où est la gare ?|Excuse me, where is the station?
Allez tout droit, puis tournez à gauche.|Go straight ahead, then turn left.
La banque est en face de la poste.|The bank is opposite the post office.
Dans ma ville, il y a un cinéma et un grand parc.|In my town there is a cinema and a big park.
Il n'y a pas de piscine.|There isn't a swimming pool.
J'habite près de la plage.|I live near the beach.`,
  },
  {
    id: 'leisure', title: 'Les loisirs', en: 'Free time & sport', emoji: '⚽', level: 9, hue: 'green',
    words: `
le sport|sport|🏅
le foot|soccer / football|⚽
le basket|basketball|🏀
le tennis|tennis|🎾
le netball|netball|🏐
la natation|swimming|🏊
la danse|dance|💃
le vélo|bike / cycling|🚲
la randonnée|hike / hiking|🥾
le skate|skateboarding|🛹
l'équitation|horse riding|🏇|f
les jeux vidéo|video games|🎮|pl
la lecture|reading|📖
la guitare|guitar|🎸
le piano|piano|🎹
la batterie|drums|🥁
le film|film / movie|🎬
la série|TV series|📺
la télé|TV|📺
le dessin animé|cartoon|🐭
le week-end|weekend|🗓️
le temps libre|free time|🕹️
jouer au foot|to play soccer|⚽
jouer du piano|to play the piano|🎹
faire du vélo|to go cycling|🚴
faire de la natation|to go swimming|🏊
faire les magasins|to go shopping|🛍️
sortir avec mes amis|to go out with my friends|👯
écouter de la musique|to listen to music|🎧
regarder la télé|to watch TV|📺
lire|to read|📚
chanter|to sing|🎤
dessiner|to draw|✏️
le passe-temps|hobby|🎯
le match|match / game|🏆
l'équipe|team|👥|f`,
    phrases: `
Pendant mon temps libre, j'aime lire.|In my free time I like reading.
Je joue au netball le samedi matin.|I play netball on Saturday mornings.
Je fais de la natation deux fois par semaine.|I go swimming twice a week.
Je joue de la guitare depuis trois ans.|I have been playing guitar for three years.
Le week-end, je sors avec mes amis.|On weekends I go out with my friends.
Je n'aime pas les jeux vidéo, c'est nul !|I don't like video games, they're rubbish!`,
  },
  {
    id: 'weather', title: 'La météo', en: 'Weather & seasons', emoji: '🌦️', level: 9, hue: 'sky',
    words: `
Quel temps fait-il ?|What's the weather like?|🌦️
il fait beau|it's nice weather|🌤️
il fait mauvais|it's bad weather|🌧️
il fait chaud|it's hot|🥵
il fait froid|it's cold|🥶
il pleut|it's raining|🌧️
il neige|it's snowing|❄️
il y a du soleil|it's sunny|☀️
il y a du vent|it's windy|💨
il y a des nuages|it's cloudy|☁️
il y a du brouillard|it's foggy|🌫️
il y a un orage|there's a storm|⛈️
la température|temperature|🌡️
le printemps|spring|🌷
l'été|summer|🌞|m
l'automne|autumn|🍂|m
l'hiver|winter|⛄|m
au printemps|in spring|🌷
en été|in summer|🏖️
en hiver|in winter|❄️
le ciel|sky|🌌
la pluie|rain|☔
la neige|snow|❄️
le soleil|sun|☀️
le vent|wind|🌬️
la météo|weather forecast|📺
demain|tomorrow|➡️
aujourd'hui|today|📍
hier|yesterday|⬅️
il fera beau|it will be nice|🌈`,
    phrases: `
Aujourd'hui, il fait beau et chaud.|Today the weather is nice and hot.
En hiver, il pleut souvent à Melbourne.|In winter it often rains in Melbourne.
Quand il fait froid, je reste à la maison.|When it's cold I stay at home.
En été, je vais à la plage.|In summer I go to the beach.
Demain, il fera beau.|Tomorrow it will be nice.
Hier, il y avait un orage.|Yesterday there was a storm.`,
  },
  {
    id: 'holidays', title: 'Les vacances', en: 'Holidays & transport', emoji: '✈️', level: 9, hue: 'teal',
    words: `
les vacances|holidays|🏝️|pl
le voyage|trip / journey|🧳
la valise|suitcase|🧳
le passeport|passport|🛂
le billet|ticket|🎫
l'avion|plane|✈️|m
le train|train|🚆
la voiture|car|🚗
le bus|bus|🚌
le bateau|boat|⛵
à pied|on foot|🚶
en avion|by plane|✈️
en voiture|by car|🚗
l'aéroport|airport|🛫|m
le camping|campsite|🏕️
la tente|tent|⛺
l'auberge de jeunesse|youth hostel|🛏️|f
la montagne|mountain|🏔️
la mer|sea|🌊
le lac|lake|🏞️
l'île|island|🏝️|f
le pays|country|🗺️
la France|France|🇫🇷
l'Australie|Australia|🇦🇺|f
à l'étranger|abroad|🌍
nager|to swim|🏊
se bronzer|to sunbathe|😎
visiter|to visit (a place)|📸
faire du ski|to go skiing|⛷️
faire du camping|to go camping|🏕️
les souvenirs|souvenirs / memories|🎁|pl
l'été dernier|last summer|⏮️|m
l'année prochaine|next year|⏭️|f`,
    phrases: `
L'été dernier, je suis allée en France.|Last summer I went to France.
J'ai voyagé en avion avec ma famille.|I travelled by plane with my family.
Nous avons logé dans un hôtel près de la mer.|We stayed in a hotel near the sea.
J'ai nagé et j'ai mangé des glaces.|I swam and ate ice creams.
C'était génial !|It was brilliant!
L'année prochaine, je vais aller au Canada.|Next year I am going to go to Canada.`,
  },
  {
    id: 'health', title: 'La santé', en: 'Body & health', emoji: '🩺', level: 9, hue: 'green',
    words: `
le corps|body|🧍
la tête|head|🙆
le nez|nose|👃
la bouche|mouth|👄
l'oreille|ear|👂|f
la dent|tooth|🦷
le bras|arm|💪
la main|hand|✋
le doigt|finger|☝️
la jambe|leg|🦵
le pied|foot|🦶
le genou|knee|🦵
le dos|back|🧍
le ventre|stomach / tummy|🫃
la gorge|throat|🗣️
le cœur|heart|❤️
J'ai mal à la tête|I have a headache|🤕
J'ai mal au ventre|I have a stomach ache|🤢
J'ai mal aux dents|I have a toothache|🦷
Je suis malade|I am sick|🤒
la fièvre|fever / temperature|🌡️
le rhume|cold (illness)|🤧
le médecin|doctor|🩺
la pharmacie|pharmacy|💊
le médicament|medicine|💊
la santé|health|💚
en forme|fit / in shape|🏋️
manger sain|to eat healthily|🥗
boire de l'eau|to drink water|💧
dormir huit heures|to sleep eight hours|😴
faire de l'exercice|to exercise|🏃
fumer|to smoke|🚭
le stress|stress|😫`,
    phrases: `
J'ai mal à la gorge et j'ai de la fièvre.|I have a sore throat and a temperature.
Je dois aller chez le médecin.|I have to go to the doctor.
Pour être en forme, je fais du sport.|To be fit, I do sport.
Il faut manger sain et boire de l'eau.|You must eat healthily and drink water.
Je ne fume pas, c'est dangereux.|I don't smoke, it's dangerous.
Je dors huit heures par nuit.|I sleep eight hours a night.`,
  },
  {
    id: 'time', title: 'Jours, mois et nombres', en: 'Days, months & numbers', emoji: '📅', level: 9, hue: 'amber',
    words: `
lundi|Monday|📅
mardi|Tuesday|📅
mercredi|Wednesday|📅
jeudi|Thursday|📅
vendredi|Friday|📅
samedi|Saturday|🎉
dimanche|Sunday|😴
janvier|January|🗓️
février|February|🗓️
mars|March|🗓️
avril|April|🗓️
mai|May|🗓️
juin|June|🗓️
juillet|July|🗓️
août|August|🗓️
septembre|September|🗓️
octobre|October|🎃
novembre|November|🗓️
décembre|December|🎄
la semaine|week|📅
le mois|month|🗓️
l'année|year|📆|f
l'anniversaire|birthday|🎂|m
onze|eleven|1️⃣
douze|twelve|🔢
quinze|fifteen|🔢
seize|sixteen|🔢
vingt|twenty|🔢
trente|thirty|🔢
quarante|forty|🔢
cinquante|fifty|🔢
soixante|sixty|🔢
soixante-dix|seventy|🔢
quatre-vingts|eighty|🔢
quatre-vingt-dix|ninety|🔢
cent|one hundred|💯
mille|one thousand|🔢`,
    phrases: `
Mon anniversaire, c'est le douze mars.|My birthday is the twelfth of March.
Aujourd'hui, c'est lundi.|Today is Monday.
Le lundi, j'ai sport.|On Mondays I have sport.
Il y a sept jours dans une semaine.|There are seven days in a week.
J'ai quinze ans.|I am fifteen years old.
Ça coûte vingt-cinq euros.|It costs twenty-five euros.`,
  },
  {
    id: 'connect', title: 'Pour bien écrire', en: 'Opinions & connectives', emoji: '✍️', level: 9, hue: 'violet',
    words: `
j'aime|I like|❤️
j'adore|I love|😍
je n'aime pas|I don't like|👎
je déteste|I hate|🤬
je préfère|I prefer|⭐
à mon avis|in my opinion|💭
je pense que|I think that|🤔
je trouve que|I find that|🔎
selon moi|in my view|👁️
parce que|because|➡️
car|because (formal)|➡️
mais|but|↔️
et|and|➕
aussi|also|➕
cependant|however|⚖️
pourtant|yet / however|⚖️
donc|so / therefore|∴
alors|so / then|➡️
ou|or|🔀
par exemple|for example|📌
surtout|especially|⭐
très|very|⬆️
assez|quite|↗️
trop|too (much)|‼️
un peu|a bit|🤏
vraiment|really|💯
super|great|🤩
génial / géniale|brilliant|🌟
nul / nulle|rubbish|🗑️
c'était|it was|⏮️
ce sera|it will be|⏭️
ce serait|it would be|💫
si j'avais le choix|if I had the choice|🎲
quand j'étais petit / quand j'étais petite|when I was little|👶
on peut|you can / one can|✅
il faut|you must / it is necessary|❗`,
    phrases: `
À mon avis, le français est très utile.|In my opinion, French is very useful.
J'adore la musique parce que c'est relaxant.|I love music because it's relaxing.
Je pense que les devoirs sont trop difficiles.|I think homework is too difficult.
J'aime le sport, cependant je préfère la danse.|I like sport, however I prefer dance.
Quand j'étais petite, j'habitais à Sydney.|When I was little, I lived in Sydney.
Si j'avais le choix, j'irais en France.|If I had the choice, I would go to France.`,
  },
  // ---------------- Year 10 ----------------
  {
    id: 'tech', title: 'La technologie', en: 'Technology & media', emoji: '📱', level: 10, hue: 'indigo',
    words: `
le portable|mobile phone|📱
l'ordinateur|computer|💻|m
la tablette|tablet|📲
l'écran|screen|🖥️|m
internet|the internet|🌐
le site web|website|🌍
l'appli|app|📲|f
les réseaux sociaux|social media|💬|pl
le message|message|✉️
le courriel|email|📧
le mot de passe|password|🔑
le jeu en ligne|online game|🎮
la vidéo|video|🎥
le selfie|selfie|🤳
la publicité|advertising / ad|📢
les informations|the news|🗞️|pl
le journal|newspaper|📰
le harcèlement|bullying / harassment|🚫
en ligne|online|🔗
télécharger|to download|⬇️
envoyer|to send|📤
partager|to share|🔁
publier|to post / to publish|📮
chercher|to look for / search|🔍
tchatter|to chat online|💬
rester en contact|to stay in touch|🤝
dangereux / dangereuse|dangerous|⚠️
pratique|practical / handy|👍
accro|addicted|🪝
la vie privée|privacy / private life|🔒
les avantages|advantages|✅|pl
les inconvénients|disadvantages|❌|pl`,
    phrases: `
J'utilise mon portable tous les jours.|I use my phone every day.
Les réseaux sociaux sont pratiques pour rester en contact.|Social media is handy for staying in touch.
Cependant, il y a des dangers en ligne.|However, there are dangers online.
Il ne faut pas partager son mot de passe.|You must not share your password.
Je pense qu'on passe trop de temps devant les écrans.|I think we spend too much time in front of screens.
Le harcèlement en ligne est un vrai problème.|Online bullying is a real problem.`,
  },
  {
    id: 'environment', title: "L'environnement", en: 'Environment', emoji: '🌏', level: 10, hue: 'green',
    words: `
l'environnement|environment|🌍|m
la planète|planet|🪐
la Terre|Earth|🌏
la nature|nature|🌿
la pollution|pollution|🏭
le réchauffement climatique|global warming|🌡️
le changement climatique|climate change|🔥
les déchets|rubbish / waste|🗑️|pl
le plastique|plastic|🧴
recycler|to recycle|♻️
le recyclage|recycling|♻️
économiser|to save (energy, money)|💡
gaspiller|to waste|🚮
l'énergie|energy|⚡|f
l'électricité|electricity|🔌|f
la forêt|forest|🌲
l'arbre|tree|🌳|m
l'océan|ocean|🌊|m
les animaux en danger|endangered animals|🐼|pl
le feu de brousse|bushfire|🔥
la sécheresse|drought|🏜️
l'inondation|flood|🌧️|f
protéger|to protect|🛡️
éteindre la lumière|to turn off the light|💡
les transports en commun|public transport|🚇|pl
le panneau solaire|solar panel|☀️
le sac réutilisable|reusable bag|🛍️
écologique|environmentally friendly|🌱
grave|serious|⚠️
sauver|to save (rescue)|🦸
l'avenir|the future|🔮|m`,
    phrases: `
Le changement climatique est un problème grave.|Climate change is a serious problem.
Pour protéger la planète, je recycle.|To protect the planet, I recycle.
J'éteins toujours la lumière.|I always turn off the light.
Il faut utiliser les transports en commun.|We must use public transport.
On devrait utiliser moins de plastique.|We should use less plastic.
En Australie, les feux de brousse sont dangereux.|In Australia, bushfires are dangerous.`,
  },
  {
    id: 'future', title: "Les métiers et l'avenir", en: 'Jobs & future plans', emoji: '💼', level: 10, hue: 'amber',
    words: `
le métier|job / profession|💼
le travail|work|🏢
l'infirmier / l'infirmière|nurse|🧑‍⚕️
l'avocat / l'avocate|lawyer|⚖️
l'ingénieur / l'ingénieure|engineer|👷
le vendeur / la vendeuse|shop assistant|🛍️
le policier / la policière|police officer|👮
le cuisinier / la cuisinière|cook / chef|🧑‍🍳
le coiffeur / la coiffeuse|hairdresser|💇
le vétérinaire|vet|🐾
le dentiste|dentist|🦷
le pompier|firefighter|🚒
l'acteur / l'actrice|actor / actress|🎭
le journaliste|journalist|📰
l'informaticien / l'informaticienne|IT specialist|💻
le comptable|accountant|🧮
l'architecte|architect|📐|m
le fermier / la fermière|farmer|🚜
le salaire|salary|💵
l'entreprise|company / business|🏢|f
le petit boulot|part-time job|🧾
le stage|work experience / internship|📋
l'université|university|🎓|f
les études|studies|📚|pl
gagner de l'argent|to earn money|💰
travailler dur|to work hard|💪
plus tard|later (on)|⏩
je voudrais devenir|I would like to become|🌟
mon rêve est de|my dream is to|💭
j'espère|I hope|🤞
bien payé / bien payée|well paid|💸
créatif / créative|creative|🎨`,
    phrases: `
Plus tard, je voudrais devenir vétérinaire.|Later on, I would like to become a vet.
J'adore les animaux, donc ce serait parfait.|I love animals, so it would be perfect.
Je vais aller à l'université.|I am going to go to university.
J'ai un petit boulot dans un café.|I have a part-time job in a café.
Mon rêve est de voyager partout dans le monde.|My dream is to travel all over the world.
Je ne voudrais pas travailler dans un bureau.|I wouldn't like to work in an office.`,
  },
  {
    id: 'festivals', title: 'Les fêtes', en: 'Festivals & traditions', emoji: '🎉', level: 10, hue: 'rose',
    words: `
la fête|party / celebration|🎉
Noël|Christmas|🎄
le Nouvel An|New Year|🎆
Pâques|Easter|🐣
la Saint-Valentin|Valentine's Day|💘
le quatorze juillet|Bastille Day (14 July)|🇫🇷
la fête nationale|national day|🎇
le cadeau|present / gift|🎁
le sapin de Noël|Christmas tree|🎄
le feu d'artifice|fireworks|🎆
le défilé|parade|🥁
la bûche de Noël|Yule log cake|🍰
la galette des rois|kings' cake (Epiphany)|👑
le réveillon|Christmas Eve / NYE dinner|🍽️
le jour férié|public holiday|📅
le mariage|wedding|💒
les bougies|candles|🕯️|pl
le carnaval|carnival|🎭
le Nouvel An chinois|Lunar New Year|🧧
fêter|to celebrate|🥳
offrir|to give (a gift)|🎁
inviter|to invite|💌
décorer|to decorate|🎀
se déguiser|to dress up|🦸
la tradition|tradition|📜
Joyeux Noël !|Merry Christmas!|🎅
Bonne année !|Happy New Year!|🥂
Bon anniversaire !|Happy birthday!|🎂`,
    phrases: `
En France, on fête Noël le vingt-quatre décembre au soir.|In France, Christmas is celebrated on the evening of 24 December.
Le quatorze juillet, il y a un défilé et un feu d'artifice.|On 14 July there's a parade and fireworks.
Pour mon anniversaire, j'ai reçu beaucoup de cadeaux.|For my birthday I received lots of presents.
Chez nous, on mange ensemble en famille.|At our house we eat together as a family.
Ma fête préférée, c'est le Nouvel An.|My favourite celebration is New Year.
On décore la maison avec des bougies.|We decorate the house with candles.`,
  },
  {
    id: 'relationships', title: 'Les relations', en: 'Relationships & teen life', emoji: '🤝', level: 10, hue: 'pink',
    words: `
s'entendre bien avec|to get on well with|🤝
se disputer avec|to argue with|😤
la dispute|argument|💢
la confiance|trust|🤞
le respect|respect|🙌
l'amitié|friendship|💛|f
l'ado|teenager|🧑|m
les jeunes|young people|👫|pl
la pression|pressure|😰
les règles|rules|📜|pl
la liberté|freedom|🕊️
l'argent de poche|pocket money|💰|m
avoir le droit de|to be allowed to|✅
il est interdit de|it is forbidden to|⛔
compréhensif / compréhensive|understanding|🤗
honnête|honest|🫶
jaloux / jalouse|jealous|😒
fidèle|loyal|🐶
agaçant / agaçante|irritating|🙄
la relation|relationship|💞
le petit ami|boyfriend|💑
la petite amie|girlfriend|💑
se marier|to get married|💍
se sentir|to feel|💭
heureux / heureuse|happy|😊
triste|sad|😢
fâché / fâchée|angry|😡
inquiet / inquiète|worried|😟
seul / seule|alone / lonely|🧍
le conseil|piece of advice|💡`,
    phrases: `
Je m'entends bien avec mes parents.|I get on well with my parents.
Je me dispute parfois avec mon frère.|I sometimes argue with my brother.
Un bon ami doit être honnête et fidèle.|A good friend must be honest and loyal.
Je n'ai pas le droit de sortir le soir.|I'm not allowed to go out in the evening.
Mes parents sont assez compréhensifs.|My parents are quite understanding.
Je me sens heureuse avec mes amis.|I feel happy with my friends.`,
  },
  {
    id: 'world', title: 'Le monde francophone', en: 'The French-speaking world', emoji: '🌍', level: 10, hue: 'teal',
    words: `
le monde|world|🌍
francophone|French-speaking|🗣️
la langue|language|💬
le Canada|Canada|🇨🇦
le Québec|Quebec|⚜️
la Belgique|Belgium|🇧🇪
la Suisse|Switzerland|🇨🇭
le Sénégal|Senegal|🇸🇳
le Maroc|Morocco|🇲🇦
la Tunisie|Tunisia|🇹🇳
Madagascar|Madagascar|🇲🇬
la Nouvelle-Calédonie|New Caledonia|🏝️
la Martinique|Martinique|🌴
le Vietnam|Vietnam|🇻🇳
l'Afrique|Africa|🌍|f
l'Europe|Europe|🇪🇺|f
l'Asie|Asia|🌏|f
le Royaume-Uni|United Kingdom|🇬🇧
les États-Unis|United States|🇺🇸|pl
l'Inde|India|🇮🇳|f
la Chine|China|🇨🇳
le Japon|Japan|🇯🇵
l'Italie|Italy|🇮🇹|f
l'Espagne|Spain|🇪🇸|f
l'Allemagne|Germany|🇩🇪|f
la capitale|capital city|🏙️
la culture|culture|🎨
la nationalité|nationality|🛂
australien / australienne|Australian|🇦🇺
français / française|French (nationality)|🇫🇷`,
    phrases: `
On parle français dans plus de vingt-cinq pays.|French is spoken in more than twenty-five countries.
Je voudrais aller au Québec.|I would like to go to Quebec.
J'habite en Australie, mais je voudrais vivre en France.|I live in Australia but I'd like to live in France.
La capitale de la Belgique, c'est Bruxelles.|The capital of Belgium is Brussels.
Au Sénégal, on parle français et wolof.|In Senegal, people speak French and Wolof.
Je suis australienne.|I am Australian.`,
  },
]

const ART = /^(le |la |les |l'|un |une )/i

function genderOf(fr: string, g?: string): Gender {
  if (g === 'm' || g === 'f' || g === 'pl') return g
  if (/^le /i.test(fr)) return 'm'
  if (/^la /i.test(fr)) return 'f'
  if (/^les /i.test(fr)) return 'pl'
  return undefined
}

function answersFor(fr: string): string[] {
  const parts = fr.split(' / ').map((s) => s.trim())
  const out = new Set<string>([fr, ...parts])
  return [...out]
}

export const THEMES: Theme[] = RAW.map((t) => ({
  id: t.id,
  title: t.title,
  en: t.en,
  emoji: t.emoji,
  level: t.level,
  hue: t.hue,
  words: t.words
    .trim()
    .split('\n')
    .map((line) => {
      const [fr, en, emoji = '', g] = line.split('|').map((s) => s.trim())
      return { id: fr, fr, en, emoji, gender: genderOf(fr, g), theme: t.id, answers: answersFor(fr) }
    }),
  phrases: t.phrases
    .trim()
    .split('\n')
    .map((line) => {
      const [fr, en] = line.split('|').map((s) => s.trim())
      return { fr, en }
    }),
}))

export const ALL_WORDS: Word[] = THEMES.flatMap((t) => t.words)
export const WORD_BY_ID = new Map(ALL_WORDS.map((w) => [w.id, w]))
export const themeById = (id: string) => THEMES.find((t) => t.id === id)

/** Words suitable for typing practice (no "…" placeholders, not too long). */
export const typeable = (w: Word) => !w.fr.includes('…') && w.fr.length <= 28

export const hasArticle = (w: Word) => ART.test(w.fr)
