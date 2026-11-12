import { useState, useEffect } from 'react'

const SEED_COURSES = [
  { id: 'c1', code: 'CS101', title: 'Web Development', professor: 'Prof. Suhitha Rao', color: 'bg-indigo-600' },
  { id: 'c2', code: 'CS201', title: 'Database Management', professor: 'Prof. Suhitha Rao', color: 'bg-emerald-600' },
]
const SEED_ASSIGNMENTS = [
  { id: 'a1', courseId: 'c1', title: 'Build Portfolio Website', desc: 'Create a responsive portfolio using React + Tailwind. Deploy on Vercel.', deadline: '2026-11-14T23:59', driveLink: 'https://drive.google.com/drive', type: 'Individual', createdAt: '2026-11-10' },
  { id: 'a2', courseId: 'c1', title: 'Group Project - E-Commerce UI', desc: 'In a group of 3, design complete E-Commerce UI with cart flow.', deadline: '2026-11-20T23:59', driveLink: 'https://drive.google.com/drive', type: 'Group', createdAt: '2026-11-10' },
  { id: 'a3', courseId: 'c2', title: 'ER Diagram + SQL Queries', desc: 'Design ER diagram for Library system and write 10 SQL queries.', deadline: '2026-11-12T23:59', driveLink: 'https://drive.google.com/drive', type: 'Individual', createdAt: '2026-11-09' },
]
const SEED_USERS = [
  { name: 'Prof. Suhitha', email: 'prof@joineazy.com', pass: '123456', role: 'professor' },
  { name: 'Trupti', email: 'trupti@student.com', pass: '123456', role: 'student' },
  { name: 'Rahul Sharma', email: 'rahul@student.com', pass: '123456', role: 'student' },
  { name: 'Priya Patil', email: 'priya@student.com', pass: '123456', role: 'student' },
]
function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    if (v === null || v === undefined) return fallback;
    if (Array.isArray(v) && v.length === 0 && key === 'je_assignments') return fallback;
    return v;
  } catch { return fallback }
}

export default function App() {
  const [user, setUser] = useState(() => load('je_user', null))
  const [users, setUsers] = useState(() => load('je_users', SEED_USERS))
  const [courses] = useState(SEED_COURSES)
  const [assignments, setAssignments] = useState(() => load('je_assignments', SEED_ASSIGNMENTS))
  const [acks, setAcks] = useState(() => load('je_acks', []))
  const [groups, setGroups] = useState(() => load('je_groups', [{ id: 'g1', courseId: 'c1', name: 'Team Alpha', leaderEmail: 'trupti@student.com', members: ['trupti@student.com', 'rahul@student.com'] }]))
  const [page, setPage] = useState('dashboard')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [newA, setNewA] = useState({ title: '', desc: '', deadline: '', driveLink: '', type: 'Individual' })
  const [groupName, setGroupName] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', pass: '', role: 'student' })
  const [authErr, setAuthErr] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { localStorage.setItem('je_users', JSON.stringify(users)) }, [users])
  useEffect(() => { localStorage.setItem('je_assignments', JSON.stringify(assignments)) }, [assignments])
  useEffect(() => { localStorage.setItem('je_acks', JSON.stringify(acks)) }, [acks])
  useEffect(() => { localStorage.setItem('je_groups', JSON.stringify(groups)) }, [groups])
  useEffect(() => { if (user) localStorage.setItem('je_user', JSON.stringify(user)); else localStorage.removeItem('je_user') }, [user])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 3000); return () => clearTimeout(t) } }, [toast])

  const showToast = (m) => setToast(m)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('je_token');
    localStorage.removeItem('je_user');
    setPage('dashboard');
    setSelectedCourse(null);
    setSelectedAssignment(null);
    setAuthMode('login');
    setEditingId(null);
  }
  const goHome = () => { setSelectedCourse(null); setSelectedAssignment(null); setPage('dashboard'); }

  const handleAuth = (e) => {
    e.preventDefault(); setAuthErr('')
    if (!form.email || !form.pass) return setAuthErr('Email and Password required')
    if (authMode === 'register') {
      if (!form.name) return setAuthErr('Name required')
      if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return setAuthErr('User already exists, please login')
      const nu = { name: form.name, email: form.email, pass: form.pass, role: form.role }
      const token = 'mock-jwt-' + btoa(form.email) + '-' + Date.now()
      localStorage.setItem('je_token', token)
      setUsers([...users, nu]); setUser(nu); setPage('dashboard'); setSelectedCourse(null); showToast('Account created! Welcome ' + form.name)
    } else {
      const found = users.find(u => u.email.toLowerCase() === form.email.toLowerCase() && u.pass === form.pass)
      if (!found) return setAuthErr('Invalid email or password. Try demo logins below.')
      const token = 'mock-jwt-' + btoa(found.email) + '-' + Date.now()
      localStorage.setItem('je_token', token)
      setUser(found); setPage('dashboard'); setSelectedCourse(null); showToast('Welcome back, ' + found.name)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black">J</div>
            <h1 className="text-2xl font-black mt-3">Joineazy</h1>
            <p className="text-gray-500 text-sm">Student, Group & Assignment Management</p>
          </div>
          <div className="flex bg-gray-100 rounded-full p-1 mb-5">
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthErr('') }} className={`flex-1 py-2 rounded-full text-sm font-bold capitalize ${authMode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>{m}</button>
            ))}
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            {authMode === 'register' && <input className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />}
            <input className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" placeholder="Password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} />
            {authMode === 'register' && (
              <div className="flex gap-2">
                {['student', 'professor'].map(r => (
                  <button type="button" key={r} onClick={() => setForm({ ...form, role: r })} className={`flex-1 py-2.5 rounded-xl border font-bold capitalize text-sm ${form.role === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800'}`}>{r}</button>
                ))}
              </div>
            )}
            {authErr && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{authErr}</p>}
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">{authMode === 'login' ? 'Login' : 'Create Account'}</button>
          </form>
          <div className="mt-5 bg-gray-50 rounded-xl p-3 text-xs space-y-1 break-words">
            <p className="font-bold text-gray-700">Demo Logins (Password: 123456)</p>
            <p>👩‍🏫 Professor: prof@joineazy.com</p>
            <p>👩‍🎓 Student Leader: trupti@student.com</p>
            <p>👨‍🎓 Student: rahul@student.com</p>
          </div>
        </div>
      </div>
    )
  }

  const isProfessor = user.role === 'professor' || user.role === 'admin'
  const myGroups = groups.filter(g => g.members.includes(user.email))
  const isLeader = (assignmentId) => {
    const g = groups.find(gr => gr.courseId === assignments.find(a => a.id === assignmentId)?.courseId && gr.members.includes(user.email))
    return g && g.leaderEmail === user.email ? g : null
  }

  const isStudentCoveredByAck = (studentEmail, ack) => {
    if (!ack) return false
    if (ack.userEmail === studentEmail) return true
    if (ack.groupName) {
      const g = groups.find(x => x.name === ack.groupName)
      if (g && g.members.includes(studentEmail)) return true
    }
    return false
  }
  const getCoveredCount = (assignmentId) => {
    const students = users.filter(u => u.role === 'student')
    const total = students.length
    const submitted = students.filter(s => {
      return acks.some(a => a.assignmentId === assignmentId && isStudentCoveredByAck(s.email, a))
    }).length
    const pct = Math.round((submitted / Math.max(1, total)) * 100)
    return { total, submitted, pct }
  }
  const getMyAckFor = (a) => {
    return acks.find(x => x.assignmentId === a.id && (x.userEmail === user.email || (x.groupName && myGroups.some(g => g.name === x.groupName))))
  }
  
  const getStatus = (a) => {
    if (isProfessor) {
      const c = getCoveredCount(a.id)
      if (c.submitted === 0) return 'Pending'
      return 'Acknowledged'
    }
    const myAck = acks.find(x => x.assignmentId === a.id && (x.userEmail === user.email || (x.groupName && myGroups.some(g => g.name === x.groupName))))
    if (myAck) return 'Acknowledged'
    if (new Date(a.deadline) < new Date()) return 'Overdue'
    return 'Pending'
  }

  const filteredAssignments = assignments.filter(a => {
    if (selectedCourse && a.courseId !== selectedCourse.id) return false
    if (filterType !== 'All' && a.type !== filterType) return false
    if (filterStatus !== 'All' && getStatus(a) !== filterStatus) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const startEdit = (a) => {
    setEditingId(a.id)
    setNewA({ title: a.title, desc: a.desc, deadline: a.deadline, driveLink: a.driveLink || '', type: a.type })
    setSelectedCourse(courses.find(c => c.id === a.courseId) || selectedCourse)
    setPage('create')
  }
  const createAssignment = (e) => {
    e.preventDefault()
    if (!newA.title || !newA.deadline) return showToast('Title & Deadline required')
    if (editingId) {
      setAssignments(assignments.map(x => x.id === editingId ? { ...x, ...newA } : x))
      setEditingId(null); setNewA({ title: '', desc: '', deadline: '', driveLink: '', type: 'Individual' }); setPage('assignments'); showToast('Assignment Updated Successfully!')
    } else {
      const na = { id: 'a' + Date.now(), courseId: selectedCourse.id, ...newA, createdAt: new Date().toISOString().slice(0, 10) }
      setAssignments([na, ...assignments]); setNewA({ title: '', desc: '', deadline: '', driveLink: '', type: 'Individual' }); setPage('assignments'); showToast('Assignment Created Successfully!')
    }
  }
  const acknowledge = (assignment) => {
    if (assignment.type === 'Group') {
      const g = isLeader(assignment.id)
      if (!g) return showToast('Only Group Leader can acknowledge group submission')
      if (acks.find(a => a.assignmentId === assignment.id && a.groupName === g.name)) return showToast('Already acknowledged by your group')
      setAcks([...acks, { assignmentId: assignment.id, userEmail: user.email, userName: user.name, date: new Date().toLocaleString(), groupName: g.name }])
      showToast(`Acknowledged by ${user.name}! All members notified.`)
    } else {
      if (acks.find(a => a.assignmentId === assignment.id && a.userEmail === user.email)) return showToast('Already acknowledged')
      setAcks([...acks, { assignmentId: assignment.id, userEmail: user.email, userName: user.name, date: new Date().toLocaleString(), groupName: null }])
      showToast('Acknowledged Successfully!')
    }
  }
  const createGroup = (e) => {
    if (e) e.preventDefault()
    if (!groupName.trim()) return showToast('Group name required - pehle naam likho')
    if (!selectedCourse) return showToast('Select a course first')
    const ng = { id: 'g' + Date.now(), courseId: selectedCourse.id, name: groupName.trim(), leaderEmail: user.email, members: [user.email] }
    setGroups([...groups, ng]); setGroupName(''); setPage('groups'); showToast('Group Created! You are Leader.')
  }
  const joinGroup = (g) => {
    if (g.members.includes(user.email)) return showToast('Already in this group')
    setGroups(groups.map(x => x.id === g.id ? { ...x, members: [...x.members, user.email] } : x))
    showToast('Joined ' + g.name)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2.5 rounded-full shadow-xl font-bold text-xs sm:text-sm text-center w-[calc(100%-2rem)] max-w-md">✅ {toast}</div>}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 cursor-pointer min-w-0" onClick={goHome}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">J</div>
            <span className="font-black text-base sm:text-lg truncate">Joineazy</span>
            <span className="hidden sm:inline text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold whitespace-nowrap">{user.role}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button onClick={goHome} className="text-xs sm:text-sm font-bold text-indigo-600">Courses</button>
            <button onClick={() => setPage('groups')} className="text-xs sm:text-sm font-bold text-gray-500 whitespace-nowrap">My Groups</button>
            <span className="hidden md:inline text-sm text-gray-600 truncate max-w-[120px]">{user.name}</span>
            <button onClick={logout} className="bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {page === 'dashboard' && !selectedCourse && (
          <>
            <h1 className="text-xl sm:text-2xl font-black">Welcome, {user.name} 👋</h1>
            <p className="text-gray-500 mb-5 text-sm sm:text-base">{isProfessor ? 'Manage your courses, create assignments and track submissions.' : 'View your courses, assignments and group submissions.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(c => {
                const count = assignments.filter(a => a.courseId === c.id).length
                const submitted = assignments.filter(a => a.courseId === c.id).filter(a => {
                  if (isProfessor) return acks.some(x => x.assignmentId === a.id)
                  return !!getMyAckFor(a)
                }).length
                return (
                  <div key={c.id} onClick={() => { setSelectedCourse(c); setPage('assignments') }} className="bg-white rounded-2xl p-4 sm:p-5 shadow hover:shadow-lg cursor-pointer border">
                    <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-white font-black text-lg mb-3`}>{c.code.slice(0, 2)}</div>
                    <p className="text-xs font-bold text-gray-400">{c.code} • {c.professor}</p>
                    <h2 className="text-base sm:text-lg font-black">{c.title}</h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-bold">{count} Assignments</span>
                      <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">{submitted} Acknowledged</span>
                    </div>
                    <p className="text-indigo-600 text-sm font-bold mt-4">Open Course →</p>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {page === 'assignments' && selectedCourse && (
          <>
            <button onClick={goHome} className="text-sm font-bold text-gray-500 mb-2">← Back to Courses</button>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <div className="min-w-0"><h1 className="text-xl sm:text-2xl font-black truncate">{selectedCourse.title}</h1><p className="text-gray-500 text-sm">{selectedCourse.code}</p></div>
              {isProfessor && <button onClick={() => { setEditingId(null); setNewA({ title: '', desc: '', deadline: '', driveLink: '', type: 'Individual' }); setPage('create') }} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">+ Create Assignment</button>}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <input placeholder="🔍 Search assignment..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-xl px-4 py-2.5 flex-1 min-w-[200px] w-full sm:w-auto outline-none focus:ring-2 ring-indigo-500 bg-white" />
              {['All', 'Individual', 'Group'].map(t => (
                <button key={t} onClick={() => setFilterType(t)} className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${filterType === t ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-800'}`}>{t}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold text-gray-500 self-center">Status:</span>
              {['All', 'Pending', 'Acknowledged', 'Overdue'].map(t => (
                <button key={t} onClick={() => setFilterStatus(t)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${filterStatus === t ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-800'}`}>{t}</button>
              ))}
            </div>
            {filteredAssignments.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 sm:p-10 text-center border"><p className="text-4xl mb-2">📭</p><p className="font-bold">No assignments yet</p><p className="text-gray-500 text-sm">{isProfessor ? 'Create your first assignment.' : 'Professor will add assignments here.'}</p></div>
            ) : (
              <div className="space-y-3">
                {filteredAssignments.map(a => {
                  const myAck = acks.find(x => x.assignmentId === a.id && (x.userEmail === user.email || (x.groupName && myGroups.some(g => g.name === x.groupName))))
                   const displayAck = isProfessor ? acks.find(x => x.assignmentId === a.id) : myAck
                  const { totalStudents, totalAck, pct } = (() => {
                    const c = getCoveredCount(a.id)
                    return { totalStudents: c.total, totalAck: c.submitted, pct: c.pct }
                  })()
                  const isOverdue = !isProfessor && new Date(a.deadline) < new Date() && !myAck
                  const hasGroupForCourse = myGroups.some(g => g.courseId === a.courseId)
                  return (
                    <div key={a.id} className="bg-white rounded-2xl p-4 sm:p-5 border shadow-sm">
                      <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${a.type === 'Group' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.type}</span>
                            {displayAck ? <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">✓ Acknowledged</span> : isOverdue ? <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-bold">⚠ Overdue</span> : <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold">Pending</span>}
                          </div>
                          <h3 className="font-black text-base sm:text-lg leading-snug">{a.title}</h3>
                          <p className="text-gray-500 text-sm">{a.desc}</p>
                          <p className="text-sm mt-2 break-words">📅 Deadline: <b>{new Date(a.deadline).toLocaleString()}</b> • {a.driveLink ? <a href={a.driveLink.startsWith('http') ? a.driveLink : `https://${a.driveLink}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline hover:text-indigo-800">OneDrive Link ↗</a> : <span className="text-gray-400">No Drive Link</span>}</p>
                          {displayAck && <p className="text-green-600 text-sm font-bold mt-1 break-words">Acknowledged {isProfessor ? `by ${displayAck.userName}` : displayAck.groupName ? `by ${displayAck.userName}` : `by you`} on {displayAck.date}</p>}
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[160px]">
                          {isProfessor && <button onClick={() => startEdit(a)} className="bg-amber-100 text-amber-800 px-4 py-2.5 rounded-xl font-bold text-sm w-full">✏️ Edit Assignment</button>}
                          {!isProfessor && !myAck && <button onClick={() => { if (window.confirm('Have you submitted this assignment on OneDrive?')) acknowledge(a) }} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm w-full">Yes, I have submitted</button>}
                          {!isProfessor && a.type === 'Group' && !hasGroupForCourse && (
                            <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg">
                              <p className="text-xs text-amber-700">⚠ You are not part of any group. Create or join one to submit this assignment.</p>
                              <button onClick={() => setPage('create-group')} className="mt-2 w-full bg-amber-600 text-white py-2 rounded-lg font-bold text-xs">Create / Join Group →</button>
                            </div>
                          )}
                          <button onClick={() => { setSelectedAssignment(a); setPage('tracking') }} className="bg-gray-100 px-4 py-2.5 rounded-xl font-bold text-sm w-full">View Tracking →</button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-bold text-gray-500 gap-2"><span>Submission Progress</span><span className="whitespace-nowrap">{totalAck} / {totalStudents} submitted • {pct}%</span></div>
                        <div className="h-2.5 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: pct + '%' }}></div></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {page === 'create' && selectedCourse && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border shadow">
            <h1 className="text-xl font-black mb-1">{editingId ? 'Edit Assignment' : 'Create Assignment'}</h1>
            <p className="text-gray-500 text-sm mb-5">Course: {selectedCourse.title}</p>
            <form onSubmit={createAssignment} className="space-y-3">
              <input className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" placeholder="Assignment Title *" value={newA.title} onChange={e => setNewA({ ...newA, title: e.target.value })} />
              <textarea className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" rows="3" placeholder="Description" value={newA.desc} onChange={e => setNewA({ ...newA, desc: e.target.value })} />
              <label className="block text-sm font-bold">Deadline *<input type="datetime-local" className="w-full border rounded-xl px-4 py-3 mt-1 outline-none" value={newA.deadline} onChange={e => setNewA({ ...newA, deadline: e.target.value })} /></label>
              <input className="w-full border rounded-xl px-4 py-3 outline-none" placeholder="OneDrive / Google Drive Link" value={newA.driveLink} onChange={e => setNewA({ ...newA, driveLink: e.target.value })} />
              <div className="flex gap-2">
                {['Individual', 'Group'].map(t => (
                  <button type="button" key={t} onClick={() => setNewA({ ...newA, type: t })} className={`flex-1 py-3 rounded-xl font-bold text-sm border ${newA.type === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'}`}>{t}</button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2"><button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-[15px]">{editingId ? 'Save Changes' : 'Create Assignment'}</button><button type="button" onClick={() => { setEditingId(null); setPage('assignments') }} className="px-5 py-3 bg-gray-100 rounded-xl font-bold text-[15px] whitespace-nowrap">Cancel</button></div>
            </form>
          </div>
        )}

        {page === 'tracking' && selectedAssignment && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border shadow">
            <button onClick={() => setPage('assignments')} className="text-sm font-bold text-gray-500">← Back</button>
            <h1 className="text-lg sm:text-xl font-black mt-2 leading-snug">{selectedAssignment.title} - Tracking</h1>
            <p className="text-gray-500 text-sm mb-4 break-words">Type: {selectedAssignment.type} • Deadline: {new Date(selectedAssignment.deadline).toLocaleString()}</p>
            {(() => {
              const { total, submitted, pct } = getCoveredCount(selectedAssignment.id)
              return (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="font-black text-sm">Submission Progress</span>
                    <span className="font-black text-sm whitespace-nowrap">{submitted} / {total} Submitted • {pct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: pct + '%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-bold">{total - submitted} Pending • {submitted} Submitted</p>
                </div>
              )
            })()}
            <div className="space-y-2">
              {users.filter(u => u.role === 'student').map(s => {
                const ack = acks.find(a => a.assignmentId === selectedAssignment.id && (a.userEmail === s.email || (a.groupName && groups.find(g => g.name === a.groupName)?.members.includes(s.email))))
                return (
                  <div key={s.email} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border rounded-xl px-3 sm:px-4 py-3">
                    <div className="min-w-0"><p className="font-bold truncate">{s.name}</p><p className="text-xs text-gray-500 break-all">{s.email}</p></div>
                    {ack ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto whitespace-nowrap">✓ Submitted • {ack.date}</span> : <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto whitespace-nowrap">Not Submitted</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {page === 'groups' && (
          <>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-1">
              <h1 className="text-xl sm:text-2xl font-black">My Groups</h1>
              {!isProfessor && <button onClick={() => setPage('create-group')} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm">+ Create Group Page →</button>}
            </div>
            {!isProfessor && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border mb-4 flex flex-wrap gap-2">
                <select className="border rounded-xl px-3 py-2.5 w-full sm:w-auto" value={selectedCourse?.id || ''} onChange={e => setSelectedCourse(courses.find(c => c.id === e.target.value))}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input className="border rounded-xl px-4 py-2.5 flex-1 min-w-[180px] w-full sm:w-auto outline-none" placeholder="New Group Name - yaha naam likho" value={groupName} onChange={e => setGroupName(e.target.value)} />
                <button onClick={() => createGroup()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm w-full sm:w-auto">+ Create Group</button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {groups.map(g => {
                const course = courses.find(c => c.id === g.courseId)
                const leader = users.find(u => u.email === g.leaderEmail)
                return (
                  <div key={g.id} className="bg-white rounded-2xl p-4 sm:p-5 border shadow-sm">
                    <div className="flex justify-between gap-2"><h3 className="font-black truncate">{g.name}</h3><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0">{course?.code}</span></div>
                    <p className="text-sm text-gray-500">Course: {course?.title}</p>
                    <p className="text-sm mt-2 break-words">👑 Leader: <b>{leader?.name}</b> {g.leaderEmail === user.email && '(You)'}</p>
                    <div className="mt-2 space-y-1">{g.members.map(m => { const u = users.find(x => x.email === m); return <p key={m} className="text-sm bg-gray-50 px-3 py-1.5 rounded-lg break-words">• {u?.name} {m === g.leaderEmail && '⭐ Leader'}</p> })}</div>
                    {!isProfessor && !g.members.includes(user.email) && <button onClick={() => joinGroup(g)} className="mt-3 w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm">Join Group</button>}
                    {g.members.includes(user.email) && <p className="mt-3 text-green-600 font-bold text-sm">✓ You are in this group</p>}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {page === 'create-group' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border shadow">
            <button onClick={() => setPage('groups')} className="text-sm font-bold text-gray-500">← Back to My Groups</button>
            <h1 className="text-xl font-black mt-2 mb-1">Create New Group</h1>
            <form onSubmit={createGroup} className="space-y-3">
              <label className="block text-sm font-bold">Select Course *
                <select className="w-full border rounded-xl px-4 py-3 mt-1 outline-none" value={selectedCourse?.id || ''} onChange={e => setSelectedCourse(courses.find(c => c.id === e.target.value))}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title} ({c.code})</option>)}
                </select>
              </label>
              <label className="block text-sm font-bold">Group Name *
                <input className="w-full border rounded-xl px-4 py-3 mt-1 outline-none focus:ring-2 ring-indigo-500" placeholder="e.g. Team Beta" value={groupName} onChange={e => setGroupName(e.target.value)} />
              </label>
              <div className="flex flex-col sm:flex-row gap-2"><button className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold">Create Group</button><button type="button" onClick={() => setPage('groups')} className="px-5 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button></div>
            </form>
          </div>
        )}
      </main>
      <footer className="text-center text-xs text-gray-400 pb-6 px-3">Joineazy • Round 2 • Trupti • Mock API + localStorage</footer>
    </div>
  )
}