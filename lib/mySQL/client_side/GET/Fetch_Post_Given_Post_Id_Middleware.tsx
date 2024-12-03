const Fetch_Post_Given_Post_Id_Middleware = async(tokenId:string,postId:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Post_Given_Post_Id', {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({tokenId,postId})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('FETCH_POST_GIVEN_ID_MIDDLEWARE: Blog details successfully fetched')
        } else {
            console.log("FETCH_POST_GIVEN_ID_MIDDLEWARE: Blog details not successfully fetched")
        }
        return data

    } catch(error) {
        console.log('FETCH_POST_GIVEN_ID_MIDDLEWARE: something went wrong in retrieving blog details: ',error)
        return error
    }
    
}
 
export default Fetch_Post_Given_Post_Id_Middleware;