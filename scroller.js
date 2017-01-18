var counter = 0;
var per_page = 15;
var loadAllowed = true;

document.addEventListener("scroll", loadShots);

requestShots();

function requestShots() {
	loadAllowed = false;
	counter++;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.dribbble.com/v1/shots?page=${counter}&per_page=${per_page}`, true);
	xhr.setRequestHeader("Authorization", "Bearer " + token);

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
	if (document.getElementsByClassName("image_hidden").length > 0) {
		var element = document.getElementsByClassName("image_hidden")[0];
		var element_position = element.offsetTop;		
		if (document.body.scrollTop + document.documentElement.scrollTop > element_position - window.innerHeight - 600) {
			loadShot(element);
			
		}
	}

	if (document.getElementsByClassName("image_hidden").length < 7 && loadAllowed) {
		requestShots();
	}
}

function loadShot(el) {
	var original = el.getElementsByClassName("js-load-img")[0];
	var img = new Image();
	img.onload = function () {
		original.src = original.dataset.src;
		el.className = el.className.replace('image_hidden','image_visible');
		loadShots();
	}
	img.src = original.dataset.src;
}

function addShots(shots) {
	while (shots.length > 0) {
		addShot(shots[0]);
		shots.splice(0, 1);
	}
}

function addShot(shot) {
	var image;
	if ((shot.animated === true || window.screen.width >= 1600) && shot.images.hidpi != null) {
		image = shot.images.hidpi;
	} else {
		image = shot.images.normal;
	}	
	
	document.getElementsByClassName("scroll")[0].innerHTML = document.getElementsByClassName("scroll")[0].innerHTML 
		+ `<div class="image image_hidden">
			<img class="js-load-img image_blur" src="" data-src="${image}">
			<h2 class="image_info image_info_header">
				<div class="image_info_text image_info_title">${shot.title}</div>
				<div class="image_info_text image_info_author"><div class="line"></div><div>${shot.user.name}</div></div>
			</h2>
			<div class="button_wrapper image_info"><button onclick="activateFavourite(this)" class="button_favourite button_unclicked">Favourite</button></div>
		</div>`;
}

function activateFavourite(btn) {
	if ((btn.className).indexOf("button_clicked") > -1) {
		btn.className = btn.className.replace('button_clicked','button_unclicked');
	} else {
		btn.className = btn.className.replace('button_unclicked','button_clicked');
	}
}

