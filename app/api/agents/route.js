import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const agents = await sql`
      SELECT 
        a.id, a.name, a.email, a.phone, a.role, a.is_active, a.profile_image, a.created_at,
        COUNT(p.id)::int AS total_ads,
        COALESCE(SUM(p.views_count), 0)::int AS total_views,
        COALESCE(SUM(p.whatsapp_clicks + p.call_clicks), 0)::int AS total_clicks
      FROM agents a
      LEFT JOIN emaar_properties p ON p.agent_id = a.id
      WHERE a.role = 'AGENT'
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;
    return NextResponse.json({ success: true, agents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();
    if (!name || !email || !password || !phone) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO agents (name, email, password, phone, role)
      VALUES (${name}, ${email}, ${password}, ${phone}, 'AGENT')
      RETURNING id, name, email, phone, role, is_active
    `;

    return NextResponse.json({ success: true, agent: inserted[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Email already exists or invalid data' }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await sql`DELETE FROM agents WHERE id = ${id} AND role = 'AGENT'`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}