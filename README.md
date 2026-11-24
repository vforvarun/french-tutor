# Allez ! — French tutor (Years 9–10)

A study app for Victorian Curriculum French, Levels 9–10. It runs in the browser on a Windows laptop (Edge/Chrome) or iPad (Safari) and can be installed as an app.

## What's inside
- **Vocabulary** — 21 themes, ~700 words + 126 key phrases, colour-coded by gender, with audio, flashcards, adaptive quizzes, a matching game and spaced-repetition review.
- **Pronunciation** — 15 sound lessons, "hear the difference" ear training, tongue twisters, speech-recognition scoring, record-and-compare, and per-word "sounds to watch" hints.
- **Grammar** — 25 topics (Y9 + Y10) with lessons, printable cheat sheets and drills; Verb Gym across 6 tenses; verb tables for 82 verbs.
- **Listening & reading** — 14 listening clips, 8 reading texts with tap-to-translate, number/price/time trainer, culture cards.
- **Exam prep** — mock exam, 10 writing tasks with a live "range checklist", oral practice with model answers, exam technique, term planner with countdowns.
- **Motivation & tracking** — daily plan, XP, levels, streaks, badges, progress charts, PIN-protected parent dashboard with a copyable weekly summary.

Progress is stored in the browser on each device. Use **Settings → Save progress file / Load progress** to move between devices.

## Develop
```bash
npm install
npm run dev      # local dev server
npm run check    # content sanity checks
npm run build    # type-check + production build
```
Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

Content lives in `src/data/` (vocab, grammar, verbs, sounds, listening, reading, exam, culture, placement).
