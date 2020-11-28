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
const url2 = 'http://weatherapp-env-1.eba-pg3pjbmp.us-west-2.elasticbeanstalk.com/weather?address=';

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const cardTitle = document.querySelector('.card-title');
const weatherDescription = document.querySelector('#weatherDescription');
const weatherIcon = document.querySelector('#weatherIcon');
const currentTemp = document.querySelector('#currentTemp');

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
                let d = new Date(data.forecast.utc * 1000);
                console.log(d);
            }
        });
    });
});

