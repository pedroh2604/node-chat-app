var socket = io();

// when a user connects to the app (new tab open)
socket.on('connect', function () {
	console.log('connected to server');
});

// when a user disconnects from the app (closes the tab)
socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

// when a message is sent
socket.on('newMessage', function (message) {
	console.log('New message', message);

	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`)

	jQuery('#messages').append(li);
});

// uses the latitude and longitude to show the user's location
socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	li.text(`${message.from}:`);
	a.attr('href', message.url);
	li.append(a);

	jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
// 	from: 'Frank',
// 	text: 'Hi'
// }, function (data) {
// 	console.log('Got it', data);
// });

// submits the message
jQuery('#message-form').on('submit', function(e) {
	// prevent the page from reloading when the form is sent
	e.preventDefault();

	// takes the value from the field and send it as a new message
	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function () {

	});
});

// geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation nor supported by your browser');
	}

	navigator.geolocation.getCurrentPosition(function (position) {
		//console.log(position);
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		alert('Unable to fetch location.')
	});
});