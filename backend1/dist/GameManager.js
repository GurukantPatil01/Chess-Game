"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const ws_1 = require("ws");
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // Remove from pending user if it was pending
        if (this.pendingUser === socket) {
            this.pendingUser = null;
        }
        // End any games this user was part of
        this.games = this.games.filter(game => {
            if (game.player1 === socket || game.player2 === socket) {
                // Notify the other player that the game ended
                const otherPlayer = game.player1 === socket ? game.player2 : game.player1;
                if (otherPlayer.readyState === ws_1.WebSocket.OPEN) {
                    otherPlayer.send(JSON.stringify({
                        type: "GAME_ENDED",
                        payload: {
                            reason: "Player disconnected"
                        }
                    }));
                }
                return false; // Remove this game
            }
            return true; // Keep this game
        });
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log("Received message:", message);
                if (message.type === messages_1.INIT_GAME) {
                    if (this.pendingUser && this.pendingUser !== socket) {
                        // Create new game with pending user and current socket
                        // pendingUser becomes white (player1), current socket becomes black (player2)
                        console.log("Starting new game between two players");
                        const game = new Game_1.Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    }
                    else {
                        // Set current socket as pending user (will be white)
                        console.log("Player waiting for opponent");
                        this.pendingUser = socket;
                        socket.send(JSON.stringify({
                            type: "WAITING_FOR_OPPONENT",
                            payload: {
                                color: "white",
                                message: "You are White. Waiting for an opponent to join..."
                            }
                        }));
                    }
                }
                if (message.type === messages_1.MOVE) {
                    console.log("Processing move:", message.move);
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        game.makeMove(socket, message.move);
                    }
                    else {
                        socket.send(JSON.stringify({
                            type: "ERROR",
                            payload: {
                                message: "You are not in any active game!"
                            }
                        }));
                    }
                }
                if (message.type === "get_valid_moves") {
                    console.log("Getting valid moves for square:", message.square);
                    const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                    if (game) {
                        game.getValidMoves(socket, message.square);
                    }
                    else {
                        socket.send(JSON.stringify({
                            type: "ERROR",
                            payload: {
                                message: "You are not in any active game!"
                            }
                        }));
                    }
                }
            }
            catch (error) {
                console.error("Error parsing message:", error);
                socket.send(JSON.stringify({
                    type: "ERROR",
                    payload: {
                        message: "Invalid JSON format. Expected: {\"type\": \"init_game\"} or {\"type\": \"move\", \"move\": {\"from\": \"e2\", \"to\": \"e4\"}}"
                    }
                }));
            }
        });
        socket.on("close", () => {
            console.log("Socket closed");
            this.removeUser(socket);
        });
        socket.on("error", (error) => {
            console.error("Socket error:", error);
            this.removeUser(socket);
        });
    }
}
exports.GameManager = GameManager;
