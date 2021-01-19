var country = $("#city")
var container = $("#container")
var button = $(".buttons")
var countries = JSON.parse(localStorage.getItem("cities")) || []
var weatherContainer = $("#weatherDisplay");
var initialLoad = true;

function renderButtons() {
    button.empty();

    for (var i = 0; i < countries.length; i++) {
        var newCountry = $("<button>")
        newCountry.addClass("btn btn-light btn-secondary cityName")
        newCountry.text(countries[i]);
        button.append(newCountry);

        if (i == countries.length - 1) {
            currentWeather(countries[i])
            getFiveDay(countries[i])
            initialLoad = false
        }
    }
}
//function when saved buttons are clicked 
$(".vertButtons").on("click", ".cityName", function (event) {
    event.preventDefault();
    var countryName = $(this).text()
    $("#weatherDisplay").empty();
    $("#fiveDay").empty();
    currentWeather(countryName);
    getFiveDay(countryName);

});
//on click for adding new countries
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    var countryName = country.val();
    countries.push(countryName);


    localStorage.setItem("cities", JSON.stringify(countries))

    $("#weatherDisplay").empty();
    $("#fiveDay").empty();

    renderButtons();
})



function currentWeather(countryName) {

    var apiKey = "7b50a0572cb4f6218adafc0e8349cf51";
    var urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + countryName +  "&units=metric" +"&appid=" + apiKey;


    // call to retrieve current weathr information for a new city 
console.log(urlQuery)
    $.ajax({
        url: urlQuery,
        method: "GET"
    }).then(function (response) {

        //pulling city name
        var countryNameHead = $("<h3>")
        countryNameHead.addClass("bigCountry")
        countryNameHead.text(response.name)
        weatherContainer.append(countryNameHead)

        //pulling and apply converter 
        console.log(urlQuery)

        var date = moment
            .unix(response.dt)
            .utc()
            .format("L");
        var mainDate = $("<h3>")
        mainDate.addClass("topDate")
        mainDate.append(date);
        weatherContainer.append(mainDate)

        //retrieve Icon, IMG

        var iconID = response.weather[0].icon
        var iconUrl = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
        var iconImg = $("<img>")
        iconImg.attr("src", iconUrl)
        weatherContainer.append(iconImg)

        //converting temp

        var tempCon = response.main.temp;
        

        
        //retrieve temp

        var tempMain = $("<p>")
        tempMain.addClass("mainData")
        tempMain.text("Temperature " + tempCon + "c"  )
        weatherContainer.append(tempMain)

        //retrieve humidity



        var humidityMain = $("<p>")
        humidityMain.addClass("mainData")
        humidityMain.text("Humidity:" + response.main.humidity + "%")
        weatherContainer.append(humidityMain)

        //retrieve wind

        var windMain = $("<p>")
        windMain.addClass("mainData")
        windMain.text("Wind: " + response.wind.speed + "km/h")
        weatherContainer.append(windMain)

        //index query
        var lat = response.coord.lat
        var long = response.coord.lon

        var uvQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + long +  "&appid=" + apiKey;

        //separate call to get UV index for new country

        $.ajax({
            url: uvQueryUrl,
            method: "GET"
        }).then(function (response) {
            var index = $("<p>").text("UV Index: ")
            index.addClass("ovalCont")
            var oval = $("<p>").text(response.value)
            oval.addClass("ovalCont")
            var value = response.value

            weatherContainer.append(index)
            weatherContainer.append(oval)

            if (value <= 2) {
                oval.addClass("lighGreenOval")
            } else if (value >= 2.1 && value <= 5) {
                oval.addClass("yellowOval")
            } else if (value >= 5 && value <= 7) {
                oval.addClass("orangeOval")
            } else if (value >= 7 && value <= 10) {
                oval.addClass("redOval")
            } else if (value >= 10) {
                oval.addClass("purpleOval")



            }
        })
    })
}

function getFiveDay(countryName) {
    //call for 5 days forecast
    var apiKey = "7b50a0572cb4f6218adafc0e8349cf51";
    var fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + countryName + "&units=metric" +  "&appid=" + apiKey;
    
    $.ajax({
        url: fiveDayUrl,
        method: "GET"
    }).then(function (response) {
       

        for (var i = 0; i < response.list.length; i++) {
            var date = moment(response.list[i].dt,"X"). utcOffset(response.city.timezone)
               

            if (date.hour() === 15) {

                //writing 5 days forecast information to the page
                var daysBox = $("<div>").addClass("dayCard")
                var dateOne = $("<p>")
                dateOne.addClass("dateOnDay")
                dateOne.text(date.format("L"));
                daysBox.append(dateOne);

                var iconID = response.list[i].weather[0].icon
                var iconUrl = "http://openweathermap.org/img/wn/" + iconID + "@2x.png"
                var temp1 = response.list[i].main.temp
                var cToFahr = (temp1 )


                var fiveIcon = $("<img>")
                var fiveTemp = $("<p>")
                fiveTemp.addClass("fiveData")
                var fiveHumid = $("<p>")
                fiveHumid.addClass("fiveData")

                fiveIcon.attr("src", iconUrl)
                fiveTemp.text("Temp: " + cToFahr)
                fiveHumid.text("Humidity: " + response.list[i].main.humidity)

                daysBox.append(fiveIcon, fiveTemp, fiveHumid)
                $("#fiveDay").append(daysBox)
            }
        }
    })
}
renderButtons();