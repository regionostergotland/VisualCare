function updateButtons() {
	let activeClass = 'btn btn-primary';
	let inactiveClass = 'btn btn-default';

	let linkKVAToButtom = {
		'BOTH': 'vjvkButton',
		'VJ110': 'vjButton',
		'VK110': 'vkButton',
	}
	let linkSexToButton = {
		'BOTH': 'sexBothButton',
		'MEN': 'sexMenButton',
		'WOMEN': 'sexWomenButton',
	}
	let linkOutToButton = {
		'-1': 'ut-1',
		'All': 'utAlla',
	}

	// Show active only on clicked button.
	$.each(linkKVAToButtom, function (name, button){
		let currElement = document.getElementById(button);
		currElement.className = (name === KVACode ? activeClass : inactiveClass);
	});
	$.each(linkSexToButton, function (name, button){
		let currElement = document.getElementById(button);
		currElement.className = (name === currentSex ? activeClass : inactiveClass);
	});
	$.each(linkOutToButton, function(name, button){
		let currElement = document.getElementById(button);
		currElement.className = (name === outType ? activeClass : inactiveClass);
	});
}

function initSlider() {
	document.getElementById("d1").innerHTML = minDate.yyyymmdd();
	document.getElementById("d2").innerHTML = maxDate.yyyymmdd();
	let dateSlider = document.getElementById('slider-date');
	let ageSlider = document.getElementById('slider-age');

	noUiSlider.create(dateSlider, {
		// Create two timestamps to define a range.
		range: {
			min: realMinDate.getTime(),
			max: realMaxDate.getTime()
		},
		// Steps of one week
		step: 24 * 60 * 60 * 1000,
		// Two more timestamps indicate the handle starting positions.
		start: [realMinDate.getTime(), realMaxDate.getTime()],
	});


	dateSlider.noUiSlider.on('set', function(values, handle) {
		if (values[1] > values[0]) {
			minDate.setTime(values[0]);
			maxDate.setTime(values[1]);
			document.getElementById("d1").innerHTML = minDate.yyyymmdd();;
			document.getElementById("d2").innerHTML = maxDate.yyyymmdd();;

			update();
		}
	});

	document.getElementById("a1").innerHTML = realMinAge + " år";
	document.getElementById("a2").innerHTML = realMaxAge + " år";


	noUiSlider.create(ageSlider, {
		// Create two timestamps to define a range.
		range: {
			min: realMinAge,
			max: realMaxAge
		},
		//orientation: "vertical",
		step: 1,
		// Two more timestamps indicate the handle starting positions.
		start: [realMinAge, realMaxAge],
	});

	ageSlider.noUiSlider.on('set', function(values, handle) {
		if (values[1] > values[0]) {
			minAge = values[0];
			maxAge = values[1];
			update();
			document.getElementById("a1").innerHTML = Math.round(minAge) + " år";
			document.getElementById("a2").innerHTML = Math.round(maxAge) + " år";
		}
	});
}

function updateOut(out){
	outType = out;
	updateButtons();
	update();
}
