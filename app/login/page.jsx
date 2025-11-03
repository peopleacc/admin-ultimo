import Link from "next/link"

export default function LoginPage() {
    return (
        <>

            <form id="loginForm" className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md space-y-5">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Masuk ke Akun</h2>


                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        required
                        placeholder="Masukkan username"
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
                        required
                        placeholder="Masukkan password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <Link
                    href="/dashboard"
                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                >
                    Masuk Dashboard
                </Link>



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

    );
}
