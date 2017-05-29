// Add links to navigation bar, proto is true if in prototypes
function setMenuHtml(proto) {
	var html = "";
	html += '<a href="javascript:void(0)" class="closebtn" style="right:25px;" onclick="closeNav()">&times;</a>';
	html += '<div class ="descText">Prototyper</div>';
	html += '<div class="protoContainer">';

	for (var i = 0; i < portfolios.length; i++) {
		html += '<div class="item">';
		// If in prototype don't create a "real" link
		if (proto){
			html += '<a onclick="openLink(\'' + portfolios[i].parameter[0] + '\',' + portfolios[i].parameter[1] + ')"><img src="' + portfolios[i].src + '"></a>';
		}
		else{
			html += '<a href="'+ portfolios[i].link +'"><img src="'+ portfolios[i].src +'"></a>';
		}
		html += portfolios[i].name;
		html += '</div>';
	}

	html += '<div class="item">';
	html += '<a href="/prototypeP6.html"><img src="'+ portfolios[1].src +'"></a>';
	html += 'Cirkeldiagram';
	html += '</div>';
	html += '</div>';
	document.getElementById("getSideNav").innerHTML = html;

}

// Add all the prototypes to the front page
function printPrototypes() {
	var html = "";
	for (var r = 0; r < Math.ceil(portfolios.length / 3); r++) {
		var startid = r * 3;
		var innerString = '<div class="row">';
		for (var i = 0; i < 3; i++) {
			var id = startid + i;
			if (id < portfolios.length) {
				var obj = portfolios[id];
				innerString += "<div class='col-md-4 portfolio-item'><a href='" + obj.link + "'><img style='width: 700px; width: 400px;' class='img-responsive' src='" + obj.src + "' alt=''></a><h3>" + obj.name + "</h3><p>" + obj.desc + "</p></div>";
			}
		}
		innerString += '</div>';
		html += innerString;
	}
	document.getElementById("prototypeResponse").innerHTML = html;
}

// Open the navigation bar
function openNav() {
	if (document.getElementById("mySidenav").style.width == "250px") {
		closeNav();
	} else {
		document.getElementById("mySidenav").style.width = "250px";
		//document.getElementById("main").style.marginLeft = "250px";
	}
}

function openNavPush() {
	if (document.getElementById("mySidenav").style.width == "250px") {
		closeNav();
	} else {
		document.getElementById("mySidenav").style.width = "250px";
		document.getElementById("main").style.marginLeft = "250px";
	}
}

// Close navigation bar
function closeNav() {
	document.getElementById("mySidenav").style.width = "0";
	document.getElementById("main").style.marginLeft = "0";
}

function openSetting() {
	if (document.getElementById("settings").style.width == "300px") {
		closeSetting();
	} else {
		document.getElementById("settings").style.width = "300px";
		document.getElementById("main").style.marginRight = "300px";
	}
}

function closeSetting() {
	document.getElementById("settings").style.width = "0";
	document.getElementById("main").style.marginRight = "0";
}
