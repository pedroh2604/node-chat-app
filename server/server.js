const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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
	
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		// io sends the data to every single connect
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	});

	// consoles when someone closes the localhost:3000 tab
	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});



server.listen(port, () => console.log(`App listening on port ${port}!`))