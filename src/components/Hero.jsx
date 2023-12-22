import React from 'react';
import './hero.css';
import image1 from './images/Weather.gif';
import { useNavigate } from "react-router-dom";

const Hero = () => {

    const navigate = useNavigate();

    return (
        <>
            <div className="container">
                <div className="left-container">
                    <img className="illustration" src={image1} />
                    <div className='content-list'>
                        <ul>
                            <li><i class="fa-regular fa-circle-check"></i> Real-Time Weather Updates</li>
                            <li><i class="fa-regular fa-circle-check"></i> Location-Centric Forecasting</li>
                        </ul>
                        <ul>
                            <li><i class="fa-regular fa-circle-check"></i> Accurate and Reliable Data</li>
                            <li><i class="fa-regular fa-circle-check"></i> Interactive Weather Maps</li>
                        </ul>
                    </div>
                </div>
                <div className="right-container">
                    <div className="content">
                        <div className='content-div'>
                            <h2 className="content-title">CloudJournal Forecast</h2>
                            <p className="content-tagline">We bring you more than just weather updates</p>
                        </div>
                        <div className='content-div'>
                            <p className="content-text">Welcome to CloudJournal, your go-to destination for accurate and up-to-date weather information. </p>
                            <button className='explore' onClick={()=>{navigate("/forecast")}}>See Weather</button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}

export default Hero;