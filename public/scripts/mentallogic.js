$(document).ready(function() {
    console.log('in mentallogic starts');

    setInterval(poll, 20);

});
let lastGameStateChange = 0;
let playerName = "";
//let gameManager = {};


var poll = function() {
    $.ajax({
        url: "http://localhost:8080/mental_data",
        success: function(mentalGameState) {
            // console.log(mentalGameState);
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
    playerName = name;
    let players = mentalGameState.players;
    let htmlToAppendToLobby = "";
    $('#board').empty();


    //for player
    var player = $('<p/>')
        .html(`${playerName}`)


    var readyToPlayButton = $('<button/>')
        .text('Ready!')
        .attr('id', `ready_button`);

    $('#board').append(player);
    $('#board').append(readyToPlayButton);
    let cardHolder = $('<div>').attr('class', 'card_holder');
    $('#board').append(cardHolder);

    for (var i = 1; i < 14; i++) {
        let card = $('<div>')
            .text(`${i} `)
            .attr('class', 'card')
        $('.card_holder').append(card);
    }
    //  $('.button_div').append(readyToPlayButton);


    //for opponents
    for (var i = 0; i < players.length; i++) {
        let playerToUpdate = mentalGameState.players[i].name;
        if (playerToUpdate != playerName) {
            var player = $('<p/>')
                .html(`${playerToUpdate}`)
                .attr('class', 'opponent_name');
            let opponentCardHolder = $('<div>').attr('class', 'opponent_card_holder');
            let line = $('<hr>');
            $('#board').append(line).append(player).append(opponentCardHolder);
        }
        console.log('player to update', playerToUpdate, 'playerName', playerName);
    }
    lastGameStateChange = mentalGameState.last_change;
    console.log(`#ready_${playerName}`);

    //deck
    let gameDeck = $('<div>')
        .attr('id', 'game_deck');


    $('#board').append(gameDeck);
}

$(`#ready_${playerName}`).click(function() {
    console.log(`${playerName} clicked the ready button`)
        // console.log('clicked join mental');
        // $.get({
        //     type: "GET",
        //     url: '/move_to_mental_queue',
        //     success: function(ret) {}
        // });
});