const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var path = require('path');
const mongoose = require('mongoose');

//Connection DB
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://127.0.0.1/chat-database') //'mongodb://localhost/chat-database'
    .then(db => console.log('db is connected'))
    .catch(err => console.log(err));

//settings
app.set('port', process.env.PORT || 3000);
require('./sockets')(io);

//static file
app.use(express.static(path.join(__dirname, 'public')));

// starting server
const server = http.listen(app.get('port'), () => {
    console.log("Listening on port 3000");
});