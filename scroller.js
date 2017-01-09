var counter = 1;
var per_page = 15;
var first = true;
var loadAllowed = true;

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
			addShots(JSON.parse(xhr.responseText));
			loadShots();
			loadAllowed = true;
		}
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};

	xhr.send();
}

function loadShots() {
	if ((window.innerHeight + window.scrollY) > document.body.scrollHeight - 600 || first) {
		first = false;
		if (document.getElementsByClassName("is_hidden").length > 0) {
			var element = document.getElementsByClassName("is_hidden")[0];
			var element_position = element.offsetTop;
			if (document.body.scrollTop > element_position - window.innerHeight) {
				loadShot(element);
			}
			if (document.getElementsByClassName("is_hidden").length < 7 && loadAllowed) {
				requestShots();
			}
		} else if (loadAllowed) {
			requestShots();
		}
	}
}

function loadShot(el) {
	var original = el.getElementsByClassName("blur")[0];	
	var img = new Image();
	img.onload = function () {
		original.src = original.getAttribute("data_src");
		el.className = el.className.replace('is_hidden','is_visible');
		loadShots();
	}
	img.src = original.getAttribute("data_src");
}

function addShots(shots) {
	while (shots.length > 0) {
		addShot(shots[0]);
		shots.splice(0, 1);
	}
}

function addShot(shot) {
	if ((shot.animated == true || window.screen.width >= 1600) && shot.images.hidpi != null) {
		var image = shot.images.hidpi;
	} else {
		var image = shot.images.normal;
	}	
	
	document.getElementById("scroll").innerHTML = document.getElementById("scroll").innerHTML 
		+ '<div class="image is_hidden">'
			+ '<img class="blur" src="' + '" data_src=' + image + '>' 
			+ '<h2 class="info">' 
				+ '<div class="text shot_title">'+ shot.title +'</div>' 
				+ '<div class="text shot_author"><div class="line"></div><div>' + shot.user.name +'</div></div>'
			+ '</h2>' 
			+ '<div class="btn_wrapper info"><button onclick="activateFavourite(this)" class="fav_button fav_unclicked">Favourite</button></div>'
		+ '</div>';
}

function activateFavourite(btn) {
	if ((btn.className).indexOf("fav_clicked") > -1) {
		btn.className = btn.className.replace('fav_clicked','fav_unclicked');
	} else {
		btn.className = btn.className.replace('fav_unclicked','fav_clicked');
	}
}

