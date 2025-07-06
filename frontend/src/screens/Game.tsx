import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { useSocket } from "../hooks/useSocket";
import { ChessBoard } from "../components/ChessBoard";
import { Button } from "../components/Button";

export const INIT_GAME ="init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GET_VALID_MOVES = "get_valid_moves";

export const Game = () => {
  const { socket, isConnecting, error: socketError } = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [moves, setMoves] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("Waiting to start...");
  const [validMoves, setValidMoves] = useState<string[]>([]);

  const requestValidMoves = (square: string) => {
    if (socket) {
      socket.send(JSON.stringify({
        type: GET_VALID_MOVES,
        square: square
      }));
    }
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          setMoves([]);
          setError(null);
          setValidMoves([]);
          setGameStatus("Game started!");
          console.log("Game initialized");
          break;

        case MOVE:
          const move = message.payload?.move || message.move;
          console.log("Processing move:", move);
          if (move) {
            chess.move(move);
            setBoard(chess.board());
            setMoves(prev => [...prev, move]);
            setError(null);
            setValidMoves([]);
            setGameStatus(`Move made: ${move.from} → ${move.to}`);
          }
          console.log("Move made");
          break;

        case "ERROR":
          const errorMessage = message.payload?.message || "An error occurred";
          const possibleMoves = message.payload?.possibleMoves || [];
          setError(errorMessage);
          setGameStatus("Error occurred");
          if (possibleMoves.length > 0) {
            setValidMoves(possibleMoves);
            console.log("Valid moves for this piece:", possibleMoves);
          }
          console.error("Server error:", errorMessage);
          break;

        case "VALID_MOVES":
          const moves = message.payload?.moves || [];
          setValidMoves(moves);
          console.log("Received valid moves:", moves);
          break;

        case "WAITING_FOR_OPPONENT":
          setGameStatus("Waiting for opponent to join...");
          setError(null);
          break;

        case GAME_OVER:
          const winner = message.payload?.winner;
          const reason = message.payload?.reason;
          if (winner) {
            setGameStatus(`Game Over! ${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by ${reason}`);
          } else {
            setGameStatus(`Game Over! ${reason}`);
          }
          setError(null);
          setValidMoves([]);
          console.log("Game over");
          break;

        default:
          console.log("Unknown message type:", message.type);
      }
    };
  }, [socket]);

  if (isConnecting) return <div className="text-white text-center pt-8">Connecting to game server...</div>;
  
  if (socketError) return (
    <div className="text-white text-center pt-8">
      <div className="bg-red-600 p-4 rounded-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Connection Error</h2>
        <p className="mb-4">{socketError}</p>
        <p className="text-sm text-red-200">Please check if the game server is running.</p>
      </div>
    </div>
  );

  if (!socket) return <div className="text-white text-center pt-8">Failed to connect to game server</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4  w-full flex justify-center">
            <ChessBoard 
              socket={socket} 
              board={board} 
              validMoves={validMoves}
              onPieceSelect={requestValidMoves}
            />
          </div>
          <div className="col-span-2 bg-slate-800 w-full flex flex-col">
            <div className="pt-8 flex justify-center">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Play
              </Button>
            </div>
            
            {/* Game Status */}
            <div className="mt-4 px-4">
              <div className="bg-slate-700 p-3 rounded-lg">
                <h3 className="text-white text-sm font-bold mb-2">Game Status</h3>
                <p className="text-gray-300 text-xs">{gameStatus}</p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 px-4">
                <div className="bg-red-600 p-3 rounded-lg">
                  <h3 className="text-white text-sm font-bold mb-2">Error</h3>
                  <p className="text-red-100 text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Valid Moves Display */}
            {validMoves.length > 0 && (
              <div className="mt-4 px-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <h3 className="text-white text-sm font-bold mb-2">Valid Moves</h3>
                  <p className="text-blue-100 text-xs">{validMoves.join(', ')}</p>
                </div>
              </div>
            )}
            
            {/* Moves Display */}
            <div className="mt-8 px-4">
              <h3 className="text-white text-lg font-bold mb-4">Moves</h3>
              <div className="bg-slate-700 p-4 rounded-lg max-h-96 overflow-y-auto">
                {moves.length === 0 ? (
                  <p className="text-gray-400 text-sm">No moves yet</p>
                ) : (
                  <div className="space-y-2">
                    {moves.map((move, index) => (
                      <div key={index} className="text-white text-sm bg-slate-600 p-2 rounded">
                        <span className="font-mono">
                          {index + 1}. {move.from} → {move.to}
                        </span>
                        {move.piece && (
                          <span className="text-gray-300 ml-2">
                            ({move.piece.color === 'w' ? 'White' : 'Black'} {move.piece.type.toUpperCase()})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;