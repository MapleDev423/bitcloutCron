const http = require('http');
const app = require('./app');

const server = http.createServer(app);
const cron = require('./cronservice.js')

const PORT = process.env.PORT || 5000;

// Run the Server
// Test coin
//  secondCoin: '0xA3733d4f64365776C2EE3e7Bcec2665B49BEb3e9'
//  mergeCoin:'0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893'

const webserver = server.listen(PORT, () => {
    console.log(`Server is running successfully at PORT :- ${PORT}`);
})
