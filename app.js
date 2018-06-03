const express = require("express");
const bodyParser = require('body-parser');
const Mongo = require('mongodb');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const userfunctions = require('./userfunctions');
const gameManagerMongoInterface = require('./gameManagerMongoInterface');
const gMLogic = require('./mental')
const app = express();
const MongoClient = Mongo.MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/data";
const PORT = process.env.PORT || 8080;
const path = require("path");
// const sassMiddleware = require('node-sass-middleware');
const ObjectID = require('mongodb').ObjectID;
app.set('view engine', 'html');
let database;

MongoClient.connect(MONGODB_URI, (err, db) => {
    if (err) {
        throw err
    }
    database = db;
})
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(cookieSession({
    name: 'session',
    keys: ["carsanddogs"],
}));
app.use(cookieParser('carsanddogs'));
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'styles'),
//     dest: path.join(__dirname, 'public'),
//     debug: false,
//     outputStyle: 'compressed'
// }));
let firstDate = new Date().getTime();
let lobbyState = {
    current_users: [],
    users_in_lobby: [],
    users_in_mental: [],
    game_starting: false,
    last_change: firstDate,
}
let mentalGameState = {
    last_change: firstDate,
    game_id: 1,
    game_start: new Date,
    players: [],
    target_deck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    game_state: 'waiting_to_begin',
    player_play_state: [],
    pointsForVictory: 100,
    total_rounds: 13,
}
const users = {}
let currentGames = {};
//ROUTES
app.post("/register", (req, res) => {
    let name = req.body.register_name;
    let password = req.body.register_password;
    if (password.length > 0 && name.length > 0 && password.length > 0) {
        for (key in users) {
            if (users[key].name === name) {
                return res.status(400).send('This name is currently registered.');
            }
        }
        let newId = generateRandomString();
        users[newId] = {
            username: name,
            password: password
        };

    }
    userfunctions.register(name, password, database, function(insertedID) {

        let userId = ObjectID(insertedID).toString();
        req.session.login_name = req.body.register_name;
        req.session.userId = userId;
        console.log(req.session);
        addUserToLobbyStateArray(name, userId);
        res.redirect('/lobby');
    });
});
app.post("/login", (req, res) => {
    let name = req.body.login_name;
    let password = req.body.login_password;
    userfunctions.login(name, password, database, function(verified, id) {
        let userId = id;
        addUserToLobbyStateArray(name, userId);
        if (name === "" || password === "") {
            return res.status(404).send("Please enter valid credentials");
        }
        if (verified === true) {
            req.session.userId = id;
            res.redirect('/lobby');
        } else {
            res.redirect('/');
        }
    });
});
app.get("/lobby", (req, res) => {
    lobbyState.last_change = new Date().getTime();
    if (req.session.login_name) {
        return res.sendFile('lobby.html', {
            root: '.'
        })
    } else {
        return res.status(400).send('Oops! Something is wrong!');
    }
    res.sendFile('views/lobby', templateVars);
});
app.get("/mental", (req, res) => {
    res.sendFile('views/mental.html', {
        root: '.'
    })
});
app.get('/lobby_data', function(req, res) {
    res.send(lobbyState);
})
app.get('/mental_data', function(req, res) {
    res.send(mentalGameState);
})
app.post("/create_mental", (req, res) => {

    lobbyState.game_starting = true;
    for (var i = 0; i < lobbyState.users_in_mental.length; i++) {
        player = {
            name: lobbyState.users_in_mental[i].name,
            score: 0,
            has_played: false,
            current_card: 0,
            cards_remaining: mentalGameState.target_deck
        }
        mentalGameState.players.push(player);
        mentalGameState.player_play_state.push(false);
        gMLogic.startGame(mentalGameState);
        console.log('********', mentalGameState);
    }
    lobbyState.last_change = new Date().getTime();
    res.send(lobbyState);
})

function clearMentalQueue() {
    lobbyState.users_in_mental = [];
    lobbyState.last_change = new Date().getTime();
    lobbyState.game_starting = false;
}
app.get('/leave_mental_queue', (req, res) => {
    let uFromCookie = req.session.login_name;
    setTimeout(clearMentalQueue, 100);
    lobbyState.last_change = new Date().getTime();
    res.send(req.session);
})
app.get("/move_to_mental_queue", (req, res) => {
    let cookie = req.session;
    for (var i = 0; i < lobbyState.users_in_lobby.length; i++) {
        let u = lobbyState.users_in_lobby[i].name;
        let uFromCookie = req.session.login_name;
        if (u == uFromCookie) {
            lobbyState.users_in_mental.push({ name: u });
            let userArrayEntry = lobbyState.users_in_lobby[i];
            let index = lobbyState.users_in_lobby.indexOf(userArrayEntry);
            if (index > -1) {
                lobbyState.users_in_lobby.splice(index, 1);
            }
            lobbyState.last_change = new Date().getTime();
        }
    }
    res.send(cookie);
})
app.get('/check_my_name', (req, res) => {
    res.send(req.session.login_name);
})
app.get("/return_to_lobby", (req, res) => {
    let cookie = req.session;
    for (var i = 0; i < lobbyState.users_in_mental.length; i++) {
        let u = lobbyState.users_in_mental[i].name;
        let uFromCookie = req.session.login_name;
        if (u == uFromCookie) {
            lobbyState.users_in_lobby.push({ name: u });
            let userArrayEntry = lobbyState.users_in_mental[i];
            let index = lobbyState.users_in_mental.indexOf(userArrayEntry);
            if (index > -1) {
                lobbyState.users_in_mental.splice(index, 1);
            }
            lobbyState.last_change = new Date().getTime();
        }
    }
    res.send(cookie);
})

function addUserToLobbyStateArray(user, userId) {
    let userObject = { name: user, userId: userId };
    lobbyState.current_users.push(userObject);
    lobbyState.users_in_lobby.push(userObject);
}

function removeItemFromArray(array, item) {
    let index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function userEventLogger(name) {
    let timeStamp = Date();
}

function generateRandomString() {
    let randomString = "";
    let newString = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 5; i++) {
        var random = Math.floor(Math.random() * newString.length - 1);
        randomString += newString[random];
    }
    return randomString;
}
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});