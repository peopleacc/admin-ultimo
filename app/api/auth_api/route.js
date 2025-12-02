import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    console.log("📥 [LOGIN] Request masuk");

    const { email, password } = await req.json();
    console.log("📨 Body diterima:", { email, password });

    if (!email || !password) {
      console.log("❌ Email atau password kosong");
      return NextResponse.json(
        { status: "error", message: "Email & password wajib diisi" },
        { status: 400 }
      );
    }

    console.log("🔍 Mencari user di database...");
    const { data: users, error: userErr } = await supabase
      .from("m_customers")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (userErr) {
      console.log("❌ Error query database:", userErr);
      return NextResponse.json(
        { status: "error", message: "Gagal membaca database" },
        { status: 500 }
      );
    }

    console.log("🔍 Hasil pencarian:", users);

    if (!users || users.length === 0) {
      console.log("❌ User tidak ditemukan");
      return NextResponse.json({
        status: "error",
        message: "Email tidak terdaftar",
      });
    }

    const user = users[0];
    console.log("✅ User ditemukan:", user.email);

    // 🔹 Cek password
    console.log("🔐 Mengecek password...");
    if (user.password !== password) {
      console.log("❌ Password salah");
      return NextResponse.json(
        { status: "error", message: "Password salah" },
        { status: 401 }
      );
    }

    console.log("✅ Password benar");

    // 🔹 Generate session
    const sessionToken = randomUUID();
    console.log("🔑 Session token dibuat:", sessionToken);

    console.log("📝 Menyimpan session ke database...");
    const { error: insertErr } = await supabase
      .from("session")
      .insert({
        user_id: user.user_id,
        email: user.email,
        token: sessionToken,
        create_at: new Date().toISOString(),
      })
      .select();

    if (insertErr) {
      console.log("❌ Gagal insert session:", insertErr);
      return NextResponse.json(
        { status: "error", message: "Gagal membuat session" },
        { status: 500 }
      );
    }

    console.log("✅ Session berhasil disimpan!");

    // 🔹 Sukses
    console.log("🚀 Login sukses, mengirim response ke client");
    return NextResponse.json(
      {
        status: "success",
        message: "Login berhasil",
        session: sessionToken,
        user: {
          id: user.user_id,
          nama: user.nama,
          email: user.email,
          phone: user.no_hp,
          alamat: user.address,

        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("💥 API Error:", err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
