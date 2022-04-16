var enterCity = $(".search-btn");
var apiKey = "7ae7162ecce3d5d55ea9b515afc7d578";
var locationId = 0;

// Keep searched cities posted on homepage and save in local storage
for (var i = 0; i < localStorage.length; i++) {
    var searchedCity = localStorage.getItem(i);
    var locationName = $(".list-cities").addClass("list-city-item");
        locationName.append("<li>" + searchedCity + "</li>");
};

enterCity.click(function () {
    var cityInput = $(".search-input").val();
    // Get current weather from api
    var urlNow = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&Appid=" + apiKey + "&units=imperial";
    // Get 5 day forecast from api
    var urlLater = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&Appid=" + apiKey + "&units=imperial";

    if (cityInput == "") {
        console.log(cityInput);
    } else {
        $.ajax({
            url: urlNow,
            method: "GET"
        }).then(function (response) {
            // list-cities appends the input
            var locationName = $(".list-cities").addClass("list-city-item");
                locationName.append("<li>" + response.name + "</li>");
            var store = localStorage.setItem(locationId, response.name);
                locationId = locationId + 1;

            // Append current weather 
            var weatherNow = $(".current-weather").append("<div>").addClass("card-body");
                weatherNow.empty();
            var cityNow = weatherNow.append("<p>");
                weatherNow.append(cityNow);

            // Get date 
            var todayDate = new Date(response.dt * 1000);
                cityNow.append(response.name + " " + todayDate.toLocaleDateString("en-US"));
                cityNow.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);

            // Add weather details 
            var infoNow = cityNow.append("<p>");
                cityNow.append(infoNow);
                infoNow.append("<p>" + "Temperature: " + response.main.temp + "</p>");
                infoNow.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>"); 
                infoNow.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // Get UV Index from api
            var uvIndex = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=7ae7162ecce3d5d55ea9b515afc7d578`;
            $.ajax({
                url: uvIndex,
                method: "GET"
            }).then(function (response) {
                var indexNow = infoNow.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                indexNow.addClass("UV");
                infoNow.append(indexNow);
            });
        });

        // Get 5-day forecast 
        $.ajax({
            url: urlLater,
            method: "GET"
        }).then(function (response) {
            // Create array for 5-days 
            var dayArray = [0, 8, 16, 24, 32];
            var futureWeather = $(".future-weather").addClass("card-body");
            var futureForecast = $(".forecast").addClass("card-text");
                futureForecast.empty();

            // Get each day
            dayArray.forEach(function (i) {
                var eachDay = new Date(response.list[i].dt * 1000);
                    eachDay = eachDay.toLocaleDateString("en-US");
                    futureForecast.append("<div class=futurePopUp>" + "<p>" + eachDay + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            });
        });
    };
});