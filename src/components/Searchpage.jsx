import React, { useState, useEffect } from "react";
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

const apiKey = "ce7b63cece294cbb99183108231912";

const Searchpage = () => {

    const [isLoading, setIsLoading] = useState(false);

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

    const todaysdate = new Date();
    let curr_time = todaysdate.toString().slice(16, 18);
    let month = todaysdate.toString().slice(4, 8);
    let weekDay = todaysdate.toString().slice(0, 3);

    const [locationData, setLocationData] = useState('');
    // console.log(locationData);
    const [city, setCity] = useState('');
    const [resData, setResponse] = useState([]);
    const [cityName, setCityName] = useState('--');
    const [cityRegion, setCityRegion] = useState('--');
    const [data, setData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [ID, setID] = useState('');
    const [timeFlag, setTimeFlag] = useState(false);

    const [day1, setDay1] = useState([]);
    const [day2, setDay2] = useState([]);

    const [hourData, setHourData] = useState([]);

    const [date, setDate] = useState('-- --');
    const [astro_date, setAstroDate] = useState('');
    const [curr_temp, setCurrTemp] = useState('--');
    const [curr_weather, setCurrWeather] = useState('');
    const [curr_icon, setCurrIcon] = useState('');
    const [humidity, setHumidity] = useState('--');
    const [wind, setWind] = useState('--');
    const [precipitation, setPrecipitation] = useState('--');
    const [pressure, setPressure] = useState('--');
    const [airquality, setAirQ] = useState('--');
    const [uvIndex, setUV] = useState('--');
    const [uvRemark, setUVRemark] = useState('');
    const [astroData, setAstroData] = useState([]);
    const [finalDayData, setFinalDayData] = useState([]);
    const [astro_curr_date,setAstroCurrDate] = useState('');
    const [airData, setAirData] = useState([]);

    const [metricflag, setMetricflag] = useState(true);
    const [fahTemp, setChangedtemp] = useState('--');

    const airRemark = ['Good', 'Moderate', 'Unhealthy', 'Unhealthy', 'Very Unhealthy', 'Hazardous'];

    let URL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=id:${ID}&aqi=yes`;
    let URL2 = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationData}&days=7&aqi=no&alerts=no`;

    let ForecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`;
    let IDURL = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;
    let IDURL2 = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${locationData}`;

    // let AstronomyURL = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}&dt=${astro_date}`;
    let AstronomyURL = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}`;

    const GetID = async (url) => {
        const response = await fetch(url);
        const Rjson = await response.json();
        setResponse(Rjson);
        setID(Rjson[0].id);
        setCityName(Rjson[0].name);
        setCityRegion(Rjson[0].region);
    }
    const getAstroData = async ()=>{
        const astroRes = await axios.get(AstronomyURL);
        const astrojson = await astroRes.data;
        setAstroData(astrojson.astronomy.astro);
    }
    useEffect(() => {
        GetID(IDURL);
        getAstroData();
    }, [city]);

    const dailyData = [];
    const hourlyData = [];

    useEffect(() => {
        if (uvIndex < 3) {
            setUVRemark('Low');
        } else if (uvIndex > 2 && uvIndex < 6) {
            setUVRemark("Medium");
        }
        else if (uvIndex > 6) {
            setUVRemark("High");
        }
        else {
            setUVRemark("");
        }
    }, [uvIndex]);

    const GetInfo = async () => {
        // const res = await fetch(URL);
        // const resJson = await res.json();
        const res = await axios.get(URL);
        setData(res.data);
        const forecastRes = await axios.get(ForecastURL);
        // const forecastjson = await forecastRes.json();
        setForecastData(forecastRes.data.forecast.forecastday);
        setDay1(forecastData[0].hour);
        setDay2(forecastData[1].hour);
        let ind = Number(curr_time);
        if (ind === 23) {
            ind = 24;
        }
        for (ind; ind < 24; ind++) {
            let curr_hour = {
                "temp": day1[ind].temp_c,
                "icon": day1[ind].condition.icon,
                "hour": day1[ind].time.slice(11,)
            }
            hourlyData.push(curr_hour);
        };
        for (ind = 0; ind < 24; ind++) {
            let curr_hour = {
                "temp": day2[ind].temp_c,
                "icon": day2[ind].condition.icon,
                "hour": day2[ind].time.slice(11,)
            }
            hourlyData.push(curr_hour);
        };

        setHourData(hourlyData);

        for (let k = 1; k < 7; k++) {
            let d = new Date(forecastData[k].date);
            let dayIndex = d.getDay();
            let c = forecastData[k].date
            let c1 = c.slice(5, 7);
            let c2 = c.slice(8, 10);
            let curr_daily_date = `${c2}/${c1}`;

            let daily_temp_data = {
                "temp": forecastData[k].day.avgtemp_c,
                "icon": forecastData[k].day.condition.icon,
                "day_date": Days[dayIndex],
                "today_date": curr_daily_date
            }
            dailyData.push(daily_temp_data);
        }
        setFinalDayData(dailyData);


        setCityName(data.location.name);
        setCurrTemp(data.current.temp_c);
        setChangedtemp(data.current.temp_f);
        setCurrWeather(data.current.condition.text);
        setCurrIcon(data.current.condition.icon);
        setHumidity(data.current.humidity);
        setWind(data.current.wind_kph);
        setPrecipitation(data.current.precip_mm);
        setPressure(data.current.pressure_mb);
        setUV(data.current.uv);
        setAirQ(data.current.air_quality['us-epa-index']);
        setAstroCurrDate(data.location.localtime);

        let airqualitydetails = {
            "co": data.current.air_quality.co,
            "no2": data.current.air_quality.no2,
            "o3": data.current.air_quality.o3,
            "so2": data.current.air_quality.so2,
            "pm2_5": data.current.air_quality.pm2_5,
            "pm10": data.current.air_quality.pm10
        }
        setAirData(airqualitydetails);

        let timetoCmp = astro_curr_date.slice(11, 13);
        let astronomy_date = astro_curr_date.slice(0, 10);
        setAstroDate(astronomy_date);
        let today = astro_curr_date.slice(8, 10);
        let astro_curr_date1 = `${weekDay} ${today} ${month}`;
        setDate(astro_curr_date1);
        
        if (timetoCmp === curr_time) {
            setTimeFlag(true);
        }
        else {
            setTimeFlag(false);
        }
        console.log("inside GetInfo");
        setIsLoading(false);
        console.log(astronomy_date);
    }
    
    const getData = async () => {
        // const res = await axios.get("https://api.ipify.org/?format=json");
        // let LocationURL = `http://ip-api.com/json/${res.data.ip}`
        // const weatherData = await fetch(LocationURL);
        // const weatherJson = await weatherData.json();

        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            let loc = `${lat},${lon}`;
            setLocationData(loc);
        });

        GetInfo();
        // console.log("reached end");
    };

    useEffect(() => {
        getData();
    }, []);
    // useEffect(()=>{
    //     GetID(IDURL2);
    //     GetInfo();
    // })
    // console.log(hourlyData);


    return (
        <>
            {/* <div className={isLoading ? "loader_div" : "loader_div_none"}>
                <span class="loader"></span>
                <p className="loader_text">Wait while we load the data ...</p>
            </div> */}
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
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            setIsLoading(true);
                                            GetInfo();
                                        }
                                    }}
                                />
                                <i class="fa-solid fa-location-crosshairs location_icon" onClick={() => { GetID(IDURL2) }}></i>
                            </div>
                            <div className={resData.length > 0 ? "suggestions" : ""}>
                                <ul className="suggest_ul">
                                    {
                                        resData.length > 0 ?
                                            resData.map((item) => {
                                                return <li className="suggest_li"
                                                    onClick={() => {
                                                        setCity(item.name);
                                                        setResponse([]);
                                                        document.getElementById("search_bar").focus();
                                                    }}>
                                                    {item.name}</li>
                                            }) :
                                            null
                                    }
                                </ul>
                            </div>
                            <div className="datetime">
                                <div className="datetime_left">
                                    <div className="citytime"><i class="fa-solid fa-location-dot arrow"></i> {cityName ? `${cityName}, ${cityRegion}` : ""} </div>
                                    <div className="date">{date}</div>
                                </div>
                            </div>
                            <div className="temp_div">
                                {/* <p className="temperature">{metricflag ? curr_temp : fahTemp} <sup className="super"><span className={metricflag ? "changeMetric1" : "changeMetric2"} onClick={() => { setMetricflag(!metricflag) }}>&deg;C</span><span className="changeMetric3">|</span><span className={metricflag ? "changeMetric2" : "changeMetric1"} onClick={() => { setMetricflag(!metricflag) }}>&deg;F</span></sup></p> */}
                                <p className="temperature">{curr_temp} <sup className="super">&deg;C</sup></p>
                                <div className="day_weather"> {curr_weather} <img className="weather_icon" alt="..." src={curr_icon ? curr_icon : alternate} /></div>
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
                                    {finalDayData.length === 0 ?


                                        <div className="daily_div1">
                                            <p className="daily_day">--</p>
                                            {/* <img className="weather_icon_daily" alt="Error" src={item.icon} /> */}
                                            <p className="daily_temp">-- &deg;c</p>
                                        </div>
                                        :
                                        <div className="daily_div1">
                                            <p className="daily_day">Today</p>
                                            <img className="weather_icon_daily" alt="Error" src={curr_icon} />
                                            <p className="daily_temp">{curr_temp} &deg;c</p>
                                        </div>
                                    }
                                    {finalDayData.map((item) => {
                                        return (
                                            <div className="daily_div1">
                                                <p className="daily_day">{item.day_date}</p>
                                                {/* <p className="daily_date">{item.today_date}</p> */}
                                                <img className="weather_icon_daily" alt="Error" src={item.icon} />
                                                <p className="daily_temp">{item.temp} &deg;c</p>
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
                                        <p className="more_info">{wind} <span className="metric">km/hr</span></p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Rainfall <i class="fa-solid fa-cloud-rain more_icons"></i> </p>
                                        <p className="more_info">{precipitation ? `${precipitation}` : "0"} <span className="metric">mm</span></p>
                                    </div>
                                </div>
                                <div className='grid_container grid_container_mobile'>
                                    <div className="grid_div">
                                        <p className="more_title">UV Index <i class="fa-regular fa-eye more_icons"></i> </p>
                                        <p className="more_info">{uvIndex} <span className="metric"> {uvRemark} </span></p>
                                    </div>
                                    <div className="grid_div">
                                        <p className="more_title">Pressure <i class="fa-solid fa-temperature-high more_icons"></i> </p>
                                        <p className="more_info">{pressure} <span className="metric">mb</span></p>
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
                                    <i class="fa-regular fa-clock icon_daily"></i> Upcoming Hours
                                </div>
                                <div className="controlers">
                                    <i class="fa-solid fa-circle-chevron-left arrowL" onClick={scroll_Left1}></i>
                                    <i class="fa-solid fa-circle-chevron-right arrowR" onClick={scroll_Right1}></i>
                                </div>
                            </p>
                            <div className="dailyForecast_div" id="scroller2">
                                <div className="daily_div1">
                                    <p className="daily_day">Now</p>
                                    <img className={curr_icon ? "weather_icon_daily" : "weather_icon_load"} alt="Error" src={curr_icon ? curr_icon : alternate} />
                                    <p className="daily_temp">{curr_temp} &deg;c</p>
                                </div>
                                {hourData.map((e) => {
                                    return (
                                        <div className="daily_div1">
                                            <p className="daily_day">{e.hour}</p>
                                            <img className="weather_icon_daily" alt="Error" src={e.icon} />
                                            <p className="daily_temp">{e.temp} &deg;c</p>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                        <div className="container_bottom_2">
                            <div className="sunrise_data">
                                <div className="sunrise_div">
                                    <div className="sunrise_left">
                                        <div className="sunrise_temp1"> <img src={sun} alt="Sun" className="sun" /><span className="sunrise_title">Sunrise/Sunset</span></div>
                                        <div className="date sunrise_temp"><span>Rise</span>  {astroData.sunrise ? astroData.sunrise : "--"} <img className="sunrise" src={sunrise} /></div>
                                        <div className="date sunrise_temp"><span>Set</span>  {astroData.sunrise ? astroData.sunrise : "--"} <img className="sunrise" src={sunset} /></div>
                                    </div>
                                    <div className="vline"></div>
                                    <div className="moonrise_right">
                                        <div className="sunrise_temp1"><img src={moon} alt="Moon" className="sun moon" /><span className="sunrise_title">Moonrise/Moonset</span></div>
                                        <div className="date sunrise_temp"><span>Rise</span> {astroData.sunrise ? astroData.sunrise : "--"} <img className="moonrise" src={moonrise} /></div>
                                        <div className="date sunrise_temp"><span>Set</span>  {astroData.sunrise ? astroData.sunrise : "--"} <img className="moonrise" src={moonset} /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="airquality_data">
                                <p className="pollutants">Current Pollutants</p>
                                <div className="airdata_row">
                                    <div className="quality_div">
                                        <p className="index_text">CO</p>
                                        <p className="index_value">{airData.co ? airData.co : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">O<sub>3</sub></p>
                                        <p className="index_value">{airData.o3 ? airData.o3 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">NO<sub>2</sub></p>
                                        <p className="index_value">{airData.no2 ? airData.no2 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">SO<sub>2</sub></p>
                                        <p className="index_value">{airData.so2 ? airData.so2 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                    <div className="quality_div">
                                        <p className="index_text">PM<sub>10</sub></p>
                                        <p className="index_value">{airData.pm10 ? airData.pm10 : "--"} <span className="index_unit">μg/m3</span></p>
                                    </div>
                                </div>
                                <div className="airdata_mobile">
                                    <div className="airdata_col">

                                        <div className="quality_div">
                                            <p className="index_text">CO</p>
                                            <p className="index_value">{airData.co ? airData.co : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">O<sub>3</sub></p>
                                            <p className="index_value">{airData.o3 ? airData.o3 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">NO<sub>2</sub></p>
                                            <p className="index_value">{airData.no2 ? airData.no2 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                    </div>
                                    <div className="airdata_col">

                                        <div className="quality_div">
                                            <p className="index_text">SO<sub>2</sub></p>
                                            <p className="index_value">{airData.so2 ? airData.so2 : "--"} <span className="index_unit">μg/m3</span></p>
                                        </div>
                                        <div className="quality_div">
                                            <p className="index_text">PM<sub>10</sub></p>
                                            <p className="index_value">{airData.pm10 ? airData.pm10 : "--"} <span className="index_unit">μg/m3</span></p>
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

export default Searchpage;