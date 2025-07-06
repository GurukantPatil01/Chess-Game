import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
   private games: Game[];
   private pendingUser: WebSocket | null;
   private users: WebSocket[];
   
   constructor() {
      this.games = [];
      this.pendingUser = null;
      this.users = [];
   }

   addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
   }

   removeUser(socket: WebSocket) {
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
                if (otherPlayer.readyState === WebSocket.OPEN) {
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

   private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log("Received message:", message);
                
                if (message.type === INIT_GAME) {
                    if (this.pendingUser && this.pendingUser !== socket) {
                        // Create new game with pending user and current socket
                        // pendingUser becomes white (player1), current socket becomes black (player2)
                        console.log("Starting new game between two players");
                        const game = new Game(this.pendingUser, socket);
                        this.games.push(game);
                        this.pendingUser = null;
                    } else {
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
                
                if (message.type === MOVE) {
                    console.log("Processing move:", message.move);
                    const game = this.games.find(game => 
                        game.player1 === socket || game.player2 === socket
                    );
                    if (game) {
                        game.makeMove(socket, message.move);
                    } else {
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
                    const game = this.games.find(game => 
                        game.player1 === socket || game.player2 === socket
                    );
                    if (game) {
                        game.getValidMoves(socket, message.square);
                    } else {
                        socket.send(JSON.stringify({
                            type: "ERROR",
                            payload: {
                                message: "You are not in any active game!"
                            }
                        }));
                    }
                }
            } catch (error) {
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