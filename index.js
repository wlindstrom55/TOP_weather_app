//2. write the functions that hit the API. 
//you're going to want functions that can take a location and return the weather data for that location
//for now, console.log it.
//we could do a location string(city, state code, or country code), or a lat/long coordinate
//note: with the free tier of OpenWeatherMap, which we are using, you can ONLY get current weather/forecast, 
//hourly and daily forecast are unavailable. Allowed: 60 calls per min

//should we do async here? not sure if necessary
// async function getWeather(location) { //should take location, return weather data object for it
//     try {
//         let response = fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=390dd47327fb6eaa282682582c6a7ba7`,
//         {mode:'cors'});
//         return response;
//     } catch {
//         window.alert(e);
//     }
// }

//rewrite this as a regular promise
function getWeather(location) {
    let string = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=390dd47327fb6eaa282682582c6a7ba7`;
    let x = fetch(string, {mode: 'cors'})
        .then(response => {
            return response.json(); //returns a promise to the next then
        })
        .then(response => {
            console.log("response object", response); //test, print out our response object to console
            const w = new Object(); //object to which we will assign our retrieved data
            w.city = response.name;

            w.desc1 = response.weather[0].main;
            w.desc2 = response.weather[0].description;

            w.temp = response.main.temp;
            w.feelsLike = response.main.feels_like;
            w.humidity = response.main.humidity;
            w.windSpeed = response.wind.speed;
            w.windDeg = response.wind.deg; //wind direction
            w.high = response.main.temp_max;
            w.low = response.main.temp_min;
            w.clouds = response.clouds.all; //cloudiness, %
            w.time = new Date(response.dt * 1000); //dt is the UTC time of the data capture. UTC elapsed time must be multiplied by 1000 for millisecond conversion
            w.sunrise = new Date(response.sys.sunrise * 1000).toLocaleTimeString();
            w.sunset = new Date(response.sys.sunset * 1000).toLocaleTimeString();
            
            //not sure if I want to use these, would need to be translated into current timezone format
            //w.time = new Date(response.dt); //time of data calc, unix UTC - so we surround it in a Date object to translate to local time
            //note: response.dt returns the total elapsed seconds since Jan 01, 1970, which is ECMA standard.
            //w.time = new Date();
            
            w.timeZone = response.timezone; //shift in seconds from UTC

            //test console logs
            console.log(response.main.temp);
            console.log(response.name); //city name
            //console.log(response.rain); //undefined, paid version
            console.log(response.weather[0].main); //undefined, paid version
            console.log(response.main.feels_like);
            console.log(response.main.humidity); //percentage humidity
            console.log(response.wind.speed); //miles/hr
            console.log(response.wind.deg); //wind direction, degrees
            //console.log(response.wind.gust); //gust, miles/hour 
            console.log(response.clouds.all); //cloudiness, as a percentage
            console.log(response.sys.sunrise); //sunrise time, UTC
            console.log(response.sys.sunset);
            console.log(response.timezone); //shift in seconds from UTC
            console.group(response.visibility); //visibility - max is 10km
        
            return w;
        })
        .catch(() => {
            window.alert("There was an error getting a response!");
        });
    return x;
}

//.3 Write the functions that process the JSON data you're getting from the API and return an object w/ only the data
//that you require for your app (so decide what you need)

async function parseWeather() {
        const resp = await getWeather(loc); //await the result of get weather, take the returned object into parseWeather()
        console.log("city: " + resp.city);
        console.log("description: " + resp.desc1 + "; " + resp.desc2);
        console.log("current temp is: " + resp.temp + " degrees F");
        console.log("feels like: " + resp.feelsLike + " degrees F");
        console.log("the high is: " + resp.high + " degrees F");
        console.log("the low is: " + resp.low + " degrees F");
        console.log("humidity: " + resp.humidity + "%");
        console.log("wind speed: " + resp.windSpeed + "mph");
        console.log("wind direction: " + resp.windDeg + " degrees(meteorological)");
        console.log("cloudiness: " + resp.clouds + "%");
        console.log("the time of this data is: " + resp.time);
        console.log("sunrise today is: " + resp.sunrise);
        console.log("sunset today is: " + resp.sunset);
        
        return resp;
        // return w;
    //});
    //return newObj;
}

const loc = "Lincoln";
parseWeather();