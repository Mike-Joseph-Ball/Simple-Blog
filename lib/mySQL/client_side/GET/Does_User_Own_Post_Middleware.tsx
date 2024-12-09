const Does_User_Own_Post_Middleware = async(tokenId:string,postId:string) => {
    try {
        const res = await fetch('api/db/get/Does_User_Own_Post', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId,postId})
        })
        const data = await res.json()

        return data
    } catch(error) {
        console.log('something went wrong in Does_User_Own_Post_Middleware: ',error)
        return error
    }
}
 
export default Does_User_Own_Post_Middleware;