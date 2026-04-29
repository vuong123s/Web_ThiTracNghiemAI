import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { 
  Home, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  User,
  LogOut,
  HelpCircle,
  Trophy
} from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./Button"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Library", path: "/library", icon: BookOpen },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b-0 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <BookOpen size={24} />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-text-primary">
                Quiz<span className="text-primary">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm font-medium transition-all flex items-center gap-2",
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-low"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
              </button>
              <div className="h-8 w-px bg-surface-low mx-2" />
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Search size={20} />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-lowest border-t border-surface-low overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-low"
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-lowest pt-20 pb-10 border-t border-surface-low">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                  <BookOpen size={18} />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-text-primary">
                  Quiz<span className="text-primary">Flow</span>
                </span>
              </Link>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Empowering students with intelligent learning tools and interactive quizzes to master any subject.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-surface-low flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-all cursor-pointer">
                    <div className="w-5 h-5 bg-current rounded-sm opacity-20" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-text-primary mb-6">Platform</h3>
              <ul className="space-y-4">
                <li><Link to="/library" className="text-text-secondary hover:text-primary transition-colors">Library</Link></li>
                <li><Link to="/dashboard" className="text-text-secondary hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/leaderboard" className="text-text-secondary hover:text-primary transition-colors">Leaderboard</Link></li>
                <li><Link to="/exams" className="text-text-secondary hover:text-primary transition-colors">Exams</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-6">Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-surface-low flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-secondary text-sm">
              © 2026 QuizFlow. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-text-secondary text-sm hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
