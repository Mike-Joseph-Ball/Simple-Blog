const admin = require("firebase-admin");
const serviceAccount = require('@/simple-blog-admin-sdk-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const auth = admin.auth();

const Get_All_Users = async() => {
    const usersArray:any[] = [];

    let nextPageToken; // Starts without a token for the first page
  
    do {
        const result:any = await admin.auth().listUsers(1000, nextPageToken); // Fetches up to 1000 users per call
        result.users.forEach((user: any) => {
            usersArray.push({
              displayName: user.displayName || "No Name", // Default if displayName is null
              email: user.email || "No Email", // Default if email is null
            });
          });
        nextPageToken = result.pageToken; // Sets the token for the next page
    } while (nextPageToken);

  return usersArray;
}
 
export default Get_All_Users;