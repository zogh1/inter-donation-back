var express = require('express');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var path = require('path');

const Live = require("./models/live");
const User = require("./models/user");

var usersRouter = require('./routes/users');
var livesRouter = require('./routes/lives.route');



var app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}
app.use("/peerjs", ExpressPeerServer(server, opinions));




require('./models/db');
const port=process.env.port || 8000






app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.resolve('./public')));
app.use('/user', usersRouter);
app.use('/live', livesRouter);


app.get("/joinLive/:liveId", (req, res) => {
  var liveId=req.params.liveId;
  res.redirect(`/${liveId}`);
});


app.get("/:room", (req, res) => {
  var userId = req.query.userId;
  var liveId=req.params.room;
  console.log(liveId,userId);
  if (liveId === 'favicon.ico') {
    return; // skip query and return early
  }
  try {
   const user= Live.find({ _id: liveId,participants: userId },async (err, result) => {
        if (err) {
          console.error(err);
        } else {
          if (result.length > 0) {
            const user = await User.findOne({ _id:userId });

           
            res.render("room", { roomId: req.params.room , user:user.firstName , succes:true});
          } else {
            res.render("room", { roomId: req.params.room , user:result , succes:false});
          }
        }
      });


} catch (err) {
  
  return res.status(500).json({ message: err.message });
}

  
});

app.get("/test/:liveId", (req, res) => {
  var userId = req.query.userId;
  var liveId=req.params.liveId;
  try {
   const user= Live.find({ _id: liveId,participants: userId }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          if (result.length > 0) {
            return res.status(200).json({
              result
            });
           
           // res.render("room", { roomId: req.params.room , user:result , succes:true});
          } else {
           // res.render("room", { roomId: req.params.room , user:result , succes:true});
           return res.status(200).json({
            result
          });
          }
        }
      }).populate('');


} catch (err) {
  
  return res.status(500).json({ message: err.message });
}

  
});


const connectedUsers = {};
io.on("connection", (socket) => {
  let room;
  let idUser;
  socket.on("join-room", (roomId, userId, userName) => {
    if (usernameAlreadyExists(userName)) {
      console.log('exist')
      // User is already connected, prevent them from joining again
      socket.emit("user-not-allowed");
      return;
    }
    connectedUsers[userId] = userName;
    console.log(connectedUsers);
    room=roomId;
    idUser=userId;
    socket.join(roomId);
    setTimeout(()=>{
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 3000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });

  socket.on("disconnect", () => {
    // Remove the user from the list of connected users when they disconnect
    for (const userId in connectedUsers) {
      if (connectedUsers.hasOwnProperty(userId) && userId === socket.id) {
        delete connectedUsers[userId];
        console.log(connectedUsers)
        break;
      }
    }
    // Notify other clients that the user has disconnected
   // socket.to(room).broadcast.emit("user-disconnected", idUser);
    
    // Rest of the code to handle the video call
  });
});
function usernameAlreadyExists(username) {
  return Object.values(connectedUsers).includes(username);
}


// error handler

server.listen(port);

module.exports = app;
