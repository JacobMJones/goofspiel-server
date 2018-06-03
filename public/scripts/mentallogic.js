$(document).ready(function() {
    console.log('in mentallogic starts');

    setInterval(poll, 20);

});
let lastGameStateChange = 0;
//let gameManager = {};


var poll = function() {
    $.ajax({
        url: "http://localhost:8080/mental_data",
        success: function(mentalGameState) {
            console.log(mentalGameState);
            checkLogForNewEvents(mentalGameState);
        },
        error: function() {

        },
        timeout: 30000 // 30 seconds
    });
};

function checkLogForNewEvents(mentalGameState) {
    if (mentalGameState.last_change > lastGameStateChange) {
        console.log('i will do something new!');
        $.ajax({

            url: "http://localhost:8080/check_my_name",
            success: function(name) {
                console.log('this is what was returned');
                reactToNewEvents(name, mentalGameState);
            },
            error: function() {
                console.log('error');
            },
            timeout: 30000
        });

    }
}

function reactToNewEvents(name, mentalGameState) {
    console.log('in react name', name)

    let players = mentalGameState.players;
    let htmlToAppendToLobby = "";
    $('#board').empty();
    for (var i = 0; i < players.length; i++) {
        let playerToUpdate = mentalGameState.players[i].name;
        var player = $('<p/>')
            .html(`${playerToUpdate}`)
        var readyToPlayButton = $('<button/>')
            .text('Ready!')
            .attr('id', `ready${playerToUpdate}`);

        // htmlToAppendToGame += `${playerToUpdate}`;
        // htmtToAppendToGame
        // htmlToAppendToGame += '<br>';
        $('#board').append(player).append(readyToPlayButton);
    }




    lastGameStateChange = mentalGameState.last_change;
}

$('#update_button').click(function() {
    // console.log('clicked join mental');
    // $.get({
    //     type: "GET",
    //     url: '/move_to_mental_queue',
    //     success: function(ret) {}
    // });
});