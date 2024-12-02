const Update_Post_Middleware = async (
    tokenId: string,
    Post_id: string,
    Post_title: string,
    Post_content: string
  ) => {
    try {
      const res = await fetch('/api/db/put/Update_Post', {
        method: 'PUT', // Correct method for updating resources
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tokenId, Post_id, Post_title, Post_content }),
      });
  
      if (!res.ok) {
        // Log and return the error from the server
        const errorData = await res.text(); // Use text() instead of json() to handle non-JSON responses
        console.error('Server responded with an error:', errorData);
        return { success: false, message: errorData || 'Unknown error occurred' };
      }
  
      // Safely parse JSON response
      const data = await res.json();
      console.log('Update Post Middleware - Post successfully updated:', data);
      return data;
    } catch (error) {
      console.error('Update Post Middleware - Fetch error:', error);
      return { success: false, message: error || 'Network error occurred' };
    }
  };
  
  export default Update_Post_Middleware;
  