let wb;
let xlsx_JSON = {};
let formF;

document.getElementById('fileSelect').addEventListener('change', handleFile, false);

// JSON to map in function createJSONElement
let MAP_EXCEL_NAME_TO_DB = {
	'startDate': 'Start Datum',
	'startJob': 'KVÅ kod Start',
	'startCode': 'Start verksamhetsenhet',
	'stopDate': 'Slut Datum',
	'stopJob': 'Kvå Kod Stop',
	'stopCode': 'Slut verksamhetsenhet',
	'svfType': 'SVF typ text',
	'personNumber': 'Personnummer',
};

// Function to map column name to names the web app understands
function createJSONElement(row, id){
	return {
		'startDate': row[MAP_EXCEL_NAME_TO_DB.startDate],
		'stopDate': row[MAP_EXCEL_NAME_TO_DB.stopDate],
		'personId': id,
		'personNumber': row[MAP_EXCEL_NAME_TO_DB.personNumber],
		'startJob': row[MAP_EXCEL_NAME_TO_DB.startJob],
		'startCode': row[MAP_EXCEL_NAME_TO_DB.startCode],
		'stopJob': row[MAP_EXCEL_NAME_TO_DB.stopJob],
		'stopCode': row[MAP_EXCEL_NAME_TO_DB.stopCode],
		'svfType': row[MAP_EXCEL_NAME_TO_DB.svfType],
	};
}

// Loop over all sheets and add all data to gobal var xlsx_JSON.
function loadWoorkbook(workbook) {
	$.each(workbook.SheetNames, function(index, sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			xlsx_JSON[sheetName] = roa;
		}
	});
}

// Run when sheet is selected. Add the data to preloaded
function onSheetSelect(sheetName){
	preloaded = [];
	if (wb === undefined) return;
	var data_sheet = xlsx_JSON[sheetName];
	$.each(data_sheet, function(index, jsonData){
		preloaded.push(createJSONElement(jsonData, index));
	});
	alert('Data has been loaded, ' + data_sheet.length + ' elements have been added' )
}

// Function to be added to the eventListener
function handleFile(e) {
	var file = e.target.files[0]; // There should only be one file
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var arr = String.fromCharCode.apply(null, new Uint8Array(data));
		wb = XLSX.read(btoa(arr), {type: 'base64'});
		loadWoorkbook(wb); // Load data
		onSheetSelect(wb.SheetNames[0]); // Add sheet buttons.
	};
	reader.readAsArrayBuffer(file);
}
