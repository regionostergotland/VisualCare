// Simulate a link opening
function openLink(key, value){
	insertParam(key, value);
	update();
}

// Add or change parameter
function insertParam(key, value){
	var currentPar = getParameters();
	// No current parameters
	if (currentPar === null){
		var newUrl = window.location.pathname + '?' + key + '=' + value;
		history.pushState({}, '', newUrl);
	}
	// Add old parameters and replace "key" if exists
	else{
		var parmString = '';
		$.each(currentPar, function (name, value){
			if (name !== key){
				parmString += name + '=' + value + '&'
			}
		});
		var newUrl = window.location.pathname + '?' + parmString + key + '=' + value;
		history.pushState({}, '', newUrl);
	}
}

// Return the GET parameters as JSON
function getParameters(){
	var searchText = window.location.search;
	if (searchText === '') return null;
	searchText = searchText.substring(1); // remove the ?
	var paraList = {};
	$.each(searchText.split('&'), function (index, data){
		paraList[data.split('=')[0]] = data.split('=')[1];
	});
	return paraList;
}
