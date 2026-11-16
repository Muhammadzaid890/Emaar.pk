import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    let leads;
    if (agentId) {
      leads = await sql`
        SELECT l.*, p.title AS property_title, p.tower_name, p.purpose
        FROM property_leads l
        LEFT JOIN emaar_properties p ON l.property_id = p.id
        WHERE l.agent_id = ${agentId}
        ORDER BY l.created_at DESC
      `;
    } else {
      leads = await sql`
        SELECT l.*, p.title AS property_title, p.tower_name, p.purpose, a.name AS agent_name
        FROM property_leads l
        LEFT JOIN emaar_properties p ON l.property_id = p.id
        LEFT JOIN agents a ON l.agent_id = a.id
        ORDER BY l.created_at DESC
      `;
    }

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}