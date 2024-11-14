import { getIdToken } from 'firebase/auth'

const Query_Most_Used_Blog = async (tokenId:string,user_email:string) => {
    try {
        const res = await fetch('api/db/get/Get_Most_Used_Blog', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tokenId,user_email})
        })
        const data = await res.json()
        console.log("Middle Query Most Used Blog - UserToken: ",tokenId)
        if(res.ok){
            console.log('Most Used Blog Successfully Returned')
            return data
        } else {
            console.log('Most used blog not successfully returned')
            return data
        }
        if(data && data.blog_id && data.post_count){
            //set react state variables
        }
    } catch(error) {
        console.log('something went wrong when getting most used blog:',error)
    }
}

export default Query_Most_Used_Blog;

