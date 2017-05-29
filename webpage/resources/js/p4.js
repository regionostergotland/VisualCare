function drawData4() {
	//console.log(constructedData)
	//var data = constructedData[textType].array;
	var data = buildGraph(filteredData);
	for (var i = 0; i < data.length; i++) {
		data[i].index = i;
	}

	var svg = d3.select("svg"),
		margin = {
			top: 20,
			right: 20,
			bottom: 30,
			left: 40
		},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;
	svg.selectAll("*").remove();
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	x.domain(data.map(function(d) {
		return d.index
	}));
	y.domain([0, d3.max(data, function(d) {
		return d.totValue;
	})]);


	var tip = d3.select('body')
		.append('div')
		.attr('class', 'tip')
		.html('I am a tooltip...')
		.style('border', '1px solid steelblue')
		.style('background', "white")
		.style('padding', '5px')
		.style('position', 'absolute')
		.style('display', 'none')
		.on('mouseover', function(d, i) {
			tip.transition().duration(0);
		})
		.on('mouseout', function(d, i) {
			tip.style('display', 'none');
		});

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y).ticks(10))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Frequency");

	//console.log(data);
	g.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.attr("class", "bar")

		.attr("width", x.bandwidth())
		.attr("x", function(d) {
			return x(d.index);
		})

		.attr("y", function(d) {
			return y(d.totValue);
		})
		.attr("height", function(d) {
			return height - y(d.totValue);
		}).on('mouseover', function(d, i) {
			tip.transition().duration(0);
			var typp = "Urin"
			if (d.type == 1) typp = "Prostata"


			var htmlString = "";

			htmlString += "<div>"
			htmlString += "Person contributing to value: " + d.persons.length + "<br />";
			htmlString += "Val: " + d.totValue + "<br />";
			htmlString += "Datum: " + d.dateStr + "<br />";
			htmlString += "</div>"


			/*for (var i = 0; i < d.persons.length; i++) {
				htmlString += filteredData[personLookup[d.persons[i].id]].personNumber + ", <br />"
			}*/
			//var htmlString = "";
			//htmlString += "Index: " + d.index + "<br />Val: " + d.totValue.toFixed(2) + "<br />Date: " + d.date.toDateString() + "<br /> Type: " + typp;
			tip.html(htmlString);
			tip.style('top', y(d.totValue) + 50 + 'px');
			tip.style('left', x(d.index) + 'px');
			tip.style('display', 'block');
		})
		.on('mouseout', function(d, i) {
			tip.transition()
				.delay(500)
				.style('display', 'none');
		});



}
