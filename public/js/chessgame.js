// const socket = io();
// const chess = new Chess();
// const boardElement = document.querySelector(".chessboard");

// let draggedPiece = null;
// let sourceSquare = null;
// let playerRole = null;

// const renderBoard = () => {
//     const board = chess.board();
//     boardElement.innerHTML = "";
//     board.forEach((row,rowindex)=>{
//         row.forEach((square,squareindex)=>{
//           const squareElement = document.createElement("div");
//           squareElement.classList.add(
//             "square",
//             (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
//           );  

//           squareElement.dataset.row = rowindex;
//           squareElement.dataset.col = squareindex;

//           if(square){
//             const pieceElement = document.createElement("div");
//             pieceElement.classList.add(
//                 "piece",
//                 square.color === "w" ? "white" : "black"
//             );
//             pieceElement.innerText = getPieceUnicode(square);
//             pieceElement.draggable = playerRole === square.color;

//             pieceElement.addEventListener("dragstart", (e) => {
//                 if (pieceElement.draggable) {
//                   draggedPiece = pieceElement;
//                   sourceSquare = { row: rowindex, col: squareindex };
//                   e.dataTransfer.setData("text/plain", ""); // Pass `e` to use `dataTransfer`
//                 }
//               });
              
//               pieceElement.addEventListener("dragend", () => {
//                 draggedPiece = null;
//                 sourceSquare = null;
//               });
              
//               squareElement.addEventListener("drop", function (e) {
//                 e.preventDefault();
//                 if (draggedPiece) {
//                   const targetSource = {
//                     row: parseInt(squareElement.dataset.row),
//                     col: parseInt(squareElement.dataset.col),
//                   };
//                   handleMove(sourceSquare, targetSource); // Pass `sourceSquare` and `targetSource`
//                 }
//               });
              
//               const handleMove = (source, target) => {
//                 const move = {
//                   from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
//                   to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
//                   promotion: "q",
//                 };
//                 socket.emit("move", move);
//               };
              
            
//             pieceElement.addEventListener("dragstart",()=>{
//                 if(pieceElement.draggable){
//                 draggedPiece = pieceElement;
//                 sourceSquare = {row:rowindex, col:squareindex};
//                 e.dataTransfer.setData('text/plain',"");    
//             }
//             });
//               pieceElement.addEventListener("dragend",(e)=>{
//                 draggedPiece = null;
//                 sourceSquare = null;
//               });
             
//               squareElement.appendChild(pieceElement);
        
//             }
//             squareElement.addEventListener("dragover",function(e){
//                 e.preventDefault();
//             });
//             squareElement.addEventListener("drop",function(e){
//                 e.preventDefault();
//                 if(draggedPiece){
//                     const targetSource = {
//                         row : parseInt(squareElement.dataset.row),
//                         col : parseInt(squareElement.dataset.col),
//                     };
//                      handleMove(sourceSquare,targetSource);
//                 }
//             });
//             boardElement.appendChild(squareElement);
//         });
//     });
//     if(playerRole === "b"){
//         boardElement.classList.add("flipped");
//     }else{
//         boardElement.classList.remove("flipped");
//     }
// };

// const handleMove = () => {
//     const move = {
//         from: `${String.fromCharCode(97+source.col)}${8-source.row}`,
//         to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
//         promotion: "q"
//     };
//     socket.emit("move",move);
// };

// const getPieceUnicode = (piece) => {
//     const unicodePieces = {
//       p: "♟", // Black Pawn
//       r: "♜", // Black Rook
//       n: "♞", // Black Knight
//       b: "♝", // Black Bishop
//       q: "♛", // Black Queen
//       k: "♚", // Black King
//       P: "♙", // White Pawn
//       R: "♖", // White Rook
//       N: "♘", // White Knight
//       B: "♗", // White Bishop
//       Q: "♕", // White Queen
//       K: "♔"  // White King
//     };
//     return unicodePieces[piece.type] || "";
//   };


//   socket.on("playerRole",function(role){
//     playerRole = role;
//     renderBoard();
//   });

//   socket.on("spectatorRole",function(){
//     playerRole = null;
//     renderBoard();
//   });

//   socket.on("boardState",function(fen){
//     chess.load(fen);
//     renderBoard();
//   });

//   socket.on("move",function(move){
//     chess.load(move);
//     renderBoard();
//   });

// renderBoard();




// // basics of socket io
// // socket.emit("churan papdi")
// // socket.on("churan papdi",function(){
// //     console.log("churan papdi received")
// // })



const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );

      squareElement.dataset.row = rowindex;
      squareElement.dataset.col = squareindex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", ""); // Required for drag events
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
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

      boardElement.appendChild(squareElement);
    });
  });

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
