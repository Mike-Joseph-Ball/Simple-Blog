import { createConnection } from '@/lib/db.ts'
import { NextResponse } from 'next/server' //Used to send HTTP responses 

export async function GET() {
    try {
        const db = await createConnection()
        const sql = "SELECT * FROM Blogs"
        const [blogs] = await db.query(sql)
        return NextResponse.json(blogs)
        
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            return NextResponse.json({ error: error.message });
        }
        console.log('Unexpected error', error);
        return NextResponse.json({ error: 'An unexpected error occurred' });
    }
}

