function drawData1() {
	var currentData = [];
	// Loop over every filterd person
	$.each(filteredData, function(index, pObj) {
		if (barType === 0) {
			//Construct age date
			var currAge = getAge(pObj['personNumber'].substr(0, 8));
			if (currAge in currentData) {
				currentData[currAge].y++;
			} else {
				currentData[currAge] = {
					y: 1,
					x: currAge,
					xDesc: currAge + ' år gammal'
				};
			}
		} else if (barType === 1) {
			var sex = getSex(pObj.personNumber);
			if (currentData.length === 0) {
				currentData.push({
					y: 0,
					x: 0,
					xDesc: 'män'
				})
				currentData.push({
					y: 0,
					x: 1,
					xDesc: 'kvinnor'
				})
			}

			if (sex === 'MEN') {
				currentData[0].y++;
			} else {
				currentData[1].y++;
			}
		}
	});

	var formatLabel = function(d) {
		if (barType === 1) {
			if (d === 0) return 'Män' // Män with unicode
			return 'Kvinna'
		}
		return d;
	}


	// TODO Why do this?
	for (var i = currentData.length - 1; i >= 0; i--) {
		if (currentData[i] === undefined) currentData.splice(i, 1);
	}


	var svg = d3.select('svg'),
		margin = {
			top: 20,
			right: 70,
			bottom: 30,
			left: 40
		},
		width = +svg.attr('width') - margin.left - margin.right,
		height = +svg.attr('height') - margin.top - margin.bottom;

	svg.selectAll('*').remove();

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
		y = d3.scaleLinear().rangeRound([height, 0]);

	var g = svg.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	x.domain(currentData.map(function(d) {
		return d.x
	}));
	y.domain([0, d3.max(currentData, function(d) {
		return d.y;
	})]);

	var tip = d3.select('body')
		.append('div')
		.attr('class', 'tip')
		.html('I am a tooltip...')
		.style('border', '1px solid steelblue')
		.style('background', 'white')
		.style('padding', '5px')
		.style('position', 'absolute')
		.style('display', 'none')
		.on('mouseover', function(d, i) {
			tip.transition().duration(0);
		})
		.on('mouseout', function(d, i) {
			tip.style('display', 'none');
		});

	g.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x).tickFormat(formatLabel));

	g.append('g')
		.attr('class', 'axis axis--y')
		.call(d3.axisLeft(y).ticks(10))
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('Frequency');

	//console.log(currentData);
	g.selectAll('.bar')
		.data(currentData)
		.enter().append('rect')
		.attr('class', 'bar')

		.attr('width', x.bandwidth())
		.attr('x', function(d) {
			return x(d.x);
		})

		.attr('y', function(d) {
			return y(d.y);
		})
		.attr('height', function(d) {
			return height - y(d.y);
		}).on('mouseover', function(d, i) {
			tip.transition().duration(0);

			var htmlString = '';
			htmlString += '<div>'
			htmlString += d.y + ' patienter är ' + d.xDesc + '.';
			htmlString += '</div>'

			tip.html(htmlString);
			tip.style('top', y(d.y) + 200 + 'px');
			tip.style('left', x(d.x) + 120 + 'px');
			tip.style('display', 'block');
		})
		.on('mouseout', function(d, i) {
			tip.transition()
				.delay(500)
				.style('display', 'none');
		});
}
