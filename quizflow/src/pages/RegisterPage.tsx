import * as React from "react"
import { motion } from "motion/react"
import { 
  User, 
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
  EyeOff,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleRegister = (e: React.FormEvent) => {
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-secondary to-pink-900 p-20 flex-col justify-between">
        <div className="absolute top-0 right-0 w-full h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-black/10 skew-x-12 -translate-x-1/2" />
        
        <Link to="/" className="flex items-center gap-3 relative z-10 group">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-secondary shadow-xl shadow-black/20 group-hover:rotate-12 transition-transform">
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
              <span>Join the Community</span>
            </div>
            <h2 className="text-5xl font-extrabold text-white leading-tight mb-8">
              Start Your <span className="text-accent underline decoration-accent/30 underline-offset-8">Success</span> Story Today
            </h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-lg mb-12">
              Create a free account to unlock personalized learning paths, track your progress, and join thousands of students worldwide.
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              { title: "Personalized Learning", desc: "AI-driven paths tailored to your needs.", icon: Zap },
              { title: "Global Community", desc: "Connect with students from 150+ countries.", icon: Globe },
              { title: "Secure & Private", desc: "Your data is always protected and private.", icon: ShieldCheck },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:bg-white/20 transition-all">
                  <feature.icon size={24} />
                </div>
                <div>
                  <p className="font-bold text-white">{feature.title}</p>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              </div>
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
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-4">Create Account</h1>
            <p className="text-text-secondary">
              Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Log in here</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-secondary transition-colors" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="John" 
                    className="w-full pl-12 pr-4 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-primary ml-1">Last Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Doe" 
                  className="w-full px-6 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-secondary transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-secondary transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-secondary focus:bg-white outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-[10px] text-text-secondary ml-1">Must be at least 8 characters with a mix of letters, numbers & symbols.</p>
            </div>

            <div className="flex items-start gap-3 ml-1">
              <input type="checkbox" id="terms" required className="mt-1 w-5 h-5 rounded-lg border-2 border-surface-low text-secondary focus:ring-secondary" />
              <label htmlFor="terms" className="text-xs font-medium text-text-secondary leading-relaxed">
                I agree to the <Link to="/terms" className="text-secondary font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-secondary font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button type="submit" variant="secondary" size="lg" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Free Account"} <ArrowRight size={20} />
            </Button>
          </form>

          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-low" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-surface px-4 text-text-secondary">Or join with</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Button variant="outline" className="rounded-2xl py-3 border-surface-low hover:border-secondary/30">
              <Chrome size={20} />
            </Button>
            <Button variant="outline" className="rounded-2xl py-3 border-surface-low hover:border-secondary/30">
              <Github size={20} />
            </Button>
            <Button variant="outline" className="rounded-2xl py-3 border-surface-low hover:border-secondary/30">
              <Facebook size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
