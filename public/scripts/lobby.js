$(document).ready(function() {
    console.log('in lobby starts');
    setInterval(poll, 20);
});
let lastLobbyStateChange = 0;

const poll = function() {
    $.ajax({

        url: "http://localhost:8080/lobby_data",
        success: function(lobbyState) {
            checkLogForNewEvents(lobbyState);
        },
        error: function() {
            console.log('error');
        },
        timeout: 30000
    });
};

$('#start_new_mental').click(function() {
    $.post({
        type: "POST",
        url: '/create_mental',
        success: function(lobbyState) {
            console.log('in return call', lobbyState);
            setTimeout(function() { lobbyState.users_in_mental = [] }, 1000);
        }
    });
});


$('#join_mental').click(function() {
    console.log('clicked join mental');
    $.get({
        type: "GET",
        url: '/move_to_mental_queue',
        success: function(ret) {}
    });
});

$('#return_to_lobby').click(function() {
    console.log('clicked return to lobby'); //works
    $.get({
        type: "GET",
        url: '/return_to_lobby',
        success: function(ret) {}
    });
});


function checkLogForNewEvents(lobbyState) {
    if (lobbyState.last_change > lastLobbyStateChange) {
        console.log('i will do something new!');
        $.ajax({

            url: "http://localhost:8080/check_my_name",
            success: function(name) {
                console.log('this is what was returned');
                reactToNewEvents(name, lobbyState);
            },
            error: function() {
                console.log('error');
            },
            timeout: 30000
        });

    }
}



function reactToNewEvents(name, lobbyState) {


    if (lobbyState.users_in_mental.some(e => e.name === name) && lobbyState.game_starting === true) {
        console.log(name, 'is in mental queue');
        $.ajax({

            url: "http://localhost:8080/leave_mental_queue",
            success: function(name) {
                console.log('went to leave and returned');

                window.location.href = '/mental';

            },
            error: function() {
                console.log('error');
            },
            timeout: 30000 // 30 seconds, where logout happens
        });




    }

    let usersInLobby = lobbyState.users_in_lobby;
    let htmlToAppendToLobby = "";
    // $('#lobby').empty();
    for (var i = 0; i < usersInLobby.length; i++) {
        let userToUpdate = lobbyState.users_in_lobby[i].name;

        htmlToAppendToLobby += `${userToUpdate}`;
        htmlToAppendToLobby += '<br>';
    }
    $('#lobby').append('<p>').html(htmlToAppendToLobby);


    let usersInMental = lobbyState.users_in_mental;
    let htmlToAppendToMental = "";
    for (var i = 0; i < usersInMental.length; i++) {
        let userToUpdate = lobbyState.users_in_mental[i].name;

        htmlToAppendToMental += `${userToUpdate}`;
        htmlToAppendToMental += '<br>';
    }
    $('#mental_queue').append('<p>').html(htmlToAppendToMental);

    lastLobbyStateChange = lobbyState.last_change;
}


function removeFromLobby(user) {
    console.log()
}

function addToMentalQueue(user) {

}

function removeFromMentalQueue(user) {

}

function createInitialDate() {
    let date = new Date();
    let t = date.setDate(date.getDate() - 100);
    return t;
}