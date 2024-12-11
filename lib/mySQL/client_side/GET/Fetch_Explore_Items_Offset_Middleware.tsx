const Fetch_Explore_Items_Offset_Middleware = async (tokenId:string,exploreItem:string,currentPage:number,searchQuery:string) => {
    try {
        const res = await fetch('api/db/get/Fetch_Explore_Items_Offset', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId,exploreItem,currentPage,searchQuery})
        })
        const data = await res.json()
        if(res.ok) {
            console.log('Fetch Explore Items Offset succeeded')
        } else {
            console.log('Fetch Explore Items Offset failed')
        }
        return data
    } catch(error) {
        console.log('Fetch Explore Items Offset Middleware failed')
        return error
    }
}
 
export default Fetch_Explore_Items_Offset_Middleware;