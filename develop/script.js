// let currentDay = $('#todayDate');

let currentDay = document.getElementById("todayDate") ;

let DateTime = luxon.DateTime ;

let now = DateTime.now()

let year = now.year ;

let month = now.month ;

let day = now.day ;

let hour = now.hour ;

let minute = now.minute ;

let second = now.second ;

let weekday = now.weekday ;

let daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] ;

let monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] ;

weekday = daysOfTheWeek[weekday - 1]

month = monthsOfTheYear[month - 1]

//---------------------------------------------------
    function getOrdinal() {
        let  dayAsString = String(day) ;
        let endOfDayString = dayAsString.charAt(dayAsString.length -1)
    
       if (endOfDayString === "1" && dayAsString !== "11") {
           ordinal = "st"
       } else if (endOfDayString === "2" && dayAsString !== "12"){
           oridnal = "nd"
       } else if (endOfDayString === "3" && dayAsString !== "13"){
           ordinal = "rd"
       } else {
           ordinal = "th"
       }
    
       return ordinal
    } 
   
//---------------------------------------------------
    
let chosenOrdinal = getOrdinal() ;
    
let dateDisplay = weekday + ", " + month + " " + day + chosenOrdinal + ", " + year ;

currentDay.textContent = dateDisplay ;