
// const socket = io();
// const chess = new Chess();
// const boardElement = document.querySelector(".chessboard");

// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard = () => {
//   const board = chess.board();
//   boardElement.innerHTML = "";
//   board.forEach((row, rowindex) => {
//     row.forEach((square, squareindex) => {
//       const squareElement = document.createElement("div");
//       squareElement.classList.add(
//         "square",
//         (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
//       );

//       squareElement.dataset.row = rowindex;
//       squareElement.dataset.col = squareindex;

//       if (square) {
//         const pieceElement = document.createElement("div");
//         pieceElement.classList.add(
//           "piece",
//           square.color === "w" ? "white" : "black"
//         );
//         pieceElement.innerText = getPieceUnicode(square);
//         pieceElement.draggable = playerRole === square.color;

//         pieceElement.addEventListener("dragstart", (e) => {
//           if (pieceElement.draggable) {
//             draggedPiece = pieceElement;
//             sourceSquare = { row: rowindex, col: squareindex };
//             e.dataTransfer.setData("text/plain", ""); // Required for drag events
//           }
//         });

//         pieceElement.addEventListener("dragend", () => {
//           draggedPiece = null;
//           sourceSquare = null;
//         });

//         squareElement.appendChild(pieceElement);
//       }

//       squareElement.addEventListener("dragover", (e) => {
//         e.preventDefault();
//       });

//       squareElement.addEventListener("drop", (e) => {
//         e.preventDefault();
//         if (draggedPiece) {
//           const targetSquare = {
//             row: parseInt(squareElement.dataset.row),
//             col: parseInt(squareElement.dataset.col),
//           };
//           handleMove(sourceSquare, targetSquare); // Pass source and target
//         }
//       });

//       boardElement.appendChild(squareElement);
//     });
//   });

//   if (playerRole === "b") {
//     boardElement.classList.add("flipped");
//   } else {
//     boardElement.classList.remove("flipped");
//   }
// };

// // Move handling logic
// const handleMove = (source, target) => {
//   const move = {
//     from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//     to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//     promotion: "q",
//   };
//   socket.emit("move", move);
// };

// // Unicode mapping for chess pieces
// const getPieceUnicode = (piece) => {
//   const unicodePieces = {
//     p: "♟", // Black Pawn
//     r: "♜", // Black Rook
//     n: "♞", // Black Knight
//     b: "♝", // Black Bishop
//     q: "♛", // Black Queen
//     k: "♚", // Black King
//     P: "♙", // White Pawn
//     R: "♖", // White Rook
//     N: "♘", // White Knight
//     B: "♗", // White Bishop
//     Q: "♕", // White Queen
//     K: "♔", // White King
//   };
//   return unicodePieces[piece.type] || "";
// };

// // Socket event handlers
// socket.on("playerRole", function (role) {
//   playerRole = role;
//   renderBoard();
// });

// socket.on("spectatorRole", function () {
//   playerRole = null;
//   renderBoard();
// });

// socket.on("boardState", function (fen) {
//   chess.load(fen);
//   renderBoard();
// });

// socket.on("move", function (move) {
//   chess.load(move);
//   renderBoard();
// });

// // Initial render
// renderBoard();




const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const turnIndicator = document.querySelector(".turn-indicator");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
      );

      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareIndex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        // Drag event listeners
        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: squareIndex };
            e.dataTransfer.setData("text/plain", ""); // Required for drag events
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        // Touch event listeners
        pieceElement.addEventListener("touchstart", (e) => {
          draggedPiece = pieceElement;
          sourceSquare = { row: rowIndex, col: squareIndex };
          e.preventDefault();
        });

        pieceElement.addEventListener("touchend", (e) => {
          draggedPiece = null;
          sourceSquare = null;
          e.preventDefault();
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare); // Pass source and target
        }
      });

      // Handle touch events for dropping
      squareElement.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const touch = e.touches[0];
          const targetElement = document.elementFromPoint(
            touch.clientX,
            touch.clientY
          );
          if (targetElement && targetElement.classList.contains("square")) {
            const targetSquare = {
              row: parseInt(targetElement.dataset.row),
              col: parseInt(targetElement.dataset.col),
            };
            handleMove(sourceSquare, targetSquare);
          }
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  // Update turn indicator
  const currentTurn = chess.turn();
  if (playerRole === currentTurn) {
    turnIndicator.innerText = "Your Turn";
    turnIndicator.style.color = "green";
  } else {
    turnIndicator.innerText = "Opponent's Turn";
    turnIndicator.style.color = "red";
  }

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

// Move handling logic
const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };
  socket.emit("move", move);
};

// Unicode mapping for chess pieces
const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♟", // Black Pawn
    r: "♜", // Black Rook
    n: "♞", // Black Knight
    b: "♝", // Black Bishop
    q: "♛", // Black Queen
    k: "♚", // Black King
    P: "♙", // White Pawn
    R: "♖", // White Rook
    N: "♘", // White Knight
    B: "♗", // White Bishop
    Q: "♕", // White Queen
    K: "♔", // White King
  };
  return unicodePieces[piece.type] || "";
};

// Socket event handlers
socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

socket.on("move", function (move) {
  chess.load(move);
  renderBoard();
});

// Initial render
renderBoard();

