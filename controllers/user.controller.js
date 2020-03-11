const models = require('../server.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports.create_user = async(req, res) => {
    res.send(await this.create(req.body));
}

module.exports.get_user = async(req, res) => {
    let where = null;
    if (req.query.where)
        where = JSON.parse(req.query.where);
    let data = null;
    if (req.params.userId) {
        data = await this.getById(req.params.userId);
    } else {
        data = await this.getAllUsers(where);
    }
    if (data)
        res.send(data)
    else {
        res.status(404);
        res.send({
            error: 404,
            ok: false,
            message: 'No element found on the database.'
        })
    }
}

module.exports.getConnectedUsers = (req, res) => {
    res.send(models.connectedUsers);
}

module.exports.login = async(req, res) => {
    if (req.body.name) {
        const user = await models.user.findOne({
            where: {
                name: req.body.name,
            }
        });
        if (user) {
            const payload = {
                check: true,
                name: user.name,
                id: user.id
            };
            const token = jwt.sign(payload, config.key, {
                expiresIn: 700000
            });
            res.send({ token: token, tokenExpire: 700000, user: { name: user.name } })
        } else {
            const created = await this.create(req.body);
            if (created.ok) {
                const payload = {
                    check: true,
                    name: created.user.name,
                    id: created.user.id
                };
                const token = jwt.sign(payload, config.key, {
                    expiresIn: 700000
                });
                res.send({ token: token, tokenExpire: 700000, user: { name: created.user.name } })
            } else {
                res.send({ created });
            }
        }
    } else {
        res.status(500);
        res.send({
            error: 500,
            ok: false,
            message: "Internal Server Error",
            description: 'Two parameters are required email and password'
        })
    }
}

module.exports.count_user = async(req, res) => {
    const data = await this.getAllUsers();
    res.send({ count: data.length });
}

module.exports.me = async(req, res) => {
    res.send(await this.getById(req.decoded.id))
}

module.exports.getUserById = async(id) => {
    const data = await models.user.findOne({
        where: {
            id,
        }
    })
    return data;
}

module.exports.getAllUsers = async(where = null) => {
    let data = null;
    if (!where)
        data = await models.user.findAll();
    else {
        console.log(where);
        data = await models.user.findAll(where);
    }
    return data;
}

module.exports.create = async(data) => {
    try {
        const user = await models.user.create({
                name: data.name,
            })
            // models.socket.emit('newUser',user.dataValues);
        return {
            ok: true,
            message: 'Element added to database successfully.',
            user: user
        };
    } catch (err) {
        if (err.parent && parseInt(err.parent.code) === 23505 && err.parent.constraint === 'users_email_key') {
            return {
                status: 500,
                ok: false,
                message: "Internal Server Error",
                description: 'The email must be unique'
            }
        } else {
            return {
                status: 500,
                ok: false,
                message: "Internal Server Error",
                description: err
            };
        }
    }
}

module.exports.getById = async(id) => {
    data = (await models.user.findAll({
        where: {
            id: id
        }
    }))[0];
    return data;
}