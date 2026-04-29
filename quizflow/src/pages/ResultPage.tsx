import * as React from "react"
import { motion } from "motion/react"
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Target, 
  ArrowRight, 
  Share2, 
  Download, 
  RefreshCw,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  HelpCircle,
  Info
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

export const ResultPage: React.FC = () => {
  const score = 8.5
  const total = 10
  const percentage = (score / total) * 100

  const stats = [
    { label: "Correct Answers", value: "8/10", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Time Spent", value: "12:45", icon: Clock, color: "text-blue-500" },
    { label: "Accuracy", value: "85%", icon: Target, color: "text-purple-500" },
    { label: "Points Earned", value: "+450", icon: Zap, color: "text-amber-500" },
  ]

  const answers = [
    {
      id: 1,
      question: "What is the average time complexity of the Quick Sort algorithm?",
      userAnswer: "O(n log n)",
      correctAnswer: "O(n log n)",
      status: "correct",
      explanation: "Quick Sort has an average time complexity of O(n log n). In the worst case, it can be O(n²), but with good pivot selection, it performs very efficiently.",
      tags: ["Algorithms", "Sorting", "Time Complexity"]
    },
    {
      id: 2,
      question: "Which data structure uses the LIFO (Last-In, First-Out) principle?",
      userAnswer: "Queue",
      correctAnswer: "Stack",
      status: "incorrect",
      explanation: "A Stack follows the LIFO principle, where the last element added is the first one to be removed. A Queue follows the FIFO (First-In, First-Out) principle.",
      tags: ["Data Structures", "Stack", "Queue"]
    }
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Result Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl shadow-primary/30 mb-8 relative"
        >
          <Award size={64} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-white/20 border-dashed rounded-full"
          />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-4">
          Excellent Work, Alex!
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          You've completed the <span className="font-bold text-text-primary">Data Structures & Algorithms</span> quiz with a score of <span className="text-primary font-bold">{score}/{total}</span>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="text-center hover:scale-[1.02] transition-transform">
            <div className={cn("w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center mx-auto mb-4", stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Answer Key */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-primary">Detailed Answer Key</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-emerald-600 bg-emerald-50">Correct (8)</Button>
              <Button variant="ghost" size="sm" className="text-rose-600 bg-rose-50">Incorrect (2)</Button>
            </div>
          </div>

          <div className="space-y-6">
            {answers.map((ans) => (
              <Card key={ans.id} className={cn(
                "border-l-8",
                ans.status === "correct" ? "border-emerald-500" : "border-rose-500"
              )}>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-bold text-text-primary leading-relaxed pr-8">
                    {ans.question}
                  </h3>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-bold",
                    ans.status === "correct" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {ans.status === "correct" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {ans.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className={cn(
                    "p-4 rounded-2xl border-2",
                    ans.status === "correct" ? "border-emerald-100 bg-emerald-50/30" : "border-rose-100 bg-rose-50/30"
                  )}>
                    <p className="text-xs font-bold text-text-secondary uppercase mb-2">Your Answer</p>
                    <p className={cn(
                      "font-bold",
                      ans.status === "correct" ? "text-emerald-700" : "text-rose-700"
                    )}>{ans.userAnswer}</p>
                  </div>
                  {ans.status === "incorrect" && (
                    <div className="p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/30">
                      <p className="text-xs font-bold text-text-secondary uppercase mb-2">Correct Answer</p>
                      <p className="font-bold text-emerald-700">{ans.correctAnswer}</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-surface-low rounded-3xl">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Info size={18} />
                    <span className="font-bold text-sm">Explanation</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {ans.explanation}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ans.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white text-[10px] font-bold text-text-secondary shadow-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <Card className="bg-primary text-white border-0 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold mb-6">What's Next?</h3>
            <div className="space-y-4 relative z-10">
              <Link to="/quiz">
                <Button variant="accent" className="w-full gap-2">
                  <RefreshCw size={18} /> Retake Quiz
                </Button>
              </Link>
              <Link to="/library">
                <Button variant="ghost" className="w-full text-white hover:bg-white/10 gap-2">
                  <BookOpen size={18} /> Explore Related Topics
                </Button>
              </Link>
              <div className="h-px bg-white/20 my-6" />
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1 text-white hover:bg-white/10 gap-2 border border-white/20">
                  <Share2 size={18} /> Share
                </Button>
                <Button variant="ghost" className="flex-1 text-white hover:bg-white/10 gap-2 border border-white/20">
                  <Download size={18} /> PDF
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-text-primary mb-6">Performance Analysis</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Improving Fast</p>
                  <p className="text-xs text-text-secondary">Your score is 15% higher than last time.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Top 10%</p>
                  <p className="text-xs text-text-secondary">You are among the top performers today.</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-8">View Full Analytics</Button>
          </Card>

          <Card className="bg-surface-low border-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <HelpCircle size={20} />
              </div>
              <h3 className="font-bold text-text-primary">Struggling with a topic?</h3>
            </div>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Our AI Tutor can explain the concepts you missed in a way that's easy to understand.
            </p>
            <Button className="w-full">Chat with AI Tutor</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
