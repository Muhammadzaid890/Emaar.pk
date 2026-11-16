import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

async function ensureColumns(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS emaar_properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      tower_name VARCHAR(100) NOT NULL,
      unit_type VARCHAR(100) NOT NULL,
      purpose VARCHAR(20) DEFAULT 'SALE',
      price_pkr BIGINT NOT NULL,
      area_sqft INT NOT NULL,
      floor_number INT DEFAULT 1,
      bedrooms INT DEFAULT 2,
      bathrooms INT DEFAULT 2,
      is_furnished BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT TRUE,
      is_deleted BOOLEAN DEFAULT FALSE,
      image_url TEXT,
      video_url TEXT,
      status VARCHAR(50) DEFAULT 'Available',
      agent_id INT,
      views_count INT DEFAULT 0,
      whatsapp_clicks INT DEFAULT 0,
      call_clicks INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Ensure all required columns exist
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS description TEXT;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS down_payment_pkr BIGINT DEFAULT 0;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS monthly_installment_pkr BIGINT DEFAULT 0;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS installment_duration VARCHAR(100);`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS video_url TEXT;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT TRUE;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS agent_id INT;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS whatsapp_clicks INT DEFAULT 0;`;
  await sql`ALTER TABLE emaar_properties ADD COLUMN IF NOT EXISTS call_clicks INT DEFAULT 0;`;
}

export async function GET(request) {
  try {
    const sql = getDb();
    await ensureColumns(sql);

    const { searchParams } = new URL(request.url);
    const tower = searchParams.get('tower');
    const unitType = searchParams.get('unit');
    const query = searchParams.get('query');
    const intent = searchParams.get('intent');
    const featured = searchParams.get('featured');
    const agentId = searchParams.get('agentId');
    const showDeleted = searchParams.get('deleted') === 'true';

    const properties = await sql`
      SELECT p.*, a.name AS agent_name, a.phone AS agent_phone, a.profile_image AS agent_image
      FROM emaar_properties p
      LEFT JOIN agents a ON p.agent_id = a.id
      WHERE p.is_deleted = ${showDeleted}
        AND (${tower ? tower : null}::text IS NULL OR p.tower_name ILIKE ${'%' + (tower || '') + '%'})
        AND (${unitType ? unitType : null}::text IS NULL OR p.unit_type ILIKE ${'%' + (unitType || '') + '%'})
        AND (${intent ? intent : null}::text IS NULL OR p.purpose = ${intent || 'SALE'})
        AND (${featured ? featured === 'true' : null}::boolean IS NULL OR p.is_featured = true)
        AND (${agentId ? Number(agentId) : null}::int IS NULL OR p.agent_id = ${agentId ? Number(agentId) : null})
        AND (${query ? query : null}::text IS NULL OR (
          p.title ILIKE ${'%' + (query || '') + '%'} 
          OR p.tower_name ILIKE ${'%' + (query || '') + '%'}
        ))
      ORDER BY p.id DESC;
    `;

    return NextResponse.json({ success: true, count: properties.length, properties });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sql = getDb();
    await ensureColumns(sql);

    const body = await request.json();

    const {
      title,
      description = '',
      tower_name,
      unit_type,
      purpose = 'SALE',
      price_pkr,
      down_payment = 0,
      down_payment_pkr = 0,
      monthly_installment = 0,
      monthly_installment_pkr = 0,
      tenure = '',
      installment_duration = '',
      area_sqft,
      floor_number = 1,
      bedrooms = 2,
      bathrooms = 2,
      is_furnished = false,
      is_featured = true,
      image_url = '',
      images = [],
      video_url = '',
      status = 'Available',
      agent_id = null
    } = body;

    const primaryImage = image_url || (images.length > 0 ? images[0] : '');
    const finalDownPayment = Number(down_payment_pkr || down_payment) || 0;
    const finalMonthly = Number(monthly_installment_pkr || monthly_installment) || 0;
    const finalTenure = installment_duration || tenure || '';
    const finalAgentId = agent_id ? Number(agent_id) : null;

    const inserted = await sql`
      INSERT INTO emaar_properties (
        title, description, tower_name, unit_type, purpose, price_pkr, 
        down_payment_pkr, monthly_installment_pkr, installment_duration,
        area_sqft, floor_number, bedrooms, bathrooms, 
        is_furnished, is_featured, is_deleted, 
        image_url, images, video_url, status, agent_id
      ) VALUES (
        ${title}, ${description}, ${tower_name}, ${unit_type}, ${purpose}, ${price_pkr},
        ${finalDownPayment}, ${finalMonthly}, ${finalTenure},
        ${area_sqft}, ${floor_number}, ${bedrooms}, ${bathrooms},
        ${is_furnished}, ${is_featured}, false,
        ${primaryImage}, ${images}, ${video_url}, ${status}, ${finalAgentId}
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error('Insert Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const sql = getDb();
    await ensureColumns(sql);

    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }

    if (action === 'toggle_featured') {
      const updated = await sql`
        UPDATE emaar_properties 
        SET is_featured = NOT is_featured 
        WHERE id = ${id} 
        RETURNING *;
      `;
      return NextResponse.json({ success: true, data: updated[0] });
    }

    if (action === 'toggle_delete') {
      const updated = await sql`
        UPDATE emaar_properties 
        SET is_deleted = NOT is_deleted 
        WHERE id = ${id} 
        RETURNING *;
      `;
      return NextResponse.json({ success: true, data: updated[0] });
    }

    const updated = await sql`
      UPDATE emaar_properties
      SET 
        title = COALESCE(${updates.title}, title),
        description = COALESCE(${updates.description}, description),
        tower_name = COALESCE(${updates.tower_name}, tower_name),
        unit_type = COALESCE(${updates.unit_type}, unit_type),
        purpose = COALESCE(${updates.purpose}, purpose),
        price_pkr = COALESCE(${updates.price_pkr}, price_pkr),
        down_payment_pkr = COALESCE(${updates.down_payment_pkr}, down_payment_pkr),
        monthly_installment_pkr = COALESCE(${updates.monthly_installment_pkr}, monthly_installment_pkr),
        installment_duration = COALESCE(${updates.installment_duration}, installment_duration),
        area_sqft = COALESCE(${updates.area_sqft}, area_sqft),
        floor_number = COALESCE(${updates.floor_number}, floor_number),
        bedrooms = COALESCE(${updates.bedrooms}, bedrooms),
        bathrooms = COALESCE(${updates.bathrooms}, bathrooms),
        image_url = COALESCE(${updates.image_url}, image_url),
        images = COALESCE(${updates.images}, images),
        video_url = COALESCE(${updates.video_url}, video_url),
        status = COALESCE(${updates.status}, status),
        is_featured = COALESCE(${updates.is_featured}, is_featured)
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    await sql`DELETE FROM emaar_properties WHERE id = ${id};`;
    return NextResponse.json({ success: true, message: 'Property permanently deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}