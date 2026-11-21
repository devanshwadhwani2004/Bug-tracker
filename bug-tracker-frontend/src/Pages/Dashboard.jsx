
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bug, LogOut, FolderKanban, CheckCircle2, Clock3,
    CircleDot, RefreshCw, LayoutDashboard, Plus,
    Search, Bell, ArrowUpRight, AlertCircle
} from 'lucide-react'
import api from '../api/axios'

function Dashboard() {
    const navigate = useNavigate()
    const [issues, setIssues] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchDashboardData = async () => {
        setLoading(true)
        setError('')
        try {
            const [issueRes, projectRes] = await Promise.all([
                api.get('/issues'),
                api.get('/projects')
            ])
            setIssues(Array.isArray(issueRes.data) ? issueRes.data : [])
            setProjects(Array.isArray(projectRes.data) ? projectRes.data : [])
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load workspace data.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
    }

    const stats = [
        { label: 'Total Issues', value: issues.length, Icon: Bug, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { label: 'To Do', value: issues.filter(i => i.status === 'TODO').length, Icon: CircleDot, color: 'text-slate-300', bg: 'bg-slate-500/10' },
        { label: 'In Progress', value: issues.filter(i => i.status === 'IN_PROGRESS').length, Icon: Clock3, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Completed', value: issues.filter(i => i.status === 'DONE').length, Icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Projects', value: projects.length, Icon: FolderKanban, color: 'text-violet-400', bg: 'bg-violet-500/10' }
    ]

    return (
        <div className="min-h-screen bg-[#080c18] text-slate-100">
            <div className="flex min-h-screen">
                <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0c1222] p-5 lg:flex">
                    <div className="flex items-center gap-3 px-2 py-3">
                        <div className="rounded-xl bg-indigo-600 p-2.5 shadow-lg shadow-indigo-600/20">
                            <Bug size={23} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">BugTracker</h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Enterprise</p>
                        </div>
                    </div>

                    <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Workspace
                    </p>

                    <button className="flex items-center gap-3 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-300">
                        <LayoutDashboard size={18} /> Overview
                    </button>

                    <button onClick={() => navigate('/projects')}
                            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                        <FolderKanban size={18} /> Projects
                    </button>

                    <button onClick={() => navigate('/issues')}
                            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
                        <Bug size={18} /> Issues
                    </button>

                    <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                        <p className="text-sm font-semibold">Workspace secured</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">Your session is protected with JWT authentication.</p>
                        <button onClick={logout} className="mt-4 flex w-full items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/20">
                            <LogOut size={16} /> Sign out
                        </button>
                    </div>
                </aside>

                <main className="min-w-0 flex-1">
                    <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080c18]/90 px-5 backdrop-blur-xl sm:px-8">
                        <div>
                            <p className="text-xs text-slate-500">Workspace / Overview</p>
                            <h2 className="mt-1 text-lg font-semibold">Dashboard</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={fetchDashboardData} disabled={loading}
                                    className="rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white">
                                <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                            </button>
                            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300 sm:flex">
                                BT
                            </div>
                            <button onClick={logout} className="rounded-xl border border-white/10 p-2.5 text-slate-400 hover:text-red-400 lg:hidden">
                                <LogOut size={17} />
                            </button>
                        </div>
                    </header>

                    <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
                        <section className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-950 via-[#151a36] to-[#10182a] p-7 sm:p-9">
                            <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
                            <div className="relative">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Your workspace</p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you!</h2>
                                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                                    Track issues, manage projects and keep your development workflow moving.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button onClick={() => navigate('/issues')}
                                            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400">
                                        <Plus size={17} /> Manage Issues
                                    </button>
                                    <button onClick={() => navigate('/projects')}
                                            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">
                                        View Projects <ArrowUpRight className="ml-1 inline" size={16} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className="mt-9">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Workspace Overview</h3>
                                    <p className="mt-1 text-sm text-slate-500">Your project activity at a glance</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                                {stats.map(({ label, value, Icon, color, bg }) => (
                                    <div key={label} className="group rounded-2xl border border-white/[0.08] bg-[#11182a] p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-400/30">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">{label}</span>
                                            <div className={`rounded-xl p-2.5 ${bg}`}>
                                                <Icon size={19} className={color} />
                                            </div>
                                        </div>
                                        <p className="mt-5 text-3xl font-bold tracking-tight">
                                            {loading ? '—' : value}
                                        </p>
                                        <p className="mt-2 text-xs text-slate-500">Live workspace data</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {error && (
                            <div role="alert" className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        <section className="mt-9 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11182a]">
                                <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                                    <div>
                                        <h3 className="font-semibold">Recent Issues</h3>
                                        <p className="mt-1 text-xs text-slate-500">Latest reported bugs and tasks</p>
                                    </div>
                                    <button onClick={() => navigate('/issues')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                                        View all <ArrowUpRight className="ml-1 inline" size={14} />
                                    </button>
                                </div>

                                {loading ? (
                                    <p className="p-8 text-center text-sm text-slate-500">Loading issues...</p>
                                ) : issues.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <Bug className="mx-auto text-slate-600" size={30} />
                                        <p className="mt-3 text-sm font-medium text-slate-300">No issues yet</p>
                                        <p className="mt-1 text-xs text-slate-500">Your reported issues will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/[0.06]">
                                        {issues.slice(0, 6).map(issue => (
                                            <div key={issue.id} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.025]">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{issue.title}</p>
                                                    <p className="mt-1 text-xs text-slate-500">{issue.issueKey} · {issue.projectName}</p>
                                                </div>
                                                <span className="shrink-0 rounded-lg border border-indigo-400/15 bg-indigo-400/10 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-300">
                          {issue.status?.replace('_', ' ') || 'UNKNOWN'}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/[0.08] bg-[#11182a]">
                                <div className="border-b border-white/[0.07] p-5">
                                    <h3 className="font-semibold">Your Projects</h3>
                                    <p className="mt-1 text-xs text-slate-500">Projects in your workspace</p>
                                </div>
                                {loading ? (
                                    <p className="p-8 text-center text-sm text-slate-500">Loading projects...</p>
                                ) : projects.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <FolderKanban className="mx-auto text-slate-600" size={30} />
                                        <p className="mt-3 text-sm text-slate-400">No projects found.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-white/[0.06]">
                                        {projects.slice(0, 5).map(project => (
                                            <div key={project.id} className="flex items-center gap-3 p-5">
                                                <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-400">
                                                    <FolderKanban size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{project.name}</p>
                                                    <p className="mt-1 text-xs text-slate-500">{project.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard

