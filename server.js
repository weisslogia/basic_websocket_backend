require('dotenv').config();
const http = require('http');
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./rutes/user.routes');

const app = express();
const server = http.createServer(app);
const socket = require('socket.io')(server);
const port = process.env.PORT || 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database/bd_websocket.db',
    logging: false
});

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const user = require('./models/user.model')(sequelize);
const message = require('./models/message.model')(sequelize);

module.exports = {
user,
message, 
sequelize,
// socket
}

async function start() {
	const force = false;
    await sequelize.authenticate();
    user.hasMany(message);
    await user.sync({force: force});
    console.log('[34mSync Model user => [32mComplete[39m');
    await message.sync({force: force});
    console.log('[34mSync Model message => [32mComplete[39m');

}
server.listen(port, async() => {
    console.clear();
    await start();
    userRoutes(app);
    messageRoutes(app);
    console.log(`[34mServer is running on port [32m${port}[39m`);
});