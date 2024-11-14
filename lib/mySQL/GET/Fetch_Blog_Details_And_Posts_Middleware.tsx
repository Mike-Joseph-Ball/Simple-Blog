const Fetch_Blog_Details_And_Posts_Middleware = async (user_tokenId:string,blog_id:Number) => {

    try {
        const res = await fetch('api/db/get/Fetch_Blog_Details_And_Posts', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_tokenId,blog_id})
        })
        const data = await res.json()
    
        if(res.ok) {
            console.log('Blog Details successfully fetched')
        } else {
            console.log('Blog Details not successfully fetched')
        }
        return data
    } catch (error) {
        console.log('something went wrong with the middleware blog details retriever')
        return error
    }

}
 
export default Fetch_Blog_Details_And_Posts_Middleware;