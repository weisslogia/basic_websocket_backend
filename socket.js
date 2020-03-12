const data = require('./server.js');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
data.socket.on('connection', function(client) {
    let decodedData;
    jwt.verify(client.handshake.query.access_token, config.key, (err, decoded) => {
        if (err) {
            return res.json({ message: 'Invalid token' })
        } else {
            decodedData = decoded;
        }
    });
    console.log(decodedData.id)
    const usr = {
        name: decodedData.name,
        id: decodedData.id,
        token: client.handshake.query.access_token,
        socketId: client.id
    }
    data.sockets.push({
        socketId: client.id,
        socket: client
    });
    data.connectedUsers.push(usr);
    client.broadcast.emit('newUser', usr);
    client.on('message-diffusion', async(message) => {
        let decodedData;
        jwt.verify(client.handshake.query.access_token, config.key, (err, decoded) => {
            if (err) {
                return res.json({ message: 'Invalid token' })
            } else {
                decodedData = decoded;
            }
        });
        await data.message.create({
            sender: decodedData.id,
            type: 2,
            message
        });
        data.socket.emit('message-diffusion', {
            sender: decodedData.id,
            type: 2,
            message
        });
    });
    client.on('message-to', async message => {
        let decodedData;
        jwt.verify(client.handshake.query.access_token, config.key, (err, decoded) => {
            if (err) {
                return res.json({ message: 'Invalid token' })
            } else {
                decodedData = decoded;
            }
        });
        message_data = {
            sender: decodedData.id,
            type: 1,
            reciver: message.reciver,
            message: message.message
        };
        await data.message.create(message_data);
        let rec;
        data.connectedUsers.forEach(item => {
            if (item.id === message.reciver) {
                rec = item.socketId
            }
            console.log(item.socketId)
                // console.log()
        });
        client.broadcast.to(rec).emit('message-to', {
            sender: decodedData.id,
            type: 1,
            reciver: message.reciver,
            message: message.message
        })
    })
    client.on('disconnect', function() {
        const usr = [];
        const soc = [];
        data.connectedUsers.forEach((user, index) => {
            if (user.token !== client.handshake.query.access_token) {
                soc.push(data.sockets[index]);
                usr.push(user)
            }
        });
        data.sockets = soc;
        client.broadcast.emit('disconnectedUser', client.handshake.query.access_token)
        data.connectedUsers = usr;
    });
});