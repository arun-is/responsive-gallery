// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
var dribbble_username = "ueno";
var queue = [];
var page = 0;
var done = false;
var spaceLeft = false;
var wait = true;
var retina;

function create(el) {
  return document.createElement(el)
}

function isRetina() {
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
					  (min--moz-device-pixel-ratio: 1.5),\
					  (-o-min-device-pixel-ratio: 3/2),\
					  (min-resolution: 1.5dppx)";

	if (window.devicePixelRatio > 1)
		return true;

	if (window.matchMedia && window.matchMedia(mediaQuery).matches)
		return true;

	return false;
};

function setContainerWidth() {
  $(".container").css("width", 200 * Math.floor(window.innerWidth / 200));
}

function addImage() {
  var item = queue.shift();
  $(".container").append('<img class="image" src="' + (retina ? item.images.hidpi : item.images.normal) + '" />');
}

function addBlank() {
  $(".container").append('<img class="image" src="/static/images/blank.png" />')
}

function shotsLoaded(shots) {
  wait = false;
  if(shots.data.length === 0) {
    done = true;
  } else {
    queue = queue.concat(shots.data);
  }
}

function checkQueue() {
  if(queue.length > 0) {
    if(Math.random() > .75) {
      addImage();
    } else {
      addBlank();
    }
  } else {
    checkScroll();
    if(!done && spaceLeft && !wait) {
      getPage();
    }
  }
}

function checkScroll() {
  spaceLeft = $('body').scrollTop() >= $('body').height() - $(window).innerHeight();
}

function getPage() {
  wait = true;
  page++;
  var script = create("script");
  script.src = "https://api.dribbble.com/v1/users/"
             + dribbble_username.trim()
             + "/shots?callback=shotsLoaded&page=" + page
             + "&pageSize=" + 30
             + "&access_token=f1c1dfab25e2d2ac2989122b6837216e5dfef3a7baefb899b2da8a986a48c371";
  document.head.appendChild(script);
}

$(document).ready(function() {
  retina = isRetina();
  setContainerWidth()
  getPage();

  $(window).resize(setContainerWidth);

  setInterval(checkQueue, 100);
});
