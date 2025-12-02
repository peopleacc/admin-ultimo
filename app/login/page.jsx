"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            // Directly query Supabase `admin` table (client-side)
            const { data: admins, error } = await supabase
                .from('admin')
                .select('*')
                .eq('email', email)
                .limit(1)

            if (error) {
                setError(error.message || 'Gagal memeriksa admin')
                setLoading(false)
                return
            }

            if (!admins || admins.length === 0) {
                setError('Admin tidak ditemukan')
                setLoading(false)
                return
            }

            const   admin = admins[0]

            // Plaintext password check (as-per current DB). Replace with hashing in production.
            if (admin.password !== password) {
                setError('Password salah')
                setLoading(false)
                return
            }

            // Create a session record in `sessions` table
            const { data: sessionData, error: sessionError } = await supabase
                .from('session')
                .insert({
                    user_id: admin.id || admin.admin_id || null,
                    email: admin.email,
                    token: Math.random().toString(36).slice(2),
                })
                .select()
                .single()

            if (sessionError) {
                setError(sessionError.message || 'Gagal membuat session')
                setLoading(false)
                return
            }

            const sessionToken = sessionData?.token
            if (sessionToken) localStorage.setItem('session', sessionToken)

            router.push('/dashboard')
        } catch (err) {
            setError(String(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>

            <form id="loginForm" onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Masuk ke Akun</h2>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Masukkan email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Masukkan password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button type="submit" disabled={loading} className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition">
                    {loading ? 'Memproses...' : 'Masuk Dashboard'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Belum punya akun?{" "}
                    <a
                        href="#"
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Daftar di sini
                    </a>
                </p>
            </form>

        </>

    )
}
