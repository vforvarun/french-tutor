import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Welcome } from './pages/Welcome'
import { VocabHome, ThemePage, Learn, Practice, Review, Match } from './pages/Vocab'
import { SoundsHome, SoundLessonPage, SayItPage } from './pages/Pronunciation'
import { GrammarHome, GrammarLesson, GrammarPractice, VerbGym, VerbTables } from './pages/Grammar'
import { SkillsHome, ListeningPage, ReadingPage, NumberTrainer, CulturePage } from './pages/Skills'
import { ExamHome, MockExam, WritingPage, SpeakingPage, Planner } from './pages/Exam'
import { ProgressPage, ParentPage } from './pages/Progress'
import { SettingsPage, MorePage } from './pages/Settings'
import { useStore } from './lib/store'

function Gate({ children }: { children: React.ReactNode }) {
  const placed = useStore((s) => s.profile.placed)
  return placed ? <>{children}</> : <Navigate to="/welcome" replace />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Gate><Home /></Gate>} />
          <Route path="/vocab" element={<VocabHome />} />
          <Route path="/vocab/:id" element={<ThemePage />} />
          <Route path="/vocab/:id/learn" element={<Learn />} />
          <Route path="/vocab/:id/practice" element={<Practice />} />
          <Route path="/vocab/:id/match" element={<Match />} />
          <Route path="/review" element={<Review />} />
          <Route path="/say" element={<SayItPage />} />
          <Route path="/sounds" element={<SoundsHome />} />
          <Route path="/sounds/:id" element={<SoundLessonPage />} />
          <Route path="/grammar" element={<GrammarHome />} />
          <Route path="/grammar/:id" element={<GrammarLesson />} />
          <Route path="/grammar/:id/practice" element={<GrammarPractice />} />
          <Route path="/verbs" element={<VerbGym />} />
          <Route path="/verbs/tables" element={<VerbTables />} />
          <Route path="/skills" element={<SkillsHome />} />
          <Route path="/listen/:id" element={<ListeningPage />} />
          <Route path="/read/:id" element={<ReadingPage />} />
          <Route path="/numbers" element={<NumberTrainer />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/exam" element={<ExamHome />} />
          <Route path="/exam/mock" element={<MockExam />} />
          <Route path="/exam/write/:id" element={<WritingPage />} />
          <Route path="/exam/speak/:id" element={<SpeakingPage />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
