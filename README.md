# goofspiel-server

The goal of this ongoing project is to make a goofspiel server that supports real time multiplayer games with both human and AI opponents. 

## Bugs/Issues
This project is in its early stages and still contains many bugs. While the user registration system works, the game itself is nearly unplayable beyond a single round. The code itself has not been refactored and is full of useless code. All game states are stored on the express server, not in the database as intended. 

## Dependencies
- Node.js
- Express
- MongoDb
- body-parser
- cookie-session

## Getting Started
- Install all the dependecies using 'npm install'
- Run the development server using 'node express_server'
- Setup a mongo server. A 'data' collection is needed for the user system. Eventually a collection for gameData will be added. 
