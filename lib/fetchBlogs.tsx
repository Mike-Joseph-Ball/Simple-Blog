export default async function fetchBlogs() {
    const baseUrl = process.env.API_PATH || "http://localhost:3000"; //defaults to localhost of API path is not specified
    const res = await fetch(`${baseUrl}/api/posts`);
    if(!res.ok) {
        throw new Error('Failed to fetch posts')
    }
    const blogs = await res.json();
    return blogs;
}   

