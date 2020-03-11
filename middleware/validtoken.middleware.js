const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const valid_login_token = express.Router();
valid_login_token.use((req, res, next) => {
    let token = req.headers['authorization'];
    token = token.split(' ')[1]
    if (token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                return res.json({ message: 'Invalid token' })
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        res.send({ message: 'Token not send' });
    }
});
const valid_admin_token = express.Router();
valid_admin_token.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                return res.send({ message: 'Invalid token' })
            } else {
                if (decoded.role.id === 1) {
                    req.decoded = decoded;
                    next();
                } else {
                    res.status(503);
                    res.send({
                        ok: false,
                        message: "Forbiden",
                    })
                }
            }
        })
    } else {
        res.send({ message: 'Token not send' });
    }
});
module.exports = {
    valid_admin_token,
    valid_login_token
};