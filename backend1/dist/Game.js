"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const ws_1 = require("ws");
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        // Notify both players that the game has started
        const gameId = this.generateGameId();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white",
                gameId: gameId,
                board: this.board.fen(),
                turn: this.board.turn(),
                message: "Game started! You are playing as White. Your turn!"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black",
                gameId: gameId,
                board: this.board.fen(),
                turn: this.board.turn(),
                message: "Game started! You are playing as Black. Wait for White's move."
            }
        }));
    }
    generateGameId() {
        return Math.random().toString(36).substring(2, 15);
    }
    makeMove(socket, move) {
        console.log(`Attempting move from ${move.from} to ${move.to}`);
        // Validate turn - White moves first (even number of moves), Black moves second (odd number of moves)
        const isWhiteTurn = this.board.history().length % 2 === 0;
        const isPlayer1Turn = isWhiteTurn; // player1 is white
        if (isPlayer1Turn && socket !== this.player1) {
            console.log("Wrong turn: Not white's turn");
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Not your turn! It's White's turn to move.",
                    currentTurn: "white",
                    yourColor: "black"
                }
            }));
            return;
        }
        if (!isPlayer1Turn && socket !== this.player2) {
            console.log("Wrong turn: Not black's turn");
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Not your turn! It's Black's turn to move.",
                    currentTurn: "black",
                    yourColor: "white"
                }
            }));
            return;
        }
        // Validate move format
        if (!move.from || !move.to || typeof move.from !== 'string' || typeof move.to !== 'string') {
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: "Invalid move format! Use: {\"from\": \"e2\", \"to\": \"e4\"}",
                    example: { "from": "e2", "to": "e4" }
                }
            }));
            return;
        }
        // Attempt to make the move
        try {
            const moveResult = this.board.move({
                from: move.from,
                to: move.to
            });
            if (!moveResult) {
                const possibleMoves = this.board.moves({ square: move.from });
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: `Invalid move: ${move.from} to ${move.to}. Valid moves for ${move.from}: ${possibleMoves.join(', ')}`,
                        possibleMoves: possibleMoves,
                        board: this.board.fen()
                    }
                }));
                return;
            }
            console.log(`Valid move made: ${move.from} to ${move.to}`);
        }
        catch (e) {
            console.error("Invalid move error:", e);
            const errorMessage = e instanceof Error ? e.message : 'Illegal chess move';
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: `Invalid move: ${move.from} to ${move.to}. ${errorMessage}`,
                    board: this.board.fen()
                }
            }));
            return;
        }
        // Check for game over conditions
        if (this.board.isGameOver()) {
            let winner = null;
            let reason = "";
            if (this.board.isCheckmate()) {
                winner = this.board.turn() === "w" ? "black" : "white";
                reason = "checkmate";
            }
            else if (this.board.isDraw()) {
                reason = "draw";
                if (this.board.isStalemate()) {
                    reason = "stalemate";
                }
                else if (this.board.isThreefoldRepetition()) {
                    reason = "threefold repetition";
                }
                else if (this.board.isInsufficientMaterial()) {
                    reason = "insufficient material";
                }
            }
            // Notify both players of game end
            const gameEndMessage = {
                type: "GAME_OVER",
                payload: {
                    winner: winner,
                    reason: reason,
                    board: this.board.fen(),
                    history: this.board.history(),
                    finalPosition: this.board.ascii()
                }
            };
            console.log("Game over:", gameEndMessage.payload);
            if (this.player1.readyState === ws_1.WebSocket.OPEN) {
                this.player1.send(JSON.stringify(gameEndMessage));
            }
            if (this.player2.readyState === ws_1.WebSocket.OPEN) {
                this.player2.send(JSON.stringify(gameEndMessage));
            }
            return;
        }
        // Send move update to both players
        const currentTurn = this.board.turn() === 'w' ? 'white' : 'black';
        const moveMessage = {
            type: messages_1.MOVE,
            payload: {
                move: {
                    from: move.from,
                    to: move.to,
                    piece: this.board.get(move.to)
                },
                board: this.board.fen(),
                ascii: this.board.ascii(),
                turn: currentTurn,
                isCheck: this.board.isCheck(),
                moveCount: this.board.history().length,
                history: this.board.history(),
                possibleMoves: this.board.moves()
            }
        };
        console.log(`Sending move update. Turn: ${currentTurn}, Move count: ${this.board.history().length}`);
        // Send to both players
        if (this.player1.readyState === ws_1.WebSocket.OPEN) {
            this.player1.send(JSON.stringify(moveMessage));
        }
        if (this.player2.readyState === ws_1.WebSocket.OPEN) {
            this.player2.send(JSON.stringify(moveMessage));
        }
    }
    getValidMoves(socket, square) {
        console.log(`Getting valid moves for square: ${square}`);
        try {
            const moves = this.board.moves({ square: square });
            console.log(`Valid moves for ${square}:`, moves);
            socket.send(JSON.stringify({
                type: "VALID_MOVES",
                payload: {
                    square: square,
                    moves: moves
                }
            }));
        }
        catch (e) {
            console.error("Error getting valid moves:", e);
            socket.send(JSON.stringify({
                type: "ERROR",
                payload: {
                    message: `Error getting valid moves for square ${square}`,
                    square: square
                }
            }));
        }
    }
}
exports.Game = Game;
