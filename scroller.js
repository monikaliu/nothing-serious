var counter = 1;
var per_page = 20;
var loadAllowed = true;

var batch;

var loadMore =  function(evt) {
	if ((window.innerHeight + window.scrollY) > document.body.offsetHeight && loadAllowed) {
		loadAllowed = false;
		console.log(counter);
		requestShots();
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
			addShots(xhr.responseText)
		}
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};

	xhr.send(null);

}

function addShots (responseText) {
	var obj = JSON.parse(responseText);
	var i = 0;

	console.log(obj);

	while (i < Object.keys(obj).length) {
		if (obj[i].animated == true || window.screen.width >= 1600) {
			var image = obj[i].images.hidpi;
		} else {
			var image = obj[i].images.normal;
		}
		document.getElementById("scroll").innerHTML = document.getElementById("scroll").innerHTML + '<div class="image"><img class="blur" src="' + image + '"> <h2><span>'+ obj[i].title +'<br />'+ obj[i].user.name +'</span></h2></div>';
		i++;
	}
	loadAllowed = true;
}
