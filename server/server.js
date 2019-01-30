const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const PublicPath = path.join(__dirname, '../public');
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(PublicPath));

// socking is listening when the connection is stablished server -> user
io.on('connection', (socket) => {
	// consoles when someone accesses localhost:3000
	console.log('New user connected');

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}

		// join an specific room
		socket.join(params.room);
		//removes the user from a previous room
		users.removeUser(socket.id);
		// adds a user to the room
		users.addUser(socket.id, params.name, params.room);

		/*
		** emit stuff to specific rooms 
		**io.emit -> io.to('room name').emit
		**socket.broadcast.emit -> socket.broadcast.to('room name').emit
		**socket.emit
		*/

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		// logged to just to the user who joined
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		// logged to to all users
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

		callback();
	});

	socket.on('createMessage', (message, callback) => {
		//console.log('createMessage', message);

		var user = users.getUser(socket.id);

	    if (user && isRealString(message.text)) {
	    	// io sends the data to every single user connected in the room
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
	    }
		
		callback();
		// fires the message to everybody but the one who fired it
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('createLocationMessage', (coords) => {
		var user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
		
	});

	// consoles when someone closes the localhost:3000 tab
	socket.on('disconnect', () => {
		console.log('User was disconnected');

		// removes a user from the room list, when they disconnect
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});



server.listen(port, () => console.log(`App listening on port ${port}!`))