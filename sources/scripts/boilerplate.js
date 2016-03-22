const hooks = {
	location: $('.location'),
	temperature: $('.data'),
	units: $('#units'),
	background: $('.weather-image'),
	warning: $('.no-data-warning')
};

const failedJsonRequest = function(message) {
	hooks.warning.html(message);
	hooks.background.show();
	hooks.warning.fadeIn();
};

const changeTemp = function(currentTempInCelsius) {
	if (hooks.temperature.hasClass('celsius')) {
		hooks.temperature.removeClass('celsius');
		hooks.temperature.addClass('farenheit');
		hooks.temperature.html(Math.round(currentTempInCelsius * 9/5 + 32));
		hooks.units.html('F');
	} else if (hooks.temperature.hasClass('farenheit')) {
		hooks.temperature.removeClass('farenheit');
		hooks.temperature.addClass('celsius');
		hooks.temperature.html(Math.round(currentTempInCelsius));
		hooks.units.html('C');
	}
};

(function() {

	$.getJSON('http://ipinfo.io', function(locData){

		$.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + locData.city + '&units=metric&APPID=953c92289e7b106c4a8e31fa809cb7e7', function(wData) {

			hooks.background.removeClass('clear-night');

			switch (wData.weather[0].id) {

				//thunderstorm
				case 200:
				case 201:
				case 202:
				case 210:
				case 211:
				case 212:
				case 221:
				case 230:
				case 231:
				case 232:
					hooks.background.addClass('thunderstorm');
					break;

				//rain
				case 300:
				case 301:
				case 302:
				case 310:
				case 311:
				case 312:
				case 313:
				case 314:
				case 321:
				case 502:
				case 503:
				case 504:
				case 511:
				case 520:
				case 521:
				case 522:
				case 531:
					hooks.background.addClass('rain');
					break;

				//light rain
				case 500:
				case 501:
					hooks.background.addClass('light-rain');
					break;

				//snow
				case 600:
				case 601:
				case 602:
				case 611:
				case 612:
				case 615:
				case 616:
				case 620:
				case 621:
				case 622:
					hooks.background.addClass('snow');
					break;

				//mist
				case 701:
					hooks.background.addClass('mist');
					break;

				//clear / sunny
				case 800:
					if (wData.dt < wData.sys.sunset) {
						hooks.background.addClass('clear-day');
					} else {
						hooks.background.addClass('clear-night');
					}
					break;

				//few clouds
				case 801:
					if (wData.dt < wData.sys.sunset) {
						hooks.background.addClass('few-clouds-day');
					} else {
						hooks.background.addClass('few-clouds-night');
					}
					break;

				//scattered clouds
				case 802:
					hooks.background.addClass('scattered-clouds');
					break;

				//broken clouds
				case 803:
					hooks.background.addClass('broken-clouds');
					break;

				default:
					hooks.background.addClass('clear-night');
					break;
			}

			hooks.location.html(locData.city);

			hooks.temperature.html(Math.round(wData.main.temp));

			hooks.units.on('click', function() {
				changeTemp(wData.main.temp);
			});

			hooks.background.fadeIn();

		}).fail(function() {
			failedJsonRequest('Cannot access OpenWeatherMap API, reverting to static value');
		});

	}).fail(function() {
		failedJsonRequest('Cannot access IpInfo API, reverting to static value');
	});

}())
