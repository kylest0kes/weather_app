var userCityChoices = JSON.parse(localStorage.getItem("cities")) || [];
var APIKey = "d060452e40efa713305ce800a49affd2";  
var city = userCityChoices[userCityChoices.length - 1] || "";

if(city){
    renderButtons();
    generateWeatherInfo();
}

//on click to add user input intouserCityChoices array
$('#submit-search').on('click', function(event) {
    event.preventDefault();
    city = $('#user-search-input').val().trim();
    if(!userCityChoices.includes(city)) userCityChoices.push(city);

    generateWeatherInfo();
    renderButtons();
    storeCities();
    addCities();
    
})

//click event for buttons list
$('#user-search-list').on("click", ".city-btn", function() {
    city = $(this).attr("data-name");
    generateWeatherInfo();
}) 

//renders the buttons in the list after user searches
function renderButtons() {
    $("#user-search-list").empty();
    for (var i = 0; i < userCityChoices.length; i++) {
        var cityButton = $('<button>');
        cityButton.addClass('list-group-item list-group-item-action city-btn');
        cityButton.attr('data-name', userCityChoices[i]);
        cityButton.text(userCityChoices[i]);
        $('#user-search-list').prepend(cityButton);
    }
}

//function to generae weather info
function generateWeatherInfo() {

    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    //ajax for name temp humidity and wind speed
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(response){
        var cityName = response.name;
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        var windSpeed = response.wind.speed;
        var humidity = response.main.humidity;
        var weatherState = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var latValue = response.coord.lat;
        var longValue = response.coord.lon;

        $('.card').removeClass('hide');
        $('.card-body').removeClass('hide');
        $('.user-city-name').html('<h3>' + cityName + " " + moment().format('L') + '</h3>' + '<img src=' + weatherState + '>');
        $('.user-city-temp').text("Temperature: " + tempF.toFixed(1) + " ºF");
        $('.user-city-humidity').text("Humidity: " + humidity + "%");
        $('.user-city-wind').text("Wind Speed: " + windSpeed + " MPH");

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + latValue + "&lon=" + longValue;

        //ajax for uv index
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(response){
            var uvIndex = response.value;
            $('.user-city-uv').text("UV Index: " + uvIndex);
        })
        
    })

    var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    //ajax for 5 day forecast
    $.ajax({
        url: fiveDayForecast,
        method: "GET"
    }).then(function(response) {
        //console.log(response)
        //$("#five-day-forecast-row").empty();
        for(var i = 0; i < response.list.length; i++) {
            if(response.list[i].dt_txt.includes("15:00:00")) {
                //console.log(response.list[i])
                var date = moment(response.list[i].dt_txt.split(" ")[0], "YYYY-MM-DD").format('M/D/YYYY');
                //console.log(date)
                var icon = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                //console.log(icon)
                var temp = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                //console.log(temp)
                var humidity = response.list[i].main.humidity;
                //console.log(humidity)

                var fiveDayCol = $('<div>').addClass('col');
                var fiveDayCard = $('<div>').addClass('card five-day-card');
                var fiveDayCardBody = $('<div>').addClass('card-body five-day-card-body')
                var fiveDayDate = $('<h4>').text(date);
                var fiveDayIcon = $('<img>').attr('src', icon);
                var fiveDayTemp = $('<p>').text('Temp: ' + temp.toFixed(2) + ' ºF');
                var fiveDayHumidity = $('<p>').text('Humidity' + humidity + '%');

                
                $('#five-day-forecast-row').append(fiveDayCol);
                fiveDayCol.append(fiveDayCard);
                fiveDayCard.append(fiveDayCardBody);
                fiveDayCardBody.append(fiveDayDate).append(fiveDayIcon).append(fiveDayTemp).append(fiveDayHumidity);
                

            }
        }
        
        $('.five-day-forecast').removeClass('hide');
    }) 

}

//store cities in local storage (WORKS)
function storeCities() {
    localStorage.setItem("cities", JSON.stringify(userCityChoices));
}


// layout being created in loop of 5 day forecast
/*  <div class="col">
        <div class="card five-day-card" id="five-day-forecast-card">
            <div class="card-body">
                <h4 class="five-day-date" id="five-day-date"></h4>
                <div class="five-day-icon" id="five-day-icon"></div>
                <p class="five-day-temp" id="five-day-temp"></p>
                <p class="five-day-humidity" id="five-day-humidity"></p>
            </div>
        </div>
    </div> */