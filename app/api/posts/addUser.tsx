import  userAuth  from '@/app/(marketing)/_auth/return authentication'
import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from '@/lib/db';

export default async function addUserToDB(req: NextApiRequest ,res: NextApiResponse) {
    const [user,isPending] = userAuth();
    if(user && !isPending) {
        const IdToken = await user.getIdToken() || null;
    }

    if(req.method == 'POST') {
        const {User_email} = req.body;

        if(!User_email) {
            return res.status(400).json({error: 'all fields are required'});
        }

        try {
            const db = await createConnection()
            const sql = 'INSERT INTO UserAccounts (User_email) VALUES (?)'
            const values = [User_email]
            const [response] : any = await db.execute(sql,values);

            return res.status(201).json({message: 'User added successfully.', id: (response as any).insertId})
            
        }catch(error) {
            res.status(405).end(`Method ${req.method} not allowed`);
        }
    }

    
}


