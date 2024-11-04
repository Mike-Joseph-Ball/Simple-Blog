export default async function fetchBlogs() {
    const res = await fetch(`@/api/sql_db/get`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
    });
    if(!res.ok) {
        throw new Error('Failed to fetch posts')
    }
    const blogs = await res.json();
    return blogs;
}   

