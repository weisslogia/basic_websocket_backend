const models = require('../server.js');

module.exports.create_message = async(req, res) => {
    try {
        if (req.decoded.id === req.body.idUser) {
            res.send({
                ok: false,
                message: 'You can not send message to yourselve'
            })
        } else {
            await models.message.create({
                sender: req.decoded.id,
                userId: req.body.idUser,
                message: req.body.message
            });
            res.send({ message: 'Message created successfully' })
        }
    } catch (err) {
        res.status(500)
        res.send({
            ok: false,
            message: "Internal Server Error",
            description: err
        })
    }
}

module.exports.sendJSONText = async(req, res) => {
    // models.socket
    await models.message.create({
        type: 3,
        message: JSON.stringify(req.body)
    });
    models.socket.emit('message-diffusion-json', {
        type: 3,
        message: JSON.stringify(req.body)
    });
    res.send('Done')
}

module.exports.sendJSONTextToUser = async(req, res) => {
    const reciver = req.params.messageId;
    // models.socket
    await models.message.create({
        type: 3,
        reciver,
        message: JSON.stringify(req.body)
    });
    models.connectedUsers.forEach(item => {
        if (item.id == reciver) {
            models.sockets.forEach(sock => {
                if (sock.socketId === item.socketId) {
                    sock.socket.emit('message-diffusion-json', {
                        type: 3,
                        message: JSON.stringify(req.body)
                    });
                }
            });
        }
    })
    res.send('Done')
}


module.exports.get_all_message = async(req, res) => {
    try {
        const data = await models.message.findAll();
        res.send(data);
    } catch (err) {
        res.status(500)
        res.send({
            ok: false,
            message: "Internal Server Error",
            description: err
        })
    }
}

module.exports.get_message_id = async(req, res) => {
    try {
        const data = await models.message.findOne({
            where: {
                id: req.params.id
            }
        })
        res.send(data);
    } catch (err) {
        res.status(500)
        res.send({
            ok: false,
            message: "Internal Server Error",
            description: err
        })
    }
}

module.exports.get_message = async(req, res) => {
    try {
        let data = null;
        if (req.params.messageId) {
            data = (await models.message.findAll({
                where: {
                    id: req.params.messageId,
                    userId: req.decoded.id
                }
            }))[0]
        } else {
            data = await models.message.findAll({
                where: {
                    [models.Op.or]: [
                        { sender: req.decoded.id },
                        { reciver: req.decoded.id },
                        { type: 2 },
                        { type: 3 }
                    ]
                },
                order: [
                    ['id', 'ASC']
                ]
            });
        }

        if (data) {
            console.log(data)
            res.send(data)
        } else {
            res.status(404);
            res.send({
                error: 404,
                ok: false,
                message: 'No element found on the database.'
            })
        }
    } catch (err) {
        res.status(500);
        console.log(err)
        res.send({
            ok: false,
            message: "Internal Server Error",
            description: err
        })
    }
}