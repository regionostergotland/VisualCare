

function drawData6() {
	var VK110Data = {};
	var VJ110Data = {};
	var VK110Keys = [];
	var VJ110Keys = [];
	
	for (var i = 0; i < filteredData.length; i++) {
		if (filteredData[i].startJob === "VK110"){
			if (VK110Data.hasOwnProperty(filteredData[i].stopJob)) VK110Data[filteredData[i].stopJob] += 1;
			else VK110Data[filteredData[i].stopJob] = 1;
		}
		if (filteredData[i].startJob === "VJ110"){
			if (VJ110Data.hasOwnProperty(filteredData[i].stopJob)) VJ110Data[filteredData[i].stopJob] += 1;
			else VJ110Data[filteredData[i].stopJob] = 1;
		}
	}

	for (var key in VJ110Data) {
		if (VJ110Data.hasOwnProperty(key)) {
			VJ110Keys.push(key);
		}
	}

	for (var key in VK110Data) {
		if (VK110Data.hasOwnProperty(key)) {
			VK110Keys.push(key);
		}
	}

	if (VJ110Keys.length != 0){
		var chart1 = c3.generate({
	        bindto: '#piechart1',
		    data: {
		        json: [VJ110Data],
				keys: {
					value: VJ110Keys,
				},
		        type:'pie'
		    }
		});
	}

	if (VK110Keys.length != 0){
	    var chart2 = c3.generate({
	        bindto: '#piechart2',
	        data: {
	            json: [VK110Data],
	            keys: {
	                value: VK110Keys,
	            },
	            type:'pie'
	        }
	    });
	}

}
