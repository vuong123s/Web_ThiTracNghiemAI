import * as React from "react"
import { motion } from "motion/react"
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  Star, 
  Users, 
  BookOpen, 
  Zap, 
  Trophy, 
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  List,
  Menu
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link } from "react-router-dom"
import { cn } from "../lib/utils"

export const LibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  const categories = ["All", "Mathematics", "Physics", "Computer Science", "Biology", "Chemistry", "History", "Literature"]

  const quizzes = [
    { id: 1, title: "Data Structures & Algorithms", subject: "Computer Science", duration: "45 mins", questions: 30, difficulty: "Hard", rating: 4.9, users: "1.2k", image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "Quantum Mechanics Basics", subject: "Physics", duration: "30 mins", questions: 20, difficulty: "Medium", rating: 4.7, users: "850", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Organic Chemistry II", subject: "Chemistry", duration: "60 mins", questions: 40, difficulty: "Hard", rating: 4.8, users: "2.1k", image: "https://images.unsplash.com/photo-1532187875605-2fe358a71428?auto=format&fit=crop&q=80&w=400" },
    { id: 4, title: "World History: Cold War", subject: "History", duration: "30 mins", questions: 25, difficulty: "Medium", rating: 4.6, users: "3.4k", image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400" },
    { id: 5, title: "Linear Algebra Advanced", subject: "Mathematics", duration: "45 mins", questions: 30, difficulty: "Hard", rating: 4.9, users: "1.5k", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400" },
    { id: 6, title: "Modern English Literature", subject: "Literature", duration: "20 mins", questions: 15, difficulty: "Easy", rating: 4.5, users: "900", image: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=400" },
  ]

  const filteredQuizzes = quizzes.filter(q => 
    (selectedCategory === "All" || q.subject === selectedCategory) &&
    (q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filter Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
        <div className="max-w-xl w-full">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Explore Library
          </h1>
          <p className="text-text-secondary mb-8">
            Find the perfect quiz to test your knowledge and prepare for your exams.
          </p>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search subjects, topics, or exams..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="gap-2 rounded-2xl">
            <Filter size={18} /> Filters
          </Button>
          <div className="flex bg-surface-low p-1 rounded-2xl">
            <button className="p-2 bg-white text-primary rounded-xl shadow-sm">
              <LayoutGrid size={20} />
            </button>
            <button className="p-2 text-text-secondary hover:text-text-primary rounded-xl">
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-12 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
              selectedCategory === cat
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-surface-low text-text-secondary hover:bg-surface-low/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} padding="none" className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="relative aspect-video overflow-hidden rounded-t-4xl">
              <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4 flex gap-2">
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md",
                  quiz.difficulty === "Hard" ? "bg-rose-500/90 text-white" : 
                  quiz.difficulty === "Medium" ? "bg-amber-500/90 text-white" : "bg-emerald-500/90 text-white"
                )}>
                  {quiz.difficulty}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <span className="flex items-center gap-1"><Users size={14} /> {quiz.users}</span>
                  <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {quiz.rating}</span>
                </div>
                <Button variant="accent" size="sm" className="rounded-xl">
                  Preview
                </Button>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{quiz.subject}</p>
                <div className="flex items-center gap-1 text-xs text-text-secondary font-medium">
                  <Clock size={14} /> {quiz.duration}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-6 group-hover:text-primary transition-colors leading-tight">
                {quiz.title}
              </h3>
              <div className="flex justify-between items-center pt-6 border-t border-surface-low">
                <span className="text-sm text-text-secondary font-medium">
                  {quiz.questions} Questions
                </span>
                <Link to="/quiz">
                  <Button variant="ghost" className="text-primary font-bold gap-2 p-0 hover:bg-transparent">
                    Start Quiz <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-32">
          <div className="w-24 h-24 rounded-full bg-surface-low flex items-center justify-center mx-auto mb-8 text-text-secondary">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-4">No quizzes found</h3>
          <p className="text-text-secondary mb-8">Try adjusting your search or filters to find what you're looking for.</p>
          <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="mt-20 flex justify-center gap-3">
        <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-xl">1</Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl">2</Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl">3</Button>
        <span className="flex items-center px-2 text-text-secondary">...</span>
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl">12</Button>
        <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-xl">
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  )
}
