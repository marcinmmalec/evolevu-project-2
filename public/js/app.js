console.log('Client side javascript file loaded!');

/*fetch('http://localhost:3000/weather?address=boston').then((response) => {
    response.json().then((data) => {
        if (data.error) {
            console.log(data.error);
        } else {
            console.log(data.location);
            console.log(data.forecast);
        }
    });
});*/
// url is for localhost
// url2 is for AWS
const url = 'http://localhost:8080/weather?address=';
//const url2 = 'http://weatherapp-env-1.eba-pg3pjbmp.us-west-2.elasticbeanstalk.com/weather?address=';

var displayData = {
    city: document.querySelector(".card-title"),
    temperature: document.querySelector("#currentTemp"),
    weather: document.querySelector("#weatherDescription"),
    icon: document.querySelector("#weatherIcon"),
    humidity1: document.querySelector('#humidity'),
    pressure1: document.querySelector('#pressure'),
    windSpeed1: document.querySelector('#windSpeed'),
    chill1: document.querySelector('#chill'),
    lowTemp1: document.querySelector('#lowTemp'),
    highTemp1: document.querySelector('#highTemp'),
    currentTime1: document.querySelector('#currentTime'),
    cloud1: document.querySelector('#cloud'),
    };
  
  function getWeather(latitude, longitude) {
    if (window.XMLHttpRequest){
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function(){
        var response = JSON.parse(xhr.responseText);
        displayData.city.innerHTML = response.name;
        displayData.temperature.innerHTML = response.main.temp;       
        displayData.humidity1.innerHTML = response.main.humidity;
        displayData.pressure1.innerHTML = response.main.pressure;
        displayData.windSpeed1.innerHTML = response.wind.speed;
        displayData.chill1.innerHTML = response.main.feels_like;
        displayData.lowTemp1.innerHTML = response.main.temp_min;
        displayData.highTemp1.innerHTML = response.main.temp_max;
        displayData.cloud1.innerHTML = response.clouds.all;       
        displayData.currentTime1.innerHTML = Date(response.dt * 1000); 

        var detailWeather = response.weather[0];
        var description = detailWeather.description;
  
        flickrLoad(latitude, longitude, description); 
  
        displayData.weather.innerHTML = description;
        displayData.icon.src = "http://openweathermap.org/img/w/" + detailWeather.icon + ".png";


      }, false);
  
      xhr.addEventListener("error", function(err){
        alert("Initial request error");
        }, false);
  
      var target = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=54e7bed8487f1b7de520fa68a9080abe&units=metric" ;
  
    xhr.open("GET", target, true);
    xhr.send();
    } else {
      alert("Initial XMLHttpRequest");
    }
  }
  
  
  function flickrLoad(latitude, longitude, description){
      var searchDesc, splitDesc;
      splitDesc = description.split(" ");
      searchDesc = splitDesc.slice(-1)[0];
      console.log(searchDesc);
  
      if (window.XMLHttpRequest){
      var body = document.getElementsByTagName('body')[0];
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function(){
          var response = xhr;
          var fullText = response.responseText;
          var segment = (fullText.slice(14, -14)) + "}";
          var fullJSON = JSON.parse(segment); 
          var imgURL = fullJSON.photos.photo[0].url_l;
          var img = new Image();
          img.src = imgURL;
          body.style.backgroundImage = 'url(' + imgURL + ')';       
  
      }, false);
      xhr.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c004bd46564d26383d37d88c1cbd4154&lat=" + latitude + "&lon=" + longitude + "&accuracy=1&tags=" + searchDesc + "&sort=relevance&extras=url_l&format=json", true);
      xhr.send();
  }}
  
  
  function findIP(){
    if (window.XMLHttpRequest){
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function(){
          var response = JSON.parse(xhr.responseText);
          console.log(response.lat, response.lon);
          getWeather(response.lat, response.lon);
          //displayData.source.innerHTML = "From: " + response.query;
      }, false);
      xhr.open("GET", "http://ip-api.com/json", true);
      xhr.send();
  }}
  
  findIP();
  
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const cardTitle = document.querySelector('.card-title');
const weatherDescription = document.querySelector('#weatherDescription');
const weatherIcon = document.querySelector('#weatherIcon');
const currentTemp = document.querySelector('#currentTemp');
const humidity = document.querySelector('#humidity');
const pressure = document.querySelector('#pressure');
const windSpeed = document.querySelector('#windSpeed');
const chill = document.querySelector('#chill');
const lowTemp = document.querySelector('#lowTemp');
const highTemp = document.querySelector('#highTemp');
const currentTime = document.querySelector('#currentTime');
const cloud = document.querySelector('#cloud');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const location = search.value;
    messageOne.textContent = 'Loading...';
    //messageTwo.textContent = '';
    fetch(`${url}${location}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
            } else {
                messageOne.textContent = '';
                //messageTwo.textContent = data.forecast;
                cardTitle.textContent = data.location;
                weatherDescription.textContent = data.forecast.weatherDescription;
                weatherIcon.src = ` http://openweathermap.org/img/wn/${data.forecast.weatherIcon}@2x.png`;
                currentTemp.textContent = data.forecast.actualTemp;
                humidity.textContent = data.forecast.humidity;
                pressure.textContent = data.forecast.pressure;
                windSpeed.textContent = data.forecast.windSpeed;  
                chill.textContent = data.forecast.feelTemp; 
                lowTemp.textContent = data.forecast.minTemp;  
                highTemp.textContent = data.forecast.maxTemp;
                cloud.textContent = data.forecast.cloud;                
                let d = new Date(data.forecast.utc * 1000);
                currentTime.textContent = d;   
                console.log(d);
            }
        });
    });
});

            
