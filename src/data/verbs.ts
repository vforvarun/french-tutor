// Verb bank. Regular verbs are generated; irregular / stem-changing verbs give
// their present tense in full. `fut` = future/conditional stem when irregular.

export interface Verb {
  inf: string
  en: string
  kind: 'er' | 'ir' | 're' | 'irr'
  pp?: string
  etre?: boolean
  refl?: boolean
  present?: string // 6 forms separated by spaces (without pronoun)
  fut?: string
  level: 9 | 10
}

const V = (inf: string, en: string, kind: Verb['kind'], extra: Partial<Verb> = {}): Verb => ({ inf, en, kind, level: 9, ...extra })

export const VERBS: Verb[] = [
  // --- the big irregulars ---
  V('être', 'to be', 'irr', { present: 'suis es est sommes êtes sont', pp: 'été', fut: 'ser' }),
  V('avoir', 'to have', 'irr', { present: 'ai as a avons avez ont', pp: 'eu', fut: 'aur' }),
  V('aller', 'to go', 'irr', { present: 'vais vas va allons allez vont', pp: 'allé', etre: true, fut: 'ir' }),
  V('faire', 'to do / to make', 'irr', { present: 'fais fais fait faisons faites font', pp: 'fait', fut: 'fer' }),
  V('pouvoir', 'to be able to (can)', 'irr', { present: 'peux peux peut pouvons pouvez peuvent', pp: 'pu', fut: 'pourr' }),
  V('vouloir', 'to want', 'irr', { present: 'veux veux veut voulons voulez veulent', pp: 'voulu', fut: 'voudr' }),
  V('devoir', 'to have to (must)', 'irr', { present: 'dois dois doit devons devez doivent', pp: 'dû', fut: 'devr' }),
  V('savoir', 'to know (a fact / how to)', 'irr', { present: 'sais sais sait savons savez savent', pp: 'su', fut: 'saur' }),
  V('venir', 'to come', 'irr', { present: 'viens viens vient venons venez viennent', pp: 'venu', etre: true, fut: 'viendr' }),
  V('devenir', 'to become', 'irr', { present: 'deviens deviens devient devenons devenez deviennent', pp: 'devenu', etre: true, fut: 'deviendr', level: 10 }),
  V('revenir', 'to come back', 'irr', { present: 'reviens reviens revient revenons revenez reviennent', pp: 'revenu', etre: true, fut: 'reviendr' }),
  V('prendre', 'to take', 'irr', { present: 'prends prends prend prenons prenez prennent', pp: 'pris' }),
  V('apprendre', 'to learn', 'irr', { present: 'apprends apprends apprend apprenons apprenez apprennent', pp: 'appris' }),
  V('comprendre', 'to understand', 'irr', { present: 'comprends comprends comprend comprenons comprenez comprennent', pp: 'compris' }),
  V('mettre', 'to put (on)', 'irr', { present: 'mets mets met mettons mettez mettent', pp: 'mis' }),
  V('voir', 'to see', 'irr', { present: 'vois vois voit voyons voyez voient', pp: 'vu', fut: 'verr' }),
  V('dire', 'to say', 'irr', { present: 'dis dis dit disons dites disent', pp: 'dit' }),
  V('lire', 'to read', 'irr', { present: 'lis lis lit lisons lisez lisent', pp: 'lu' }),
  V('écrire', 'to write', 'irr', { present: 'écris écris écrit écrivons écrivez écrivent', pp: 'écrit' }),
  V('boire', 'to drink', 'irr', { present: 'bois bois boit buvons buvez boivent', pp: 'bu' }),
  V('sortir', 'to go out', 'irr', { present: 'sors sors sort sortons sortez sortent', pp: 'sorti', etre: true }),
  V('partir', 'to leave', 'irr', { present: 'pars pars part partons partez partent', pp: 'parti', etre: true }),
  V('dormir', 'to sleep', 'irr', { present: 'dors dors dort dormons dormez dorment', pp: 'dormi' }),
  V('courir', 'to run', 'irr', { present: 'cours cours court courons courez courent', pp: 'couru', fut: 'courr', level: 10 }),
  V('connaître', 'to know (a person / place)', 'irr', { present: 'connais connais connaît connaissons connaissez connaissent', pp: 'connu', level: 10 }),
  V('croire', 'to believe', 'irr', { present: 'crois crois croit croyons croyez croient', pp: 'cru', level: 10 }),
  V('ouvrir', 'to open', 'irr', { present: 'ouvre ouvres ouvre ouvrons ouvrez ouvrent', pp: 'ouvert', level: 10 }),
  V('envoyer', 'to send', 'irr', { present: 'envoie envoies envoie envoyons envoyez envoient', pp: 'envoyé', fut: 'enverr', level: 10 }),
  V('naître', 'to be born', 'irr', { present: 'nais nais naît naissons naissez naissent', pp: 'né', etre: true, fut: 'naîtr', level: 10 }),
  V('mourir', 'to die', 'irr', { present: 'meurs meurs meurt mourons mourez meurent', pp: 'mort', etre: true, fut: 'mourr', level: 10 }),
  // --- stem-changing -er verbs ---
  V('manger', 'to eat', 'er', { present: 'mange manges mange mangeons mangez mangent' }),
  V('nager', 'to swim', 'er', { present: 'nage nages nage nageons nagez nagent' }),
  V('commencer', 'to start', 'er', { present: 'commence commences commence commençons commencez commencent' }),
  V('acheter', 'to buy', 'er', { present: 'achète achètes achète achetons achetez achètent', fut: 'achèter' }),
  V('préférer', 'to prefer', 'er', { present: 'préfère préfères préfère préférons préférez préfèrent' }),
  V('appeler', 'to call', 'er', { present: 'appelle appelles appelle appelons appelez appellent', fut: 'appeller', level: 10 }),
  // --- regular -er ---
  V('aimer', 'to like / to love', 'er'),
  V('adorer', 'to love', 'er'),
  V('détester', 'to hate', 'er'),
  V('parler', 'to speak', 'er'),
  V('jouer', 'to play', 'er'),
  V('regarder', 'to watch', 'er'),
  V('écouter', 'to listen to', 'er'),
  V('habiter', 'to live (in)', 'er'),
  V('travailler', 'to work', 'er'),
  V('visiter', 'to visit (a place)', 'er'),
  V('chanter', 'to sing', 'er'),
  V('danser', 'to dance', 'er'),
  V('trouver', 'to find', 'er'),
  V('porter', 'to wear / to carry', 'er'),
  V('préparer', 'to prepare', 'er'),
  V('aider', 'to help', 'er'),
  V('penser', 'to think', 'er'),
  V('utiliser', 'to use', 'er', { level: 10 }),
  V('arriver', 'to arrive', 'er', { etre: true }),
  V('entrer', 'to enter', 'er', { etre: true }),
  V('rester', 'to stay', 'er', { etre: true }),
  V('tomber', 'to fall', 'er', { etre: true }),
  V('rentrer', 'to go home', 'er', { etre: true }),
  V('monter', 'to go up', 'er', { etre: true }),
  V('retourner', 'to return', 'er', { etre: true, level: 10 }),
  // --- regular -ir ---
  V('finir', 'to finish', 'ir'),
  V('choisir', 'to choose', 'ir'),
  V('réussir', 'to succeed / to pass', 'ir'),
  V('grandir', 'to grow up', 'ir', { level: 10 }),
  // --- regular -re ---
  V('vendre', 'to sell', 're'),
  V('attendre', 'to wait (for)', 're'),
  V('entendre', 'to hear', 're'),
  V('répondre', 'to answer', 're'),
  V('perdre', 'to lose', 're'),
  V('descendre', 'to go down', 're', { etre: true }),
  // --- reflexive ---
  V('se laver', 'to wash (oneself)', 'er', { refl: true, etre: true }),
  V('se lever', 'to get up', 'er', { refl: true, etre: true, present: 'lève lèves lève levons levez lèvent', fut: 'lèver' }),
  V('se réveiller', 'to wake up', 'er', { refl: true, etre: true }),
  V("s'habiller", 'to get dressed', 'er', { refl: true, etre: true }),
  V('se coucher', 'to go to bed', 'er', { refl: true, etre: true }),
  V('se doucher', 'to have a shower', 'er', { refl: true, etre: true }),
  V('se brosser les dents', 'to brush your teeth', 'er', { refl: true, etre: true }),
  V("s'amuser", 'to have fun', 'er', { refl: true, etre: true }),
  V('se reposer', 'to rest', 'er', { refl: true, etre: true, level: 10 }),
  V('se promener', 'to go for a walk', 'er', { refl: true, etre: true, present: 'promène promènes promène promenons promenez promènent', fut: 'promèner', level: 10 }),
  V("s'entendre", 'to get on (with)', 're', { refl: true, etre: true, level: 10 }),
]

export const verbByInf = (inf: string) => VERBS.find((v) => v.inf === inf)
