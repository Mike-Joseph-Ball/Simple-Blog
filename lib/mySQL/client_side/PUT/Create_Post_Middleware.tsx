const Create_Post_Middleware = async (tokenId:string,blogId:string) => {
    const res = await fetch('/api/db/put/Create_Post', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({tokenId,blogId})
    });

    const data = await res.json()
    return data
}
 
export default Create_Post_Middleware;