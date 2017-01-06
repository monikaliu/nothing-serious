var counter = 1;
var per_page = 15;
var loadAllowed = true;
var shots = [];

document.addEventListener("getShots", requestShots);
document.addEventListener("scroll", loadShots);

requestShots();

function requestShots() {	
	loadAllowed = false;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.dribbble.com/v1/shots?page=" + counter + "&per_page=" + per_page, true);
	xhr.setRequestHeader("Authorization", "Bearer " + token);
	counter++;

	xhr.onload = function (e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			shots = shots.concat(JSON.parse(xhr.responseText));
			document.dispatchEvent(new Event('scroll'));
			loadAllowed = true;
		}
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};

	xhr.send();
}

function loadShots() {
	if ((window.innerHeight + window.scrollY) > document.body.scrollHeight - 400) {
		if (shots.length > 0) {
			loadShot(shots[0]);
			document.dispatchEvent(new Event('scroll'));
		} else if (loadAllowed) {
			requestShots();
		}
	}
}

function loadShot(shot) {
	if ((shot.animated == true || window.screen.width >= 1600) && shot.images.hidpi != null) {
		var image = shot.images.hidpi;
	} else {
		var image = shot.images.normal;
	}	
	
	document.getElementById("scroll").innerHTML = document.getElementById("scroll").innerHTML 
		+ '<div class="image">'
			+ '<img class="blur" src="' + image + '">' 
			+ '<h2 class="info">' 
				+ '<div class="text shot_title">'+ shot.title +'</div>' 
				+ '<div class="text shot_author"><div class="line"></div><div>' + shot.user.name +'</div></div>' 
				
			+ '</h2>' 
			+ '<div class="btn_wrapper info"><button onclick="activateFavourite(this)" class="fav_button">Favourite</button></div>'
		+ '</div>';		

	shots.splice(0, 1);		
}

function activateFavourite(btn) {
	btn.className += " fav_clicked";
}

