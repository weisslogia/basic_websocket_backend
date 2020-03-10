require('dotenv').config();
const http = require('http');
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

// const userRoutes = require('./rutes/user.routes');

const app = express();
const server = http.createServer(app);
const socket = require('socket.io')(server);
const port = process.env.PORT || 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/bd_websocket.db'
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const user = require('./models/user.model')(sequelize);
// const message = require('./models/message.model')(sequelize);

// module.exports = {
// user,
// message, 
// sequelize,
// socket
// }
async function start() {
    await sequelize.authenticate();
}
server.listen(port, async() => {
    console.clear();
    await start();
    // userRoutes(app);
    // messageRoutes(app);
    console.log(`[34mServer is running on port [32m${port}[39m`);
});