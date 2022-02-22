const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');
const os = require('os');

const {verifyToken} = require('../utils/signToken');
const {SITE_SERVER, DOMAIN_NAME, HOSTNAME} = require('./utils/keys');

const app = express();
const server = http.createServer(app);
const io = (os.hostname().includes(HOSTNAME)) ? socketio(server,{ path: '/narrator' }) :  socketio(server) ;
// const PORT = process.env.port || 3001;
const SERVER_PORT = typeof SITE_SERVER != "undefined" && SITE_SERVER == "beta" ? 3005 : 3003;
const PORT = (os.hostname().includes(HOSTNAME)) ? SERVER_PORT : 3001;
const display_console = false;

if(display_console || false) console.log(`[narrator] process.env localhost`,process.env.MONGODB_LOCALHOST_DB);

// Be sure to add a database or the db functions wont do anything (not even error out)
const mongoose = require('mongoose');
const Keys = require('./utils/keys').mongodb;
// console.log(`[narrator] process.env localhost`,process.env.localhost);// doesn't work. Keys.localhost maybe

if(display_console || true) console.log(`[os] Keys`,Keys);

if(display_console || false) console.log(`[os] hostname`,os.hostname());

let dbConnect = (os.hostname().includes(HOSTNAME)) ? Keys.liveDB : Keys.db;// what is this in production?
// let dbConnect = `mongodb://167.99.57.20:27017/SunzaoAlight`;// what is this in production?

if(display_console || false) console.log(`[os] dbConnect`,dbConnect);
mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true  });
// mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = "ChatCord Bot"

// set static folders
app.use(express.static(path.join(__dirname,"public")));// GOTCHA requires middleware = express.static

// run when a client connects
io.on("connection", (socket) => {

  if(display_console || false) console.log("[narrator_server] io connection made.");

  // room will be the id of the item
  socket.on("joinRoom", async ({token, room, color}) => {

    if (display_console || true) console.log(`[narrator_server] token = `, token);

    let token_data = verifyToken(token);// also perform a check access once you acquire the project_id
    if(display_console || false) console.log(`[narrator_server] token data = `,token_data);// if invalid this will be undefined

    // report back error
    if(!token_data){
      if(display_console || true) console.error(`[narrator_server] sending back an error`);
      // do i send the blocked message with this?
      return;
    }

    let user_id = token_data.user_id;
    let project_id = token_data.project_id || user_id;

    // adding project_id would allow the user to control what contact info is provided
    const user = await userJoin({id: socket.id, project_id, user_id, room, color});

    if(display_console || false) console.log(chalk.yellow(`[narrator_server] user`),user);

    socket.join(user.room)

    // Welcome current user
    socket.emit("info", await formatMessage({user:botName, msg:"Welcome to ChatCord"}));// emits to the single client that is connecting

    // broadcast when a user connects
    // socket.broadcast.emit("message", formatMessage(botName,"A user has joined the chat"));// broadcast.emit emits to everyone except the user thats connecting
    socket.broadcast.to(user.room).emit("info", await formatMessage({user:botName, msg:`${user.user_id} has joined the chat`}));


    // io.emit();//emits to all the clients in general
    io.to(user.room).emit("roomUsers",{
      room: user.room,
      users: getRoomUsers(user.room)
    });

  }); // joinRoom




  // listen for chatMessage
  socket.on("chatMessage", async (msg) => {
    if (display_console || true) console.log(`[chatMessage] payload`,msg.payload);

    // if(display_console || true) console.log(`[chatMessage] socket.id`,socket.id);

    const user = getCurrentUser(socket.id);
    if(display_console || true) console.log(`[chatMessage] user`,user);

    // io.emit("message",formatMessage("user",msg));
    io.to(user.room).emit("message",await formatMessage({...user, msg, save:true}));
  })// on chatMessage

  // runs when client disconnects
  socket.on("disconnect", async () => {

    if(display_console || true) console.log(`[disconnect] disconnecting`);

    const user = userLeave(socket.id);

    if(display_console || true) console.log(`[disconnect]`,user);

    if(user){
      io.to(user.room).emit("info", await formatMessage({user: botName, msg:`${user.user_id} has left the chat.`}));

      io.to(user.room).emit("roomUsers",{
        room: user.room,
        users: getRoomUsers(user.room)
      });

    }// if
    // io.emit("message", formatMessage(botName,"A user has left the chat."));

  });// on disconnect

});// on connection


// app.listen(PORT, () => console.log(`server running on port ${PORT}`));
server.listen(PORT, () => console.log(`server running on port ${PORT}`));// replaced app.listen
