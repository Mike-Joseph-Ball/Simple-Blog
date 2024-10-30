import { createConnection } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function addBlogHandler(req: NextApiRequest ,res: NextApiResponse) {
    if(req.method == 'POST') {
        const { Blog_title,User_email,} = req.body

        if(!Blog_title || !User_email) {
            return res.status(400).json({error: 'All fields are required'})
        }

        try {
            const db = await createConnection();
            const sql = "INSERT INTO Blogs (Blog_title,User_email) VALUES (?, ?, ?)"
            const values = [Blog_title,User_email]
            const [response] : any = await db.execute(sql,values);

            return res.status(201).json({message: 'Blog added successfully', id: (response as any).insertId})
        } catch(error) {
            console.error(error)
            return res.status(500).json({ error: 'database error'});
        
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} not allowed`)
    }
}