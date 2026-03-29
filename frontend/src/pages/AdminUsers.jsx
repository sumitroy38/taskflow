import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import api from '../api/axios'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users').then(res => { setUsers(res.data); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]">T</div>
          <span className="font-black text-lg">TaskFlow</span>
          <Link to="/dashboard" className="ml-auto text-sm text-zinc-500 hover:text-white transition-colors">← Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black mb-2">Manage Users</h1>
          <p className="text-zinc-500 mb-8">{users.length} registered users</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-zinc-600">Loading users...</div>
        ) : (
          <div className="bg-zinc-900/80 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-white/5">
                <tr>
                  {['User', 'Email', 'Role', 'Joined'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${user.role === 'ADMIN' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-zinc-700/50 text-zinc-300 border-zinc-600/50'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}