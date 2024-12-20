import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Use your Firebase service account
    });
}

export const getUserDisplayNameByEmail = async (email: string): Promise<string | null> => {
    try {
        // Fetch the user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        return userRecord.displayName || null; // Return displayName if it exists, otherwise null
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};