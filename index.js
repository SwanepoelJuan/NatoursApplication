const express = require('express');
const morgan = require('morgan'); 

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express(); // This is a new implementation, previously this was done via the http module 

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
}
// MIDDLEWARE

app.use(express.json()); 

app.use((req, res, next) =>  {
    req.requestTime = new Date().toISOString(); 
    next(); 
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app; 