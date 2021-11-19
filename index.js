const express = require("express");
const { Server } = require("socket.io");
const indexRouter = require("./routers/indexRouter");
const passport = require("passport");
const session = require("express-session");

const app = express();
const server = require("http").createServer(app);

const sessionMiddleware = session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

// Http connection(s)

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// rest endpoints
app.use("/api", indexRouter);

// Socket connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize));
io.use(wrap(passport.session));

io.on("connect", socket => {});

// start server
server.listen(4000, () => {
  console.log("Server up on port 4000");
});
