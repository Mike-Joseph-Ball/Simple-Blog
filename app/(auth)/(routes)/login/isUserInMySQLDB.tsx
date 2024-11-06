'use client'
const isUserInMySQLDB = async (user_email : string) => {

    try {
    const res =  await fetch('/api/db/get/fetchUser', {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({user_email})
    })

    const data = await res.json()
    return data;
    } catch(error) {
        console.log("Error occured in isUserInMYSQLDB: ",error)
        return error;
    }
}
 
export default isUserInMySQLDB;