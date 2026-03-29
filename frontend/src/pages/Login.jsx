import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import api from '../api/axios'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('role', res.data.role)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl shadow-rose-500/10 p-8 md:p-10">
          <div className="text-center mb-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-[0_0_20px_rgba(244,63,94,0.4)] mb-6"
            >
              <span className="text-white text-2xl font-black">T</span>
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Back</span>
            </h1>
            <p className="text-zinc-400 font-medium">Elevate your workflow with TaskFlow</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-3"
              >
                ⚠ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="group w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose-400 font-bold hover:text-rose-300 transition-colors ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}