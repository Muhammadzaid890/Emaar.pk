import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function PUT(request) {
  try {
    const { id, name, phone, password, profile_image } = await request.json();

    if (!id || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    let updated;
    if (password && password.trim().length > 0) {
      updated = await sql`
        UPDATE agents
        SET name = ${name}, phone = ${phone}, password = ${password.trim()}, profile_image = ${profile_image || null}
        WHERE id = ${id}
        RETURNING id, name, email, phone, role, is_active, profile_image
      `;
    } else {
      updated = await sql`
        UPDATE agents
        SET name = ${name}, phone = ${phone}, profile_image = ${profile_image || null}
        WHERE id = ${id}
        RETURNING id, name, email, phone, role, is_active, profile_image
      `;
    }

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}