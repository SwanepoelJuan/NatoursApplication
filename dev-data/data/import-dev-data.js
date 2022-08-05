const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

dotenv.config({path: './config.env'}); //This needs to be specified before we actually import the app

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD
);

mongoose
.connect(DB, {
    useNewUrlParser: true, //Don't worry to much about these variables (this object)
    userCreateIndex: true, 
    useFindAndModify: false
})
.then( con => { 
    if(process.env.NODE_ENV === 'development')
        console.log('Database connection is working!');
}); 

//Read file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data import was successful');
    }
    catch(err) {
        console.log(err);
    }
    process.exit();
};

const deleteTours = async () => {
    try {
        await Tour.deleteMany();
        console.log('Tours successfully deleted!')
    }
    catch(err) {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
} else if(process.argv[2] === '--delete'){
    deleteTours();
} else {
    console.log('Incorrect argument specified!');
}
console.log(process.argv)
