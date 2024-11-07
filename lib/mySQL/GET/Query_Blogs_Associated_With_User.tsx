const Query_Blogs_Associated_With_User = async (user_tokenId:string,user_email:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Blogs_For_User', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_tokenId,user_email})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('Blog successfully added to mySQL DB')
        } else {
            console.log('Blog not successfully added to mySQL DB')
        }
        return data
    } catch(error) {
        console.log('something went wrong in the middleware blog retrieval')
        return error
    }
}
 
export default Query_Blogs_Associated_With_User;