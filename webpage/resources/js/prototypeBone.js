// Config
let URLServer = 'http://37.139.0.36:8080/persons'

// Global vars
/*
 * filteredData is an array containing a sub-set of person-objects that has been filtered by
 * all the filter-variables.
 */
var filteredData = []; // Filterd data
var barType = 0; // Some prototypes use this to know if shoing sex or age
var distType = 0;
/*
 * personLookup is a lookup-table containing all the person-objects in filteredData, with the same Key
 * as the id of that person in filteredData.
 * Etc. filteredData = [p1,p2,p3....pN]
 * personLookup['253567'] -> p2;
 */
var personLookup = {};

/*
 * ottoType is a variable that decides what distribution
 * that is used in dataManip.js.
 * 0 is linear distribution, 1 is normalDistribution20, 2 is normalDistribution5
 */
var ottoType = 0; // TODO Change name

var outType = '-1'

// Vars used for filter
var KVACode = 'BOTH';
var currentSex = 'BOTH';
/*
 * preloaded is an array containing all person-objects returned from api-call in function preLoad()
 */
var preloaded = []; // All data

/*
 * Filter-variables
 * These following variables are used to filter the array filteredData. By changing one of these
 * variables and calling run(), filteredData and the graphs are updated accordingly.
 */


 /*
  * realMinDate, realMaxDate, realMinAge, realMaxAge is variables containing information about the
  * minimum and maximum ranges that is contained in preloaded. They are used for setting slider-ranges.
  */
var realMinDate = new Date(); // TODO What is this for?
var realMaxDate = new Date(); // TODO What is this for?

var realMinAge = Infinity;
var realMaxAge = 0;

/*
 * minDate and maxDate are used to filter filteredData if person.startDate is within the range minDate to maxDate.
 * These values should be in the range realMinDate <= minDate <= maxDate <= realMaxDate
 */


var minDate = new Date(); // TODO What is this for?
var maxDate = new Date(); // TODO What is this for?

let mapProtToFunc = {
	1: function () {
			$('#barList').show();
			$('#info').hide();
			drawData1();
	},
	2: function () {
			$('#barList').hide();
			$('#info').hide();
			constructHeatData();
			drawData2();
	},
	3: function () {
		$('#barList').hide();
		$('#info').hide();
		drawData3();
	},
	4: function () {
		$('#barList').hide();
		$('#info').hide();
		drawData4();
	},
	5: function () {
		$('#barList').hide();
		$('#info').show();
		textType = 'BOTH';
		filterData();
		drawData5();
	},
};
let loadedProto = [];

function update(){

	filterData();
	let protNum = getParameters();

	for (var obj in portfolios) {
		if (portfolios[obj].id == protNum.prototype){
			console.log("hjr");
			var htmlText = "";
			htmlText += "<h4>" + portfolios[obj].name + "</h4>";
			htmlText += "<p>" + portfolios[obj].desc + "</p>"
			$('#grafinfo').html(htmlText);
			break;
		}
	}

	// Set prototype to one if not defined
	protNum = (protNum === null ? 1 : protNum.prototype);
	protNum = (protNum === null ? 1 : protNum);
	protNum = (mapProtToFunc[protNum] === undefined ? 1 : protNum);

	// Load JS if necessary and call on function maped to the prototype
	loadJS(protNum, mapProtToFunc[protNum]);
}

function loadFromDB(callback){
	$.ajax({
		url: URLServer,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			$.each(data, function(index, data){
				preloaded.push(data);
			});
			filteredData = preloaded;
			callback();
		},
		error: function(error) {
			console.log('Can not read DB:');
			console.log(error);
		}
	});
}


function updateKVA(type) {
	KVACode = type;
	updateButtons();
	update();
}
function updateSex(type) {
	currentSex = type;
	updateButtons();
	update();
}


function downloadSVG(){
	let svg  = document.getElementById('graphs');
	let xml  = new XMLSerializer().serializeToString(svg);
	let to_replace = ['ä','ö','å','Ä','Ö','Å'];
	$.each(to_replace, function(index, char){
		xml = xml.replaceAll(char, '&#' + char.charCodeAt(0).toString() + ';')
	})

	let imageData = 'data:image/svg+xml;base64,' + btoa(xml);
	// Create link with download image and click on it
	let a = $('<a>')
		.attr('href', imageData)
		.attr('download', 'img.svg')
		.appendTo('body');
	a[0].click();
	a.remove();

}

// Data-changers and event listeners
function setDistType() {
	var val = document.getElementById('distType').value;
	distType = Number(val);
	update();
}

function setMinMaxDate() {
	$.each(preloaded, function(index, currentObj){
		var date = new Date(currentObj.startDate);
		if (date < minDate) {
			minDate = date;
			minDate.addDays(20); // TODO Why?
			realMinDate = date;
		}
		// Set realMinAge / realMaxAge
		var age = getAge(currentObj.personNumber.substr(0, 8));
		if (age < realMinAge) realMinAge = age;
		if (age > realMaxAge) realMaxAge = age;
		minAge = realMinAge;
		maxAge = realMaxAge;
	});
}

// Returns a descriptive name from JobCode
function getNameFromJob(job) {
 var name = 'Unknown';
 if (job.substr(0, 3) == 'VJ1') {
	 name = 'Urin';
 } else if (job.substr(0, 3) == 'VK1') {
	 name = 'Prostata';
 }
 return name;
}



// Filters data based on min and Max date, and stop-code
function filterData() {
	filteredData = [];
	$.each(preloaded, function(index, currentObj){
		var date = new Date(currentObj.startDate);
		// If date is within user-defined limits
		if (!(date >= minDate && date < maxDate)){
			return true; // Continue
		};
		// If stopCode == -1
		/*console.log(currentObj.stopCode.substr(0, 2))
		if (currentObj.stopCode.substr(0, 2) !== '-1'){
			return true; // Continue
		};*/
		// Check if in age
		var age = getAge(currentObj.personNumber.substr(0, 8));
		if (!(age >= minAge && age <= maxAge)){
			return true; // Continue
		}
		// Check if right sex
		if (currentSex != 'BOTH' && getSex(currentObj.personNumber) !== currentSex){
			return true; // Continue
		}
		// Check if right KVACode
		if (KVACode != 'BOTH' && currentObj.startJob !== KVACode){
			return true; // Continue
		}
		// TODO What is this?
		if ((outType !== 'All') && currentObj.stopCode.substr(0, 2) !== '-1'){
			return true; // Continue
		}
		filteredData.push(currentObj)
	});

	personLookup = {};
	for (var i = 0; i < filteredData.length; i++) {
		personLookup[filteredData[i].personId] = i;
	}
}

//TODO What is this
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

// Loads JS files if not loaded and run callback
function loadJS(protNum, callback){
	let mapProtNumToFile = {
		1: '/resources/js/p1.js',
		2: '/resources/js/p2.js',
		3: '/resources/js/p3.js',
		4: '/resources/js/p4.js',
		5: '/resources/js/p5.js',
	};
	// Is prototype number is not in mapProtNumToFile load it and call on the
	// callback function
	if (loadedProto.indexOf(protNum) === -1){
		$.getScript(mapProtNumToFile[protNum], function(data, textStatus, jqxhr ) {
			loadedProto.push(protNum);
			callback();
		});
	}
	else{
		callback();
	}
}

// If edit in sex or age bar
function setBarType(){
	var val = document.getElementById('barChooser').value;
	barType = Number(val);
	update();
}


// Uses the filtered data to construct data

// TODO Add comments!
function constructHeatData() {
	constructedData = {};
	let arrLength = minDate.daydiff(maxDate);
	let currentType = 0;
	for (var d in filteredData) {
		let obj = filteredData[d];
		if (!(obj.startJob in constructedData)) {
			constructedData[obj.startJob] = {
				'array': [],
				'name': getNameFromJob(obj.startJob),
				'arrLength': arrLength,
				'type': getTypeFromJob(obj.startJob)
			}
			for (var i = 0; i < arrLength; i++) {
				var dat = new Date(minDate);
				dat.setDate(dat.getDate() + i);
				constructedData[obj.startJob].array.push({
					'val': 0,
					'index': i,
					'date': dat,
					'type': getTypeFromJob(obj.startJob)
				});
			}
			currentType++;
		}
		addValuesToConstructed(obj);
	}

	if (!('VK110' in constructedData)) {
		constructedData['VK110'] = {
			'array': [],
			'name': getNameFromJob('VK110'),
			'arrLength': arrLength,
			'type': getTypeFromJob('VK110')
		}

	}
	if (!('VJ110' in constructedData)) {
		constructedData['VJ110'] = {
			'array': [],
			'name': getNameFromJob('VJ110'),
			'arrLength': arrLength,
			'type': getTypeFromJob('VJ110')
		}
	}
}


// Adds value to the constructedData object, using standard
function addValuesToConstructed(obj) {
	// TODO What is this?
	let distVal = 30;

	var thisDate = new Date(obj.startDate);
	var id = minDate.daydiff(thisDate);
	for (var k = -distVal; k < distVal + 1; k++) {
		var currId = Number(id) + k;
		if (currId >= 0 && currId < constructedData[obj.startJob].array.length) {
			var valler = 1 - Math.abs(k) / (distVal);
			constructedData[obj.startJob].array[currId].val += valler;
			if (constructedData[obj.startJob].array[currId].val < minVal){
				minVal = constructedData[obj.startJob].array[currId].val;
			}
			if (constructedData[obj.startJob].array[currId].val > maxVal){
				 maxVal = constructedData[obj.startJob].array[currId].val;
			}
		}
	}
}

// Help Functions

// Returns the sex of a person based on personNumber
function getSex(pNumber) {
	if (Number(pNumber.substr(11, 1)) % 2 == 0) {
		return 'WOMEN';
	}
	return 'MEN';
}

// Returns age from birth date
function getAge(dob) {
	var year = Number(dob.substr(0, 4));
	var month = Number(dob.substr(4, 2)) - 1;
	var day = Number(dob.substr(6, 2));
	var today = new Date();
	var age = today.getFullYear() - year;
	if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
		age--;
	}
	return age;
}

// Returns a descriptive name from JobCode
/*
// TODO Used?
function getNameFromJob(job) {
	if (job.substr(0, 3) == 'VJ1') {
		return 'Urin';
	}
	if (job.substr(0, 3) == 'VK1') {
		return 'Prostata';
	}
	return 'Unknown';
}
*/

// Returns the day-difference between two date-object
Date.prototype.daydiff = function(second) {
	return Math.round((second - this) / (1000 * 60 * 60 * 24));
};

// Extra date functions
// Add n days to date object
Date.prototype.addDays = function(n) {
	this.setDate(this.getDate() + parseInt(n));
	return this;
};

// Returns date-object on format 'yyyy/mm/dd'
Date.prototype.yyyymmdd = function() {
	var mm = this.getMonth() + 1; // getMonth() is zero-based
	var dd = this.getDate();

	return [this.getFullYear(),
		(mm > 9 ? '' : '0') + mm,
		(dd > 9 ? '' : '0') + dd
	].join('-');
};

String.prototype.replaceAll = function (find, replace) {
	var str = this;
	return str.replace(new RegExp(find, 'g'), replace);
};
