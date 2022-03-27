var searchButton = $(".search-btn");
var apiKey = "b8ecb570e32c2e5042581abd004b71bb";
var cityId = 0;

// Keep searched cities posted on homepage and save in local storage
for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list-cities").addClass("list-city-item");
    cityName.append("<li>" + city + "</li>");
};

searchButton.click(function () {
    var searchInput = $(".search-input").val();
    // Get current weather from api
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Get 5 day forecast from api
    var urlFuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            // list-cities appends the input
            var cityName = $(".list-cities").addClass("list-city-item");
            cityName.append("<li>" + response.name + "</li>");
            var local = localStorage.setItem(cityId, response.name);
            cityId = cityId + 1;

            // Append current weather 
            var currentWeather = $(".current-weather").append("<div>").addClass("card-body");
            currentWeather.empty();
            var currentCity = currentWeather.append("<p>");
            currentWeather.append(currentCity);

            // Get date 
            var date = new Date(response.dt * 1000);
            currentCity.append(response.name + " " + date.toLocaleDateString("en-US"));
            currentCity.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);

            // Add weather details 
            var currentDetails = currentCity.append("<p>");
            currentCity.append(currentDetails);
            currentDetails.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            currentDetails.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>"); 
            currentDetails.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // Get UV Index from api
            var urlIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;
            $.ajax({
                url: urlIndex,
                method: "GET"
            }).then(function (response) {
                var currentIndex = currentDetails.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentIndex.addClass("UV");
                currentDetails.append(currentIndex);
            });
        });

        // Get 5-day forecast 
        $.ajax({
            url: urlFuture,
            method: "GET"
        }).then(function (response) {
            // Create array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var futureWeather = $(".future-weather").addClass("card-body");
            var fiveDayForecast = $(".forecast").addClass("card-text");
            fiveDayForecast.empty();

            // Get each day
            day.forEach(function (i) {
                var dailyTime = new Date(response.list[i].dt * 1000);
                dailyTime = dailyTime.toLocaleDateString("en-US");
                fiveDayForecast.append("<div class=futurePopUp>" + "<p>" + dailyTime + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            });
        });
    };
});