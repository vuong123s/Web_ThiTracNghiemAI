import * as React from "react"
import { motion } from "motion/react"
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  Zap, 
  Target, 
  Search, 
  ChevronRight, 
  Star,
  Award,
  Crown,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { cn } from "../lib/utils"

export const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState("Weekly")
  const [searchQuery, setSearchQuery] = React.useState("")

  const timeframes = ["Daily", "Weekly", "Monthly", "All-time"]

  const topThree = [
    { id: 2, name: "Sarah Miller", points: "2,840", rank: 2, avatar: "https://i.pravatar.cc/150?img=1", accuracy: "94%", streak: "15" },
    { id: 1, name: "Alex Johnson", points: "3,120", rank: 1, avatar: "https://i.pravatar.cc/150?img=2", accuracy: "98%", streak: "24" },
    { id: 3, name: "David Chen", points: "2,650", rank: 3, avatar: "https://i.pravatar.cc/150?img=3", accuracy: "91%", streak: "10" },
  ]

  const leaderboardData = [
    { id: 4, name: "Emily Watson", points: "2,420", rank: 4, avatar: "https://i.pravatar.cc/100?img=4", trend: "up", accuracy: "89%", streak: "8" },
    { id: 5, name: "Michael Ross", points: "2,380", rank: 5, avatar: "https://i.pravatar.cc/100?img=5", trend: "down", accuracy: "87%", streak: "12" },
    { id: 6, name: "Jessica Lee", points: "2,250", rank: 6, avatar: "https://i.pravatar.cc/100?img=6", trend: "stable", accuracy: "92%", streak: "5" },
    { id: 7, name: "Ryan Garcia", points: "2,100", rank: 7, avatar: "https://i.pravatar.cc/100?img=7", trend: "up", accuracy: "85%", streak: "3" },
    { id: 8, name: "Sophie Turner", points: "1,980", rank: 8, avatar: "https://i.pravatar.cc/100?img=8", trend: "up", accuracy: "88%", streak: "14" },
    { id: 9, name: "Kevin Hart", points: "1,850", rank: 9, avatar: "https://i.pravatar.cc/100?img=9", trend: "down", accuracy: "82%", streak: "2" },
    { id: 10, name: "Olivia Wilde", points: "1,720", rank: 10, avatar: "https://i.pravatar.cc/100?img=10", trend: "stable", accuracy: "90%", streak: "7" },
  ]

  const filteredLeaderboard = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 mb-6 shadow-lg shadow-amber-200/50"
        >
          <Trophy size={40} />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-4">
          Global <span className="text-gradient">Leaderboard</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          See how you stack up against the best learners in the world.
        </p>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-24 max-w-5xl mx-auto">
        {topThree.map((user, i) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            className={cn(
              "relative flex flex-col items-center",
              user.rank === 1 ? "order-1 md:order-2 z-10" : user.rank === 2 ? "order-2 md:order-1" : "order-3"
            )}
          >
            {/* Rank Badge */}
            <div className={cn(
              "absolute -top-6 z-20 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl",
              user.rank === 1 ? "bg-amber-400 scale-125" : user.rank === 2 ? "bg-slate-400" : "bg-orange-400"
            )}>
              {user.rank === 1 ? <Crown size={24} /> : <span className="font-bold text-lg">{user.rank}</span>}
            </div>

            <Card 
              variant={user.rank === 1 ? "primary" : "default"} 
              padding="lg"
              className={cn(
                "w-full text-center group hover:scale-[1.02] transition-transform",
                user.rank === 1 ? "pt-16 pb-12" : "pt-12 pb-10"
              )}
            >
              <div className="relative inline-block mb-6">
                <div className={cn(
                  "w-24 h-24 rounded-full p-1 border-4",
                  user.rank === 1 ? "border-amber-400" : user.rank === 2 ? "border-slate-300" : "border-orange-300"
                )}>
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg">
                  <Star size={16} className={cn(
                    user.rank === 1 ? "text-amber-400 fill-amber-400" : "text-text-secondary"
                  )} />
                </div>
              </div>

              <h3 className={cn(
                "text-xl font-extrabold mb-1",
                user.rank === 1 ? "text-white" : "text-text-primary"
              )}>{user.name}</h3>
              <p className={cn(
                "text-sm font-bold mb-6",
                user.rank === 1 ? "text-white/70" : "text-primary"
              )}>{user.points} Points</p>

              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  user.rank === 1 ? "bg-white/10" : "bg-surface-low"
                )}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", user.rank === 1 ? "text-white/60" : "text-text-secondary")}>Accuracy</p>
                  <p className={cn("text-sm font-bold", user.rank === 1 ? "text-white" : "text-text-primary")}>{user.accuracy}</p>
                </div>
                <div className={cn(
                  "p-3 rounded-2xl",
                  user.rank === 1 ? "bg-white/10" : "bg-surface-low"
                )}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", user.rank === 1 ? "text-white/60" : "text-text-secondary")}>Streak</p>
                  <p className={cn("text-sm font-bold", user.rank === 1 ? "text-white" : "text-text-primary")}>{user.streak} 🔥</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
        <div className="flex bg-surface-low p-1.5 rounded-3xl w-full lg:w-auto">
          {timeframes.map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "flex-1 lg:flex-none px-6 py-3 rounded-2xl text-sm font-bold transition-all",
                timeframe === t
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search players..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-3xl bg-surface-low border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-low/50">
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Rank</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Player</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Points</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Accuracy</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Streak</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest">Trend</th>
                <th className="px-8 py-6 text-xs font-bold text-text-secondary uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-low">
              {filteredLeaderboard.map((user, i) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-surface-low/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <span className="text-lg font-extrabold text-text-secondary">#{user.rank}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-surface-low group-hover:border-primary/30 transition-colors">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-text-primary">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-primary">{user.points}</span>
                  </td>
                  <td className="px-8 py-6 text-text-secondary font-medium">
                    {user.accuracy}
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold">
                      <Zap size={14} className="fill-amber-600" /> {user.streak}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {user.trend === "up" ? (
                      <div className="flex items-center gap-1 text-emerald-500">
                        <ArrowUp size={16} /> <span className="text-xs font-bold">Rising</span>
                      </div>
                    ) : user.trend === "down" ? (
                      <div className="flex items-center gap-1 text-rose-500">
                        <ArrowDown size={16} /> <span className="text-xs font-bold">Falling</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Minus size={16} /> <span className="text-xs font-bold">Stable</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={20} />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Your Rank Section */}
      <div className="mt-12">
        <Card variant="glass" className="border-primary/20 bg-primary/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="text-2xl font-bold">#142</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">Your Current Rank</h3>
                <p className="text-text-secondary">You are in the <span className="text-primary font-bold">Top 5%</span> of learners this week!</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Points to next rank</p>
                <p className="text-lg font-bold text-text-primary">120 Pts</p>
              </div>
              <Button size="lg" className="gap-2">
                Improve Rank <TrendingUp size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
