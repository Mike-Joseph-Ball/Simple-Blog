import mysql from 'mysql2/promise'


let connection: mysql.Connection | null = null;

export const createConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST, //Next.js allows you to access your environment variables like this as long as they are in the root directory
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
        });
    }
    return connection;
}

export const createPool = mysql.createPool({
    host: process.env.DATABASE_HOST, //Next.js allows you to access your environment variables like this as long as they are in the root directory
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 30, // Limit of concurrent connections
    queueLimit: 0
  });