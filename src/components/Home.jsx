import React, { useState, useEffect, useMemo } from "react";
import './forecast.css';
import './media-queries.css';
import sunrise from './images/sunrise.png';
import sunset from './images/sunset.png';
import leftImg from './images/bgleft.png'
import alternate from './images/alternate.svg';
import spinner from './images/spinner.svg';
import sun from './images/sun.png';
import moon from './images/moon.png';
import moonrise from './images/moonrise.png';
import moonset from './images/moonset.png';
import cloud from './images/cloujournal.png';
import axios from 'axios';
import Forecast from "./Forecast";

const apiKey = "ce7b63cece294cbb99183108231912";

const Searchpage = () => {
    const [loc, setLoc] = useState({});
    // const [isLoading, setIsLoading] = useState(false);
    const [currData,setCurrData] = useState([]);
    const [forecastData,setForecastData] = useState([]);


    // let URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${ID}&aqi=yes`;
    // let URL2 = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationData}&days=7&aqi=no&alerts=no`;

    // let ForecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
    // let IDURL = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;
    // let IDURL2 = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${locationData}`;

    // // let AstronomyURL = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${astro_date}`;
    // let AstronomyURL = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}`;

    const getIp = async () => {
        const res = await axios.get("https://api.ipify.org/?format=json");
        const location_url = `http://ip-api.com/json/${res.data.ip}`;
        const res1 = await axios.get(location_url);
        setLoc(res1.data);
        let searchAPI = `https://api.weatherapi.com/v1/forecast.json?key=ce7b63cece294cbb99183108231912&q=${res1.data.lat},${res1.data.lon}&days=7&aqi=yes&alerts=yes`;
        const res2 = await axios.get(searchAPI);
        setCurrData(res2.data);
        setForecastData(res2.data.forecast.forecastday);
    };
    const getData = async (e)=>{
        let searchAPI = `https://api.weatherapi.com/v1/forecast.json?key=ce7b63cece294cbb99183108231912&q=${e}&days=7&aqi=yes&alerts=yes`;
        const res2 = await axios.get(searchAPI);
        setCurrData(res2.data);
        setForecastData(res2.data.forecast.forecastday);
    }
      useEffect(() => {
        getIp();
      }, []);
    
    const handleCityName = (e)=>{
        getData(e);
    }
    return (
        <>
            {/* <div className={isLoading ? "loader_div" : "loader_div_none"}>
                <span class="loader"></span>
                <p className="loader_text">Wait while we load the data ...</p>
            </div> */}
            <Forecast location={currData.location} forecastData={forecastData}  current={currData.current} curr_data={currData} handleCity={handleCityName}/>
        </>
    )
}

export default Searchpage;