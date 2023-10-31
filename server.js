/**
 * Server setup
 */

// Get dependencies
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');

// Get files
const { envSECRET } = require('./config/scrtConfig');
const globalRouter = require('./routes/global');
const { apiLimiter, authRateLimiter } = require('./middleware/validation/rateLimiter') ;
const authRouter = require('./routes/auth');
const { ErrorHandler } = require('./controller/error/ErrorHandler');
const services = require('./routes/services');
const user = require('./routes/user');
const sessionRouter = require('./routes/session');
const { blockJWT, protect } = require('./middleware/auth');

// Set app
const app = express();

// Set session
const server = http.createServer(app);
const sessionMiddleWare = session({
    secret: envSECRET,
    resave: false,
    saveUninitialized: false,
});
server.headersTimeout = 5000;
server.requestTimeout = 10000;
app.set("trust proxy", true);
app.use(sessionMiddleWare);

// Allow access
app.use(cors());
app.use(helmet());
var accessLogStream = fs.createWriteStream(path.join("./", "access.log"), {
    flags: "a",
});

// Loggers
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Cookies
app.use(cookieParser());

// Routes
app.use("/api", globalRouter);
app.use("/api/auth", authRateLimiter, authRouter);
app.use("/api/session", sessionRouter);
// app.use("/api/services", blockJWT, protect, services);
app.use("/api/user", blockJWT, protect, user);
app.use(ErrorHandler);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    const data = { 
        msg: 'Hello from the server!',
        cookies:  req.cookies,
        signedCookies: req.signedCookies,
    };
    res.json(data);
});