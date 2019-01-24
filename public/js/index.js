var socket = io();

socket.on('connect', function () {
	console.log('connected to server');

	// socket.emit('createEmail', {
	// 	to: 'bea@example.com',
	// 	text: 'Hey, this is Peter'
	// });

	socket.emit('createMessage', {
		from: 'you@example.com',
		text: 'whaaat'
	});
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

// socket.on('newEmail', function (email) {
// 	console.log('New email', email);
// });

socket.on('newMessage', function (message) {
	console.log('New message', message);
});