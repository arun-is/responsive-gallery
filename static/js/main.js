// To make images retina, add a class "2x" to the img element
// and add a <image-name>@2x.png image. Assumes jquery is loaded.
var dribbble_username = "RypeArts";
var queue = [];
var page = 0;
var done = false;
var spaceLeft = false;
var wait = true;
var retina;

function create(el) {
  return document.createElement(el)
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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

function getImagePath(image) {
  return image.images.hidpi || image.images.normal;
}

function setContainerWidth() {
  width = 400 * Math.floor(window.innerWidth / 400) || window.innerWidth;
  $(".container").css("width", width);
}

function getSmallImage(image) {
  return '<img class="image small" src="' + (getImagePath(image)) + '" />';
}

function addBigImage() {
  var image = queue.shift();
  $(".container").append('<img class="image big" src="' + (getImagePath(image)) + '" />');
}

function addSmallBlank() {
  $(".container").append('<img class="small" src="/static/images/blank.png" />');
}

function addBigBlank() {
  $(".container").append('<img class="big" src="/static/images/blank.png" />');
}

function addSmallImageBlock() {
  var number = 0;
  var random = Math.random();
  var a = 4, b = 3, c = 2, d = 1, tot=a+b+c+d;
  if(random < (a/tot)) {
    number = 1;
  } else if((a/tot) < random && random < ((a+b)/tot)) {
    number = 2;
  } else if((a+b)/tot < random && random < ((a+b+c)/tot)) {
    number = 3;
  } else if((a+b+c)/tot < random) {
    number = 4;
  }
  number = Math.min(number,queue.length);
  images = [];
  for(var i = 0; i < number; i++) {
    images.push(queue.shift());
  }
  var tags = [];
  for(var i = 0; i < images.length; i++) {
    tags.push(getSmallImage(images[i]));
  }
  for(var i = 0; i < (4 - tags.length); i++) {
    tags.push('<img class="small" src="/static/images/blank.png" />');
  }
  tags = shuffle(tags);
  var tagString = tags.join("");
  $(".container").append('<div class="big flex flex-wrap">' + tagString + '</div>');
}

function addImage() {
  var random = Math.random();
  var a = 2, b = 1, c = 1, tot=a+b+c;
  if(random < (a/tot)) {
    addSmallImageBlock();
  } else if((a/tot) < random && random < ((a+b)/tot)) {
    addBigImage();
  } else if(((a+b)/tot) < random) {
    addBigBlank();
  }
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
    addImage();

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
