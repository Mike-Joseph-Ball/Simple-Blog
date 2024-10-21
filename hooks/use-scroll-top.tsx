import { useState, useEffect } from "react";

//Function Description: this function sets up an event listener
//to determine whether or not the user has scrolled beyond a vertical 
//threshold. This is used in navbar.tsx to make the navbar sticky
//if this function returns true.
export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false)

    const handleScroll = () => {
        //window.scrollY is a property that returns the number of pixels
        //the document has been vertically scrolled from the top of the
        //window. It tell you how far down the user has scrolled on the webpage
        //https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
        if(window.scrollY > threshold) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }
    //useEffect is a react hook that lets you synchronize a component with an external system. 
    //In this case, we are sychronizing this component with the browser to see if the user has
    //scrolled beyond the threshold. Every time the user scrolls, this function will be called.
    useEffect(() => {
        //When this component is mounted to the DOM, it adds this event listener
        window.addEventListener("scroll", handleScroll);

        //Return a cleanup function - a function can be defined or called here. 
        return () => 
            //When this component is unmounted (meaning it is removed from the DOM, probably because the user maviages to a different page)
            //This return statement is called, and the eventlistener is removed
            window.removeEventListener("scroll", handleScroll)
    }, 
    //This is an array of dependcies. Whenever any dependencies change, react will re-run the effect. 
    //Tutorial uses this dependcy trigger but I'm going to comment it out and hope I don't need it later lol [threshold]
    );

    return scrolled;

}