
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Bug, Mail, Lock, Eye, EyeOff, ArrowRight,
    ShieldCheck, LayoutDashboard, CheckCircle2
} from 'lucide-react'

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('http://localhost:8082/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok || !data.token) {
                throw new Error(data.message || 'Invalid email or password. Please register first.')
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user || {}))
            navigate('/dashboard', { replace: true })

        } catch (err) {
            setError(err.message || 'Unable to connect to server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#080c18] text-white lg:grid lg:grid-cols-2">

            {/* LEFT BRANDING */}
            <section className="relative hidden overflow-hidden border-r border-white/[0.07] bg-[#0c1222] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
                <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-[100px]" />
                <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[100px]" />

                <div className="relative flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-3 shadow-lg shadow-indigo-600/30">
                        <Bug size={26} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">BugTracker</h1>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Enterprise Platform</p>
                    </div>
                </div>

                <div className="relative max-w-xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs text-indigo-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Smart issue management
                    </div>

                    <h2 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
                        Build better.
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Ship faster.
            </span>
                    </h2>

                    <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
                        Bring your projects, issues and team collaboration together in one powerful workspace.
                    </p>

                    <div className="mt-12 space-y-5">
                        {[
                            ['Centralized issue tracking', 'Keep every bug and task organized.'],
                            ['Team collaboration', 'Stay aligned throughout development.'],
                            ['Secure workspace', 'Protected access with JWT authentication.']
                        ].map(([title, description]) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-400">
                                    <CheckCircle2 size={19} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs text-slate-600">
                    © 2026 BugTracker. Built for better development workflows.
                </p>
            </section>

            {/* RIGHT LOGIN FORM */}
            <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
                <div className="w-full max-w-md">

                    <div className="mb-10 lg:hidden">
                        <div className="mb-5 inline-flex rounded-xl bg-indigo-600 p-3">
                            <Bug size={26} />
                        </div>
                        <h1 className="text-2xl font-bold">BugTracker</h1>
                    </div>

                    <div className="mb-9">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                            Welcome back
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Sign in to your account
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Enter your credentials to access your workspace.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Email address
                            </label>
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                <Mail size={18} className="shrink-0 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-300">
                                    Password
                                </label>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                <Lock size={18} className="shrink-0 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-500 hover:text-white">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60">
                            {loading ? 'Signing in...' : 'Sign in to workspace'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-slate-600">NEW TO BUGTRACKER?</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <Link to="/register"
                          className="flex w-full items-center justify-center rounded-xl border border-white/10 py-4 text-sm font-semibold text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/5 hover:text-white">
                        Create your account
                    </Link>

                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        Secure authentication · Protected workspace
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login

