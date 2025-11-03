import { supabase } from "@/lib/supabaseClient"

export default async function DashboardPage() {
  const { data: users, error } = await supabase.from("User").select("*")

  console.log("Data dari Supabase:", users)
  console.log("Error:", error)

  if (error) return <div>Error: {error.message}</div>
  if (!users?.length) return <div>Tidak ada data user.</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daftar User</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  )
}
