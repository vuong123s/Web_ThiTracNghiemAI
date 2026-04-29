import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  HelpCircle, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Info,
  Timer,
  LayoutGrid,
  Settings,
  Maximize2
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"

export const QuizPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null)
  const [timeLeft, setTimeLeft] = React.useState(1800) // 30 minutes
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  const questions = [
    {
      id: 1,
      text: "What is the average time complexity of the Quick Sort algorithm?",
      options: [
        "O(n log n)",
        "O(n²)",
        "O(log n)",
        "O(n)"
      ],
      correctOption: 0,
      explanation: "Quick Sort has an average time complexity of O(n log n). In the worst case, it can be O(n²), but with good pivot selection, it performs very efficiently.",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      text: "Which data structure uses the LIFO (Last-In, First-Out) principle?",
      options: [
        "Queue",
        "Stack",
        "Linked List",
        "Binary Tree"
      ],
      correctOption: 1,
      explanation: "A Stack follows the LIFO principle, where the last element added is the first one to be removed.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
    }
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      navigate('/result')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Quiz Header */}
      <header className="glass sticky top-0 z-50 h-20 flex items-center px-6 justify-between shadow-soft">
        <div className="flex items-center gap-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft size={18} /> Exit Quiz
            </Button>
          </Link>
          <div className="h-8 w-px bg-surface-low" />
          <div>
            <h1 className="font-bold text-text-primary">Data Structures & Algorithms</h1>
            <p className="text-xs text-text-secondary">Midterm Exam • 20 Questions</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 text-primary font-mono font-bold">
            <Timer size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
              <Maximize2 size={20} />
            </Button>
            <Button 
              variant="secondary" 
              size="md" 
              className="ml-4"
              onClick={() => navigate('/result')}
            >
              Submit Quiz
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Main Quiz Area */}
        <div className="flex-grow overflow-y-auto p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-text-secondary">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-sm font-bold text-primary">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-surface-low rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  className="h-full bg-primary rounded-full shadow-lg shadow-primary/20" 
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-8 leading-relaxed">
                    {questions[currentQuestion].text}
                  </h2>
                  
                  {questions[currentQuestion].image && (
                    <div className="mb-8 rounded-3xl overflow-hidden shadow-lg">
                      <img 
                        src={questions[currentQuestion].image} 
                        alt="Question context" 
                        className="w-full h-auto max-h-[400px] object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        className={cn(
                          "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left group",
                          selectedOption === index
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-surface-low hover:border-primary/30 hover:bg-surface-low"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors",
                          selectedOption === index
                            ? "bg-primary text-white"
                            : "bg-surface-low text-text-secondary group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className={cn(
                          "text-lg font-medium",
                          selectedOption === index ? "text-primary" : "text-text-primary"
                        )}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    <ChevronLeft size={20} /> Previous
                  </Button>
                  <div className="flex gap-4">
                    <Button variant="outline" className="gap-2">
                      <Flag size={20} /> Flag Question
                    </Button>
                    <Button size="lg" className="gap-2 min-w-[160px]" onClick={handleNext}>
                      {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-surface-lowest border-l border-surface-low flex flex-col"
            >
              <div className="p-6 border-b border-surface-low flex justify-between items-center">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <LayoutGrid size={18} /> Question Grid
                </h3>
                <button onClick={() => setIsSidebarOpen(false)} className="text-text-secondary hover:text-text-primary">
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6">
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => i < questions.length && setCurrentQuestion(i)}
                      className={cn(
                        "w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                        i === currentQuestion
                          ? "bg-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                          : i < questions.length && selectedOption !== null
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-surface-low text-text-secondary hover:bg-surface-low/80"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-12 space-y-6">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Legend</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-md bg-primary" />
                      <span className="text-text-secondary">Current</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-md bg-emerald-100" />
                      <span className="text-text-secondary">Answered</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-md bg-surface-low" />
                      <span className="text-text-secondary">Unanswered</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-4 h-4 rounded-md bg-amber-100" />
                      <span className="text-text-secondary">Flagged</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-surface-low/50">
                <Card padding="sm" className="bg-white border-0 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Need Help?</p>
                      <p className="text-[10px] text-text-secondary">Ask our AI Tutor</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto p-0 w-8 h-8 rounded-full">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
