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

// Stores user data in session
app.post('/M01095133', (request, response) => {
    const userData = request.body;
    request.session.userData = userData;
    response.send({datarecieved: true, userData: userData})
});

app.get('/M01095133', (request, response) => {
    if("userData" in request.session)
        response.send*{userData: request.session.userData}
    else
        response.send({userData: false});
});

app.listen(8080, () => console.log('Listening on http://localhost:8080/M01095133'));