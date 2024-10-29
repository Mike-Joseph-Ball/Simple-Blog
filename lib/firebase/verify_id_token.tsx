//written followin this documentation:
//https://firebase.google.com/docs/auth/admin/verify-id-tokens#web

// idToken comes from the client app
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase-admin/app';

const app = initializeApp();


getAuth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    // ...
  })
  .catch((error) => {
    // Handle error
  });