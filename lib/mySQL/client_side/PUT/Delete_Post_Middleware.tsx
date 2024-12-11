const Delete_Post_Middleware = async(tokenId:string,postId:string) => {
    const res = await fetch('/api/db/put/Delete_Post', {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({tokenId,postId})
    })

    const data = await res.json()
    return data
}
 
export default Delete_Post_Middleware;