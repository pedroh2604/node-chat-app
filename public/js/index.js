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

// socket.emit('createMessage', {
// 	from: 'Frank',
// 	text: 'Hi'
// }, function (data) {
// 	console.log('Got it', data);
// });


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