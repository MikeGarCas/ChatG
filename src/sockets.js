const Chat = require('./models/Chat');


module.exports = function (io) {

    let users = {};
    io.on('connection', async socket => {
        console.log('New user connected');

        let messages = await Chat.find({});
        socket.emit('Load old msg', messages);

        socket.on('New User', (data, cb) => {
            console.log(data);
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickName = data;
                users[socket.nickName] = socket;
                //users.push(socket.nickName);
                updateusers();
            }
        });

        socket.on('Send message', async (data, cb) => {

            var msg = data.trim();
            console.log('msg', msg);

            if (msg.substr(0, 3) === '/w ') {
                console.log('substr', msg.substr(0, 3));
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substring(0, index);
                    var msg = msg.substring(index + 1);
                    if (name in users) {
                        users[name].emit('whisper', {
                            msg,
                            nick: socket.nickName
                        });
                    } else {
                        cb('This user is offline');
                    }
                } else {
                    cb("Please enter message");
                }
            } else {
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickName
                });

                await newMsg.save();
                io.sockets.emit('New messages', {
                    msg,
                    nick: socket.nickName
                });
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickName) return;
            delete users[socket.nickName];
            //users.splice(users.indexOf(socket.nickName), 1);
            updateusers();
        });

        function updateusers() {
            io.sockets.emit('usernames', Object.keys(users));
        }
    });
};

