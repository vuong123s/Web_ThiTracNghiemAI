import * as React from "react"
import { motion } from "motion/react"
import { 
  Trophy, 
  Zap, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Play, 
  BookOpen, 
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Star,
  Search,
  Filter
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

export const Dashboard: React.FC = () => {
  const stats = [
    { label: "Total Quizzes", value: "48", icon: BookOpen, color: "bg-blue-500", trend: "+12%" },
    { label: "Average Score", value: "85%", icon: Target, color: "bg-purple-500", trend: "+5%" },
    { label: "Study Streak", value: "12 Days", icon: Zap, color: "bg-amber-500", trend: "🔥" },
    { label: "Global Rank", value: "#142", icon: Trophy, color: "bg-emerald-500", trend: "Top 5%" },
  ]

  const recentQuizzes = [
    { id: 1, title: "Data Structures & Algorithms", subject: "Computer Science", score: "92%", date: "2 hours ago", image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "Quantum Mechanics Basics", subject: "Physics", score: "78%", date: "Yesterday", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Organic Chemistry II", subject: "Chemistry", score: "88%", date: "2 days ago", image: "https://images.unsplash.com/photo-1532187875605-2fe358a71428?auto=format&fit=crop&q=80&w=400" },
  ]

  const recommendations = [
    { id: 4, title: "Linear Algebra Advanced", subject: "Mathematics", duration: "45 mins", difficulty: "Hard", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400" },
    { id: 5, title: "World History: Cold War", subject: "History", duration: "30 mins", difficulty: "Medium", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">
            Welcome back, <span className="text-primary">Alex!</span> 👋
          </h1>
          <p className="text-text-secondary">
            You've completed <span className="font-bold text-text-primary">12 quizzes</span> this week. Keep it up!
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar size={18} /> Schedule Study
          </Button>
          <Link to="/quiz">
            <Button className="gap-2">
              <Play size={18} fill="currentColor" /> Start New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-lg",
                stat.trend.includes("+") ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-text-secondary font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-extrabold text-text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Recent Activity</h2>
              <Link to="/history" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <Card key={quiz.id} padding="none" className="flex items-center gap-6 group cursor-pointer hover:bg-surface-low transition-colors">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-l-4xl">
                    <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow py-4">
                    <div className="flex justify-between items-start pr-6">
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{quiz.subject}</p>
                        <h3 className="text-lg font-bold text-text-primary mb-1">{quiz.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center gap-1"><Clock size={14} /> {quiz.date}</span>
                          <span className="flex items-center gap-1"><CheckCircle2 size={14} /> {quiz.score} Score</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                        <ArrowUpRight size={20} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Recommended for You */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Recommended for You</h2>
              <Link to="/library" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                Explore Library <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.id} padding="none" className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden rounded-t-4xl">
                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-text-primary shadow-sm">
                        {rec.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{rec.subject}</p>
                    <h3 className="text-xl font-bold text-text-primary mb-4">{rec.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary flex items-center gap-1">
                        <Clock size={14} /> {rec.duration}
                      </span>
                      <Button variant="outline" size="sm" className="rounded-2xl">
                        Start Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-primary to-indigo-700 text-white border-0">
            <h3 className="text-xl font-bold mb-6">Learning Progress</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Weekly Goal</span>
                  <span>80%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "80%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white rounded-full" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-white/60">Hours Studied</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-2xl font-bold">450</p>
                  <p className="text-xs text-white/60">Points Earned</p>
                </div>
              </div>
              <Button variant="accent" className="w-full">View Detailed Report</Button>
            </div>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-text-primary">Leaderboard</h3>
              <Trophy size={18} className="text-accent" />
            </div>
            <div className="space-y-4">
              {[
                { name: "Sarah Miller", points: "2,840", rank: 1, avatar: "https://i.pravatar.cc/100?img=1" },
                { name: "Alex Johnson", points: "2,650", rank: 2, avatar: "https://i.pravatar.cc/100?img=2" },
                { name: "David Chen", points: "2,420", rank: 3, avatar: "https://i.pravatar.cc/100?img=3" },
              ].map((user) => (
                <div key={user.rank} className="flex items-center gap-4">
                  <span className={cn(
                    "w-6 text-sm font-bold",
                    user.rank === 1 ? "text-accent" : "text-text-secondary"
                  )}>#{user.rank}</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-low">
                    <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary">{user.points} pts</p>
                  </div>
                  {user.rank === 1 && <Star size={16} className="text-accent fill-accent" />}
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-primary font-bold">View Full Leaderboard</Button>
          </Card>

          {/* Upcoming Exams */}
          <Card className="bg-surface-low border-0">
            <h3 className="font-bold text-text-primary mb-6">Upcoming Exams</h3>
            <div className="space-y-4">
              {[
                { title: "Midterm Math", date: "Oct 15", time: "10:00 AM", type: "Official" },
                { title: "CS Principles", date: "Oct 18", time: "02:30 PM", type: "Mock" },
              ].map((exam, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <span className="text-xs font-bold leading-none">{exam.date.split(' ')[1]}</span>
                    <span className="text-[10px] uppercase font-bold">{exam.date.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{exam.title}</p>
                    <p className="text-xs text-text-secondary">{exam.time} • {exam.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
