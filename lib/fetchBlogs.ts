export default async function fetchBlogs() {
    const res = await fetch('/home/mike/Documents/notion-clone/app/api/posts');
    const blogs = await res.json();
    return blogs;
}

