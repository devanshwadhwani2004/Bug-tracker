
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Bug, User, Mail, Lock, Eye, EyeOff,
    ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react'

function Register() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password.length < 8) {
            setError('Password must contain at least 8 characters.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('http://localhost:8082/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed. Please try again.')
            }

            navigate('/login', {
                replace: true,
                state: { message: 'Account created successfully! Please sign in.' }
            })

        } catch (err) {
            setError(err.message || 'Unable to connect to server.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#080c18] text-white lg:grid lg:grid-cols-2">

            <section className="relative hidden overflow-hidden border-r border-white/[0.07] bg-[#0c1222] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
                <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-indigo-600/15 blur-[100px]" />

                <div className="relative flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-600 p-3">
                        <Bug size={26} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">BugTracker</h1>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Enterprise Platform</p>
                    </div>
                </div>

                <div className="relative max-w-xl">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                        Get started today
                    </p>
                    <h2 className="text-5xl font-bold leading-tight xl:text-6xl">
                        Your team's
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              next chapter.
            </span>
                    </h2>
                    <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
                        Create your account and bring your projects, developers and issues into one organized workspace.
                    </p>

                    <div className="mt-12 space-y-5">
                        {[
                            'Organize projects and development tasks',
                            'Track bugs across your workflow',
                            'Collaborate with your development team'
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle2 size={19} className="text-emerald-400" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative text-xs text-slate-600">
                    © 2026 BugTracker. Built for better development workflows.
                </p>
            </section>

            <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
                <div className="w-full max-w-md">

                    <div className="mb-9 lg:hidden">
                        <div className="mb-5 inline-flex rounded-xl bg-indigo-600 p-3">
                            <Bug size={26} />
                        </div>
                        <h1 className="text-2xl font-bold">BugTracker</h1>
                    </div>

                    <div className="mb-8">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                            Create your workspace
                        </p>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Create an account
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Get started with your secure development workspace.
                        </p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">

                        {[
                            { name: 'name', label: 'Full name', type: 'text', placeholder: 'Enter your full name', Icon: User },
                            { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', Icon: Mail }
                        ].map(({ name, label, type, placeholder, Icon }) => (
                            <div key={name}>
                                <label className="mb-2 block text-sm font-medium text-slate-300">{label}</label>
                                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                    <Icon size={18} className="shrink-0 text-slate-500" />
                                    <input
                                        name={name}
                                        type={type}
                                        required
                                        autoComplete={name === 'email' ? 'email' : 'name'}
                                        value={form[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                                <Lock size={18} className="shrink-0 text-slate-500" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-slate-600"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-500 hover:text-white">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Use at least 8 characters.</p>
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60">
                            {loading ? 'Creating account...' : 'Create account'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                            Sign in
                        </Link>
                    </p>

                    <div className="mt-9 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        Your account is protected
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register
