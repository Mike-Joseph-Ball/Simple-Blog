const Fetch_Count_Explore_Items_Middleware = async (tokenId:string,exploreItem:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Count_Explore_Items', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId,exploreItem})
        })
        const data = await res.json()
        if(res.ok) {
            console.log('Fetch Count Explore Items succeeded')
        } else {
            console.log('Fetch Count Explore Items failed')
        }
        return data
    } catch(error) {
        console.log('Fetch Count Explore Items Middleware failed')
        return error
    }
}
 
export default Fetch_Count_Explore_Items_Middleware;