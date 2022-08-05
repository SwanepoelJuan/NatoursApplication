const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'}); //This needs to be specified before we actually import the app

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose
.connect(DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then( con => { 
    if(process.env.NODE_ENV === 'development')
        console.log('Database connection is working!');
}); 

const app = require('./index'); 
const http = require('http');

const port = process.env.PORT || 3000; 

const server = http.createServer(app); //Create a server, and use the app module which contains our routing

server.listen(port, () => {
    console.log(`App running on port ${port}`); 
});

// Everything not related to express takes place outside of the app/index file

