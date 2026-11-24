// Pronunciation lessons: the sounds English speakers find hardest in French.

export interface SoundLesson {
  id: string
  title: string
  symbol: string // big label
  tip: string // how to make the sound
  mouth: string // physical tip
  examples: [string, string][] // [fr, en]
  pairs: [string, string][] // minimal pairs for "hear the difference"
  twister?: [string, string]
  level: 9 | 10
}

export const SOUNDS: SoundLesson[] = [
  {
    id: 'silent', title: 'Silent endings', symbol: 'petiŧ', level: 9,
    tip: 'Most consonants at the end of a word are silent — especially **s, t, d, x, z, p**. A final **-e** is silent too, but it makes the consonant before it heard: petit (“puh-tee”) but petite (“puh-teet”). Remember **CaReFuL**: final **c, r, f, l** are usually pronounced (avec, bonjour, neuf, il).',
    mouth: 'Stop the word at the last vowel. Don’t let an “s” or “t” sneak out!',
    examples: [['petit', 'small'], ['grand', 'big'], ['trois', 'three'], ['vous', 'you'], ['les chats', 'the cats'], ['avec', 'with'], ['bonjour', 'hello'], ['neuf', 'nine']],
    pairs: [['petit', 'petite'], ['grand', 'grande'], ['vert', 'verte'], ['français', 'française'], ['il est grand', 'elle est grande']],
    twister: ['Trois petits chats gris dorment dans un lit.', 'Three little grey cats sleep in a bed.'],
  },
  {
    id: 'u', title: 'u vs ou', symbol: 'u / ou', level: 9,
    tip: '**ou** is easy: like “oo” in “food”. The French **u** has no English twin: say “ee”, then — keeping your tongue exactly there — round your lips into a tight “o”.',
    mouth: 'Tongue forward (as for “ee”), lips pushed out like a kiss. If your tongue slides back, you’re saying “ou”.',
    examples: [['tu', 'you'], ['la rue', 'the street'], ['le jus', 'juice'], ['salut', 'hi'], ['vous', 'you (plural)'], ['tout', 'all'], ['rouge', 'red'], ['la musique', 'music']],
    pairs: [['tu', 'tout'], ['vu', 'vous'], ['la rue', 'la roue'], ['dessus', 'dessous'], ['pur', 'pour'], ['bu', 'bout']],
    twister: ['As-tu vu le tutu de tulle de Lili d’Honolulu ?', 'Did you see Lili from Honolulu’s tulle tutu?'],
  },
  {
    id: 'r', title: 'The French R', symbol: 'R', level: 9,
    tip: 'The French **r** is made in the throat, not with the tip of the tongue. It’s a soft gargle — like the sound you make clearing your throat gently, or the “ch” in Scottish “loch” but with voice.',
    mouth: 'Keep the tip of your tongue down behind your bottom teeth. Raise the back of your tongue towards your throat and let the air rub through.',
    examples: [['rouge', 'red'], ['la rue', 'the street'], ['très', 'very'], ['Paris', 'Paris'], ['merci', 'thank you'], ['le frère', 'brother'], ['l’arbre', 'tree'], ['bonjour', 'hello']],
    pairs: [],
    twister: ['Trois tortues trottaient sur un trottoir très étroit.', 'Three tortoises trotted on a very narrow footpath.'],
  },
  {
    id: 'nasal', title: 'Nasal vowels', symbol: 'an · on · in', level: 9,
    tip: 'When a vowel is followed by **n** or **m** (and no vowel after), you don’t say the n — the air goes through your nose instead. There are three main ones: **an/en** (like “ahn”), **on** (like “ohn”), **in/ain/un** (like “ahn” with a smile).',
    mouth: 'Hold your nose: a nasal vowel should feel buzzy. Don’t touch the roof of your mouth with your tongue — no “n” sound at the end!',
    examples: [['l’enfant', 'child'], ['manger', 'to eat'], ['la chambre', 'bedroom'], ['bon', 'good'], ['le poisson', 'fish'], ['le vin', 'wine'], ['le pain', 'bread'], ['un', 'one']],
    pairs: [['vent', 'vont'], ['vin', 'vent'], ['bon', 'banc'], ['pain', 'pont'], ['long', 'lent'], ['main', 'mon']],
    twister: ['Un grand plat plein de pain blanc.', 'A big dish full of white bread.'],
  },
  {
    id: 'nasal-or-not', title: 'Nasal or not?', symbol: 'bon / bonne', level: 9,
    tip: 'If **n** or **m** is followed by a **vowel** (or doubled: nn, mm), the vowel is **not** nasal and you **do** say the n. This is why masculine and feminine forms sound different: bon (nasal) → bonne (“bun”).',
    mouth: 'Feminine: finish with your tongue touching behind your top teeth for a clear “n”.',
    examples: [['bon / bonne', 'good'], ['italien / italienne', 'Italian'], ['américain / américaine', 'American'], ['un / une', 'a'], ['plein / pleine', 'full']],
    pairs: [['bon', 'bonne'], ['fin', 'fine'], ['Jean', 'Jeanne'], ['américain', 'américaine'], ['un', 'une'], ['italien', 'italienne']],
  },
  {
    id: 'le-les', title: 'le vs les', symbol: 'le / les', level: 9,
    tip: 'The little words **le, de, ce, je, me** have a short, relaxed “uh” sound. **les, des, ces, mes** sound like “ay” (as in “day” but without the y). Getting this right tells the listener singular or plural!',
    mouth: '“uh”: lips loose and slightly round. “ay”: lips spread in a smile, tongue high.',
    examples: [['le livre', 'the book'], ['les livres', 'the books'], ['de', 'of'], ['des', 'some'], ['je', 'I'], ['j’ai', 'I have']],
    pairs: [['le', 'les'], ['de', 'des'], ['ce', 'ces'], ['je', 'j’ai'], ['le chat', 'les chats'], ['me', 'mes']],
  },
  {
    id: 'e-accents', title: 'é, è, ê', symbol: 'é · è', level: 9,
    tip: '**é** (and -er, -ez at the end of words) is a crisp “ay” without a y-glide: café, parler, chez. **è, ê** and **ai** are more open, like “e” in “bed”: mère, fête, lait.',
    mouth: 'é: smile, jaw nearly closed. è: drop your jaw a little more.',
    examples: [['le café', 'coffee'], ['l’été', 'summer'], ['parler', 'to speak'], ['chez', 'at the home of'], ['la mère', 'mother'], ['très', 'very'], ['la fête', 'party'], ['le lait', 'milk']],
    pairs: [],
    twister: ['Pépé a préparé un café épicé.', 'Grandpa made a spicy coffee.'],
  },
  {
    id: 'eu', title: 'eu, œu', symbol: 'eu', level: 9,
    tip: '**eu / œu** sounds like the “u” in “fur” (without the r) — lips rounded. Short in **deux, bleu, peu**; a bit more open in **sœur, heure, jeune**.',
    mouth: 'Say “ay”, then round your lips without moving your tongue.',
    examples: [['deux', 'two'], ['bleu', 'blue'], ['un peu', 'a bit'], ['la sœur', 'sister'], ['l’heure', 'hour'], ['jeune', 'young'], ['le jeu', 'game'], ['le cœur', 'heart']],
    pairs: [['deux', 'doux'], ['peu', 'pou'], ['le jeu', 'la joue'], ['le feu', 'fou']],
  },
  {
    id: 'oi', title: 'oi, eau, au', symbol: 'oi · eau', level: 9,
    tip: '**oi** = “wa” (moi = “mwa”). **eau** and **au** = “o” (as in “go”, but shorter, no w-glide).',
    mouth: 'For “o”, round your lips and keep them still — don’t slide into “oh-oo”.',
    examples: [['moi', 'me'], ['trois', 'three'], ['la voiture', 'car'], ['noir', 'black'], ['l’eau', 'water'], ['beau', 'beautiful'], ['le gâteau', 'cake'], ['jaune', 'yellow']],
    pairs: [],
    twister: ['Trois oiseaux boivent de l’eau au bord du bateau.', 'Three birds drink water at the edge of the boat.'],
  },
  {
    id: 'ch-j', title: 'ch, j, g', symbol: 'ch · j', level: 9,
    tip: '**ch** = “sh” (chat = “sha”). **j** and soft **g** (before e, i, y) = the “s” in “measure”. Before a, o, u, **g** is hard like “go”.',
    mouth: '“sh” and “zh” are the same mouth shape — just add voice for j.',
    examples: [['le chat', 'cat'], ['le chocolat', 'chocolate'], ['je', 'I'], ['jouer', 'to play'], ['rouge', 'red'], ['la géographie', 'geography'], ['la gare', 'station'], ['le gâteau', 'cake']],
    pairs: [['le chou', 'la joue'], ['le chant', 'les gens'], ['bouger', 'boucher']],
    twister: ['Les chaussettes de l’archiduchesse sont-elles sèches ?', 'Are the archduchess’s socks dry?'],
  },
  {
    id: 's-z', title: 's or z?', symbol: 'ss / s', level: 9,
    tip: 'A single **s between two vowels** sounds like **z** (maison, rose). **ss** is always a hissing **s** (poisson). This changes the meaning!',
    mouth: 'z buzzes (put a hand on your throat), s hisses.',
    examples: [['la maison', 'house'], ['la rose', 'rose'], ['le poisson', 'fish'], ['le dessert', 'dessert'], ['la chemise', 'shirt'], ['la trousse', 'pencil case']],
    pairs: [['le poisson', 'le poison'], ['le dessert', 'le désert'], ['le coussin', 'le cousin'], ['ils sont', 'ils ont']],
  },
  {
    id: 'gn-ill', title: 'gn and ill', symbol: 'gn · ill', level: 10,
    tip: '**gn** = “ny” as in “canyon” (montagne). **ill** after a vowel, and usually after a consonant, = “y” (fille = “fee-y”, famille = “fa-mee-y”). Exceptions: **ville, mille, tranquille** say “eel”.',
    mouth: 'For gn, press the middle of your tongue flat against the roof of your mouth.',
    examples: [['la montagne', 'mountain'], ['l’Espagne', 'Spain'], ['le champignon', 'mushroom'], ['la fille', 'girl'], ['la famille', 'family'], ['travailler', 'to work'], ['le soleil', 'sun'], ['la ville', 'town']],
    pairs: [],
    twister: ['La fille de la famille travaille à la montagne.', 'The family’s daughter works in the mountains.'],
  },
  {
    id: 'h-th-qu', title: 'h, th, qu, ç', symbol: 'h · qu', level: 9,
    tip: '**h** is always silent (l’hôtel, l’homme). **th** = plain t (le thé). **qu** = k (qui, quatre — no “w”!). **ç** = s (garçon, français). **c** before e/i is soft (ici), before a/o/u it is hard (café).',
    mouth: 'For qu, don’t round your lips: “kee”, not “kwee”.',
    examples: [['l’hôtel', 'hotel'], ['l’heure', 'hour'], ['le thé', 'tea'], ['le théâtre', 'theatre'], ['qui', 'who'], ['quatre', 'four'], ['le garçon', 'boy'], ['ici', 'here']],
    pairs: [],
  },
  {
    id: 'liaison', title: 'Liaison', symbol: 'les‿amis', level: 10,
    tip: 'A silent final consonant **wakes up** when the next word starts with a vowel or h. s and x sound like **z**: les‿amis (“lay-za-mee”), vous‿avez (“voo-za-vay”). n links too: un‿enfant.',
    mouth: 'Join the two words as if they were one.',
    examples: [['les amis', 'the friends'], ['vous avez', 'you have'], ['nous allons', 'we go'], ['un enfant', 'a child'], ['ils ont', 'they have'], ['deux heures', 'two hours'], ['mes amis', 'my friends']],
    pairs: [['ils sont', 'ils ont'], ['nous savons', 'nous avons'], ['elles sont', 'elles ont']],
  },
  {
    id: 'tion-ent', title: '-tion and -ent', symbol: '-tion', level: 10,
    tip: '**-tion** = “see-ohn” (natation). At the end of a **verb**, **-ent** is silent (ils parlent = “eel parl”). In other words **-ent** is nasal (souvent, le moment, l’argent).',
    mouth: 'For verbs, stop at the consonant before -ent.',
    examples: [['la natation', 'swimming'], ['l’information', 'information'], ['ils parlent', 'they speak'], ['elles mangent', 'they eat'], ['souvent', 'often'], ['le moment', 'moment'], ['l’argent', 'money']],
    pairs: [['il parle', 'ils parlent'], ['souvent', 'ils sont']],
  },
]

export const soundById = (id: string) => SOUNDS.find((s) => s.id === id)
