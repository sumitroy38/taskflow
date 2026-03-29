import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTask from './pages/CreateTask'
import EditTask from './pages/EditTask'
import AdminUsers from './pages/AdminUsers'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const role = localStorage.getItem('role')
  return role === 'ADMIN' ? children : <Navigate to="/dashboard" />
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tasks/create" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
        <Route path="/tasks/edit/:id" element={<PrivateRoute><EditTask /></PrivateRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      </Routes>
    </HashRouter>
  )
}