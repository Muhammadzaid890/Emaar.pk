import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function POST(request) {
  try {
    const { propertyId, action, clientName, clientPhone } = await request.json();

    if (action === 'VIEW') {
      await sql`UPDATE properties SET views_count = COALESCE(views_count, 0) + 1 WHERE id = ${propertyId}`;
    } else if (action === 'WHATSAPP') {
      await sql`UPDATE properties SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1 WHERE id = ${propertyId}`;
      const prop = await sql`SELECT agent_id FROM properties WHERE id = ${propertyId}`;
      await sql`
        INSERT INTO property_leads (property_id, agent_id, client_name, client_phone, lead_type)
        VALUES (${propertyId}, ${prop[0]?.agent_id || null}, ${clientName || 'WhatsApp Visitor'}, ${clientPhone || 'Direct Click'}, 'WHATSAPP')
      `;
    } else if (action === 'CALL') {
      await sql`UPDATE properties SET call_clicks = COALESCE(call_clicks, 0) + 1 WHERE id = ${propertyId}`;
      const prop = await sql`SELECT agent_id FROM properties WHERE id = ${propertyId}`;
      await sql`
        INSERT INTO property_leads (property_id, agent_id, client_name, client_phone, lead_type)
        VALUES (${propertyId}, ${prop[0]?.agent_id || null}, ${clientName || 'Call Visitor'}, ${clientPhone || 'Direct Call'}, 'CALL')
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}