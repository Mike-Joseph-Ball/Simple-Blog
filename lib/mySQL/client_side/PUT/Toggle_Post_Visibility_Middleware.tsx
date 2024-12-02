const Toggle_Post_Visibility_Middleware = async (tokenId:string,Post_id:string) => {
    try {
        const res = await fetch('/api/db/put/Toggle_Post_Visibility', {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({tokenId,Post_id})
        })

        if(!res.ok) {
            const errorData = await res.json()
            return { success:false, message:errorData || 'Unknown error occurred trying to toggle post visibility'}
        }
        const data = await res.json()
        return data
    } catch(error) {
        console.error('Toggle visibility middleware error:',error)
        return { success: false,message:error || 'Network error occurred when trying to toggle post visibility'}

    }
}
 
export default Toggle_Post_Visibility_Middleware;