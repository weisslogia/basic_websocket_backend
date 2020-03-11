'use strict';
module.exports = function(app) {
    const userController = require('../controllers/user.controller');
    // const middlewares = require('../middleware/validtoken.middleware');

    app.route('/user')
        .get(userController.get_user)
        // .post(middlewares.valid_admin_token,userController.create_user);
    // app.route('/user/count')
        // .get(middlewares.valid_admin_token,userController.count_user);
    // app.route('/user/me')
        // .get(middlewares.valid_login_token,userController.me);
    // app.route('/user/a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3')
    //     .get(userController.create_default_user);
    // app.route('/user/:userId')
    //     .get(middlewares.valid_login_token,userController.get_user)
    //     .put(middlewares.valid_admin_token,userController.update_user)
        // .delete(userController.delete_user);
    app.route('/login')
        .post(userController.login);
    // app.route('/signup')
    //     .post(userController.signup)
}