$(document).ready(function() {
    console.log('in mentallogic starts');

    setInterval(poll, 20);

});
let lastGameStateChange = 0;
let playerName = "";
let canPlayCard = true;
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
        //   console.log('i will do something new!');
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

    } else {
        //console.log('nothing has changed');
    }
}

function reactToNewEvents(name, mentalGameState) {


    //eventually we show drawn card, first change how player cards are displayed



    playerName = name;
    let players = mentalGameState.players;
    let htmlToAppendToLobby = "";
    $('#board').empty();

    //for player
    var player = $('<p/>')
        .html(`${playerName}`)
    var score = $('<p/>')
        .html('score:')
        .attr('id', `${playerName}_score`);

    $('#board').append(player).append(score);
    let cardHolder = $('<div>').attr('class', 'card_holder');
    $('#board').append(cardHolder);

    for (var i = 1; i < 14; i++) {
        let card = $('<div>')
            .text(`${i}`)
            .attr('id', `card${playerName}${i}`)
            .attr('class', 'card')
            .data('value', `${i}`)
            .bind('click', function() {
                if (canPlayCard) {
                    canPlayCard = false;
                    $(this)
                        .attr('class', 'played_card');
                    var playerObject = mentalGameState.players.filter(function(obj) {

                        return obj.name == playerName
                    });
                    let realP = playerObject[0];
                    realP.current_card = parseInt($(this).data('value'));
                    realP.has_played = true;
                    console.log('realP', realP);
                    //change cards remaining
                    $.post({
                        url: "http://localhost:8080/push_player",
                        data: realP,
                        success: function() {
                            console.log('new player info pushed');
                        }
                    });
                }
            });
        $('.card_holder').append(card);
    }

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
    if (mentalGameState.game_state === 'waiting_for_players') {
        let gameDeck = $('<div>')
            .html(mentalGameState.current_card)
            .attr('id', 'game_deck');

        $('#board').append(gameDeck);
    } else {
        let gameDeck = $('<div>')
            .attr('id', 'game_deck');
        $('#board').append(gameDeck);
    }




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