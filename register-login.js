'use-strict';

import express from 'express';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

const app = express();
app.use(bodyParser.json());

app.use(
    expressSession({
        secret: 'Artify secret',
        cookie: {maxAge: 60000},
        resave: false,
        saveUninitialized: true
    })
);

// connect to database later?
const userArray = [];

// Register user
app.post('/M01095133/register', (request, response) => {
    // Get data from message body
    const newUser = request.body;
    console.log("Data recieved: " + JSON.stringify(newUser))

    // Check if all feilds are filled
    if(newUser.name === undefined || newUser.email === undefined 
        || newUser.username === undefined || newUser.password === undefined){
        response.send({error: true, message: "New user must fill empty fields."});
        return;
    }

    // Add user to data structure
    userArray.push(newUser);

    // Finish registration
    response.send({registration: true, email: newUser.username});
})

// Login user
app.post('/M01095133/login', (request, response) => {
    const userLogin = request.body;
    console.log(userLogin);

    for (let user of userArray){
        if(user.username === userLogin.username && user.password === userLogin.password){
            request.session.username = user.username;
            console.log(request.session);

            response.send({login: true, username: user.username});
            return;

        }
    }

    // User not found
    response.send({login: false, message: "Username or password is incorrect."});
})

// Return login status
app.get('/M01095133/login', (request, response) => {
    if (!("email" in request.session))
        response.send({login: false});
    else {
        response.send({login: true, name: request.session.email});
    }
});

// Logout user
app.delete('/M01095133/login', (request, response) => {
    request.session.destroy(err => {
        if(err)
            response.send({error: JSON.stringify(err)});
        else {
            response.send({login: false});
        }
    });
});