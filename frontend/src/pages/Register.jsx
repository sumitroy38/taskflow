import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import api from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('role', res.data.role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 md:p-10">
          <div className="text-center mb-10">
            <motion.div whileHover={{ scale: 1.05, rotate: -5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_20px_rgba(139,92,246,0.4)] mb-6">
              <span className="text-white text-2xl font-black">T</span>
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Account</span>
            </h1>
            <p className="text-zinc-400 font-medium">Join TaskFlow today</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl mb-6 text-sm">
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
                placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500">Already have an account?{' '}
              <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors ml-1">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}