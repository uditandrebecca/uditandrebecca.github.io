let playIcon = $('#play-icon');
let pauseIcon = $('#pause-icon');
let player = $('#player');
let mediaType = $('#media-type');
let nowPlaying = $('#now-playing');
let controls = $('#media-controls');
let currentMediaType = "song";

let currentSongIndex = 0;
let currentFunnyIndex = 0;
let playing = false;

let songs = ["Portishead - Undenied.mp3",
	"Wilco - Jesus, Etc..mp3",
	"Weezer - Jacked Up.mp3",
	"Wilco - Handshake Drugs.mp3",
	"Uncle Tupelo - New Madrid.mp3",
	"Weezer - Zombie Bastards.mp3",
	"Black Country, New Road - Across The Pond Friend.mp3",
	"Wilco - California Stars.mp3",
	"Marina - Teen Idle.mp3",
	"Golden Smog - Pecan Pie.mp3",
	"Wilco - I-'ll Fight.mp3",
	"Moby - Natural Blues.mp3",
	"Wilco - I-'m the Man Who Loves You.mp3",
	"Beirut - Scenic World.mp3",
	"Wilco - Reservations.mp3",
	"Marina - Froot.mp3",
	"Jeff Tweedy - I-'m Always In Love.mp3",
	"Jeff Tweedy - Dawned On Me.mp3"];

let funnies = ["You mean the world to me - you're the girl of my dreams.",
	"Let's say, hypothetically, that we were married. It's fair to assume that in this case, we would be husband and wife. Now would it also be reasonable to assume that I will keep you happy until the end of time? Answer that, liberal.",
	"You're my comfort. Like a background of tender blue. Rain-soaked alleyways. Dandelions losing their heads.",
	"I love you - my spirit dove, I would fold mountains for you.",
	"Tragedy is guaranteed, but I would like you to know that my love for you grows stronger every day.",
	"I'm quite a piece of work, so thank you for dealing with me. (You're no walk in the park either. Ha.)",
	"I dream of distant lands, with frozen ladders that climb through bright windows. Vast pools wait beside silent lawns, where the sun halos in a circular summer. And I think about your kiss, my infinite lover, away from an ancient blaze.",
	"The sun is waiting by the windowsill, and my fingertips write my will on your skin. I'm in love."]

$(document).ready(() => {
	console.log('Page loaded, magic ensues');
	player.attr('src', "music/" + songs[currentSongIndex]);
	nowPlaying.text(cleanName(songs[currentSongIndex]));
	playing = false;
})

function handleBold(el) {
	$(".media-select .button").removeClass('selected')
	$(el).addClass('selected');
}


function playSong(el) {
	currentMediaType = 'song'
	console.log("Rebecca wants to play a song");
	handleBold(el)
	mediaType.text('Song Mode')
	nowPlaying.text(cleanName(songs[currentSongIndex]));
	player[0].pause()
	player.attr('src', "music/" + songs[currentSongIndex]);
	pausePlayer();
	controls.show();
}

function playFunnyTime(el) {
	console.log("Rebecca wants to see a sweet message");
	currentMediaType = "funny"
	handleBold(el)
	nowPlaying.text(cleanName(funnies[currentFunnyIndex]));
	pausePlayer();
	player.attr('src', "funnytimes/" + funnies[currentFunnyIndex]);
	controls.show()
}

function freakout(el) {
	console.log("Rebecca is freaking out");
	handleBold(el)
	mediaType.text('Freakout engaged, Udit is being notified. Deep breaths!')
	player[0].pause()
	nowPlaying.text('')
	controls.hide()
	sendPush();
}

function playPauseClicked(el) {
	console.log("Rebecca pressed play/pause");
	let clicked = $(el).find('img').not(".hidden")[0];
	clicked = $(clicked).attr('id');
	if (clicked === "play-icon") {
		// Rebecca wants to play the media
		player[0].play();

		if (currentMediaType === "song") {
			nowPlaying.text(cleanName(songs[currentSongIndex]))
		} else {
			pauseIcon.removeClass('hidden');
			playIcon.removeClass('hidden')
		}
		playing = true

		playIcon.addClass('hidden');
		pauseIcon.removeClass('hidden');

	} else {
		// Rebecca is pausing
		player[0].pause();
		playing = false;
		playIcon.removeClass('hidden')
		pauseIcon.addClass('hidden');
	}
}

function nextClicked() {
	console.log('Rebecca clicked next');
	if (currentMediaType === "song") {
		currentSongIndex++
		currentSongIndex > songs.length ? currentSongIndex = 0 : true;
		player.attr('src', "music/" + songs[currentSongIndex]);
		nowPlaying.text(cleanName(songs[currentSongIndex]));
	} else {
		currentFunnyIndex++;
		currentFunnyIndex > funnies.length ? currentFunnyIndex = 0 : true;
		player.attr('src', "funnytimes/" + funnies[currentFunnyIndex]);
		nowPlaying.text(cleanName(funnies[currentFunnyIndex]));
	}

	if (playing === true) {
		player[0].play();
	}
}

function prevClicked() {
	console.log("Rebecca clicked previous")

	if (currentMediaType === "song") {
		currentSongIndex--;
		currentSongIndex < 0 ? currentSongIndex = 0 : true;
		player.attr('src', "music/" + songs[currentSongIndex]);
		nowPlaying.text(cleanName(songs[currentSongIndex]));
	} else {
		currentFunnyIndex--;
		currentFunnyIndex < 0 ? currentFunnyIndex = 0 : true;
		player.attr('src', "funnytimes/" + funnies[currentFunnyIndex]);
		nowPlaying.text(cleanName(funnies[currentFunnyIndex]));
	}

	if (playing === true) {
		player[0].play();
	}
}


player.on("ended", () => {
	console.log("Player has ended, hide play button, show pause");
	pausePlayer();
})

function pausePlayer() {
	player[0].pause()
	pauseIcon.addClass('hidden');
	playIcon.removeClass('hidden');
	playing = false;
}


function sendPush() {
	var accessToken = 'o.r2DXFy67nyONvS7IWnH4vdFk2Tsy4Xrb';
	var deviceName = 'Firefox';
	var notificationTitle = 'Rebecca\'s shit has hit the fan!';
	var notificationBody = 'Call her now.';
  
	var url = 'https://api.pushbullet.com/v2/pushes';
	var params = {
	  type: 'note',
	  device_name: deviceName,
	  title: notificationTitle,
	  body: notificationBody
	};
  
	fetch(url, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'Access-Token': accessToken
	  },
	  body: JSON.stringify(params)
	})
	.then(response => {
	  if (response.ok) {
		console.log('Notification sent successfully!');
	  } else {
		console.error('Error sending notification:', response.status, response.statusText);
	  }
	})
	.catch(error => {
	  console.error('Error sending notification:', error);
	});
  }


function cleanName(name) {
	name = name.replace('.mp3', '')
	name = name.replace('.aac', '')
	return name
}


jQuery.fn.visible = function () {
	return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function () {
	return this.css('visibility', 'hidden');
};

jQuery.fn.visibilityToggle = function () {
	return this.css('visibility', function (i, visibility) {
		return (visibility == 'visible') ? 'hidden' : 'visible';
	});
};
