import { SQUARES, type Color, type PieceSymbol, type Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";


export const ChessBoard = ({ 
  board, 
  socket, 
  validMoves = [], 
  onPieceSelect 
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  validMoves?: string[];
  onPieceSelect?: (square: string) => void;
}) => {
  const [from , setFrom] =useState<null | Square >(null);
  const [to, setTo] = useState<null | Square >(null);

  const getPieceImage = (piece: { type: PieceSymbol; color: Color }) => {
    const color = piece.color === 'w' ? 'w' : 'b';
    const type = piece.type;
    return `/${color}${type}.png`;
  };

  const handleSquareClick = (rowIndex: number, colIndex: number, piece: any) => {
    // Convert board coordinates to chess square notation (a1, b2, etc.)
    const squareName = String.fromCharCode(97 + colIndex) + (8 - rowIndex) as Square;
    
    console.log(`Clicked square: ${squareName}, piece:`, piece, `from:`, from);
    console.log(`Board coordinates: row=${rowIndex}, col=${colIndex}`);

    if (!from) {
      // First click - selecting a piece
      if (piece) {
        setFrom(squareName);
        console.log(`Selected piece at ${squareName}:`, piece);
        // Request valid moves for this piece
        if (onPieceSelect) {
          onPieceSelect(squareName);
        }
      }
    } else {
      // Second click - making a move
      if (squareName !== from) {
        console.log(`Attempting move from ${from} to ${squareName}`);
        console.log(`Piece being moved:`, piece);
        
        // Add some basic validation
        if (piece && piece.color === board[8 - parseInt(from[1])][from.charCodeAt(0) - 97]?.color) {
          console.log("Cannot capture your own piece!");
          return;
        }
        
        socket.send(JSON.stringify({
          type: MOVE,
          move: {
            from,
            to: squareName
          }
        }));
        // Reset selection after making move
        setFrom(null);
        setTo(null);
      } else {
        // Clicking the same square - deselect
        setFrom(null);
        setTo(null);
      }
    }
  };

  const isSelected = (rowIndex: number, colIndex: number) => {
    const squareName = String.fromCharCode(97 + colIndex) + (8 - rowIndex) as Square;
    return from === squareName;
  };

  const isValidMove = (rowIndex: number, colIndex: number) => {
    const squareName = String.fromCharCode(97 + colIndex) + (8 - rowIndex) as Square;
    return validMoves.includes(squareName);
  };

  return (
    <div className="text-white-200">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((piece, j) => {
            const squareName = String.fromCharCode(97 + j) + (8 - i) as Square;
            const selected = isSelected(i, j);
            const validMove = isValidMove(i, j);
            
            return (
              <div 
                key={j}
                onClick={() => handleSquareClick(i, j, piece)}
                className={`w-16 h-16 flex items-center justify-center text-lg font-bold cursor-pointer border-2 ${
                  selected ? 'border-yellow-400' : validMove ? 'border-green-400' : 'border-transparent'
                } ${
                  (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                }`}
              > 
                <div className="w-full justify-center flex">
                  <div className="h-full justify-center flex flex-col">
                    {piece ? (
                      <img 
                        src={getPieceImage(piece)} 
                        alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      validMove && (
                        <div className="w-4 h-4 bg-green-400 rounded-full opacity-50"></div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Debug Info */}
      <div className="mt-4 text-white text-sm">
        <p>Selected: {from || 'None'}</p>
        <p>Valid moves: {validMoves.join(', ') || 'None'}</p>
      </div>
    </div>
  );
};