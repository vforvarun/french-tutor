// A short placement check. Items are ordered from easy to hard; `lvl` is the band.
import { mcq, type Q } from '../lib/quiz'

const P = (lvl: 1 | 2 | 3, q: Q): Q => ({ ...q, tag: 'placement:' + lvl })

export const PLACEMENT: Q[] = [
  P(1, mcq('What does “la sœur” mean?', 'the sister', ['the mother', 'the brother', 'the aunt'])),
  P(1, mcq('How do you say “I am 14”?', "J'ai quatorze ans.", ['Je suis quatorze ans.', 'Je quatorze ans.'])),
  P(1, mcq('“le chien” is …', 'the dog', ['the cat', 'the house', 'the bread'])),
  P(1, mcq('Choose the correct article: ___ maison', 'la', ['le', 'les'])),
  P(1, mcq('What does “il fait froid” mean?', "It's cold", ["It's hot", "It's raining", 'He is cold'])),
  P(1, mcq('Nous ___ au foot.', 'jouons', ['joue', 'jouez'])),
  P(1, mcq('“mercredi” is …', 'Wednesday', ['Monday', 'Thursday', 'Friday'])),
  P(2, mcq('Je ___ au cinéma samedi dernier.', 'suis allée', ['ai allé', 'vais'])),
  P(2, mcq('Ma mère est très ___ .', 'gentille', ['gentil', 'gentils'])),
  P(2, mcq('Je ne mange pas ___ viande.', 'de', ['de la', 'la'])),
  P(2, mcq('Demain, je ___ jouer au tennis.', 'vais', ['suis', 'ai'])),
  P(2, mcq('Je ___ lève à sept heures.', 'me', ['se', 'te'])),
  P(2, mcq('What does “J\'ai mal à la tête” mean?', 'I have a headache', ['I am tired', 'I hurt my hand', 'I am sick of it'])),
  P(2, mcq('Elle habite ___ Canada.', 'au', ['en', 'à'])),
  P(3, mcq('Quand j\'___ petite, j\'habitais à Sydney.', 'étais', ['ai été', 'suis'])),
  P(3, mcq('L\'année prochaine, je ___ en France. (will go)', 'irai', ['vais', 'allais'])),
  P(3, mcq('Si j\'avais de l\'argent, j\'___ une voiture.', 'achèterais', ['achète', 'ai acheté'])),
  P(3, mcq('Tu aimes ce film ? Oui, je ___ adore.', "l'", ['lui', 'le'])),
  P(3, mcq('Le livre ___ je lis est intéressant.', 'que', ['qui', 'où'])),
  P(3, mcq('J\'apprends le français ___ trois ans.', 'depuis', ['pour', 'il y a'])),
]
