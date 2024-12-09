const Fetch_Number_Of_Comments_Middleware = async(tokenId:string,postId:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Number_Of_Comments', {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({tokenId,postId})
        })
        const data = await res.json()

        if(res.ok) {
            console.log('Fetch_Number_Of_Comments: success')
        } else {
            console.log("Fetch_Number_Of_Comments: error")
        }
        return data

    } catch(error) {
        console.log('Fetch_Number_Of_Comments: something went wrong: ',error)
        return error
    }
    
}
 
export default Fetch_Number_Of_Comments_Middleware;