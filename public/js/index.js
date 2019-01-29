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
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();

	// the second argument is the data that will be rendered on the html
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);

	//console.log('New message', message);
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`)

	// jQuery('#messages').append(li);
});

// uses the latitude and longitude to show the user's location
socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();

	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html)

	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');

	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('href', message.url);
	// li.append(a);

	// jQuery('#messages').append(li);
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

	var messageTextbox = jQuery('[name=message]');

	// takes the value from the field and send it as a new message
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val()
	}, function () {
		// clears the textBox after the message is sent
		messageTextbox.val('');
	});
});

// geolocation
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		return alert('Geolocation nor supported by your browser');
	}

	// disables the button after clicking it once
	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		//console.log(position);
		// enables the location button
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location.')
	});
});
