const Query_Blogs_Associated_With_User = async (user_tokenId:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Blogs_For_User', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_tokenId})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('Blogs associated with user successfully queried')
        } else {
            console.log('Blogs associated with user not successfully queried')
        }
        return data
    } catch(error) {
        console.log('something went wrong in the middleware blog retrieval')
        return error
    }
}
 
export default Query_Blogs_Associated_With_User;