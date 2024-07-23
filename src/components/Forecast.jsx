import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './forecast.css';
import './media-queries.css';
import sunrise_img from './images/sunrise.png';
import sunset_img from './images/sunset.png';
import leftImg from './images/bgleft.png'
import alternate from './images/alternate.svg';
import spinner from './images/spinner.svg';
import sun from './images/sun.png';
import moon from './images/moon.png';
import moonrise_img from './images/moonrise.png';
import moonset_img from './images/moonset.png';
import cloud from './images/cloujournal.png';
function Forecast({ getIp,location, forecastData, current, handleCity }) {
    const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const scroll_Left = () => {
        document.getElementById("scroller1").scrollLeft -= 300;
    }
    const scroll_Right = () => {
        document.getElementById("scroller1").scrollLeft += 300;
    }
    const scroll_Left1 = () => {
        document.getElementById("scroller2").scrollLeft -= 300;
    }
    const scroll_Right1 = () => {
        document.getElementById("scroller2").scrollLeft += 300;
    }

    const airRemark = ['', 'Good', 'Moderate', 'Unhealthy', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];
    const [uvRemark, setUVRemark] = useState('');
    const [city, setCity] = useState('');

    // const {location,alerts,current,forecast} = data;
    const { name, region } = location ? location : "";
    // const { co, no2, o3, pm2_5, pm10, so2 } = air_quality ? air_quality : "";
    const {co,so2,o3,pm10,no2} = current ? current.air_quality : "";
    const airquality = current ? current.air_quality['us-epa-index'] : ""; 
    const { icon, text } = current ? current.condition : "";
    const { humidity, precip_mm, temp_c, temp_f, uv, pressure_mb, wind_kph } = current ? current : "";

    const todaysdate = new Date();
    let curr_time = todaysdate.toString().slice(16, 18);
    let month = todaysdate.toString().slice(4, 8);
    let weekDay = todaysdate.toString().slice(0, 3);
    const date = `${weekDay} ${curr_time} ${month}`;
    useEffect(() => {
        if (uv < 3) {
            setUVRemark('Low');
        } else if (uv > 2 && uv < 6) {
            setUVRemark("Medium");
        }
        else if (uv > 6) {
            setUVRemark("High");
        }
        else {
            setUVRemark("");
        }
    }, [uv]);

    const [citylist,setCityList] = useState([]);
    const handleChange = async (cityname)=>{
        const url = `http://api.weatherapi.com/v1/search.json?key=ce7b63cece294cbb99183108231912&q=${cityname}`;
        const res2 = await axios.get(url);
        setCityList(res2.data);
    }
    return (
        <>
            <div className="container_forecast">
                <div className="container_center">
                    <div className="container_top">

                        <div className="left_forecast">

                            <div className="search_div">
                                <i className='fa-solid fa-search search_glass'></i>
                                <input type="text" placeholder="Search Location"
                                    className='search_bar'
                                    id="search_bar"
                                    autocomplete="off"
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        handleChange(e.target.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleCity(event.target.value);
                                        }
                                    }}
                                />
                                <i class="fa-solid fa-location-crosshairs location_icon" onClick={() => {getIp();setCity('') }}></i>
                            </div>
                            <div className={citylist.length > 0 ? "suggestions" : ""}>
                                <ul className="suggest_ul">
                                    {
                                        citylist.length > 0 ?
                                            citylist.map((item) => {
                                                const {name} = item;
                                                return <li className="suggest_li"
                                                    onClick={() => {
                                                        setCity(name);
                                                        handleCity(name);
                                                        setCityList([]);
                                                        document.getElementById("search_bar").focus();
                                                    }}>
                                                    {name}</li>
                                            }) :
                                            null
                                    }
                                </ul>
                            </div>
                            <div className="datetime">
                                <div className="datetime_left">
                                    <div className="citytime"><i class="fa-solid fa-location-dot arrow"></i> {name ? `${name}, ${region}` : ""} </div>
                                    <div className="date">{date}</div>
                                </div>
                            </div>
                            <div className="temp_div">
                                <p className="temperature">{temp_c} <sup className="super">&deg;C</sup></p>
                                <div className="day_weather"> {text} <img className="weather_icon" alt="..." src={icon ? icon : alternate} /></div>
                            </div>

                            <p className="company_name">
                                CloudJournal
                                <img src={cloud} className="logo" />
                            </p>
                        </div>

                        <div className="right_forecast">
                            <div className="dailyForecast1">
                                <p className="daily_title">
                                    <div>
                                        <i class="fa-regular fa-calendar icon_daily"></i> Next Days
                                    </div>
                                    <div className="controlers">
                                        <i class="fa-solid fa-circle-chevron-left arrowL" onClick={scroll_Left}></i>
                                        <i class="fa-solid fa-circle-chevron-right arrowR" onClick={scroll_Right}></i>
                                    </div>
                                </p>
                                <div className="dailyForecast_div" id="scroller1">
                                    {forecastData.length === 0 ?
                                        <div className="daily_div1">
                                            <p className="daily_day">--</p>
                                            <p className="daily_temp">-- &deg;c</p>
                                        </div>
                                        :
                                        <div className="daily_div1">
                                            <p className="daily_day">Today</p>
                                            <img className="weather_icon_daily" alt="Error" src={icon} />
                                            <p className="daily_temp">{temp_c} &deg;c</p>
                                        </div>
                                    }
                                    {forecastData.slice(1,).map((item, index) => {
                                        const { date, day: { avgtemp_c, condition: { icon } } } = item;
                                        let d = new Date(date);
                                        let dayIndex = d.getDay();
                                        return (
                                            <div key={index} className="daily_div1">
                                                <p className="daily_day">{Days[dayIndex]}</p>
                                                <img className="weather_icon_daily" alt="Error" src={icon} />
                                                <p className="daily_temp">{avgtemp_c} &deg;c</p>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>

                            <div className="moreInfo">
                                <div className='grid_container'>
                                    <div className="grid_div">
                                        <p className="more_title">Humidity <i class="fa-solid fa-droplet more_icons"></i> </p>
                                        <p className="more_info">{humidity} <span className="metric">%</span> </p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Wind <i class="fa-solid fa-wind more_icons"></i> </p>
                                        <p className="more_info">{wind_kph} <span className="metric">km/hr</span></p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Rainfall <i class="fa-solid fa-cloud-rain more_icons"></i> </p>
                                        <p className="more_info">{precip_mm ? `${precip_mm}` : "0"} <span className="metric">mm</span></p>
                                    </div>
                                </div>
                                <div className='grid_container grid_container_mobile'>
                                    <div className="grid_div">
                                        <p className="more_title">UV Index <i class="fa-regular fa-eye more_icons"></i> </p>
                                        <p className="more_info">{uv} <span className="metric"> {uvRemark} </span></p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Pressure <i class="fa-solid fa-temperature-high more_icons"></i> </p>
                                        <p className="more_info">{pressure_mb} <span className="metric">mb</span></p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Air Quality <i class="fa-solid fa-smog more_icons"></i> </p>
                                        <p className="more_info1">{airRemark[airquality] ? airRemark[airquality] : "--"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="more1"><i class="fa-solid fa-circle-info icon_daily"></i> More Details of Today's Weather</p>
                    <div className="container_bottom">

                        <div className="dailyForecast">
                            <p className="daily_title">
                                <div>
                                    <i class="fa-regular fa-clock icon_daily"></i> Houry Forecast
                                </div>
                                <div className="controlers">
                                    <i class="fa-solid fa-circle-chevron-left arrowL" onClick={scroll_Left1}></i>
                                    <i class="fa-solid fa-circle-chevron-right arrowR" onClick={scroll_Right1}></i>
                                </div>
                            </p>
                            <div className="dailyForecast_div" id="scroller2">
                                {/* <div className="daily_div1">
                                    <p className="daily_day">Now</p>
                                    <img className={icon ? "weather_icon_daily" : "weather_icon_load"} alt="Error" src={icon ? icon : alternate} />
                                    <p className="daily_temp">{temp_c} &deg;c</p>
                                </div> */}
                                {forecastData.slice(0, 1).map((item, index) => {
                                    const { hour } = item;
                                    return (
                                        <>
                                            {hour.slice(0, 12).map((data, ind) => {
                                                const { temp_c, time, condition: { icon } } = data;
                                                return (
                                                    <div className="daily_div1" key={ind}>
                                                        <p className="daily_day">{time.slice(11,)}</p>
                                                        <img className="weather_icon_daily" alt="Error" src={icon} />
                                                        <p className="daily_temp">{temp_c} &deg;c</p>
                                                    </div>
                                                )
                                            })
                                            }
                                        </>

                                    )
                                })
                                }
                            </div>
                        </div>
                        <div className="container_bottom_2">
                            <div className="sunrise_data">
                                <div className="sunrise_div">
                                    {forecastData.slice(0, 1).map((item, index) => {
                                        const { hour, astro: { sunrise, sunset, moonrise, moonset } } = item;
                                        return (
                                            <>
                                                <div className="sunrise_left">
                                                    <div className="sunrise_temp1"> <img src={sun} alt="Sun" className="sun" /><span className="sunrise_title">Sunrise/Sunset</span></div>
                                                    <div className="date sunrise_temp"><span>Rise</span>  {sunrise} <img className="sunrise" src={sunrise_img} /></div>
                                                    <div className="date sunrise_temp"><span>Set</span>  {sunset} <img className="sunrise" src={sunset_img} /></div>
                                                </div>
                                                <div className="vline"></div>
                                                <div className="moonrise_right">
                                                    <div className="sunrise_temp1"><img src={moon} alt="Moon" className="sun moon" /><span className="sunrise_title">Moonrise/Moonset</span></div>
                                                    <div className="date sunrise_temp"><span>Rise</span> {moonrise} <img className="moonrise" src={moonrise_img} /></div>
                                                    <div className="date sunrise_temp"><span>Set</span>  {moonset} <img className="moonrise" src={moonset_img} /></div>
                                                </div>
                                            </>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                            <div className="airquality_data">
                                <p className="pollutants">Current Pollutants</p>
                                <div className="airdata_row">
                                    <div className="quality_div">
                                        <p className="index_text">CO</p>
                                        <p className="index_value">{co ? co : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">O<sub>3</sub></p>
                                        <p className="index_value">{o3 ? o3 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">NO<sub>2</sub></p>
                                        <p className="index_value">{no2 ? no2 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">SO<sub>2</sub></p>
                                        <p className="index_value">{so2 ? so2 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">PM<sub>10</sub></p>
                                        <p className="index_value">{pm10 ? pm10 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                </div>
                                <div className="airdata_mobile">
                                    <div className="airdata_col">

                                        <div className="quality_div">
                                            <p className="index_text">CO</p>
                                            <p className="index_value">{co ? co : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">O<sub>3</sub></p>
                                            <p className="index_value">{o3 ? o3 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">NO<sub>2</sub></p>
                                            <p className="index_value">{no2 ? no2 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                    </div>
                                    <div className="airdata_col">

                                        <div className="quality_div">
                                            <p className="index_text">SO<sub>2</sub></p>
                                            <p className="index_value">{so2 ? so2 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">PM<sub>10</sub></p>
                                            <p className="index_value">{pm10 ? pm10 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <p className="developer">Designed and Developed by AmanPathan</p>
                            &nbsp;
                            <a href="https://github.com/AmanPathan/CloudJournal" target="_blank" className="link"><i class="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Forecast