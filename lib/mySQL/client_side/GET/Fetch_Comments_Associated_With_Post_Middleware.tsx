const Fetch_Comments_Associated_With_Post_Middleware = async(tokenId:string,postId:string,currentPage:number) => {
    try {
        const res = await fetch('api/db/get/Fetch_Comments_Associated_With_Post', {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({tokenId,postId,currentPage})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('Fetch_Comments_Associated_With_Post_Middleware: success')
        } else {
            console.log("Fetch_Comments_Associated_With_Post_Middleware: error")
        }
        return data

    } catch(error) {
        console.log('Fetch_Comments_Associated_With_Post_Middleware: something went wrong: ',error)
        return error
    }
    
}
 
export default Fetch_Comments_Associated_With_Post_Middleware;