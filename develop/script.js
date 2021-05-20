// let currentDay = $('#todayDate');

let currentDay = document.getElementById("todayDate");

let DateTime = luxon.DateTime;

let now = DateTime.now()

let year = now.year;

let month = now.month;

let day = now.day;

let hour = now.hour;

let minute = now.minute;

let second = now.second;

let weekday = now.weekday;

let daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

let monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

weekday = daysOfTheWeek[weekday - 1]

month = monthsOfTheYear[month - 1]

//---------------------------------------------------
function getOrdinal() {
    let dayAsString = String(day);
    let endOfDayString = dayAsString.charAt(dayAsString.length - 1)

    if (endOfDayString === "1" && dayAsString !== "11") {
        ordinal = "st"
    } else if (endOfDayString === "2" && dayAsString !== "12") {
        oridnal = "nd"
    } else if (endOfDayString === "3" && dayAsString !== "13") {
        ordinal = "rd"
    } else {
        ordinal = "th"
    }

    return ordinal
}

//---------------------------------------------------

let chosenOrdinal = getOrdinal();

let dateDisplay = `${weekday}, ${month} ${day}${chosenOrdinal}, ${year}`

currentDay.textContent = dateDisplay;


//api call 
// let cityCoorApiFormat = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}"

// let weatherApiCallFormat = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}";

let weatherApiIconFormat = "http://openweathermap.org/img/wn/10d@2x.png"

let cityCoorUrl = "https://api.openweathermap.org/geo/1.0/direct?q="

let weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?"

let chosenCityEl = document.getElementById("chosenCity") ;


let cityInput = document.getElementById("cityInput") ;

let chosenCity = "" ;

let currentTempEl = document.getElementById("currentTemp") ;

let currentWindEl = document.getElementById("currentWind") ;

let currentHumidityEl = document.getElementById("currentHumidity") ;

let currentUVEl = document.getElementById("currentUV") ;

let currentIcon = document.getElementById("currentIcon") ;

//------------------------------



function makeApiCall() {

    let coordinatesRequestUrl = cityCoorUrl + chosenCity + "&limit=10&appid=" + api_key ;

    let lat = ""

    let lon = ""

    let weatherRequestUrl =  ""

    console.log(coordinatesRequestUrl)

    //fetch city coordinates
    fetch(coordinatesRequestUrl).then(function (response) {
        return response.json();
    })
        .then(function (data) {

            console.log(data)
            console.log(data[0]["lat"])
            console.log(data[0]["lon"])

            lat = data[0]["lat"]
            lon = data[0]["lon"]
            
            console.log(lat) ;
            weatherRequestUrl = `${weatherApiUrl}lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=${api_key}`
            chosenCityEl.textContent = data[0]["name"] ;
            //Use lat/lon to get weather
            fetch(weatherRequestUrl).then(function(response) {
                return response.json() ;
            })
                .then(function (weatherData) {
                    console.log(weatherData) ;

                    //Main Box
                    currentTempEl.textContent = weatherData["current"]["temp"] ;

                    currentWindEl.textContent = weatherData["current"]["wind_speed"] ;

                    currentHumidityEl.textContent = weatherData["current"]["humidity"] ;

                    currentUVEl.textContent = weatherData["current"]["uvi"] ;

                    currentIcon.setAttribute("src", `http://openweathermap.org/img/wn/${weatherData["current"]["weather"][0]["icon"]}@2x.png` )

                    //---------------------- 
                    if (currentUVEl.textContent <= 2) {
                        currentUVEl.classList.remove("uvVeryHigh") ;
                        currentUVEl.classList.remove("uvHigh") ;
                        currentUVEl.classList.remove("uvModerate") ;
                        currentUVEl.classList.add("uvLow") ;
            
                    } else if (currentUVEl.textContent <= 5){
                        currentUVEl.classList.remove("uvVeryHigh") ;
                        currentUVEl.classList.remove("uvHigh") ;
                        currentUVEl.classList.remove("uvLow") ;
                        currentUVEl.classList.add("uvModerate") ;
            
                    } else if (currentUVEl.textContent <= 7) {
                        currentUVEl.classList.remove("uvVeryHigh") ;
                        currentUVEl.classList.remove("uvModerate") ;
                        currentUVEl.classList.remove("uvLow") ;
                        currentUVEl.classList.add("uvHigh") ;
                    } else {
                        currentUVEl.classList.remove("uvHigh") ;
                        currentUVEl.classList.remove("uvModerate") ;
                        currentUVEl.classList.remove("uvLow") ;
                        currentUVEl.classList.add("uvVeryHigh") ;
                    }

                    //---------------------- 


                    //Five day forecast

                    for (let i = 0; i < 5; i++) {

                        let dateTimeUnix = weatherData["daily"][i+1]["dt"] ;

                        let dateTimeUnixMil = dateTimeUnix * 1000 ;

                        let dateObj = new Date(dateTimeUnixMil) ;

                        let dateObjString = dateObj.toLocaleDateString("en-US", {month: "numeric", day: "numeric", year: "numeric"}) ;

                        console.log(dateObjString) ;

                        document.getElementById(`date${String(i+1)}`).textContent = dateObjString ;

                        document.getElementById(`temp${String(i+1)}`).textContent = weatherData["daily"][i+1]["temp"]["day"]

                        document.getElementById(`wind${String(i+1)}`).textContent = weatherData["daily"][i+1]["wind_speed"]

                        document.getElementById(`humidity${String(i+1)}`).textContent = weatherData["daily"][i+1]["humidity"]

                        document.getElementById(`icon${String(i+1)}`).setAttribute("src", `http://openweathermap.org/img/wn/${weatherData["daily"][i+1]["weather"][0]["icon"]}@2x.png`)
                    }
                }) ;
        }) ;

//End makeApiCall
}


//----------------------------

let searchButton = document.getElementById("searchButton") ;

let citySearch = "" ;

let recentSearchesDiv = document.getElementById("recentSearches") ; 

let clearSearchButton = document.getElementById("clearSearchButton") ;

//--------------------------------------------------------

function initializePage() {
    if (localStorage.getItem("searchHistory") === null) {
        let searchHistoryArray = [] ;
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray)) ;
    } else {
    
    let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) ;

    for (let i = searchHistoryArray.length -1; i>=0; i--) {
        let lastSearch = document.createElement("h3") ;
        lastSearch.textContent = searchHistoryArray[i] ;
        recentSearchesDiv.appendChild(lastSearch) ;
        }
    }
}

//--------------------------------------------------------

initializePage() ;

//--------------------------------------------------------

function populateRecentSearches() {

    citySearch = cityInput.value ;
    console.log(citySearch) ;

    if (citySearch === "") {
        return
    }

    let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) ;

    searchHistoryArray.push(citySearch) ;

    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray)) ;

    cityInput.value = "" ;

    // let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) ;

    for (let i = searchHistoryArray.length -1; i>=0; i--) {
        let lastSearch = document.createElement("h3") ;
        lastSearch.textContent = searchHistoryArray[i] ;
        recentSearchesDiv.appendChild(lastSearch) ;
    }
}

//--------------------------------------------------------


searchButton.addEventListener("click", function () {

    chosenCity = cityInput.value ;

    makeApiCall() ;

    let recentSearches = document.getElementById("recentSearches")

    // let element = document.getElementById("top");
    while (recentSearches.firstChild) {
    recentSearches.removeChild(recentSearches.firstChild);
}
    populateRecentSearches() ;

}) ;

//--------------------------------------------------------

clearSearchButton.addEventListener("click", function () {
    clear() ;
})

//--------------------------------------------------------

function clear() {

    let recentSearches = document.getElementById("recentSearches")

    while (recentSearches.firstChild) {
    recentSearches.removeChild(recentSearches.firstChild);
}
    let searchHistoryArray = localStorage.getItem("searchHistory")

    searchHistoryArray = []

    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray)) ;
}