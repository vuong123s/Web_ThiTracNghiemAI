import * as React from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "motion/react"
import { Layout } from "./components/Layout"
import { LandingPage } from "./pages/LandingPage"
import { Dashboard } from "./pages/Dashboard"
import { QuizPage } from "./pages/QuizPage"
import { LibraryPage } from "./pages/LibraryPage"
import { ResultPage } from "./pages/ResultPage"
import { LeaderboardPage } from "./pages/LeaderboardPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"

const AppContent: React.FC = () => {
  const location = useLocation()
  const isQuizPage = location.pathname === "/quiz"
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  const content = (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AnimatePresence>
  )

  const [isClient, setIsClient] = React.useState(false)
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (isQuizPage || isAuthPage) {
    return content
  }

  return <Layout>{content}</Layout>
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
