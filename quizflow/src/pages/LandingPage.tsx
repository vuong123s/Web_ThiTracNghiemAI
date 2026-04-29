import * as React from "react"
import { motion } from "motion/react"
import { 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Users, 
  Trophy, 
  Zap, 
  BookOpen, 
  Brain, 
  Target,
  Sparkles
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { Link } from "react-router-dom"

import { cn } from "../lib/utils"

export const LandingPage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8">
                <Sparkles size={16} />
                <span>AI-Powered Learning Platform</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.1] mb-8">
                Master Any Subject with <span className="text-gradient">Intelligent</span> Quizzes
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-lg">
                Personalized learning paths, real-time feedback, and interactive challenges designed to help you excel in your exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Start Learning Now <ArrowRight size={20} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Play size={20} fill="currentColor" /> Watch Demo
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-low overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-white text-xs font-bold">
                    +2k
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-bold text-text-primary">2,400+ Students</p>
                  <p className="text-text-secondary">Joined this week</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Students learning" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 z-20"
              >
                <Card variant="glass" padding="sm" className="flex items-center gap-4 border-white/40">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Top Scorer</p>
                    <p className="text-sm font-bold text-text-primary">Alex Johnson</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 z-20"
              >
                <Card variant="glass" padding="sm" className="flex items-center gap-4 border-white/40">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary font-medium">Daily Streak</p>
                    <p className="text-sm font-bold text-text-primary">15 Days 🔥</p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-surface-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary mb-6">
              Why Choose QuizFlow?
            </h2>
            <p className="text-lg text-text-secondary">
              We combine cognitive science with advanced technology to create the most effective learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Adaptive Learning",
                description: "Our AI analyzes your performance to create a personalized learning path that focuses on your weak areas.",
                color: "bg-primary"
              },
              {
                icon: Target,
                title: "Exam Focused",
                description: "Huge library of practice questions and mock exams curated by top educators to match real exam patterns.",
                color: "bg-secondary"
              },
              {
                icon: Users,
                title: "Social Learning",
                description: "Compete with friends, join study groups, and climb the leaderboard to stay motivated and engaged.",
                color: "bg-accent"
              }
            ].map((feature, i) => (
              <Card key={i} className="group hover:scale-[1.02] transition-transform">
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg", feature.color)}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold tracking-tight text-text-primary mb-6">
                Explore Subjects
              </h2>
              <p className="text-lg text-text-secondary">
                From Mathematics to Computer Science, find the perfect quiz to test your knowledge.
              </p>
            </div>
            <Link to="/library">
              <Button variant="outline" className="gap-2">
                View All Subjects <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Mathematics", icon: "Σ", color: "bg-blue-500" },
              { name: "Physics", icon: "⚛", color: "bg-purple-500" },
              { name: "Biology", icon: "🧬", color: "bg-green-500" },
              { name: "Chemistry", icon: "🧪", color: "bg-red-500" },
              { name: "Computer Science", icon: "💻", color: "bg-indigo-500" },
              { name: "History", icon: "📜", color: "bg-amber-500" },
              { name: "Literature", icon: "📚", color: "bg-pink-500" },
              { name: "Geography", icon: "🌍", color: "bg-teal-500" },
              { name: "Economics", icon: "📊", color: "bg-orange-500" },
              { name: "Art", icon: "🎨", color: "bg-rose-500" },
              { name: "Music", icon: "🎵", color: "bg-cyan-500" },
              { name: "Languages", icon: "🗣", color: "bg-emerald-500" },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
              >
                <Card padding="sm" className="flex flex-col items-center text-center h-full hover:shadow-xl transition-shadow">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4", cat.color)}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-bold text-text-primary">{cat.name}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="primary" padding="none" className="relative overflow-hidden rounded-[4rem]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-1/2" />
            <div className="relative z-10 px-8 py-20 md:px-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-8">
                  Ready to Boost Your Learning?
                </h2>
                <p className="text-xl text-white/80 mb-10">
                  Join thousands of students who are already using QuizFlow to achieve their academic goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link to="/register">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto">
                      Create Free Account
                    </Button>
                  </Link>
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Card padding="sm" className="bg-white/10 border-white/20 backdrop-blur-md">
                    <p className="text-3xl font-bold text-white">98%</p>
                    <p className="text-sm text-white/60">Success Rate</p>
                  </Card>
                  <Card padding="sm" className="bg-white/10 border-white/20 backdrop-blur-md">
                    <p className="text-3xl font-bold text-white">50k+</p>
                    <p className="text-sm text-white/60">Questions</p>
                  </Card>
                </div>
                <div className="space-y-4 mt-8">
                  <Card padding="sm" className="bg-white/10 border-white/20 backdrop-blur-md">
                    <p className="text-3xl font-bold text-white">10k+</p>
                    <p className="text-sm text-white/60">Active Users</p>
                  </Card>
                  <Card padding="sm" className="bg-white/10 border-white/20 backdrop-blur-md">
                    <p className="text-3xl font-bold text-white">4.9/5</p>
                    <p className="text-sm text-white/60">User Rating</p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
