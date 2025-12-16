import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from 'next/server';


// GET - Fetch semua fasum
export async function GET() {
    const { data, error } = await supabase
        .from('api_fasum')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform ke format yang diharapkan Android
    const transformed = data.map(item => ({
        id: item.id,
        name: item.name,
        phone: item.phone,
        address: {
            street: item.address,
            city: item.city,
            geo: {
                lat: item.lat,
                lng: item.ing // Note: typo di schema (ing bukan lng)
            }
        }
    }));

    return NextResponse.json(transformed);
}
// POST - Create fasum baru
export async function POST(request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from('api_fasum')
        .insert({
            name: body.name,
            phone: body.phone,
            address: body.address,
            city: body.city,
            lat: body.lat,
            ing: body.lng // Note: typo di schema
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }

    return NextResponse.json({
        success: true,
        message: 'Data berhasil ditambahkan',
        data: { id: data.id, name: data.name }
    });
}