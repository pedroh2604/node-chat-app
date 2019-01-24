const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const PublicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(PublicPath));

// socking is listening when the connection is stablished server -> user
io.on('connection', (socket) => {
	// consoles when someone accesses localhost:3000
	console.log('New user connected');

	// logged to just to the user who joined
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	// logged to to all users
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		// io sends the data to every single connect
		io.emit('newMessage', generateMessage(message.from, message.text));
		
		// fires the message to everybody but the one who fired it
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	// consoles when someone closes the localhost:3000 tab
	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});



server.listen(port, () => console.log(`App listening on port ${port}!`))