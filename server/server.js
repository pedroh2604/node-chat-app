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

io.on('connection', (socket) => {
	console.log('New user connect');

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});



server.listen(port, () => console.log(`App listening on port ${port}!`))