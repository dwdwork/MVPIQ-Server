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

// Get files
const globalRouter = require('./routes/global');
const authRouter = require('./routes/auth');
const services = require('./routes/services');
// const { errorHandler } = require('./controller/errorHandler');
const user = require('./routes/user');
const envSECRET = require('./config');
const { blockJWT, protect } = require('./middleware/auth');

// Old
// const apiRoutes = require('./routes/api');

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

// Old Routes
// app.use('/api', apiRoutes);

// Routes
app.use("/api", globalRouter);
app.use("/api/auth", authRouter);
// app.use("/api/services", blockJWT, protect, services);
app.use("/api/user", blockJWT, protect, user);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    const data = { msg: 'Hello from the server!' };
    res.json(data);
});