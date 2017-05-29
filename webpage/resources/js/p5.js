var scaler = 0.8;
var graphs = d3.select("svg#graphs");
var info = d3.select("svg#info");
var panel = d3.select("#panel");
var x = graphs.attr("width") / 9.5 * scaler;
var y = graphs.attr("height") / 6 * scaler;
var width = graphs.attr("width") / 950 * 1000 * scaler;
var height = graphs.attr("height") / 4 * scaler;
var areaColors = ["#d30000", "#00d300", "#0000d3", "#000000"];
var legends = ["Summa", "Prostatacancer", "Urinblåsecancer", "Kapacitet"];
var capacity = 10;
var upperData = [{
        d: 1,
        f: 0
    }, {
        d: 2,
        f: 2
    }, {
        d: 3,
        f: 0
    },
    {
        d: 4,
        f: 2
    }, {
        d: 5,
        f: 4
    }, {
        d: 6,
        f: 1
    }, {
        d: 7,
        f: 0
    },
    {
        d: 8,
        f: 0
    }, {
        d: 9,
        f: 2
    }, {
        d: 10,
        f: 0
    }, {
        d: 11,
        f: 1
    },
    {
        d: 12,
        f: 6
    }, {
        d: 13,
        f: 5
    }, {
        d: 14,
        f: 0
    }, {
        d: 15,
        f: 0
    },
    {
        d: 16,
        f: 2
    }, {
        d: 17,
        f: 1
    }, {
        d: 18,
        f: 1
    }, {
        d: 19,
        f: 1
    },
    {
        d: 20,
        f: 6
    }, {
        d: 21,
        f: 0
    }, {
        d: 22,
        f: 0
    }, {
        d: 23,
        f: 6
    },
    {
        d: 24,
        f: 2
    }, {
        d: 25,
        f: 1
    }, {
        d: 26,
        f: 2
    }, {
        d: 27,
        f: 0
    },
    {
        d: 28,
        f: 0
    }, {
        d: 29,
        f: 0
    }, {
        d: 30,
        f: 3
    }, {
        d: 31,
        f: 2
    }
];
var lowerData = [{
        d: 1,
        f: 0
    }, {
        d: 2,
        f: 1
    }, {
        d: 3,
        f: 1
    },
    {
        d: 4,
        f: 3
    }, {
        d: 5,
        f: 1
    }, {
        d: 6,
        f: 1
    }, {
        d: 7,
        f: 0
    },
    {
        d: 8,
        f: 0
    }, {
        d: 9,
        f: 3
    }, {
        d: 10,
        f: 2
    }, {
        d: 11,
        f: 3
    },
    {
        d: 12,
        f: 2
    }, {
        d: 13,
        f: 2
    }, {
        d: 14,
        f: 0
    }, {
        d: 15,
        f: 0
    },
    {
        d: 16,
        f: 1
    }, {
        d: 17,
        f: 0
    }, {
        d: 18,
        f: 3
    }, {
        d: 19,
        f: 2
    },
    {
        d: 20,
        f: 3
    }, {
        d: 21,
        f: 0
    }, {
        d: 22,
        f: 0
    }, {
        d: 23,
        f: 5
    },
    {
        d: 24,
        f: 2
    }, {
        d: 25,
        f: 1
    }, {
        d: 26,
        f: 1
    }, {
        d: 27,
        f: 1
    },
    {
        d: 28,
        f: 0
    }, {
        d: 29,
        f: 0
    }, {
        d: 30,
        f: 2
    }, {
        d: 31,
        f: 2
    }
];


function drawData5() {
    var sumData = [];

    //console.log(constructedData)
    //var data = constructedData[textType].array;
    //var data = buildGraph(filteredData);


    var data11 = [];
    var data21 = [];


    for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].startJob === "VK110") data11.push(filteredData[i]);
        if (filteredData[i].startJob === "VJ110") data21.push(filteredData[i]);
    }
    var data1 = buildGraph(data11, distType);
    var data2 = buildGraph(data21, distType);
    var codeObj = {
        "VK110": data1,
        "VJ110": data2
    }
    codeObj = addMinMaxDate(codeObj);

    upperData = [];
    lowerData = [];

    for (var i = 0; i < data1.length; i++) {
        upperData.push({
            "f": data1[i].totValue,
            "d": i,
            "dPoint": data1[i]
        });
    }

    for (var i = 0; i < data2.length; i++) {
        lowerData.push({
            "f": data2[i].totValue,
            "d": i,
            "dPoint": data2[i]
        });
    }



    d3.select("svg#graphs").selectAll("*").remove();

    // Loop over the longest list
    let longest = (upperData.length > lowerData.length ? upperData : lowerData).length;
    for (var i = 0; i < longest; i++) {
        var val1 = 0;
        var val2 = 0;
        if (i < upperData.length) val1 = upperData[i].f;
        if (i < lowerData.length) val2 = lowerData[i].f;

        sumData[i] = {
            d: i,
            f: (val1 + val2)
        };
    }
    var sumLimitData = [];
    for (var i = 0; i < sumData.length; i++) {
        sumLimitData.push({
            d: (i + 1),
            f: capacity
        });
    }
    // header
    graphs.append("text")
        .style("font-size", y * 28 / 100 + "px")
        .style("font-family", "calibri")
        .style("fill", "#0066b3")
        .attr("x", x)
        .attr("y", y / 2)
    // sum x and y scalers
    var xSumScaler = d3.scaleLinear()
        .domain([1, d3.max(sumData, function(e) {
            return e.d;
        })])
        .rangeRound([0, width]);
    var ySumScaler = d3.scaleLinear()
        .domain([0, d3.max(sumData, function(e) {
            return e.f;
        })])
        .rangeRound([height, 0]);
    // upper x and y scalers
    var xUpperScaler = d3.scaleLinear()
        .domain([1, d3.max(upperData, function(e) {
            return e.d;
        })])
        .rangeRound([0, width]);
    var yUpperScaler = d3.scaleLinear()
        .domain([0, d3.max(upperData, function(e) {
            return e.f;
        })])
        .rangeRound([height, 0]);
    // lower x and y scalers
    var xLowerScaler = d3.scaleLinear()
        .domain([1, d3.max(lowerData, function(e) {
            return e.d;
        })])
        .rangeRound([0, width]);
    var yLowerScaler = d3.scaleLinear()
        .domain([0, d3.max(lowerData, function(e) {
            return e.f;
        })])
        .rangeRound([height, 0]);
    // sum area and limit line
    var sumArea = d3.area()
        .x(function(e) {
            return xSumScaler(e.d);
        })
        .y0(height)
        .y1(function(e) {
            return ySumScaler(e.f);
        })
        .curve(d3.curveCardinal);
    var sumLimitLine = d3.line()
        .x(function(e) {
            return xSumScaler(e.d);
        })
        .y(function(e) {
            return ySumScaler(e.f);
        });
    // upper area
    var upperArea = d3.area()
        .x(function(e) {
            return xUpperScaler(e.d);
        })
        .y0(height)
        .y1(function(e) {
            return yUpperScaler(e.f);
        })
        .curve(d3.curveCardinal);
    // lower area
    var lowerArea = d3.area()
        .x(function(e) {
            return xLowerScaler(e.d);
        })
        .y0(height)
        .y1(function(e) {
            return yLowerScaler(e.f);
        })
        .curve(d3.curveCardinal);
    // add sum path and limit line
    graphs.append("path")
        .datum(sumData)
        .attr("d", sumArea)
        .attr("transform", "translate(" + x + "," + y + ")")
        .style("fill", areaColors[0]);
    graphs.append("path")
        .data([sumLimitData])
        .attr("d", sumLimitLine)
        .attr("transform", "translate(" + x + "," + y + ")")
        .attr("stroke-width", 1)
        .style("stroke", "black");
    // add upper path
    graphs.append("path")
        .datum(upperData)
        .attr("d", upperArea)
        .attr("transform", "translate(" + x + "," + (y + height * 1.3) + ")")
        .style("fill", areaColors[1]);
    // add lower path
    graphs.append("path")
        .datum(lowerData)
        .attr("d", lowerArea)
        .attr("transform", "translate(" + x + "," + (y + height * 2.6) + ")")
        .style("fill", areaColors[2]);
    // add sum x and y axis
    graphs.append("g")
        .attr("class", "x axis")
        .attr("fill", areaColors[0])
        .attr("transform", "translate(" + x + "," + (y + height) + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisBottom(xSumScaler));
    graphs.append("g")
        .attr("class", "y axis")
        .attr("fill", areaColors[0])
        .attr("transform", "translate(" + x + "," + y + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisLeft(ySumScaler));
    // add upper x and y axis
    graphs.append("g")
        .attr("class", "x axis")
        .attr("fill", areaColors[1])
        .attr("transform", "translate(" + x + "," + (y + height * 2.3) + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisBottom(xUpperScaler));
    graphs.append("g")
        .attr("class", "y axis")
        .attr("fill", areaColors[1])
        .attr("transform", "translate(" + x + "," + (y + height * 1.3) + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisLeft(yUpperScaler));
    // add lower x and y axis
    graphs.append("g")
        .attr("class", "x axis")
        .attr("fill", areaColors[2])
        .attr("transform", "translate(" + x + "," + (y + height * 3.6) + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisBottom(xLowerScaler));
    graphs.append("g")
        .attr("class", "y axis")
        .attr("fill", areaColors[2])
        .attr("transform", "translate(" + x + "," + (y + height * 2.6) + ")")
        .style("font-size", height * 16 / 200 + "px")
        .call(d3.axisLeft(yLowerScaler));
    // add legends
    for (var i = 0; i < legends.length; i++) {
        graphs.append("rect")
            .attr("x", x + x * 2.5 * i)
            .attr("y", height * 4.6)
            .attr("width", width * 0.03)
            .attr("height", width * 0.03)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", areaColors[i]);
        graphs.append("text")
            .style("font-size", height * 0.1 + "px")
            .style("font-family", "calibri")
            .style("fill", areaColors[i])
            .attr("x", x * 1.5 + x * 2.5 * i)
            .attr("y", height * 4.73)
            .text(legends[i]);
    }

    var maxxval = 0;
    for (var i = 0; i < sumData.length; i++) {
        console.log()
        if (y + ySumScaler(sumData[i].f) > maxxval) maxxval = y + ySumScaler(sumData[i].f);
    }
    // add area line dots
    for (var i = 0; i < sumData.length; i++) {
        graphs.append("rect")
            .attr("x", x + xSumScaler(sumData[i].d))
            .attr("y", y + ySumScaler(sumData[i].f))
            .attr("width", 3)
            .attr("height", maxxval - (y + ySumScaler(sumData[i].f)))
            .attr("id", i)
            .style("fill", "red")
            .on("mouseover", function() {
                d3.select(this).style("fill", "darkred")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", "red")
            })
            .on("click", function() {
                var id = d3.select(this).attr("id");

                var pers = [];
                for (var j = 0; j < lowerData[id].dPoint.persons.length; j++) {
                    pers.push(personLookup[lowerData[id].dPoint.persons[j].id]);
                }
                for (var j = 0; j < upperData[id].dPoint.persons.length; j++) {
                    pers.push(personLookup[upperData[id].dPoint.persons[j].id]);
                }
                var persUnique = pers.filter(onlyUnique)
                console.log(persUnique)
                updateInfo(persUnique);

            });

    }
    maxxval = 0;
    for (var i = 0; i < upperData.length; i++) {
        if (y + height * 1.3 + yUpperScaler(upperData[i].f) > maxxval) maxxval = y + height * 1.3 + yUpperScaler(upperData[i].f);
    }

    for (var i = 0; i < upperData.length; i++) {

        graphs.append("rect")
            .attr("x", x + xUpperScaler(upperData[i].d))
            .attr("y", y + height * 1.3 + yUpperScaler(upperData[i].f))
            .attr("width", 3)
            .attr("height", maxxval - (y + height * 1.3 + yUpperScaler(upperData[i].f)))
            .attr("id", i)
            .style("fill", areaColors[1])
            .on("mouseover", function() {
                d3.select(this).style("fill", "darkgreen")
            })
            .on("mouseout", function() {
                d3.select(this).style("fill", areaColors[1])
            })
            .on("click", function() {
                var id = d3.select(this).attr("id");
                var pers = [];
                for (var j = 0; j < upperData[id].dPoint.persons.length; j++) {
                    pers.push(personLookup[upperData[id].dPoint.persons[j].id]);
                }
                var persUnique = pers.filter(onlyUnique)
                updateInfo(persUnique);
            });

    }

		maxxval = 0;
		for (var i = 0; i < lowerData.length; i++) {
        if (y + height * 2.6 + yLowerScaler(lowerData[i].f) > maxxval) maxxval = y + height * 2.6 + yLowerScaler(lowerData[i].f);
    }
    for (var i = 0; i < lowerData.length; i++) {
			graphs.append("rect")
					.attr("x", x + xLowerScaler(lowerData[i].d))
					.attr("y", y + height * 2.6 + yLowerScaler(lowerData[i].f))
					.attr("width", 3)
					.attr("height", maxxval - (y + height * 2.6 + yLowerScaler(lowerData[i].f)))
					.attr("id", i)
					.style("fill", areaColors[2])
					.on("mouseover", function() {
							d3.select(this).style("fill", "darkblue")
					})
					.on("mouseout", function() {
							d3.select(this).style("fill", areaColors[2])
					})
					.on("click", function() {
							var id = d3.select(this).attr("id");
							var pers = [];
							for (var j = 0; j < lowerData[id].dPoint.persons.length; j++) {
									pers.push(personLookup[lowerData[id].dPoint.persons[j].id]);
							}
							var persUnique = pers.filter(onlyUnique)
							updateInfo(persUnique);
					});
    }

}

function updateInfo(pers) {
    // reset side bar
    d3.select("svg#info").selectAll("*").remove();
    // append pie charts
    var w = info.attr("width") * scaler;
    var h = info.attr("height") * scaler;
    var r = Math.min(w * 0.5, h * 0.55) / 2;
    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#ff33dd"]);
    var startCodes = [{
        d: "A",
        f: 0
    }, {
        d: "B",
        f: 0
    }, {
        d: "C",
        f: 0
    }, {
        d: "D",
        f: 0
    }, {
        d: "E",
        f: 2
    }];
    var stopCodes = [{
        d: "E",
        f: 0
    }, {
        d: "F",
        f: 0
    }, {
        d: "G",
        f: 0
    }, {
        d: "H",
        f: 0
    }, {
        d: "E",
        f: 2
    }];
    startCodes = [];
    stopCodes = [];
    /*for (var i = 0; i < startCodes.length; i++) {
    		startCodes[i].f = Math.trunc(Math.random() * 3) + 1;
    		stopCodes[i].f = Math.trunc(Math.random() * 3) + 1;
    }*/

    // append bar chart of age spans
    var ages = [{
            k: "0-20",
            v: 0
        }, {
            k: "21-40",
            v: 0
        }, {
            k: "41-60",
            v: 0
        },
        {
            k: "61-80",
            v: 0
        }, {
            k: "81-",
            v: 0
        }
    ];
    var gender = [{
        k: "Män",
        v: 0
    }, {
        k: "Kvinnor",
        v: 0
    }];

    /*for (var i = 0; i < ages.length; i++) {
    		ages[i].v = Math.trunc(Math.random() * 3) + 1;
    }*/

    var startFix = {};
    var stopFix = {};

    if (pers != undefined) {
        for (var i = 0; i < pers.length; i++) {
            var id = pers[i];
            var person = filteredData[id];
            var age = getAge(person.personNumber.substr(0, 8));
            var sex = getSex(person.personNumber);
            var startJob = person.startJob;
            var stopJob = person.stopJob;

            if (startJob in startFix) {
                startFix[startJob].f++;
            } else {
                startFix[startJob] = {
                    d: startJob,
                    f: 1
                }
            }
            if (stopJob in stopFix) {
                stopFix[stopJob].f++;
            } else {
                stopFix[stopJob] = {
                    d: stopJob,
                    f: 1
                }
            }

            /*var found = false;
            for (var i = 0; i < startCodes.length; i++) {
            	if (startCodes[i].d == startJob){ startCodes[i].f++;
            		found = true;
            		break;
            	}
            }
            console.log(found + "1")
            if (found == false) startCodes.push({d: startJob, f:1})

            found = false;
            for (var i = 0; i < stopCodes.length; i++) {
            	if (stopCodes[i].d == stopJob){ stopCodes[i].f++;
            		found = true;
            		break;
            	}
            }
            console.log(found + "2")
            if (found == false) stopCodes.push({d: stopJob, f:1})
            */

            if (age >= 0 && age < 21) {
                ages[0].v++;
            }
            if (age >= 21 && age < 41) {
                ages[1].v++;
            }
            if (age >= 41 && age < 61) {
                ages[2].v++;
            }
            if (age >= 61 && age < 81) {
                ages[3].v++;
            }
            if (age >= 81) {
                ages[4].v++;
            }

            if (sex == "MEN") gender[0].v++;
            if (sex == "WOMEN") gender[1].v++;


        }
    }

    for (var d in startFix) {
        if (startFix.hasOwnProperty(d)) {
            startCodes.push(startFix[d])
        }
    }

    for (var d in stopFix) {
        if (stopFix.hasOwnProperty(d)) {
            stopCodes.push(stopFix[d])
        }
    }


    info.append("text")
        .attr("x", (w / 2))
        .attr("y", h * 0.2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "calibri")
        .style("fill", "#0066b3")
        .text("Start KVÅ-kod och Slut KVÅ-kod");
    var startPie = d3.pie().sort(null).value(function(d) {
        return d.f;
    });
    var startPath = d3.arc().outerRadius(r - 10).innerRadius(0);
    var startLabel = d3.arc().outerRadius(r - 40).innerRadius(r - 40);
    var startArc = info.selectAll(".arc").data(startPie(startCodes))
        .enter().append("g").attr("class", "arc");
    startArc.append("path").attr("d", startPath)
        .attr("fill", function(d) {
            return color(d.data.d);
        })
        .attr("transform", "translate(" + r + "," + h * 0.35 + ")");
    startArc.append("text")
        .attr("transform", function(d) {
            pos = startLabel.centroid(d);
            return "translate(" + (pos[0] + w * 0.22) + "," + (pos[1] + h * 0.35) + ")";
        })
        .attr("dy", "10px").text(function(d) {
            return d.data.d;
        });
    var stopPie = d3.pie().sort(null).value(function(d) {
        return d.f;
    });
    var stopPath = d3.arc().outerRadius(r - 10).innerRadius(0);
    var stopLabel = d3.arc().outerRadius(r - 40).innerRadius(r - 40);
    var stopArc = info.selectAll(".arc2").data(stopPie(stopCodes))
        .enter().append("g").attr("class", "arc2");
    stopArc.append("path").attr("d", stopPath)
        .attr("fill", function(d) {
            return color(d.data.d);
        })
        .attr("transform", "translate(" + r * 3 + "," + h * 0.35 + ")");
    stopArc.append("text")
        .attr("transform", function(d) {
            pos = stopLabel.centroid(d);
            return "translate(" + (pos[0] + w * 0.74) + "," + (pos[1] + h * 0.35) + ")";
        })
        .attr("dy", "10px").text(function(d) {
            return d.data.d;
        });


    info.append("text")
        .attr("x", (w / 2))
        .attr("y", h * 0.57)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "calibri")
        .style("fill", "#0066b3")
        .text("Åldersfördelning");
    var xBarScaler = d3.scaleBand().range([w * 0.15, w * 0.9]).padding(0.1)
        .domain(ages.map(function(d) {
            return d.k;
        }));
    var yBarScaler = d3.scaleLinear().range([h * 0.75, h * 0.6])
        .domain([0, d3.max(ages, function(e) {
            return e.v;
        })]);
    info.append("g").attr("transform", "translate(0," + h * 0.75 + ")")
        .call(d3.axisBottom(xBarScaler));
    info.append("g").attr("transform", "translate(" + w * 0.15 + ", 0)")
        .call(d3.axisLeft(yBarScaler).ticks(3));
    info.selectAll(".bar")
        .data(ages)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return xBarScaler(d.k);
        })
        .attr("width", xBarScaler.bandwidth())
        .attr("y", function(d) {
            return yBarScaler(d.v);
        })
        .attr("height", function(d) {
            return h * 0.75 - yBarScaler(d.v);
        })
        .style("fill", "#0000d3");
    // append horizontal bar chart for gender


    info.append("text")
        .attr("x", (w / 2))
        .attr("y", h * 0.87)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-family", "calibri")
        .style("fill", "#0066b3")
        .text("Könsfördelning");
    var xHorizontalBarScaler = d3.scaleLinear().range([w * 0.15, w * 0.9])
        .domain([0, d3.max(gender, function(d) {
            return d.v;
        })]);
    var yHorizontalBarScaler = d3.scaleBand().range([h * 1.05, h * 0.9])
        .domain(gender.map(function(d) {
            return d.k;
        })).padding(0.1);
    info.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h * 1.05 + ")")
        .call(d3.axisBottom(xHorizontalBarScaler).ticks(5));
    info.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + w * 0.15 + ", 0)")
        .call(d3.axisLeft(yHorizontalBarScaler));
    info.selectAll(".horizontalBar")
        .data(gender)
        .enter().append("rect")
        .attr("class", "horizontalBar")
        .attr("x", w * 0.15)
        .attr("height", yHorizontalBarScaler.bandwidth())
        .attr("y", function(d) {
            return yHorizontalBarScaler(d.k);
        })
        .attr("width", function(d) {
            return xHorizontalBarScaler(d.v) - w * 0.15;
        })
        .style("fill", "#00d300");
}
