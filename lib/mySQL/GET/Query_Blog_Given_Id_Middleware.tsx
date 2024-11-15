const Query_Blog_Given_Id_Middlware = async(tokenId:string,user_email:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Blog_Given_Id', {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({tokenId,user_email})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('QUERY_BLOG_GIVEN_ID_MIDDLEWARE: Blog details successfully fetched')
        } else {
            console.log("QUERY_BLOG_GIVEN_ID_MIDDLEWARE: Blog details not successfully fetched")
        }
        return data

    } catch(error) {
        console.log('QUERY_BLOG_GIVEN_ID_MIDDLEWARE: something went wrong in retrieving blog details: ',error)
        return error
    }
    
}
 
export default Query_Blog_Given_Id_Middlware;