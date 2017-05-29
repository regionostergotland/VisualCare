/**
 * Created by Otto on 2017-04-11.
 */

/*
SD = 20
Mean = 60
Step = 1
min = -3SD
 */
var normalDistribution20 = [0.0002, 0.0003, 0.0003, 0.0004, 0.0004, 0.0005, 0.0006, 0.0006, 0.0007, 0.0008,
	0.0009, 0.0011, 0.0012, 0.0013, 0.0015, 0.0017, 0.0019, 0.0021, 0.0023, 0.0026,
	0.0028, 0.0031, 0.0034, 0.0038, 0.0041, 0.0045, 0.0049, 0.0053, 0.0058, 0.0062,
	0.0067, 0.0072, 0.0078, 0.0083, 0.0088, 0.0094, 0.0100, 0.0106, 0.0112, 0.0118,
	0.0124, 0.0130, 0.0136, 0.0142, 0.0148, 0.0153, 0.0159, 0.0164, 0.0169, 0.0174,
	0.0178, 0.0182, 0.0186, 0.0189, 0.0192, 0.0194, 0.0196, 0.0198, 0.0199, 0.0199
];

/*
 SD = 5
 Mean = 60
 Step = 1
 min = -3SD
 */
var normalDistribution5 = [0.0012, 0.0021, 0.0035, 0.0057, 0.0088, 0.0132, 0.0189, 0.0260, 0.0343, 0.0436,
	0.0532, 0.0624, 0.0703, 0.0763, 0.0793
];

function DataPoint(date) {
	this.date = new Date(date);
	this.dateStr = new Date(date).yyyymmdd();
	this.persons = [];
	this.totValue = 0;

	this.addPerson = function(person, value) {
		this.persons.push({
			"id": person.personId,
			"val": value
		});
		this.totValue = this.totValue + value;
	};

	this.removePerson = function(person) {
		var i = 0;
		for (var p in this.persons) {
			if (this.persons[p].id === person.personId) {
				this.totValue = this.totValue - this.persons[p].val;
				this.persons.remove(i);
				break;
			} else {
				i++;
			}
		}
	};
}
/* Author: Johan
 * Takes in codeObj ({"VK110": [DataPoint, ..., DataPoint], "VJ110": [DataPoint, ..., DataPoint], })
 * and returns ({"VK110": [DataPoint, ..., DataPoint], "VJ110": [DataPoint, ..., DataPoint], }) with added min and max dates
 */
function addMinMaxDate(codeObj) {
	var minDate = new Date(2220, 1, 1);
	var maxDate = new Date(1900, 1, 1);

	for (var d in codeObj) {
		if (codeObj.hasOwnProperty(d)) {
			var arr = codeObj[d];
			if (arr.length > 0) {
				var mDate = arr[0].date;
				if (mDate < minDate) minDate = mDate;
				if (mDate > maxDate) maxDate = mDate;

				mDate = arr[arr.length - 1].date;
				if (mDate < minDate) minDate = mDate;
				if (mDate > maxDate) maxDate = mDate;
			}
		}
	}


	for (var d in codeObj) {
		if (codeObj.hasOwnProperty(d)) {
			var arr = codeObj[d];
			if (arr.length > 0) {
				var mDate = arr[0].date;

				for (var i = 1; i < -mDate.daydiff(minDate) + 1; i++) {
					var da = new Date(mDate);
					da.addDays(-i);
					arr.splice(0, 0, new DataPoint(da));
				}

				mDate = arr[arr.length - 1].date;

				for (var i = 0; i < mDate.daydiff(maxDate); i++) {
					var da = new Date(mDate);
					da.addDays(i + 1);
					arr.push(new DataPoint(da))
				}


			}
		}
	}
	return codeObj;
}

function buildGraph(personArray, typee) {
	if (personArray.length === 0) return [];
	var graph = buildGraphSkeleton(personArray);
	for (var person in personArray) {
		if (typee == 0) personLinearDistribution(personArray[person], graph);
		if (typee == 1) personNormal20Distribution(personArray[person], graph);
		if (typee == 2) personNormal5Distribution(personArray[person], graph);

	}
	return graph;
}

function buildGraphSkeleton(personArray) {
	var startDate = new Date(personArray[0].startDate);
	var endDate = new Date(personArray[personArray.length - 1].startDate).addDays(132);
	var graph = [];

	for (var i = 0; new Date(startDate).addDays(i) <= endDate; i++) {
		graph.push(new DataPoint(new Date(startDate).addDays(i)));
	}
	return graph;
}

/*
 Distribute a person into the graph using a normal distribution as described by the array normalDistribution20.
 */
function personNormal20Distribution(person, graph) {
	var startDate = person.startDate;
	var i = 0;
	for (var point in graph) {
		if (graph[point].dateStr == startDate) {
			for (var j = 0; j < 119; j++) {
				if (j < 60) {
					graph[i + j].addPerson(person, normalDistribution20[j]);
				} else {
					graph[i + j].addPerson(person, normalDistribution20[normalDistribution20.length - (j - 58)]);
				}
			}
		}
		i++;
	}
}

function personNormal5Distribution(person, graph) {
	var startDate = person.startDate;
	var i = 0;
	for (var point in graph) {
		if (graph[point].dateStr == startDate) {
			for (var j = 45; j < 74; j++) {
				if (j < 60) {
					graph[i + j].addPerson(person, normalDistribution5[j - 45]);
				} else {
					graph[i + j].addPerson(person, normalDistribution5[normalDistribution5.length - (j - 58)]);
				}
			}
		}
		i++;
	}
}
/*
function personDirectDistribution(person,graph){
	var startDate = person["startDate"];
	for (var point in graph) {
		if(graph[point].dateStr == startDate){
			if (point+60 < graph.length) graph[point+60].addPerson(person,1);
		}
	}
}
*/
/*
	Distribute a person into the graph using a linear equation.
 */
function personLinearDistribution(person, graph) {
	var startDate = person.startDate;
	var i = 0;
	for (var point in graph) {
		if (graph[point].dateStr == startDate) {
			for (var j = 0; j < 60; j++) {
				graph[i + j].addPerson(person, i / 1800);
			}
		}
		i++;
	}
}
