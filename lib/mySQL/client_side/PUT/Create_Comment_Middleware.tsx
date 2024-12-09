const Create_Comment_Middleware = async(tokenId:string,commentContents:string,postId:string) => {
    try {
        const res = await fetch('/api/db/put/Create_Comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({tokenId,commentContents,postId})
        })
    
        const data = await res.json()
        return data

    } catch(error) {
        return error
    }

}

export default Create_Comment_Middleware