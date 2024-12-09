const Does_User_Own_Blog_Middleware = async(tokenId:string,blogId:string) => {
    try {
        const res = await fetch('api/db/get/Does_User_Own_Blog', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId,blogId})
        })
        const data = await res.json()

        return data
    } catch(error) {
        console.log('something went wrong in Does_User_Own_Blog_Middleware: ',error)
        return error
    }
}
 
export default Does_User_Own_Blog_Middleware;