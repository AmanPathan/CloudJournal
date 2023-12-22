import React from "react";
import errorImg from './images/error.gif'
import './error.css';

const Error = ()=>{
    return (
        <>
            <div className="img_container">
                <img src={errorImg} alt="" className="errorImg" />
            </div>
        </>
    );
}

export default Error;