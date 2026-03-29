import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import api from '../api/axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

  const fetchTasks = async () => {
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      if (filterUser) params.assignedToId = filterUser
      const res = await api.get('/tasks', { params })
      setTasks(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [filterStatus, filterUser])
  useEffect(() => { if (role === 'ADMIN') api.get('/users').then(r => setUsers(r.data)).catch(() => {}) }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const statusConfig = {
    TODO: { color: 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50', dot: 'bg-zinc-400' },
    IN_PROGRESS: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
    DONE: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  }

  const stats = ['TODO', 'IN_PROGRESS', 'DONE'].map(s => ({
    label: s.replace('_', ' '),
    count: tasks.filter(t => t.status === s).length,
    ...statusConfig[s]
  }))

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]">T</div>
            <span className="font-black text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            {role === 'ADMIN' && (
              <Link to="/admin/users" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">Manage Users</Link>
            )}
            <Link to="/tasks/create"
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-rose-500/20">
              + New Task
            </Link>
            <div className="flex items-center gap-2 pl-4 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
                {name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-zinc-300 hidden sm:block">{name}</span>
            </div>
            <button onClick={() => { localStorage.clear(); navigate('/login') }}
              className="text-sm text-zinc-500 hover:text-rose-400 transition-colors">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage and track all your tasks</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/80 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{s.label}</p>
              </div>
              <p className="text-4xl font-black">{s.count}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4 mb-6 flex gap-4 flex-wrap items-center">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-zinc-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20">
            <option value="">All Statuses</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          {role === 'ADMIN' && (
            <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
              className="bg-zinc-800 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20">
              <option value="">All Users</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          )}
          {(filterStatus || filterUser) && (
            <button onClick={() => { setFilterStatus(''); setFilterUser('') }}
              className="text-sm text-zinc-500 hover:text-rose-400 transition-colors">✕ Clear</button>
          )}
          <span className="ml-auto text-sm text-zinc-600">{tasks.length} tasks</span>
        </div>

        {/* Tasks Table */}
        {loading ? (
          <div className="text-center py-20 text-zinc-600">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-zinc-400 text-lg font-medium">No tasks found</p>
            <Link to="/tasks/create" className="text-rose-400 text-sm mt-2 inline-block hover:underline">Create your first task →</Link>
          </motion.div>
        ) : (
          <div className="bg-zinc-900/80 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['Title', 'Status', 'Assigned To', 'Created By', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {tasks.map((task, i) => (
                    <motion.tr key={task.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-white">{task.title}</p>
                        {task.description && <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-xs">{task.description}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${statusConfig[task.status]?.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[task.status]?.dot}`} />
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{task.assignedToName || '—'}</td>
                      <td className="px-6 py-4 text-sm text-zinc-400">{task.createdByName}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link to={`/tasks/edit/${task.id}`} className="text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors">Edit</Link>
                          <button onClick={() => handleDelete(task.id)} className="text-sm text-zinc-600 hover:text-rose-400 font-medium transition-colors">Delete</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}