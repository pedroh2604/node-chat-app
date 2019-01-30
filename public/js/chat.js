var socket = io();

// autoScroll to see new messages
function scrollToBottom() {
	// Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child');

	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lasMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lasMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

// when a user connects to the app (new tab open)
socket.on('connect', function () {
	console.log('connected to server');

	// redirects the user to the specific chat room
	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function (err) {
		if (err) {
			alert(err);
			// users is redirected to homepage
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

// updates the users room list when someone joins

socket.on('updateUserList', function (users) {
	//console.log('Users list', users);
	var ol = jQuery('<ol></ol>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
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
	scrollToBottom();

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

	jQuery('#messages').append(html);
	scrollToBottom();

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
