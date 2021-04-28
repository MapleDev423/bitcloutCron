const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const cron = require('./cronservice.js')

const PORT = process.env.PORT || 5000;

// Run the Server
const webserver = server.listen(PORT, () => {
    console.log(`Server is running successfully at PORT :- ${PORT}`);
})