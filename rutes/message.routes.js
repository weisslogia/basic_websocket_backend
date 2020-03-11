'use strict';
module.exports = function(app) {
    const messageController = require('../controllers/message.controller');
    const middlewares = require('../middleware/validtoken.middleware');

    app.route('/message')
        .get(middlewares.valid_login_token,messageController.get_message)
        .post(middlewares.valid_login_token,messageController.create_message);
    app.route('/message/all')
        .get(middlewares.valid_admin_token,messageController.get_all_message);
    app.route('/message/all/:id')
        .get(middlewares.valid_admin_token,messageController.get_message_id);
    app.route('/message/:messageId')
        .get(middlewares.valid_login_token,messageController.get_message)
        // .delete(middlewares.valid_login_token,messageController.delete_message);
}