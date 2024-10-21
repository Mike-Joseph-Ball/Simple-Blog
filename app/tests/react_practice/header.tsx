const Header = (props : any) => {
    return (<h1>{props.title}</h1>);
}

export default Header;


/*
Could have also been written like this:

const Header = ({title} : {title: string}) => {
    return (<h1>{title}</h1>);
}

export default Header;


*/