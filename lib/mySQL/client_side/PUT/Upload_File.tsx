const Upload_File_Client = async () => {
    try {
        const res = await fetch('api/db/put/Create_Blog' , {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({})
        })
        const data = await res.json()
        //res.ok indicates that the status code is in between 200-299, signifying a successful response
        if(res.ok) {
            console.log('Blog successfully added to mySQL DB')
        } else {
            console.log('Blog not successfully added to mySQL DB')
        }
        return data;
    } catch (error) {
        console.log('something went wrong in middleware blog creation client component')
        return error
    }
}
 
export default Upload_File_Client;