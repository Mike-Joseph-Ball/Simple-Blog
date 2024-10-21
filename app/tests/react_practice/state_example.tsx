import React from "react";

const DisplayLikes = () => {

    const [Likes, setLikes] = React.useState(0);

    function handleLike() {
        setLikes(Likes + 1)
    }

    return ( <div>
        <button onClick={handleLike}>{Likes}</button>
    </div> );
}
 
export default DisplayLikes;