  const express = require('express');
  const path = require('path');
  const app = express();
  // const os = require('os');

var http = require('http').Server(app, {cors: {
  origin: ["https://sunzao.us", "https://www.sunzao.us", "https://alt.sunzao.us"]
}});

// ,
// methods: ["GET", "POST"],
// allowedHeaders: ["my-custom-header"],
//   credentials: true
  const io = require('socket.io')(http);

  // console.log(`[rocket] host`, os.hostname());// example
  console.log(`[rocket] dir`, __dirname, __dirname.includes("beta"));
  const SERVER_PORT = __dirname.includes("beta") ? 3004 : 3002;

  const PORT = SERVER_PORT;// see webRTC/rocket

  // const server = app.listen(PORT, () => {
  //   console.log(`Example app listening on port ${PORT}`);
  // })
  
  // const io = require('socket.io')({
  //   path: '/socket.io',
  // });
  
  // io.listen(server);// no changes with path property

  const { URLSearchParams} = require('url');

  // app.get('/', (req, res) => {
  //   res.send('Hello World!');
  // });


  // https://expressjs.com/en/guide/writing-middleware.html
  // const publicDirectoryPath = path.join(__dirname,"../public");
  // app.use('/meet',express.static(publicDirectoryPath));
  //
  // const appPath = path.join(__dirname,'../public/rocket/index.html');
  // app.get('/meet',(req, res, next) => {
  //   res.sendFile(appPath);
  // });

  // app.get('*', (req, res) => {
  //   // res.send('my 404 page')
  //   console.log('[express server] rendering 404')
  //   res.render('404', {
  //     title:'404',
  //     errorMessage:'page not found'
  //   });
  //
  // });


  // io.listen(server);

  // to learn more about namespaces
  // https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm

let connectedPeers = new Map();

const webRTC_Connections = (socket) => {

  
}

// io.set('log level', 1);
const sock = io.sockets.use((socket, next) => {
  // const myURL = new URLSearchParams(socket.handshake.url);
  console.log('[.use] test', 3);
  console.log('[.use] socket namespace', socket.nsp.name);
  // console.log('[.use] socket handshake', socket.handshake);
  // console.log('[.use] socket handshake', socket.handshake.query);// this does nothing new
  const myQry = socket.handshake.query;
  console.log('[.use] ns = ', myQry.ns);
  // socket.of('/webrtcPeer');// this doesn't help

  // socket.disconnect(true);// works
// 
  // const hasNamespace = typeof myQry === 'undefined' || typeof myQry.ns === 'undefined' ? false : true;

  // if (!hasNamespace) {
  //   // send an error
  //   console.log('[.use] namespace not detected');
  //   const err = new Error('not authorized');
  //   err.data = { content: 'Please retry later' }; // additional details
  //   next(err);
  // } else {
    next();
  // }// else
}).on('connection', (socket) => {
  // NOTE: "connect" && "connection" appear to do the same thing
  // this should process any and all connections
  // console.log('running io.sockets',socket);
  // socket.join('/webrtcPeer');// this doesn't help
  // socket.of('/webrtcPeer');// this doesn't help
  const transport = socket.conn.transport.name; // in most cases, "polling"
  console.log(`[connection] transport`, transport);

  socket.conn.on("upgrade", () => {
    const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
    console.log(`[connection] upgradedTransport`, upgradedTransport);
  });

  const namespace = socket.handshake.query.ns;
  console.log('[connection] namespace = ', namespace);

  // switch (namespace) {
  //   case 'webrtcPeer':
  //     webRTC_Connections(socket);
  //     break;

  //   default:
  //     break;
  // }
  try {
    console.log('[socket] id', socket.id);

    socket.emit('connection-success', { success: socket.id });
    // io.sockets.emit('connection-success', { success: socket.id });// fails

    connectedPeers.set(socket.id, socket);
    // FUTURE: i can expand  the peerID data to hold json which includes user id and low-res image blob
    // FUTURE: may need mongodb persistence

    socket.on('disconnect', () => {
      console.log('[rocket] disconnected');
      connectedPeers.delete(socket.id);
    });

    socket.on('offerOrAnswer', (data) => {
      // send to the other peer(s) if any
      for (const [peerID, peer] of connectedPeers.entries()) {
        // don't send to self
        if (peerID !== data.socketID) {
          console.log('[offerOrAnswer] id and payload', peerID, data.payload);
          peer.emit('offerOrAnswer', data.payload);// this socket variable is from the for loop
        } else {
          console.log('[same offerAnswer id]');
        }
      }
      // FUTURE: groups need to save the offer and the host and auto offer to new connections
      // or auto offer to all existing pending connections
      // there is an issue with late connections net receiving an offer - late connections also need to be approved
      // its easier to kick the one that doesn't belong than to approve all - allow a kick to remove a socket or
      // add a socket to a banned list - how do you keep the ip address from returning? - if registered user
      // we can hold the user id
    });// offerOrAnswer

    socket.on('candidate', (data) => {
      // send to the other peer(s) if any
      for (const [peerID, peer] of connectedPeers.entries()) {
        // don't send to self
        if (peerID !== data.socketID) {
          console.log('[candidate] id and payload', peerID, data.payload);
          peer.emit('candidate', data.payload);
        } else {
          console.log('[same candidate id]');
        }
      }
    });// candidate
  } catch (error) {
    console.log('[socket] an error occured', error);
  }

  

  // FUTURE: the host can have a list of socketID's attached to thumbnail images
  //  the host can click the id and inform the server to send the candidate to everyone

  // FUTURE: connectedPeers already has the full list of participants
  // parse through the list and match the id to the candidate data - then send the candidate data to each candidate

});


// io.of(/^\/dynamic-\d+$/).on("connection", (socket) => {
//   io.of(/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/).on("connection", (socket) => {
//   const namespace = socket.nsp;
//   console.log('[io.sockets] socket namespace', namespace);
// });
// these are used to limit what the namespace may be

// io.of((name, auth, next) => {
//   console.log('[io.sockets] socket name', name);
//   console.log('[io.sockets] socket auth', auth);
//   next(null, true); // or false, when the creation is denied
// });

const peers = io.of('/webrtcPeer');
//   // const peers = io.sockets;

//   // keep a reference of all socket connections
peers.on('connection', (socket) => {
  // console.log('running peers io.sockets', socket);
  
  console.log('[socket] peers id', socket.id);

  socket.emit('connection-success', { success: socket.id });

  connectedPeers.set(socket.id, socket);
  // FUTURE: i can expand  the peerID data to hold json which includes user id and low-res image blob
  // FUTURE: may need mongodb persistence

  socket.on('disconnect', () => {
    console.log('[rocket] disconnected');
    connectedPeers.delete(socket.id);
  });

  socket.on('offerOrAnswer', (data) => {
    // send to the other peer(s) if any
    for (const [peerID, peer] of connectedPeers.entries()) {
      // don't send to self
      if (peerID !== data.socketID) {
        console.log('[offerOrAnswer] id and payload', peerID, data.payload);
        peer.emit('offerOrAnswer', data.payload);// this socket variable is from the for loop
      } else {
        console.log('[same offerAnswer id]');
      }
    }
    // FUTURE: groups need to save the offer and the host and auto offer to new connections
    // or auto offer to all existing pending connections
    // there is an issue with late connections net receiving an offer - late connections also need to be approved
    // its easier to kick the one that doesn't belong than to approve all - allow a kick to remove a socket or
    // add a socket to a banned list - how do you keep the ip address from returning? - if registered user
    // we can hold the user id
  });// offerOrAnswer

  socket.on('candidate', (data) => {
    // send to the other peer(s) if any
    for (const [peerID, peer] of connectedPeers.entries()) {
      // don't send to self
      if (peerID !== data.socketID) {
        console.log('[candidate] id and payload', peerID, data.payload);
        peer.emit('candidate', data.payload);
      } else {
        console.log('[same candidate id]');
      }
    }
  });// candidate

  // FUTURE: the host can have a list of socketID's attached to thumbnail images
  //  the host can click the id and inform the server to send the candidate to everyone

  // FUTURE: connectedPeers already has the full list of participants
  // parse through the list and match the id to the candidate data - then send the candidate data to each candidate

  });// peers connection


  const server = http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  })
