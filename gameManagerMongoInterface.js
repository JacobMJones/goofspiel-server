const retrieveGame = function(name, password, database, cb) {

    database.collection('mentalGames').find(userQuery).toArray(function(err, result) {
        if (err) throw err

        let storedPassword = result[0].password;
        if (storedPassword === password) {
            cb(true);
        } else {
            cb(false);
        }
    });
}

const createGame = function(database) {

    let gameManager = {
        game_id: 1,
        targetDeck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        game_start: new Date,
        //win condition can be points or matches
        win_condition: 'points',
        needed_to_win: 200,
        total_hands: 13,
    }

    database.collection('mentalGames').insertOne(gameManager, function(err, res) {
        if (err) throw err;
        console.log('1 document inserted');
    })
}
const incrementGameId = function() {

}
module.exports = {
    createGame: createGame,
    // register: register
};