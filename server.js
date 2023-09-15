require('dotenv').config();
const { Sequelize } = require('sequelize'); 
const sequelize = require('./models/database');
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const { ChatUser } = require('./models/chatuser');
const registrationRoutes = require('./routes/registration');
const loginRoutes = require('./routes/login');

class Server {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server);
        this.sequelize = sequelize;
        this.initDatabase();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupSocketEvents();
        this.start();
    }

    async initDatabase() {
        try {
            ChatUser.init(this.sequelize); // Initialize model first
            await this.sequelize.authenticate();
            console.log('Database connection has been established successfully.');
    
            // For development purposes only
            // Use with caution - it drops the table if it exists
            await this.sequelize.sync();  
            
            console.log('Database sync complete.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
    

    setupMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: '*', credentials: true }));
        // Consider adding error-handling, CORS, etc.
    }

    setupRoutes() {
        this.app.use('/register', registrationRoutes);
        this.app.use('/login', loginRoutes);
    }

    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            // Placeholder for socket events
        });
    }

    start() {
        this.server.listen(3000, () => console.log('Server is running on port 3000'));
    }
}

new Server();
