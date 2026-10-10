import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const sql = getDb();
    // Saara purana unverified / dummy data delete
    await sql`DELETE FROM emaar_properties;`;
    return NextResponse.json({ success: true, message: 'Database cleared. Now only properties added by Admin will show.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}