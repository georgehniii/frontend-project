//https://api.weather.gov/points/{latitude},{longitude}
//https://api.weather.gov/alerts/active?area={state}
var $inputLatitude = $("#inputLatitude");
var $inputLongitude = $("#inputLongitude");
var $submitButton = $("#submit");
$("#map").hide();
$submitButton.on("click",function(){
    searchCtrl(false);
    var $inputLatitude = $("#inputLatitude").val();
    var $inputLongitude = $("#inputLongitude").val();
    //console.log($inputLatitude + $inputLongitude);
    //console.log(typeof parseInt($inputLongitude));
    $.get(`https://api.weather.gov/points/${$inputLatitude},${$inputLongitude}`, (data) => {
        //console.log(data);
        var x = $inputLatitude;
        var y = $inputLongitude;
        weatherOptions(data.properties,x,y);
        //console.log(data.properties.relativeLocation.properties.city);
        //console.log(data.properties.forecast);           
        $.get(data.properties.forecast, (forcastData) => {
            //console.log(forcastData);
            printForeCast(forcastData, "daily");
        });
    
    });
});

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvcmdlaG5paWkiLCJhIjoiY2wyaTY4ZHlxMGd4djNwbW1xMXU3ODdpeSJ9.u1mbw2tcwkRVUhbjEq5-dA';
const geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
types: 'country,region,place,postcode,locality,neighborhood'
});
 
geocoder.addTo('#geocoder');
geocoder.on('result', (e) => {
console.log(e);
    $("#inputLatitude").val(e.result.center[1].toFixed(4));
    $("#inputLongitude").val(e.result.center[0].toFixed(4));
    $(".cityState").remove();
    const $cityState = $("<h2 class='cityState'></h2>");
    $cityState.text(e.result.place_name);
    $cityState.appendTo(".weatherBox");
    $(".cityState").hide();
});

 
function printForeCast(weather, option){
    $(".details").remove();
    removeContainers();
    var periods = weather.properties.periods;
    if(option === "hourly"){
        var count = 1;
    }
    for(var index = 0; index < periods.length; index++){
        //console.log(periods[index].detailedForecast);
        const $weatherContainer = $(`<div class='weatherContainer'></div>`);        
        const $detailedWeather = $("<p class='details'></p>");
        if(option === "daily" && index%2 === 0){
            var img = icon(periods[index].isDaytime, periods[index].shortForecast);
            $(`<img class="icon" src="${img}" alt="?" width="48" height="48">`).appendTo($weatherContainer);
            const $detailedWeather2 = $("<p class='details'></p>");
            const $day = $(`<div class='details' id='day${periods[index]}'></div>`);
            const $day2 = $(`<div class='details' id='day${periods[index+1]}'></div>`);
            $day.text(periods[index].name);
            $detailedWeather.text(periods[index].detailedForecast);        
            $day.appendTo($weatherContainer);
            $detailedWeather.appendTo($weatherContainer);
            var img2 = icon(periods[index+1].isDaytime, periods[index+1].shortForecast);
            $(`<img class="icon" src="${img2}" alt="?" width="48" height="48">`).appendTo($weatherContainer);
            $day2.text(periods[index+1].name);
            $detailedWeather2.text(periods[index+1].detailedForecast);        
            $day2.appendTo($weatherContainer);
            $detailedWeather2.appendTo($weatherContainer);
            $weatherContainer.appendTo(".weatherBox");
        }
        if(option === "hourly"){
            var img = icon(periods[index].isDaytime, periods[index].shortForecast);
            console.log(img);
            $(`<img class="icon" src="${img}" alt="?" width="48" height="48">`).appendTo($weatherContainer);
            $detailedWeather.text(
                periods[index].startTime.slice(11,16)
                +" "
                +periods[index].shortForecast
                +". "
                +periods[index].temperature
                +periods[index].temperatureUnit
                +" wind speed: "
                +periods[index].windSpeed);
            $detailedWeather.appendTo($weatherContainer);
            $weatherContainer.appendTo(".weatherBox");
            if(count === 24){
                return;
            }
            count++;
        }
    }
}

function removeContainers(){   
    $(".details").remove();
    $(".weatherContainer").remove();
}

function searchCtrl(show){
    if(show === true){
        $(".cityState").hide();
        $(".geocoderContainer").show();
        $("#submit").show();
        $("#map").hide();
    }
    if(show === false){
        $(".cityState").show();
        $(".geocoderContainer").hide();
        $("#submit").hide();
    }
}

function weatherOptions(options,x,y){
    console.log(x,y);
    $(".weatherOptions").remove();
    $("<div class='optionContainer'></div>").prependTo(".weatherBox");
    $("<button class='weatherOptions' id='newSearch'>New</button>").prependTo(".optionContainer");
    $("<button class='weatherOptions' id='radar'>Radar</button>").prependTo(".optionContainer");
    $("<button class='weatherOptions' id='daily'>Daily</button>").prependTo(".optionContainer");
    $("<button class='weatherOptions' id='hourly'>Hourly</button>").prependTo(".optionContainer");
    $("#hourly").on("click",function(){
        console.log(options);
        $("#map").hide();
        $.get(options.forecastHourly, (forecastData) => {
            console.log(forecastData.properties.periods);
            printForeCast(forecastData, "hourly");
        });
    });
    $("#daily").on("click",function(){
        //console.log(options);
        $("#map").hide();
        $.get(options.forecast, (forecastData) => {
            console.log(forecastData.properties.periods);
            printForeCast(forecastData, "daily");
        });
    });
    $("#newSearch").on("click",function(){
            $("#map").hide();
            $(".optionContainer").remove();
            searchCtrl(true);
            removeContainers();
        });
    $("#radar").on("click",function(){
        $(".details").remove();
        removeContainers();
        buildMap(x,y);
        $("#map").show();
        radar(x, y);
    });
}

function icon(day, weather){
    console.log(day+" "+ weather);
    if(weather.includes("Thunderstorms") || weather.includes("thunder")){
        return "images/thunderCloud.png";
    }else if(weather.includes("Rain") || weather.includes("Showers")){
        return "images/rainCloud.png";
    }else if(weather.includes("Snow")){
        return "images/snowCloud.png";
    }else if(weather.includes("Cloudy") || weather.includes("cloudy") && !weather.includes("Partly")){
        return "images/cloud.png";
    }else if(day === false && weather.includes("Clear") ){
        return "images/moon.png";
    }else if(day === true && weather.includes("Sunny")){
        return "images/sun.png";
    }else{
        return "images/rainbow.png";
    }
}

//radar================================================================================================================================
function buildMap(x,y){
    let map = L.map('map').setView([x, y], 7);
    L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/7/${x}/${y}.png?appid=7ec722a8566097f7dca9ab81bc006f24`,{
        // tileSize: 512,
        // zoomOffset: -1,
        // minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        crossOrigin: true
        }).addTo(map);
    
    L.imageOver
    //add scale---------------------------------------------------
    L.control.scale().addTo(map);

}//https://api.maptiler.com/maps/outdoor/{${z}}/{${x}}/{${y}}.png?key=NEt0RES7he4FXr3usj9i

// function tileLayer(z,x,y,map){
    

// }
//https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid={API key}

function radar(x,y){
    x=35.567;
    y=-93.8527;
    // $.get(`https://tile.openweathermap.org/map/precipitation_new/${"z"}/${"x"}/${"y"}.png?appid=7ec722a8566097f7dca9ab81bc006f24`, (data) => {
    //    console.log(data);
    //    map.addLayer(data);
    // });
    
}