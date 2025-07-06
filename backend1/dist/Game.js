"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
    }
    makeMove(socket, move) {
        //validation here type of move
        if (this.board.move.length % 2 === 0 && socket === this.player1) {
            return;
        }
        else if (this.board.move.length % 2 === 1 && socket === this.player2) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.error("Invalid move", e);
            return;
        }
        //update the board 
        //push the move
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                }
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.INIT_GAME,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                }
            }));
            return;
        }
        if (this.board.moves.length % 2 === 0) { //send updated board to both the player
            this.player2.emit(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.emit(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
    }
}
exports.Game = Game;
