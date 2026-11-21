
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bug, Plus, Search, RefreshCw, Pencil, Trash2,
    X, LogOut, ArrowLeft, AlertCircle, CalendarDays
} from 'lucide-react'
import api from '../api/axios'

const emptyForm = {
    title: '',
    description: '',
    projectId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: ''
}

function Issues() {
    const navigate = useNavigate()

    const [issues, setIssues] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [priorityFilter, setPriorityFilter] = useState('ALL')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const loadData = async () => {
        setLoading(true)
        setError('')

        try {
            const [issueResponse, projectResponse] = await Promise.all([
                api.get('/issues'),
                api.get('/projects')
            ])

            setIssues(Array.isArray(issueResponse.data) ? issueResponse.data : [])
            setProjects(Array.isArray(projectResponse.data) ? projectResponse.data : [])
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to load issues or projects. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const openCreate = () => {
        setEditingId(null)
        setForm({
            ...emptyForm,
            projectId: projects.length ? String(projects[0].id) : ''
        })
        setError('')
        setShowModal(true)
    }

    const openEdit = (issue) => {
        setEditingId(issue.id)
        setForm({
            title: issue.title || '',
            description: issue.description || '',
            projectId: String(issue.projectId || ''),
            priority: issue.priority || 'MEDIUM',
            status: issue.status || 'TODO',
            dueDate: issue.dueDate || ''
        })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.projectId) {
            setError('Please select a project first.')
            return
        }

        setSaving(true)

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            projectId: Number(form.projectId),
            priority: form.priority,
            status: form.status,
            dueDate: form.dueDate || null
        }

        try {
            if (editingId) {
                await api.put(`/issues/${editingId}`, payload)
            } else {
                await api.post('/issues', payload)
            }

            setShowModal(false)
            await loadData()
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to save issue. Please check the backend response.'
            )
        } finally {
            setSaving(false)
        }
    }

    const deleteIssue = async (id) => {
        if (!window.confirm('Are you sure you want to delete this issue?')) {
            return
        }

        try {
            await api.delete(`/issues/${id}`)
            await loadData()
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete issue.')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
    }

    const filteredIssues = issues.filter(issue => {
        const matchesSearch =
            `${issue.issueKey || ''} ${issue.title || ''} ${issue.projectName || ''}`
                .toLowerCase()
                .includes(search.toLowerCase())

        const matchesStatus =
            statusFilter === 'ALL' || issue.status === statusFilter

        const matchesPriority =
            priorityFilter === 'ALL' || issue.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
    })

    const statusColors = {
        TODO: 'border-slate-500/20 bg-slate-500/10 text-slate-300',
        IN_PROGRESS: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
        DONE: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
    }

    const priorityColors = {
        LOW: 'text-slate-400',
        MEDIUM: 'text-blue-400',
        HIGH: 'text-orange-400',
        CRITICAL: 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-[#080c18] text-white">
            <header className="flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#0c1222] px-5 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-2.5">
                        <Bug size={22} />
                    </div>
                    <div>
                        <h1 className="font-bold">BugTracker</h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Enterprise</p>
                    </div>
                </div>

                <button onClick={logout}
                        className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400">
                    <LogOut size={17} /> Logout
                </button>
            </header>

            <main className="mx-auto max-w-7xl p-5 sm:p-8">
                <button onClick={() => navigate('/dashboard')}
                        className="mb-7 flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="flex flex-wrap items-center justify-between gap-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                            Issue Management
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">Issues</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Track, prioritize and manage development issues.
                        </p>
                    </div>

                    <button onClick={openCreate}
                            disabled={projects.length === 0}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
                        <Plus size={18} /> Create Issue
                    </button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Total Issues', value: issues.length, color: 'text-indigo-400' },
                        { label: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length, color: 'text-amber-400' },
                        { label: 'Completed', value: issues.filter(i => i.status === 'DONE').length, color: 'text-emerald-400' }
                    ].map(item => (
                        <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-[#11182a] p-5">
                            <p className="text-sm text-slate-400">{item.label}</p>
                            <p className={`mt-3 text-3xl font-bold ${item.color}`}>
                                {loading ? '—' : item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {error && (
                    <div role="alert" className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11182a]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-5">
                        <div>
                            <h3 className="font-semibold">All Issues</h3>
                            <p className="mt-1 text-xs text-slate-500">
                                {filteredIssues.length} issue(s) found
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#080c18] px-3">
                                <Search size={16} className="text-slate-500" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search issues..."
                                    className="w-36 bg-transparent py-3 text-sm outline-none sm:w-48"
                                />
                            </div>

                            <select value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="rounded-xl border border-white/10 bg-[#080c18] px-3 py-3 text-xs outline-none">
                                <option value="ALL">All Status</option>
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>

                            <select value={priorityFilter}
                                    onChange={e => setPriorityFilter(e.target.value)}
                                    className="rounded-xl border border-white/10 bg-[#080c18] px-3 py-3 text-xs outline-none">
                                <option value="ALL">All Priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>

                            <button onClick={loadData}
                                    className="rounded-xl border border-white/10 p-3 text-slate-400 hover:text-white">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="p-12 text-center text-sm text-slate-500">Loading issues...</p>
                    ) : filteredIssues.length === 0 ? (
                        <div className="p-12 text-center">
                            <Bug className="mx-auto text-slate-600" size={36} />
                            <p className="mt-4 font-semibold">No issues found</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Create an issue or change your filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="border-b border-white/[0.07] bg-white/[0.02]">
                                <tr className="text-xs text-slate-500">
                                    <th className="px-5 py-4 font-medium">Issue</th>
                                    <th className="px-5 py-4 font-medium">Project</th>
                                    <th className="px-5 py-4 font-medium">Priority</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Assignee</th>
                                    <th className="px-5 py-4 font-medium">Actions</th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-white/[0.06]">
                                {filteredIssues.map(issue => (
                                    <tr key={issue.id} className="transition hover:bg-white/[0.025]">
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-semibold">{issue.title}</p>
                                            <p className="mt-1 text-xs text-slate-500">{issue.issueKey}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-400">
                                            {issue.projectName || '—'}
                                        </td>
                                        <td className={`px-5 py-4 text-xs font-bold ${priorityColors[issue.priority] || 'text-slate-400'}`}>
                                            {issue.priority || '—'}
                                        </td>
                                        <td className="px-5 py-4">
                        <span className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold ${statusColors[issue.status] || statusColors.TODO}`}>
                          {issue.status?.replace('_', ' ') || 'UNKNOWN'}
                        </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-400">
                                            {issue.assigneeName || 'Unassigned'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => openEdit(issue)}
                                                        title="Edit issue"
                                                        className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-indigo-400">
                                                    <Pencil size={15} />
                                                </button>
                                                <button onClick={() => deleteIssue(issue.id)}
                                                        title="Delete issue"
                                                        className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-red-400">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl sm:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {editingId ? 'Edit Issue' : 'Create New Issue'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add details about the issue.
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                    className="rounded-lg p-2 text-slate-400 hover:bg-white/5">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Issue Title</label>
                                <input required maxLength={150}
                                       value={form.title}
                                       onChange={e => setForm({ ...form, title: e.target.value })}
                                       placeholder="Enter issue title"
                                       className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Description</label>
                                <textarea rows={4}
                                          value={form.description}
                                          onChange={e => setForm({ ...form, description: e.target.value })}
                                          placeholder="Describe the issue..."
                                          className="w-full resize-none rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500" />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Project</label>
                                <select required value={form.projectId}
                                        onChange={e => setForm({ ...form, projectId: e.target.value })}
                                        className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500">
                                    <option value="">Select a project</option>
                                    {projects.map(project => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">Priority</label>
                                    <select value={form.priority}
                                            onChange={e => setForm({ ...form, priority: e.target.value })}
                                            className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">Status</label>
                                    <select value={form.status}
                                            onChange={e => setForm({ ...form, status: e.target.value })}
                                            className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500">
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                                    <CalendarDays size={16} /> Due Date
                                </label>
                                <input type="date" value={form.dueDate}
                                       onChange={e => setForm({ ...form, dueDate: e.target.value })}
                                       className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm text-slate-300 outline-none focus:border-indigo-500" />
                            </div>

                            {error && (
                                <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold hover:bg-indigo-500 disabled:opacity-50">
                                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Issue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Issues
