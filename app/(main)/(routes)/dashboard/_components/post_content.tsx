type ChildComponentProps = {
    postData: Array<any>;
};
const PostContent: React.FC<ChildComponentProps> = ({postData}) => {
    return ( <div className=" flex flex-col p-6 w-full h-full justify-start items-center bg-red-500 ml-auto">
        Blog Title
    </div> );
}
 
export default PostContent;