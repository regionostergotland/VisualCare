function drawData3() {
	var data = buildGraph(filteredData, distType);

	var svg = d3.select("svg"),
		margin = {
			top: 20,
			right: 50,
			bottom: 30,
			left: 50
		},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;
	svg.selectAll("*").remove();

	var parseTime = d3.timeParse("%d-%b-%y");

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);

	// define the line
	var valueline = d3.line()
		.x(function(d) {
			return x(d.date);
		})
		.y(function(d) {
			return y(d.totValue);
		});

	var area = d3.area()
		.x(function(d) {
			return x(d.date);
		})
		.y1(function(d) {
			return y(d.totValue);
		});


	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) {
		return d.date;
	}));
	y.domain([0, d3.max(data, function(d) {
		return d.totValue;
	})]);

	area.y0(y(0));

	// Add the valueline path.
	g.append("path")
		.datum(data)
		.attr("fill", "steelblue")
		.attr("d", area)

	// Add the X Axis
	g.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	// Add the Y Axis
	g.append("g")
		.call(d3.axisLeft(y));
}
