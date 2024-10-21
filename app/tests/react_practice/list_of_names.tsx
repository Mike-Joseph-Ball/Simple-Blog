const NameList = () => {
    const nameList = ["Grace Hopper", "Ada Lovelace", "Margaret Hamilton"]
    return ( <div>
        <ul>
            {nameList.map((fullname) => (
                <li key={fullname}>{fullname}</li>
            ))}
        </ul>
    </div> );
}

const handleClick = () => {
    console.log("Increment Like Counter!")
}

export { handleClick };
 
export default NameList;