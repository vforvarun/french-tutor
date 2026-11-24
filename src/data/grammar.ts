// Grammar topics for Levels 9–10. `body` uses a tiny markup:
//   blank line = new paragraph · "- " bullet · "> " tip box · "| a | b |" table row
//   "= fr = en" example sentence with audio · **bold**
import { mcq, typed, type Q } from '../lib/quiz'

export interface GrammarTopic {
  id: string
  title: string
  en: string
  emoji: string
  level: 9 | 10
  body: string
  drills: Q[]
}

const T = (id: string, title: string, en: string, emoji: string, level: 9 | 10, body: string, drills: Q[]): GrammarTopic => ({
  id,
  title,
  en,
  emoji,
  level,
  body: body.trim(),
  drills: drills.map((d) => ({ ...d, tag: 'g:' + id })),
})

export const GRAMMAR: GrammarTopic[] = [
  T('articles', 'Le, la, les, un, une', 'Articles & gender', '🔤', 9, `
Every French noun is either **masculine** or **feminine**. There's no "it" — a table is "she" (la table) and a book is "he" (le livre). The article tells you the gender, so **always learn a noun with its article**.

| | masculine | feminine | before a vowel | plural |
| the | le | la | l' | les |
| a / some | un | une | un / une | des |

= le chat = the cat
= une pomme = an apple
= l'école = the school
= des enfants = (some) children

> Gender clues: words ending in **-tion, -ette, -ure, -ence, -ie** are usually feminine. Words ending in **-ment, -age, -eau, -isme** are usually masculine.

> Making plurals: usually add **-s** (which you don't pronounce!). Words ending in **-eau** add **-x**: un gâteau → des gâteaux.`, [
    mcq('___ livre (book)', 'le', ['la', "l'"], 'livre is masculine.'),
    mcq('___ maison (house)', 'la', ['le', 'les'], 'maison is feminine.'),
    mcq('___ école (school)', "l'", ['la', 'le'], 'Before a vowel, le/la become l\'.'),
    mcq('___ télévision', 'la', ['le', 'un'], 'Words ending in -tion are feminine.'),
    mcq('J\'ai ___ chien.', 'un', ['une', 'des'], 'chien is masculine → un.'),
    mcq('Il y a ___ fenêtres.', 'des', ['un', 'une'], 'Plural "some" → des.'),
    mcq('___ fromage', 'le', ['la', 'les'], 'Words ending in -age are usually masculine.'),
    typed('Plural: un gâteau → des ___', 'gâteaux', '-eau nouns add -x in the plural.'),
    mcq('___ bicyclette', 'la', ['le', "l'"], 'Words ending in -ette are feminine.'),
    typed('Write "the friends" (les + amis)', 'les amis', 'les + plural noun with -s.'),
  ]),
  T('partitive', 'Du, de la, des', 'Partitive articles ("some")', '🧀', 9, `
When you talk about **an amount of something** (food and drink especially), French uses **du / de la / de l' / des**. English often leaves "some" out — French never does!

| masculine | feminine | before a vowel | plural |
| du pain | de la confiture | de l'eau | des pâtes |

= Je mange du pain. = I eat (some) bread.
= Je bois de l'eau. = I drink water.

But when you **like / love / hate** something in general, use le/la/les:

= J'aime le fromage. = I like cheese.

> After a **negative**, du / de la / des all become **de** (or **d'**): Je ne mange **pas de** viande. Je n'ai **pas d'**argent.`, [
    mcq('Je mange ___ pain.', 'du', ['de la', 'des'], 'pain is masculine → du.'),
    mcq('Je bois ___ eau.', "de l'", ['du', 'de la'], 'Before a vowel → de l\'.'),
    mcq('Tu veux ___ confiture ?', 'de la', ['du', 'des'], 'confiture is feminine → de la.'),
    mcq('Il mange ___ frites.', 'des', ['du', 'de la'], 'Plural → des.'),
    mcq('Je ne mange pas ___ viande.', 'de', ['de la', 'la'], 'After a negative → de.'),
    mcq("J'adore ___ chocolat.", 'le', ['du', 'de'], 'With aimer/adorer/détester use le/la/les.'),
    typed('Translate: I drink milk. (lait = m)', 'je bois du lait', 'boire + du (masculine).'),
    mcq("Je n'ai pas ___ argent.", "d'", ['de l\'', 'du'], 'pas de → pas d\' before a vowel.'),
    typed('Translate: We eat some vegetables. (Nous mangeons …)', 'nous mangeons des légumes', 'Plural → des.'),
  ]),
  T('adjectives', 'Les adjectifs', 'Adjective agreement & position', '🎨', 9, `
Adjectives **agree** with the noun: they change to match its gender and number.

| | masculine | feminine | m. plural | f. plural |
| regular | petit | petite | petits | petites |
| ends in -e | timide | timide | timides | timides |
| -eux | sérieux | sérieuse | sérieux | sérieuses |
| -if | sportif | sportive | sportifs | sportives |
| -on / -en | bon | bonne | bons | bonnes |

Some are irregular: **beau → belle**, **vieux → vieille**, **blanc → blanche**, **long → longue**, **gentil → gentille**.

**Position:** most adjectives go **after** the noun: un chat **noir**. But **BANGS** adjectives go **before**: **B**eauty (beau, joli), **A**ge (jeune, vieux), **N**umber (premier), **G**oodness (bon, mauvais), **S**ize (grand, petit).

= une robe rouge = a red dress
= une petite maison = a small house

> Colours never go before the noun. "Marron" and "orange" never change!`, [
    typed('Ma sœur est ___ . (grand)', 'grande', 'sœur is feminine → add -e.'),
    typed('Mes frères sont ___ . (sportif)', 'sportifs', 'masculine plural → add -s.'),
    typed('Elle est très ___ . (sérieux)', 'sérieuse', '-eux → -euse.'),
    typed('une ___ maison (beau)', 'belle', 'beau → belle (feminine).'),
    mcq('Which is correct?', 'une voiture rouge', ['une rouge voiture', 'un voiture rouge'], 'Colours go after; voiture is feminine.'),
    mcq('Which is correct?', 'un petit chien', ['un chien petit', 'une petite chien'], 'petit is a BANGS adjective → before.'),
    typed('Les filles sont ___ . (gentil)', 'gentilles', 'gentil → gentille → gentilles.'),
    mcq('J\'ai les yeux ___ .', 'marron', ['marrons', 'marronnes'], 'marron never changes.'),
    typed('une ___ dame (vieux)', 'vieille', 'vieux → vieille.'),
    typed('Ma mère est ___ . (timide)', 'timide', 'Already ends in -e → no change.'),
  ]),
  T('present-er', 'Le présent : -er', 'Present tense: -er verbs', '🟦', 9, `
The present tense says what you **do** or **are doing**. "Je joue" = I play / I am playing / I do play.

Most French verbs end in **-er**. Take off -er and add the endings:

| je | jou**e** | nous | jou**ons** |
| tu | jou**es** | vous | jou**ez** |
| il / elle / on | jou**e** | ils / elles | jou**ent** |

> The endings **-e, -es, -ent** are all **silent**! Je joue, tu joues, ils jouent all sound the same.

> **je → j'** before a vowel or h: j'aime, j'habite, j'écoute.

Watch out for **manger** (nous mang**e**ons) and **commencer** (nous commen**ç**ons) — they keep the soft sound.

= Nous regardons un film. = We are watching a film.
= Elles habitent à Paris. = They live in Paris.`, [
    typed('je ___ (parler)', 'parle', 'je → -e'),
    typed('tu ___ (jouer)', 'joues', 'tu → -es'),
    typed('nous ___ (regarder)', 'regardons', 'nous → -ons'),
    typed('vous ___ (écouter)', 'écoutez', 'vous → -ez'),
    typed('ils ___ (aimer)', 'aiment', 'ils → -ent (silent!)'),
    typed('___ habite à Melbourne. (I)', "j'", 'je → j\' before h.'),
    typed('nous ___ (manger)', 'mangeons', 'Keep the e: mangeons.'),
    typed('elle ___ (chanter)', 'chante', 'il/elle → -e'),
    mcq('Ils ___ au foot.', 'jouent', ['jouons', 'joue'], 'ils → -ent.'),
    typed('nous ___ (commencer)', 'commençons', 'ç keeps the soft "s" sound.'),
  ]),
  T('present-ir-re', 'Le présent : -ir et -re', 'Present tense: -ir & -re verbs', '🟩', 9, `
**-ir verbs** (finir, choisir, réussir): take off -ir and add:

| je fin**is** | nous fin**issons** |
| tu fin**is** | vous fin**issez** |
| il fin**it** | ils fin**issent** |

**-re verbs** (vendre, attendre, répondre, entendre): take off -re and add:

| je vend**s** | nous vend**ons** |
| tu vend**s** | vous vend**ez** |
| il vend | ils vend**ent** |

= Je finis mes devoirs. = I finish my homework.
= Nous attendons le bus. = We are waiting for the bus.

> The il/elle form of -re verbs has **no ending**: il attend.`, [
    typed('je ___ (finir)', 'finis', '-ir: je → -is'),
    typed('nous ___ (choisir)', 'choisissons', '-ir: nous → -issons'),
    typed('ils ___ (réussir)', 'réussissent', '-ir: ils → -issent'),
    typed('tu ___ (vendre)', 'vends', '-re: tu → -s'),
    typed('elle ___ (attendre)', 'attend', '-re: il/elle → no ending'),
    typed('vous ___ (répondre)', 'répondez', '-re: vous → -ez'),
    mcq('Nous ___ le bus.', 'attendons', ['attendez', 'attendissons'], '-re: nous → -ons'),
    typed('il ___ (finir)', 'finit', '-ir: il → -it'),
  ]),
  T('irregular', 'Être, avoir, aller, faire', 'The big four irregular verbs', '⭐', 9, `
These four are the most important verbs in French. Learn them by heart!

| | être (be) | avoir (have) | aller (go) | faire (do/make) |
| je | suis | ai (j'ai) | vais | fais |
| tu | es | as | vas | fais |
| il/elle | est | a | va | fait |
| nous | sommes | avons | allons | faisons |
| vous | êtes | avez | allez | faites |
| ils/elles | sont | ont | vont | font |

French uses **avoir** where English uses "to be" for age, hunger, thirst and fear:

= J'ai quatorze ans. = I am fourteen.
= J'ai faim. = I'm hungry.

**faire** is used for weather and many activities:

= Il fait beau. = The weather is nice.
= Je fais du vélo. = I go cycling.

> Don't mix up **ils sont** (they are, s sound) and **ils ont** (they have, z sound).`, [
    typed('je ___ (être)', 'suis', ''),
    typed('nous ___ (avoir)', 'avons', ''),
    typed('ils ___ (aller)', 'vont', ''),
    typed('vous ___ (faire)', 'faites', 'Irregular: faites.'),
    typed('tu ___ (être)', 'es', ''),
    typed('elles ___ (avoir)', 'ont', ''),
    mcq('J\'___ quinze ans.', 'ai', ['suis', 'fais'], 'Age uses avoir.'),
    mcq('Il ___ froid. (the weather)', 'fait', ['est', 'a'], 'Weather uses faire.'),
    typed('nous ___ (aller)', 'allons', ''),
    typed('vous ___ (être)', 'êtes', ''),
    mcq('Ils ___ français. (they are)', 'sont', ['ont', 'font'], 'être → ils sont.'),
  ]),
  T('negation', 'La négation', 'Negatives', '🚫', 9, `
To make a sentence negative, wrap **ne … pas** around the verb (like a sandwich 🥪):

= Je **ne** joue **pas** au tennis. = I don't play tennis.
= Je **n'**aime **pas** les maths. = I don't like maths.

**ne → n'** before a vowel.

Other negatives work the same way:

| ne … jamais | never |
| ne … rien | nothing |
| ne … plus | no longer / not any more |
| ne … personne | nobody |

= Il **ne** mange **jamais** de viande. = He never eats meat.

> In the passé composé, the sandwich goes around **avoir/être**: Je **n'**ai **pas** mangé.

> In speech, French people often drop the ne: "J'sais pas" — but always write it!`, [
    typed('Make negative: Je joue au foot.', 'je ne joue pas au foot', 'ne … pas around the verb.'),
    typed("Make negative: J'aime le sport.", "je n'aime pas le sport", 'ne → n\' before a vowel.'),
    mcq('Il ne mange ___ de viande. (never)', 'jamais', ['rien', 'personne'], ''),
    mcq("Je ne fais ___ . (nothing)", 'rien', ['jamais', 'plus'], ''),
    mcq('Elle ___ habite plus ici.', "n'", ['ne', 'pas'], ''),
    typed('Make negative: Nous regardons la télé.', 'nous ne regardons pas la télé', ''),
    mcq('Je n\'ai ___ mangé.', 'pas', ['ne', 'jamais pas'], 'Passé composé: ne + avoir + pas + participle.'),
    mcq('Il n\'y a ___ . (nobody)', 'personne', ['rien', 'jamais'], ''),
  ]),
  T('questions', 'Poser des questions', 'Asking questions', '❓', 9, `
Three ways to ask a yes/no question:

- **Raise your voice:** Tu aimes le sport ?
- **Est-ce que** at the start: **Est-ce que** tu aimes le sport ?
- **Inversion** (formal): Aimes-tu le sport ?

**Question words:**

| qui ? | who? | où ? | where? |
| quand ? | when? | comment ? | how? |
| pourquoi ? | why? | combien ? | how much/many? |
| que / qu'est-ce que ? | what? | quel / quelle ? | which / what? |

= Où est-ce que tu habites ? = Where do you live?
= Qu'est-ce que tu fais le week-end ? = What do you do at the weekend?
= Quelle est ta matière préférée ? = What is your favourite subject?

> **quel** agrees like an adjective: quel sport ? quelle couleur ? quels films ? quelles matières ?

> Answer "pourquoi ?" with **parce que**.`, [
    mcq('___ habites-tu ? — À Melbourne.', 'Où', ['Quand', 'Qui'], ''),
    mcq('___ tu aimes le sport ?', 'Est-ce que', ['Qu\'est-ce que', 'Quel'], 'Yes/no question → est-ce que.'),
    mcq('___ est ton anniversaire ? — Le 3 mai.', 'Quand', ['Où', 'Comment'], ''),
    mcq('___ tu fais ce soir ?', "Qu'est-ce que", ['Est-ce que', 'Où'], 'What → qu\'est-ce que.'),
    mcq('___ matière préfères-tu ?', 'Quelle', ['Quel', 'Quels'], 'matière is feminine → quelle.'),
    mcq('___ ça coûte ? — Dix euros.', 'Combien', ['Comment', 'Pourquoi'], ''),
    mcq('Pourquoi tu aimes le français ? — ___ c\'est intéressant.', 'Parce que', ['Pourquoi', 'Car que'], ''),
    mcq('___ t\'appelles-tu ?', 'Comment', ['Qui', 'Quel'], 'Comment t\'appelles-tu ? = What is your name?'),
  ]),
  T('reflexive', 'Les verbes pronominaux', 'Reflexive verbs', '🪞', 9, `
Reflexive verbs describe things you do **to yourself** — mostly daily routine. They have an extra pronoun:

| je **me** lève | nous **nous** levons |
| tu **te** lèves | vous **vous** levez |
| il/elle **se** lève | ils/elles **se** lèvent |

**me / te / se → m' / t' / s'** before a vowel: je **m'**habille.

= Je me réveille à sept heures. = I wake up at seven.
= Elle se douche le matin. = She showers in the morning.

Negative: the pronoun stays stuck to the verb inside the sandwich:

= Je **ne me** lève **pas** tôt. = I don't get up early.

> With aller + infinitive the pronoun changes to match: Je vais **me** coucher. Tu vas **te** coucher.`, [
    mcq('Je ___ lève à sept heures.', 'me', ['te', 'se'], ''),
    mcq('Tu ___ couches à quelle heure ?', 'te', ['me', 'se'], ''),
    mcq('Elle ___ habille.', "s'", ['se', 'me'], 'se → s\' before a vowel.'),
    mcq('Nous ___ douchons.', 'nous', ['se', 'vous'], ''),
    typed('ils ___ réveillent (pronoun)', 'se', ''),
    typed('Translate: I get dressed.', "je m'habille", ''),
    mcq('Negative: Je ___ lève pas tôt.', 'ne me', ['me ne', 'ne'], 'ne + pronoun + verb + pas.'),
    typed('Je vais ___ coucher. (pronoun)', 'me', 'Pronoun matches the subject.'),
  ]),
  T('futur-proche', 'Le futur proche', 'Near future (going to)', '🚀', 9, `
To say what you are **going to** do, use **aller + infinitive**. Easy!

| je vais jouer | nous allons jouer |
| tu vas jouer | vous allez jouer |
| il/elle va jouer | ils/elles vont jouer |

= Ce week-end, je vais aller au cinéma. = This weekend I'm going to go to the cinema.
= Nous allons manger au restaurant. = We are going to eat at a restaurant.

Negative: sandwich around aller:

= Je **ne** vais **pas** travailler. = I'm not going to work.

> Useful time words: **demain** (tomorrow), **ce soir** (tonight), **le week-end prochain** (next weekend), **l'année prochaine** (next year).`, [
    typed('je ___ jouer (aller)', 'vais', ''),
    typed('nous ___ manger', 'allons', ''),
    typed('Translate: I am going to watch a film.', ['je vais regarder un film'], ''),
    mcq('Elles ___ partir demain.', 'vont', ['va', 'allons'], ''),
    typed('Translate: She is going to swim.', 'elle va nager', ''),
    mcq('Negative: Je ___ vais ___ sortir.', 'ne … pas', ['pas … ne', 'ne … rien'], ''),
    typed('tu ___ faire tes devoirs', 'vas', ''),
    typed('Translate: They (boys) are going to play soccer.', ['ils vont jouer au foot'], ''),
  ]),
  T('passe-avoir', 'Le passé composé (avoir)', 'Perfect tense with avoir', '⏮️', 9, `
The passé composé says what you **did** or **have done**. It has two parts:

**avoir (present) + past participle**

| j'ai joué | nous avons joué |
| tu as joué | vous avez joué |
| il/elle a joué | ils/elles ont joué |

**Making the past participle:**

| -er → -é | jouer → joué |
| -ir → -i | finir → fini |
| -re → -u | vendre → vendu |

**Irregular past participles to learn:**

| faire → fait | avoir → eu | être → été |
| prendre → pris | boire → bu | voir → vu |
| lire → lu | écrire → écrit | mettre → mis |
| devoir → dû | pouvoir → pu | vouloir → voulu |

= Hier, j'ai mangé une pizza. = Yesterday I ate a pizza.
= Nous avons vu un film. = We saw a film.

> Negative: **Je n'ai pas** mangé. The sandwich goes around avoir.`, [
    typed("j'___ joué (avoir)", 'ai', ''),
    typed('Past participle of manger', 'mangé', ''),
    typed('Past participle of finir', 'fini', ''),
    typed('Past participle of faire', 'fait', 'Irregular.'),
    typed('Past participle of voir', 'vu', 'Irregular.'),
    typed('Translate: I watched TV.', ["j'ai regardé la télé", "j'ai regardé la télévision"], ''),
    typed('nous ___ fini (avoir)', 'avons', ''),
    typed('Past participle of prendre', 'pris', 'Irregular.'),
    typed('Translate: They (boys) did their homework.', ['ils ont fait leurs devoirs'], ''),
    mcq('Negative: Je ___ mangé.', "n'ai pas", ['ne pas ai', "n'ai mangé pas"], ''),
    typed('Past participle of boire', 'bu', 'Irregular.'),
  ]),
  T('passe-etre', 'Le passé composé (être)', 'Perfect tense with être', '🏠', 9, `
About 16 verbs (mostly about **movement**) use **être** instead of avoir. Remember them with **DR & MRS VANDERTRAMP**:

| **D**evenir | **R**evenir | **M**onter | **R**ester |
| **S**ortir | **V**enir | **A**ller | **N**aître |
| **D**escendre | **E**ntrer | **R**entrer | **T**omber |
| **R**etourner | **A**rriver | **M**ourir | **P**artir |

With être, the past participle **agrees** with the subject like an adjective: add **-e** for feminine and **-s** for plural.

| je suis allé(e) | nous sommes allé(e)s |
| tu es allé(e) | vous êtes allé(e)(s) |
| il est allé / elle est allée | ils sont allés / elles sont allées |

= Elle est arrivée à huit heures. = She arrived at eight.
= Nous sommes partis tôt. = We left early.

> **All reflexive verbs** use être too: je **me suis** levé(e).

> A girl writing about herself adds -e: Je suis allé**e** au cinéma.`, [
    mcq('Je ___ allé au parc.', 'suis', ['ai', 'es'], 'aller uses être.'),
    mcq("J'___ mangé une pomme.", 'ai', ['suis', 'es'], 'manger uses avoir.'),
    typed('Elle est ___ (arriver)', 'arrivée', 'Feminine → add -e.'),
    typed('Ils sont ___ (partir)', 'partis', 'Masculine plural → add -s.'),
    typed('Elles sont ___ (sortir)', 'sorties', 'Feminine plural → -es.'),
    mcq('Which verb uses être?', 'tomber', ['jouer', 'finir'], 'tomber is in DR MRS VANDERTRAMP.'),
    typed('Translate (a girl): I went to the beach.', ['je suis allée à la plage'], ''),
    typed('Nous ___ restés à la maison. (être)', 'sommes', ''),
    mcq('Elle s\'___ couchée tard.', 'est', ['a', 'ai'], 'Reflexive verbs use être.'),
    typed('Il est ___ en 2010. (naître)', 'né', 'naître → né.'),
  ]),
  T('possessives', 'Mon, ma, mes', 'Possessive adjectives', '🎒', 9, `
"My, your, his…" agree with the **thing owned**, not the owner!

| | masc. | fem. | plural |
| my | mon | ma | mes |
| your (tu) | ton | ta | tes |
| his / her | son | sa | ses |
| our | notre | notre | nos |
| your (vous) | votre | votre | vos |
| their | leur | leur | leurs |

= mon frère, ma sœur, mes parents = my brother, my sister, my parents

> **son / sa** can mean his OR her: **sa** mère = his mother or her mother (because mère is feminine).

> Before a feminine word starting with a vowel use **mon/ton/son**: **mon** amie, **ton** école.`, [
    mcq('___ sœur (my)', 'ma', ['mon', 'mes'], ''),
    mcq('___ parents (my)', 'mes', ['ma', 'mon'], ''),
    mcq('___ père (your, tu)', 'ton', ['ta', 'tes'], ''),
    mcq('Paul aime ___ mère. (his)', 'sa', ['son', 'ses'], 'mère is feminine → sa.'),
    mcq('___ amie (my)', 'mon', ['ma', 'mes'], 'Vowel → mon, even though amie is feminine.'),
    mcq('___ maison (our)', 'notre', ['nos', 'leur'], ''),
    mcq('___ enfants (their)', 'leurs', ['leur', 'ses'], ''),
    mcq('Marie et ___ frère (her)', 'son', ['sa', 'ses'], 'frère is masculine → son.'),
  ]),
  T('places', 'À, au, en', 'Prepositions with places', '📍', 9, `
**Towns:** use **à** — J'habite **à** Melbourne. Je vais **à** Paris.

**Countries:**

| feminine (most end in -e) | **en** | en France, en Australie |
| masculine | **au** | au Canada, au Japon |
| plural | **aux** | aux États-Unis |

**Going to places in town:** à + le = **au**, à + les = **aux**:

| à + le | au | au cinéma |
| à + la | à la | à la piscine |
| à + l' | à l' | à l'école |
| à + les | aux | aux magasins |

= Je vais au parc et ensuite à la plage. = I'm going to the park and then the beach.

> "At someone's house" = **chez**: chez moi, chez ma grand-mère.`, [
    mcq('J\'habite ___ Melbourne.', 'à', ['en', 'au'], 'Towns → à.'),
    mcq('Je vais ___ France.', 'en', ['au', 'à'], 'France is feminine → en.'),
    mcq('Il habite ___ Canada.', 'au', ['en', 'à'], 'Canada is masculine → au.'),
    mcq('Nous allons ___ cinéma.', 'au', ['à le', 'à la'], 'à + le → au.'),
    mcq('Elle va ___ piscine.', 'à la', ['au', 'aux'], ''),
    mcq('Je vais ___ école.', "à l'", ['au', 'à la'], ''),
    mcq('Ils vont ___ États-Unis.', 'aux', ['en', 'au'], 'Plural → aux.'),
    mcq('Je dors ___ ma copine ce soir.', 'chez', ['à', 'au'], 'At someone\'s house → chez.'),
    mcq('Je vais ___ magasins.', 'aux', ['au', 'à les'], 'à + les → aux.'),
  ]),
  T('modals', 'Pouvoir, vouloir, devoir', 'Can, want, must + infinitive', '🔑', 9, `
These three verbs are followed by an **infinitive** (the -er/-ir/-re form):

| | pouvoir (can) | vouloir (want) | devoir (must) |
| je | peux | veux | dois |
| tu | peux | veux | dois |
| il/elle | peut | veut | doit |
| nous | pouvons | voulons | devons |
| vous | pouvez | voulez | devez |
| ils/elles | peuvent | veulent | doivent |

= Je peux sortir ce soir ? = Can I go out tonight?
= Je dois faire mes devoirs. = I must do my homework.
= Elle veut aller en France. = She wants to go to France.

> **Je voudrais** (I would like) is the polite form of vouloir — perfect for shops and cafés!

> **On peut** = you/one can. **Il faut** = you must (it never changes).`, [
    typed('je ___ (pouvoir)', 'peux', ''),
    typed('ils ___ (vouloir)', 'veulent', ''),
    typed('nous ___ (devoir)', 'devons', ''),
    mcq('Je dois ___ mes devoirs.', 'faire', ['fais', 'fait'], 'Modal + infinitive.'),
    typed('Translate: I want to go to France.', ['je veux aller en france'], ''),
    typed('elle ___ (pouvoir)', 'peut', ''),
    mcq('___ un café, s\'il vous plaît. (polite)', 'Je voudrais', ['Je veux', 'Je dois'], ''),
    typed('vous ___ (vouloir)', 'voulez', ''),
  ]),
  // -------- Year 10 --------
  T('imparfait', "L'imparfait", 'Imperfect tense', '🎞️', 10, `
The imparfait describes the past: **what things were like**, **what used to happen**, or **what was happening**.

**Formation:** take the **nous** form of the present, remove **-ons**, add the endings:

| je jou**ais** | nous jou**ions** |
| tu jou**ais** | vous jou**iez** |
| il jou**ait** | ils jou**aient** |

nous **finiss**ons → je finissais · nous **faisons** → je faisais · nous **av**ons → j'avais

The only irregular stem is **être → ét-**: j'étais, c'était.

= Quand j'étais petite, j'habitais à Sydney. = When I was little, I lived in Sydney.
= Il faisait chaud. = It was hot.
= C'était génial ! = It was brilliant!

> -ais, -ait, -aient all sound the same ("ay").`, [
    typed('je ___ (jouer, imparfait)', 'jouais', ''),
    typed('nous ___ (finir, imparfait)', 'finissions', ''),
    typed("j'___ (être, imparfait)", 'étais', 'être → ét-'),
    typed('il ___ (faire, imparfait)', 'faisait', ''),
    typed('ils ___ (avoir, imparfait)', 'avaient', ''),
    typed("C'___ génial ! (être)", 'était', ''),
    typed('vous ___ (habiter, imparfait)', 'habitiez', ''),
    mcq('Quand j\'___ petit, j\'aimais les dessins animés.', 'étais', ['ai été', 'suis'], 'Description in the past → imparfait.'),
    typed('tu ___ (manger, imparfait)', 'mangeais', 'Keep the e before a.'),
  ]),
  T('pc-vs-imp', 'Passé composé ou imparfait ?', 'Choosing the right past tense', '⚖️', 10, `
Both are past tenses but do different jobs:

| **Passé composé** | **Imparfait** |
| a single, completed action | a description / background |
| "what happened" | "what it was like" |
| Je suis allée à la plage. | Il faisait beau. |
| interrupting action | what was going on |
| … quand le téléphone **a sonné**. | Je **regardais** la télé … |

= Quand j'étais petite, je jouais au parc. = When I was little, I used to play in the park. (habit → imparfait)
= Samedi dernier, j'ai joué au tennis. = Last Saturday I played tennis. (one time → passé composé)

> Clue words for imparfait: **quand j'étais petit(e)**, **d'habitude**, **tous les jours**, **souvent**, **c'était**.

> Clue words for passé composé: **hier**, **samedi dernier**, **un jour**, **soudain**, **une fois**.`, [
    mcq('Hier, je ___ au cinéma.', 'suis allée', ['allais', 'vais']),
    mcq('Quand j\'étais petite, je ___ au parc tous les jours.', 'jouais', ['ai joué', 'joue']),
    mcq('Il ___ beau et chaud.', 'faisait', ['a fait', 'fait']),
    mcq('Je regardais la télé quand mon frère ___ .', 'est arrivé', ['arrivait', 'arrive']),
    mcq('Samedi dernier, nous ___ une pizza.', 'avons mangé', ['mangions', 'mangeons']),
    mcq('C\'___ vraiment génial !', 'était', ['a été', 'est été']),
    mcq('D\'habitude, il ___ le bus.', 'prenait', ['a pris', 'prendra']),
    mcq('Soudain, il ___ à pleuvoir.', 'a commencé', ['commençait', 'commence']),
  ]),
  T('futur', 'Le futur simple', 'Future tense (will)', '🔮', 10, `
The futur simple says what **will** happen. Add these endings to the **infinitive** (for -re verbs, drop the final e):

| je jouer**ai** | nous jouer**ons** |
| tu jouer**as** | vous jouer**ez** |
| il jouer**a** | ils jouer**ont** |

= Je finirai mes études. = I will finish my studies.
= Nous vendrons la maison. = We will sell the house.

**Irregular stems** (same endings):

| être → ser- | avoir → aur- | aller → ir- | faire → fer- |
| pouvoir → pourr- | vouloir → voudr- | devoir → devr- | venir → viendr- |
| voir → verr- | savoir → saur- | | |

= Demain, il fera beau. = Tomorrow it will be nice.
= Je serai médecin. = I will be a doctor.

> The endings look like **avoir** in the present: ai, as, a, (av)ons, (av)ez, ont!`, [
    typed('je ___ (jouer, futur)', 'jouerai', ''),
    typed('nous ___ (finir, futur)', 'finirons', ''),
    typed('ils ___ (vendre, futur)', 'vendront', 'Drop the e of -re.'),
    typed('je ___ (être, futur)', 'serai', ''),
    typed('tu ___ (avoir, futur)', 'auras', ''),
    typed('il ___ (faire, futur)', 'fera', ''),
    typed('nous ___ (aller, futur)', 'irons', ''),
    typed('vous ___ (pouvoir, futur)', 'pourrez', ''),
    typed('Translate: I will be a vet.', ['je serai vétérinaire'], ''),
  ]),
  T('conditionnel', 'Le conditionnel', 'Conditional (would)', '💭', 10, `
The conditional says what **would** happen. It's easy: **future stem + imparfait endings**.

| je jouer**ais** | nous jouer**ions** |
| tu jouer**ais** | vous jouer**iez** |
| il jouer**ait** | ils jouer**aient** |

= J'aimerais aller au Japon. = I would like to go to Japan.
= Ce serait génial. = It would be great.
= Je voudrais devenir médecin. = I would like to become a doctor.

**Si + imparfait → conditionnel** ("If I had…, I would…"):

= **Si j'avais** beaucoup d'argent, **j'achèterais** une maison. = If I had lots of money, I would buy a house.
= **Si j'étais** riche, **je voyagerais** partout. = If I were rich, I would travel everywhere.

> Same irregular stems as the future: ser-, aur-, ir-, fer-, pourr-, voudr-, devr-…

> "On devrait" = we should. Great for environment essays!`, [
    typed('je ___ (aimer, conditionnel)', 'aimerais', ''),
    typed("ce ___ génial (être, conditionnel)", 'serait', ''),
    typed('nous ___ (aller, conditionnel)', 'irions', ''),
    typed('je ___ (vouloir, conditionnel)', 'voudrais', ''),
    typed('on ___ recycler (devoir, conditionnel)', 'devrait', ''),
    mcq("Si j'avais de l'argent, j'___ une voiture.", 'achèterais', ['achète', 'achèterai'], 'si + imparfait → conditionnel.'),
    mcq('Si j\'___ riche, je voyagerais.', 'étais', ['serais', 'suis'], 'The si part uses imparfait.'),
    typed('ils ___ (faire, conditionnel)', 'feraient', ''),
  ]),
  T('object-pronouns', 'Le, la, lui, leur', 'Object pronouns', '🎯', 10, `
Pronouns replace nouns so you don't repeat yourself. They go **before the verb**.

**Direct object** (it / him / her / them):

| le | him / it (m) | Je **le** regarde. |
| la | her / it (f) | Je **la** mange. |
| l' | before a vowel | Je **l'**aime. |
| les | them | Je **les** adore. |

**Indirect object** (to him / to her / to them) — after verbs like parler **à**, donner **à**, téléphoner **à**:

| lui | to him / to her | Je **lui** parle. |
| leur | to them | Je **leur** téléphone. |

= Tu aimes ce film ? Oui, je **l'**adore. = Do you like this film? Yes, I love it.
= Je donne un cadeau à ma mère → Je **lui** donne un cadeau.

> me, te, nous, vous work for both: Il **me** parle. Je **te** vois.

> With aller + infinitive, the pronoun goes before the infinitive: Je vais **le** faire.`, [
    mcq('Tu regardes la télé ? Oui, je ___ regarde.', 'la', ['le', 'lui'], 'la télé is feminine.'),
    mcq('Tu manges le gâteau ? Oui, je ___ mange.', 'le', ['la', 'leur'], ''),
    mcq('Tu aimes les pommes ? Oui, je ___ aime.', 'les', ['leur', 'la'], ''),
    mcq('Je parle à mon frère → Je ___ parle.', 'lui', ['le', 'leur'], 'parler à → indirect.'),
    mcq('Je téléphone à mes parents → Je ___ téléphone.', 'leur', ['les', 'lui'], ''),
    mcq('Tu fais tes devoirs ? Je vais ___ faire.', 'les', ['leur', 'le'], 'Before the infinitive.'),
    mcq('Tu connais Marie ? Oui, je ___ connais.', 'la', ['lui', 'le'], 'connaître takes a direct object.'),
    mcq('J\'aime ce film. Je ___ adore.', "l'", ['le', 'la'], 'Before a vowel → l\'.'),
  ]),
  T('y-en', 'Y et en', 'The pronouns y and en', '🧭', 10, `
**y** replaces a **place** (à / en / chez + place). It means "there":

= Tu vas à la plage ? Oui, j'**y** vais. = Yes, I'm going there.
= On **y** va ! = Let's go!

**en** replaces **de + something**, especially quantities. It means "some / of it / of them":

= Tu as des frères ? Oui, j'**en** ai deux. = Yes, I have two (of them).
= Tu veux du gâteau ? Non merci, je n'**en** veux pas.

> Like other pronouns, y and en go **before the verb**.

> Il y a = there is/are. Il **y en a** trois = there are three of them.`, [
    mcq('Tu vas au cinéma ? Oui, j\'___ vais.', 'y', ['en', 'le'], 'Place → y.'),
    mcq('Tu as des sœurs ? Oui, j\'___ ai une.', 'en', ['y', 'les'], 'Quantity → en.'),
    mcq('Tu veux du pain ? Oui, j\'___ veux.', 'en', ['y', 'le'], 'du pain → en.'),
    mcq('Elle habite en France ? Oui, elle ___ habite.', 'y', ['en', 'la'], ''),
    mcq('Combien de chiens as-tu ? J\'___ ai trois.', 'en', ['y', 'les'], ''),
    mcq('On ___ va ! (Let\'s go!)', 'y', ['en', 'le'], ''),
  ]),
  T('comparatives', 'Plus, moins, aussi', 'Comparatives & superlatives', '📊', 10, `
**Comparing** two things: adjective agrees with the first noun.

| plus … que | more … than | Elle est **plus** grande **que** moi. |
| moins … que | less … than | Le bus est **moins** cher **que** le train. |
| aussi … que | as … as | Il est **aussi** drôle **que** son frère. |

**Superlative** (the most / the least): le / la / les + plus / moins:

= C'est **la plus** belle ville. = It's the most beautiful city.
= C'est **le moins** cher. = It's the cheapest (least expensive).

**Irregular:**

| bon → **meilleur** (better) → **le meilleur** (the best) |
| mauvais → **pire** (worse) → **le pire** (the worst) |

= Le français est **meilleur que** les maths ! = French is better than maths!

> Never say "plus bon" — always **meilleur**.`, [
    mcq('Ma sœur est ___ grande que moi. (taller)', 'plus', ['moins', 'aussi'], ''),
    mcq('Le train est ___ cher ___ l\'avion. (less … than)', 'moins … que', ['plus … de', 'aussi … comme'], ''),
    mcq('Ce film est ___ que l\'autre. (better)', 'meilleur', ['plus bon', 'bien'], 'bon → meilleur.'),
    mcq('C\'est ___ ville du monde. (the most beautiful)', 'la plus belle', ['le plus beau', 'la plus beau'], 'ville is feminine.'),
    mcq('Il est ___ intelligent que son frère. (as)', 'aussi', ['autant', 'si'], ''),
    mcq('C\'est le ___ jour de ma vie ! (worst)', 'pire', ['plus mauvais de', 'moins bon'], ''),
    typed('Translate: She is the best.', ['elle est la meilleure'], ''),
  ]),
  T('relatives', 'Qui, que, où', 'Relative pronouns', '🔗', 10, `
Relative pronouns join two sentences into one longer one — great for higher marks!

| **qui** | who / which (subject — followed by a verb) | J'ai un ami **qui** habite à Paris. |
| **que / qu'** | who(m) / which / that (object — followed by a subject) | Le film **que** j'ai vu était génial. |
| **où** | where / when | La ville **où** j'habite est grande. |

= C'est le prof **qui** est très sympa. = It's the teacher who is very nice.
= C'est le livre **que** je lis. = It's the book (that) I'm reading.

> Quick test: if the next word is a **verb** → **qui**. If the next word is a **subject** (je, tu, il, mon frère…) → **que**.`, [
    mcq('J\'ai une amie ___ parle espagnol.', 'qui', ['que', 'où'], 'Next word is a verb → qui.'),
    mcq('Le livre ___ je lis est intéressant.', 'que', ['qui', 'où'], 'Next word is a subject → que.'),
    mcq('La ville ___ j\'habite est petite.', 'où', ['que', 'qui'], 'Place → où.'),
    mcq('C\'est le film ___ j\'ai vu hier.', 'que', ['qui', 'où'], ''),
    mcq('J\'ai un chien ___ s\'appelle Max.', 'qui', ['que', 'où'], ''),
    mcq('Le jour ___ je suis né, il neigeait.', 'où', ['que', 'qui'], 'où also means "when".'),
  ]),
  T('depuis', 'Depuis et venir de', 'Depuis & venir de', '⏳', 10, `
**depuis + present tense** = "have been …ing for / since". French uses the **present**, not the past!

= J'apprends le français **depuis** deux ans. = I have been learning French for two years.
= J'habite ici **depuis** 2015. = I have lived here since 2015.

**venir de + infinitive** = "have just done":

= Je **viens de** manger. = I have just eaten.
= Ils **viennent d'**arriver. = They have just arrived.

> Use these in speaking assessments — they sound very natural.`, [
    mcq('J\'apprends le français ___ trois ans.', 'depuis', ['pour', 'pendant que'], ''),
    mcq('J\'___ ici depuis 2018. (live)', 'habite', ['ai habité', 'habitais'], 'depuis + present.'),
    typed('Translate: I have just eaten. (venir de)', ['je viens de manger'], ''),
    mcq('Ils ___ d\'arriver.', 'viennent', ['vient', 'venons'], ''),
    typed('Translate: I have been playing piano for 5 years.', ['je joue du piano depuis cinq ans', 'je joue du piano depuis 5 ans'], ''),
  ]),
  T('imperative', "L'impératif", 'Giving instructions', '📣', 10, `
The imperative gives orders and instructions (directions, recipes, advice). Use the **tu, nous or vous** form **without the pronoun**:

| tu | **Écoute !** | Listen! |
| nous | **Écoutons !** | Let's listen! |
| vous | **Écoutez !** | Listen! (polite / plural) |

> For **-er verbs**, the tu form drops the **-s**: tu manges → **Mange !**

Irregular: **être → sois, soyons, soyez** · **avoir → aie, ayons, ayez**.

= Tournez à gauche. = Turn left.
= Allons au cinéma ! = Let's go to the cinema!

Negative: **Ne** touche **pas** ! = Don't touch!`, [
    mcq('(tu) ___ ! (écouter)', 'Écoute', ['Écoutes', 'Écoutez'], '-er tu form drops the s.'),
    mcq('(vous) ___ à droite. (tourner)', 'Tournez', ['Tourne', 'Tournons'], ''),
    mcq('(nous) ___ au parc ! (aller)', 'Allons', ['Allez', 'Va'], ''),
    typed('(tu) ___ tes devoirs ! (finir)', 'finis', ''),
    mcq('(vous) ___ sages ! (être)', 'Soyez', ['Êtes', 'Soyons'], ''),
    typed('Negative (tu): Don\'t eat! (manger)', ['ne mange pas'], ''),
  ]),
]

export const grammarById = (id: string) => GRAMMAR.find((g) => g.id === id)
