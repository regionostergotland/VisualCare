function drawData2() {
	var data = constructedData;
	var svg = d3.select("svg"),
		margin = {
			top: 20,
			right: 100,
			bottom: 30,
			left: 100
		},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	svg.selectAll("*").remove();
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
		.call(d3.axisLeft(y).ticks(1))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("Bajs");

	var scaleHeight = 30;
	var scaleWidth = 100;
	var scaleX = 30;
	var scaleY = 5;
	var colorScaler = [];
	for (var i = 0; i < scaleWidth; i++) {
		colorScaler[i] = new Object();
		colorScaler[i].val = map(i, 0, scaleWidth, minVal, maxVal);
		colorScaler[i].id = i;
	}

	g.append("rect")
		.attr("height", scaleHeight + 2)
		.attr("width", scaleWidth + 2)
		.attr("x", scaleX - 1)
		.attr("y", scaleY - 1);

	g.append("text")
		.attr("x", scaleX)
		.attr("y", scaleY + scaleHeight + 16)
		.attr("text-anchor", "middle")
		.text("" + minVal.toFixed(2));

	g.append("text")
		.attr("x", scaleX + scaleWidth)
		.attr("y", scaleY + scaleHeight + 16)
		.attr("text-anchor", "middle")
		.text("" + maxVal.toFixed(2));

	g.selectAll(".colorScaler")
		.data(colorScaler)
		.enter().append("rect")
		.attr("class", "scaler")
		.attr("height", scaleHeight)
		.attr("width", 1)
		.attr("style", function(d) {

			var color = panColor(d.val, minVal, maxVal, startColor, endColor);
			var styleString = "fill:rgb(" + color.r + "," + color.g + "," + color.b + ");";
			return styleString;
		})
		.attr("x", function(d) {
			return scaleX + d.id;
		})
		.attr("y", scaleY);


	var bWidth = 0;

	var datas = [];

	for (var i = 0; i < Object.keys(constructedData).length; i++) {
		var key = Object.keys(constructedData)[i];
		var object = constructedData[key];
		bWidth = (width - 10) / object.array.length;
		for (var k = 0; k < object.array.length; k++) {
			datas.push(object.array[k])
		}
	}

	var bHeight = 100;

	g.selectAll(".bar")
		.data(datas)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("height", bHeight)
		.attr("width", bWidth + 4)
		.attr("style", function(d) {
			var color = panColor(d.val, minVal, maxVal, startColor, endColor)
			var styleString = "fill:rgb(" + color.r + "," + color.g + "," + color.b + ");";

			return styleString;
		})
		.attr("x", function(d) {
			d.xx = d.index * (bWidth) + 10;
			return d.index * (bWidth) + 10
		})
		.attr("y", function(d) {
			d.yy = height - (bHeight + 20) * (d.type + 1);
			return height - (bHeight + 20) * (d.type + 1);
		})
		.on('mouseover', function(d, i) {
			tip.transition().duration(0);
			var typp = "Urin"
			if (d.type == 1) typp = "Prostata"
			var htmlString = "";
			htmlString += "Val: " + d.val.toFixed(2) + "<br />Date: " + d.date.toDateString() + "<br /> Type: " + typp;
			tip.html(htmlString);
			tip.style('top', d.yy + 50 + 'px');
			tip.style('left', d.xx + 'px');
			tip.style('display', 'block');
		})
		.on('mouseout', function(d, i) {
			tip.transition()
				.delay(500)
				.style('display', 'none');
		})

	g.append("text")
		.attr("x", 10)
		.attr("y", height + 20)
		.attr("text-anchor", "middle")
		.text("" + minDate.toDateString());

	g.append("text")
		.attr("x", 10 + width + bWidth)
		.attr("y", height + 20)
		.attr("text-anchor", "middle")
		.text("" + maxDate.toDateString());

	g.append("text")
		.attr("x", -10)
		.attr("y", height - (bHeight + 20) + bHeight / 2)
		.attr("text-anchor", "end")
		.text("Urin");
	g.append("text")
		.attr("x", -10)
		.attr("y", height - (bHeight + 20) * 2 + bHeight / 2)
		.attr("text-anchor", "end")
		.text("Prostata");

}
