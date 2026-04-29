import * as React from "react"
import { motion } from "motion/react"
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  Facebook, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('/dashboard')
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-stretch bg-surface">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary to-indigo-900 p-20 flex-col justify-between">
        <div className="absolute top-0 right-0 w-full h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-black/10 skew-x-12 -translate-x-1/2" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-xl shadow-black/20 group-hover:rotate-12 transition-transform">
            <BookOpen size={28} />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            Quiz<span className="text-white/70">Flow</span>
          </span>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold mb-8 backdrop-blur-md border border-white/20">
              <Sparkles size={16} />
              <span>Welcome Back!</span>
            </div>
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-8">
              Continue Your <span className="text-accent underline decoration-accent/30 underline-offset-8">Learning</span> Journey
            </h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg mb-12">
              Log in to access your personalized dashboard, track your progress, and challenge yourself with new quizzes.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Active Students", value: "10k+", icon: CheckCircle2 },
              { label: "Quizzes Taken", value: "50k+", icon: CheckCircle2 },
            ].map((stat, i) => (
              <Card key={i} padding="sm" className="bg-white/10 border-white/20 backdrop-blur-md text-white">
                <stat.icon size={20} className="mb-3 text-accent" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/60 uppercase font-bold tracking-wider">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © 2026 QuizFlow. Empowering minds globally.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-4">Log In</h1>
            <p className="text-text-secondary">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-text-primary">Password</label>
                <Link to="/forgot-password" title="Forgot Password?" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-surface-low text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm font-medium text-text-secondary">Remember me for 30 days</label>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"} <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-low" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-surface px-4 text-text-secondary">Or continue with</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Button variant="outline" className="rounded-2xl py-3">
              <Chrome size={20} />
            </Button>
            <Button variant="outline" className="rounded-2xl py-3">
              <Github size={20} />
            </Button>
            <Button variant="outline" className="rounded-2xl py-3">
              <Facebook size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
