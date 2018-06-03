function startGame(mentalGameState) {
    console.log("********GAME HAS STARTED***********");
    console.log(mentalGameState);
    // for (var i = 0; i < mentalGameState.total_rounds; i++) {
    let card = selectCardFromDeck(mentalGameState);
    return card;
    //  simulatePlayerAction();
    //calculateWinnerOfTurn();
    // }
    // console.log('game state in in mental startGame', mentalGameState);
    //1. announce game start  

    //3 .display card to players
    //4. wait for each player to submit

    //calculateWinnerOfTurns();

    //6. assign points
    // 7. if deck has cards or no player has enough points to win goto 2
    // 8. if playing total rounds calculate winner of round  
}

// function simulatePlayerAction(mentalGameState) {
//     //Math.floor(Math.random() * 10 + 1),
//     for (var player in mentalGameState.players) {
//         //select card from array, remove from array,
//         let card = mentalGameState.players[player].player_cards[Math.floor(Math.random() *
//             mentalGameState.players[player].player_cards.length)];
//             mentalGameState.players[player].current_card_played = card;
//     }
// }

function selectCardFromDeck(mentalGameState) {
    //pick card
    let cardsRemaining = mentalGameState.target_deck.length;
    let indexForChoosingCard = Math.floor(Math.random() * cardsRemaining);
    let cardToReturn = mentalGameState.target_deck[indexForChoosingCard];

    //remove from deck (will be removed from object on database)
    let index = mentalGameState.target_deck.indexOf(cardToReturn);
    if (index > -1) {
        mentalGameState.target_deck.splice(index, 1);
    }
    console.log('card to return', cardToReturn);
    return cardToReturn;
    // console.log(mentalGameState);

    //calculateWinnerOfTurn(cardToReturn);

}

function calculateWinnerOfTurn(mentalGameState, cardToReturn) {
    let highestCard = 0;
    let winner;
    let topCardsAreTied = false;
    for (var player in mentalGameState.players) {
        playerCard = mentalGameState.players[player].current_card_played;
        //  console.log('card', card, 'current_card_played', gameManager.players[card].current_card_played, 'highest card', highestCard);
        if (playerCard > highestCard) {
            highestCard = playerCard;
            winner = player;
            topCardsAreTied = false;
        } else if (playerCard === highestCard) {
            topCardsAreTied = true;
        }
    }

    if (topCardsAreTied) {
        //  console.log('top cards tied, no one wins')
    } else {
        //console.log('The winner is ', winner, ' with a', highestCard, 'they won', cardToReturn);
        mentalGameState.players[winner].player_score += cardToReturn;
    }

}

function calculateTheWinner(mentalGameState) {
    let highestScore = 0;
    let winner;
    let topScoresTied = false;
    for (var player in mentalGameState.players) {
        let finalScore = mentalGameState.players[player].player_score;
        console.log(`${player} final score: ${finalScore}`);
        //  console.log('card', card, 'current_card_played', gameManager.players[card].current_card_played, 'highest card', highestCard);
        if (finalScore > highestScore) {
            highestScore = finalScore;
            winner = player;
            topScoresTied = false;
        } else if (finalScore === highestScore) {
            topCardsAreTied = true;
        }
    }
    if (!topScoresTied) {
        console.log(`${winner} has won the game with a score of ${highestScore}`);
    }

}

module.exports = {
    startGame: startGame,
    selectCardFromDeck: selectCardFromDeck,
    calculateWinnerOfTurn: calculateWinnerOfTurn,
    calculateTheWinner: calculateTheWinner

};