
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bug, FolderKanban, Plus, Search, Pencil, Trash2,
    X, LogOut, RefreshCw, ArrowLeft, CheckCircle2
} from 'lucide-react'
import api from '../api/axios'

function Projects() {
    const navigate = useNavigate()

    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [saving, setSaving] = useState(false)

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'ACTIVE'
    })

    const loadProjects = async () => {
        setLoading(true)
        setError('')

        try {
            const response = await api.get('/projects')
            setProjects(Array.isArray(response.data) ? response.data : [])
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load projects.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])

    const openCreateModal = () => {
        setEditingId(null)
        setForm({ name: '', description: '', status: 'ACTIVE' })
        setError('')
        setShowModal(true)
    }

    const openEditModal = (project) => {
        setEditingId(project.id)
        setForm({
            name: project.name || '',
            description: project.description || '',
            status: project.status || 'ACTIVE'
        })
        setError('')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                status: form.status,
                managerId: user.id || user.userId || 1
            }

            if (editingId) {
                await api.put(`/projects/${editingId}`, payload)
            } else {
                await api.post('/projects', payload)
            }

            setShowModal(false)
            await loadProjects()
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to save project. Check the backend response.'
            )
        } finally {
            setSaving(false)
        }
    }

    const deleteProject = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this project?'
        )

        if (!confirmed) return

        try {
            await api.delete(`/projects/${id}`)
            await loadProjects()
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to delete project.')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
    }

    const filteredProjects = projects.filter(project =>
        `${project.name} ${project.description || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const statusStyle = {
        ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        COMPLETED: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        ON_HOLD: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
                            Workspace Management
                        </p>
                        <h2 className="mt-2 text-3xl font-bold">Projects</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Create, organize and manage your development projects.
                        </p>
                    </div>

                    <button onClick={openCreateModal}
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500">
                        <Plus size={18} /> New Project
                    </button>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-[#11182a] p-5">
                        <FolderKanban className="text-indigo-400" size={22} />
                        <p className="mt-4 text-sm text-slate-400">Total Projects</p>
                        <p className="mt-1 text-3xl font-bold">{loading ? '—' : projects.length}</p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#11182a] p-5">
                        <CheckCircle2 className="text-emerald-400" size={22} />
                        <p className="mt-4 text-sm text-slate-400">Active Projects</p>
                        <p className="mt-1 text-3xl font-bold">
                            {loading ? '—' : projects.filter(p => p.status === 'ACTIVE').length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#11182a] p-5">
                        <CheckCircle2 className="text-violet-400" size={22} />
                        <p className="mt-4 text-sm text-slate-400">Completed Projects</p>
                        <p className="mt-1 text-3xl font-bold">
                            {loading ? '—' : projects.filter(p => p.status === 'COMPLETED').length}
                        </p>
                    </div>
                </div>

                <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#11182a]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] p-5">
                        <div>
                            <h3 className="font-semibold">All Projects</h3>
                            <p className="mt-1 text-xs text-slate-500">Manage your workspace projects</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#080c18] px-3">
                            <Search size={17} className="text-slate-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search projects..."
                                className="w-48 bg-transparent py-3 text-sm outline-none placeholder:text-slate-600"
                            />
                        </div>

                        <button onClick={loadProjects} disabled={loading}
                                className="rounded-xl border border-white/10 p-3 text-slate-400 hover:text-white">
                            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    {error && (
                        <div role="alert" className="m-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <p className="p-12 text-center text-sm text-slate-500">Loading projects...</p>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-12 text-center">
                            <FolderKanban className="mx-auto text-slate-600" size={36} />
                            <p className="mt-4 font-semibold">No projects found</p>
                            <p className="mt-2 text-sm text-slate-500">
                                Create your first project to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProjects.map(project => (
                                <div key={project.id}
                                     className="rounded-2xl border border-white/[0.08] bg-[#0c1222] p-5 transition hover:border-indigo-400/30">

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                                            <FolderKanban size={22} />
                                        </div>

                                        <span className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold ${statusStyle[project.status] || statusStyle.ACTIVE}`}>
                      {project.status?.replace('_', ' ') || 'ACTIVE'}
                    </span>
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold">{project.name}</h3>
                                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                                        {project.description || 'No description provided.'}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                                        <span className="text-xs text-slate-600">Project #{project.id}</span>

                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(project)}
                                                    title="Edit project"
                                                    className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-indigo-400/30 hover:text-indigo-400">
                                                <Pencil size={15} />
                                            </button>

                                            <button onClick={() => deleteProject(project.id)}
                                                    title="Delete project"
                                                    className="rounded-lg border border-white/10 p-2 text-slate-400 hover:border-red-400/30 hover:text-red-400">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                    <div className="my-auto w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl sm:p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {editingId ? 'Edit Project' : 'Create New Project'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Enter your project details below.
                                </p>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                    className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Project Name</label>
                                <input
                                    required
                                    maxLength={100}
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Enter project name"
                                    className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Description</label>
                                <textarea
                                    rows={4}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe your project..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Project Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 text-sm outline-none focus:border-indigo-500">
                                    <option value="ACTIVE">Active</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="ON_HOLD">On Hold</option>
                                </select>
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
                                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Projects
