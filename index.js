//note: with the free tier of OpenWeatherMap, which we are using, you can ONLY get current weather/forecast, 
//hourly and daily forecast are unavailable. Allowed: 60 calls per min
//openweathermap docs: https://openweathermap.org/weather-conditions
//giphy docs: https://developers.giphy.com/docs/api/endpoint/#get-gifs-by-id

//this will make the weather call, and then filter that data into an object which it will return
function getWeather(location) {
    let string = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=390dd47327fb6eaa282682582c6a7ba7`;
    let x = fetch(string, {mode: 'cors'})
        .then(response => {
            return response.json(); //returns a promise to the next then
        })
        .then(response => {
            console.log("response object", response); //test, print out our whole response object to console
            const w = new Object(); //object to which we will assign our retrieved data
            w.city = response.name;
            w.country = response.sys.country;
            w.lat = response.coord.lat;
            w.long = response.coord.lon;
            w.desc1 = response.weather[0].main;
            w.desc2 = response.weather[0].description;
            w.temp = response.main.temp;
            w.feelsLike = response.main.feels_like;
            w.humidity = response.main.humidity;
            w.pressure = response.main.pressure;
            w.windSpeed = response.wind.speed;
            w.windDeg = response.wind.deg; //wind direction, check here: http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
            w.high = response.main.temp_max;
            w.low = response.main.temp_min;
            w.clouds = response.clouds.all; //cloudiness, %
            w.time = new Date(response.dt * 1000); //dt is the UTC time of the data capture. UTC elapsed time must be multiplied by 1000 for millisecond conversion
            w.sunrise = new Date(response.sys.sunrise * 1000).toLocaleTimeString();
            w.sunset = new Date(response.sys.sunset * 1000).toLocaleTimeString();
            //note: response.dt returns the total elapsed seconds since Jan 01, 1970, which is ECMA standard
            return w;
        })
        .catch(() => {
            window.alert("There was an error getting a response!");
        });
    return x;
}

//below here will be our function to fetch a gif from Giphy
async function fetchGif(desc) {
    try {
        //the giphy translate endpoint converts words and phrases to gif form via algorithm
        let urlString = `https://api.giphy.com/v1/gifs/translate?api_key=rKZIWTL7Xvk4WGgU2VLgLoklD8wykBZP&weirdness=0&s=${desc}`;
        const response = await fetch(urlString, {mode: 'cors'});
        return response.json();
    } catch {
        window.alert('Error querying Giphy');
    }
}

//parseWeather() will take the object created in getWeather(), and create the visual elements
async function parseWeather(loc) {
        let load = document.querySelector('.loading');
        load.style.color = 'red';
        load.innerHTML = "Loading Request...";
        const body = document.querySelector('body');
        //should we have some try/catches around these below?
        const resp = await getWeather(loc); //await the result of get weather, take the returned object into parseWeather()
        const gif = await fetchGif(resp.name + " " + resp.desc1 + " weather"); //await result of gif, take returned objet to display in parseWeather()
        const content = document.querySelector('.content');

        //upon every location submit, delete content elements before recreating
        let toDelete = document.querySelectorAll('.todelete');
        toDelete.forEach((el) => el.remove());
    
        //create the gif element.
        const gifC = document.createElement('img');
        gifC.classList.add('todelete');
        gifC.src = gif.data.images.original.url;
        //will append the gif below
        
        //maybe another conditional chain for night time?
        if(resp.desc1 === 'Clouds') { //maybe could rewrite all this as function calls if you decide to add more on
            body.style.backgroundColor = 'grey';
            body.style.color = 'white';
            //call function for adding gif to dom?
        } else if( resp.desc1 === 'Rain') {
            body.style.backgroundColor = 'darkblue';
            body.style.color = 'lightskyblue';
        } else if(resp.desc1 === 'snow') {
            body.style.backgroundColor = ''
        } else if(resp.desc1 === 'Clear') { //&& new Date().toLocaleTimeString > a certain time, show night?
            body.style.backgroundColor = 'lightskyblue';
            body.style.color = 'white';
        } else if(resp.desc1 === 'Mist') {
            body.style.backgroundColor = 'royalblue';
            body.style.color = 'white';
        } else {
            body.style.backgroundColor = 'white';
            body.style.color = 'black';
        }

        //test console logs
        console.log("city: " + resp.city);
        console.log("lat: " + resp.lat + "; long: " + resp.long);
        console.log("description: " + resp.desc1 + "; " + resp.desc2);
        console.log("current temp is: " + resp.temp + " degrees F");
        console.log("feels like: " + resp.feelsLike + " degrees F");
        console.log("the high is: " + resp.high + " degrees F");
        console.log("the low is: " + resp.low + " degrees F");
        console.log("humidity: " + resp.humidity + "%");
        console.log("atmospheric pressure: " + resp.pressure + "hPa");
        console.log("wind speed: " + resp.windSpeed + "mph");
        console.log("wind direction: " + resp.windDeg + " degrees(meteorological)");
        console.log("cloudiness: " + resp.clouds + "%");
        console.log("the time of this data is: " + resp.time);
        console.log("sunrise today is: " + resp.sunrise);
        console.log("sunset today is: " + resp.sunset);
        
        const p = document.createElement('p');
        let ct = new Date().toLocaleTimeString(); //current time
        p.innerHTML = resp.city + " - " + resp.country +  "<br><br> lat: " + resp.lat + "<br> long: " + resp.long +
        "<br><br> forecast: " + resp.desc1 + "; " + resp.desc2 + "<br><br> current time is: " + ct + "<br> current temp is: "
        + resp.temp + "<br> feels like: " + resp.feelsLike + "<br> the high is: " + resp.high + "<br> the low is: " + 
        resp.low + "<br> humidity: " + resp.humidity + "%<br> atmospheric pressure: " + resp.pressure + " hPa<br> wind speed: "
        + resp.windSpeed + "mph<br> wind direction: " + resp.windDeg + " degrees (meteorological)<br>" + "cloudiness: " 
        + resp.clouds + "%<br> time of data capture: " + resp.time + "<br> sunset: " + resp.sunset + "<br> sunrise: " + resp.sunrise;

        p.classList.add('todelete');
        
        content.append(p);
        content.append(gifC);
        
        return resp;
}

async function changeLoc() { //everytime a user submits a different location, new API calls are run
    let load = document.querySelector('.loading');
    let inp = document.getElementById('location');
    let val = inp.value;
    await parseWeather(val);
    load.innerHTML = ""; //after parseWeather finishes execution and info + gif is displayed, clear loading sign
}

//note: the onsubmit script calls all the methods through parseWeather()