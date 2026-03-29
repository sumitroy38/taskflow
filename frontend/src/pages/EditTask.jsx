import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import api from '../api/axios'

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', assignedToId: '' })
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/tasks/${id}`).then(res => {
      const t = res.data
      setForm({ title: t.title, description: t.description || '', status: t.status, assignedToId: t.assignedToId || '' })
    })
    api.get('/users').then(res => setUsers(res.data)).catch(() => {})
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      if (!payload.assignedToId) delete payload.assignedToId
      else payload.assignedToId = parseInt(payload.assignedToId)
      await api.put(`/tasks/${id}`, payload)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    { value: 'TODO', label: 'Todo', color: 'text-zinc-300' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'text-blue-400' },
    { value: 'DONE', label: 'Done', color: 'text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]">T</div>
          <span className="font-black text-lg">TaskFlow</span>
          <Link to="/dashboard" className="ml-auto text-sm text-zinc-500 hover:text-white transition-colors">← Back</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2">Edit Task</h1>
          <p className="text-zinc-500 mb-8">Update task details</p>

          {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl mb-6 text-sm">⚠ {error}</div>}

          <div className="bg-zinc-900/80 border border-white/5 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Title *</label>
                <input type="text" required value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                <textarea value={form.description} rows={4}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {statusOptions.map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setForm({...form, status: opt.value})}
                      className={`py-3 rounded-2xl border text-sm font-bold transition-all ${form.status === opt.value ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-white/5 bg-zinc-800/50 text-zinc-500 hover:border-white/10'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Assign To</label>
                <select value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all">
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes →'}
                </button>
                <Link to="/dashboard" className="px-8 py-4 border border-white/10 rounded-2xl text-zinc-400 hover:bg-white/5 transition-all text-sm font-medium flex items-center">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}