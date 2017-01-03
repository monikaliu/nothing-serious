var counter = 1;
var per_page = 20;
var loadAllowed = true;

var loadMore =  function(evt) {
	if ((window.innerHeight + window.scrollY) > document.body.offsetHeight && loadAllowed) {
		loadAllowed = false;
		console.log(counter);
		loadSomething();		
	}
};

loadSomething();
document.addEventListener("scroll", loadMore);


function loadSomething () {	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.dribbble.com/v1/shots?page=" + counter + "&per_page=" + per_page, true);
	xhr.setRequestHeader("Authorization", "Bearer " + token);
	counter++;

	xhr.onload = function (e) {
		addShots(xhr)
	};

	xhr.onerror = function (e) {
		console.error(xhr.statusText);
	};

	xhr.send(null);

}

function addShots (xhr) {	
	if (xhr.readyState === 4) {
		if (xhr.status === 200) {
		var obj = JSON.parse(xhr.responseText);

			for (var i = 0; i < Object.keys(obj).length; i++) {
				var image = obj[i].images.normal;
				document.getElementById("scroll").innerHTML = document.getElementById("scroll").innerHTML + '<img id="img_one" src="' + image + '">';
			}
		}
	}
	loadAllowed = true;
}
