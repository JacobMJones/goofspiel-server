const login = function(name, password, database, cb) {

    let userQuery = {
            name: name
        }
        // make err the first parameter of the callback
    database.collection('data').find(userQuery).toArray(function(err, result) {
        if (err) throw err


        let storedPassword = result[0].password;

        if (storedPassword === password) {;
            cb(true, result[0]._id);
        } else {
            cb(false);
        }
    });
}
const register = function(name, password, database, cb) {
    let user = {
        "name": name,
        "password": password
    }
    database.collection('data').insertOne(user, function(err, res) {

        if (err) throw err;
        console.log('1 document inserted');

        cb(res.insertedId)
    })
}
module.exports = {
    login: login,
    register: register
};