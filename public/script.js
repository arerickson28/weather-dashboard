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
let weatherApiIconFormat = "http://openweathermap.org/img/wn/10d@2x.png"

let cityCoorUrl = "https://api.openweathermap.org/geo/1.0/direct?q="

let weatherApiUrl = "https://api.openweathermap.org/data/3.0/onecall?"

let chosenCityEl = document.getElementById("chosenCity") ;


let cityInput = document.getElementById("cityInput") ;

let chosenCity = "" ;

let currentTempEl = document.getElementById("currentTemp") ;

let currentWindEl = document.getElementById("currentWind") ;

let currentHumidityEl = document.getElementById("currentHumidity") ;

let currentUVEl = document.getElementById("currentUV") ;

let currentIcon = document.getElementById("currentIcon") ;

//------------------------------

async function getCoordinates(cityCoorUrl, chosenCity) {
    let coordinatesRequestUrl = cityCoorUrl + chosenCity + "&limit=10&appid=";

    let requestBody = {
        "coordinatesRequestUrl": `${coordinatesRequestUrl}`
    }

    try {
        const coordinateResponse = await fetch('/api/coordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })

        const coordinateData = await coordinateResponse.json()

        return coordinateData

    } catch(error) {
        console.log("error: " + error)
    }
}

async function getWeatherData(coordinateData) {

    console.log(coordinateData[0]["lat"])
    console.log(coordinateData[0]["lon"])

    chosenCityEl.textContent = coordinateData[0]["name"] 

    let lat = coordinateData[0]["lat"]
    let lon = coordinateData[0]["lon"]

    let weatherRequestUrl = `${weatherApiUrl}lat=${lat}&lon=${lon}&units=imperial&exclude=hourly,minutely&appid=`;

    let requestBody = {
        "weatherRequestUrl": `${weatherRequestUrl}`
    }

    try {
        const weatherResponse = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })

        const weatherData = await weatherResponse.json()

        return weatherData

    } catch(error) {
        console.log("error: " + error)
    }

}


async function makeApiCall() {

    // fetch city coordinates
    let coordinateData = await getCoordinates(cityCoorUrl, chosenCity)

    console.log("coordinateData: ", coordinateData)

    // fetch city weather
    let weatherData = await getWeatherData(coordinateData)

    console.log("weatherData: ", weatherData) ;

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
    
    populateRecentSearches() ;
    }
}

//--------------------------------------------------------

initializePage() ;

//--------------------------------------------------------

function populateRecentSearches() {

    function addSearchToHistory() {

        citySearch = cityInput.value ;
        console.log(citySearch) ;
    
        if (citySearch === "") {
            return
        }
    
        let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) ;
    
        searchHistoryArray.push(citySearch) ;
    
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray)) ;
    
        cityInput.value = "" ;
        
    }

    addSearchToHistory() ;

    let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) ;

    for (let i = searchHistoryArray.length -1; i>=0; i--) {

        let lastSearch = document.createElement("button") ;

        lastSearch.textContent = searchHistoryArray[i] ;

        console.log(lastSearch.textContent) ;

        lastSearch.setAttribute("type", "button") ;

        lastSearch.setAttribute("class", "btn btn-outline-secondary") ;

        lastSearch.addEventListener("click", function() {
            chosenCity = lastSearch.textContent ;
            handleSearch() ;
        }) ;

        recentSearchesDiv.appendChild(lastSearch) ;
    }
}

//--------------------------------------------------------

clearSearchButton.addEventListener("click", function () {
    clear() ;
})

//--------------------------------------------------------

searchButton.addEventListener("click", function() {
    chosenCity = cityInput.value ;
    handleSearch() ;
}) ;

//Search Event Handler
function handleSearch() {

    makeApiCall() ;

    let recentSearches = document.getElementById("recentSearches")

    // let element = document.getElementById("top");
    while (recentSearches.firstChild) {
    recentSearches.removeChild(recentSearches.firstChild);
}
    populateRecentSearches() ;
}


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