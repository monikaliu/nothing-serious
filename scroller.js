var counter = 1;
var per_page = 20;
var loadAllowed = true;

var shots = [];

var loadMore =  function(evt) {
	if ((window.innerHeight + window.scrollY) > document.body.scrollHeight - 200 && loadAllowed) {
		loadAllowed = false;
		addShots();
		if ((window.innerHeight + window.scrollY) > document.body.scrollHeight - 200) {
			requestShots();
		}
		loadAllowed = true;
	}
};

requestShots();
document.addEventListener("scroll", loadMore);

function requestShots() {	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.dribbble.com/v1/shots?page=" + counter + "&per_page=" + per_page, true);
	xhr.setRequestHeader("Authorization", "Bearer " + token);
	counter++;

	xhr.onload = function (e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			shots = JSON.parse(xhr.responseText);
			addShots();
		}
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};

	xhr.send();

}

function addShots () {
	var i = 0;
	while (i < Object.keys(shots).length && (window.innerHeight + window.scrollY) > document.body.scrollHeight - 200) {
		addShot(shots[i]);
		console.log((window.innerHeight + window.scrollY) > document.body.scrollHeight - 200);
		i++;
	}
	console.log(i);
	shots.splice(0, i);	
}

function addShot(shot) {
	if ((shot.animated == true || window.screen.width >= 1600) && shot.images.hidpi != null) {
		var image = shot.images.hidpi;
	} else {
		var image = shot.images.normal;
	}
	document.getElementById("scroll").innerHTML = document.getElementById("scroll").innerHTML 
		+ '<div class="image">'
			+ '<img class="blur" src="' + image + '">' 
			+ '<h2>' 
				+ '<div class="text shot_title">'+ shot.title +'</div>' 
				+ '<div class="text shot_author"><div class="line"></div><div>' + shot.user.name +'</div></div>' 
			+ '</h2>' 
		+ '</div>';
}


