"use strict";

// import { Board } from "./Board";

function initialiseBoard() {
    const size = 10;

    // let board = new Board(10, 10);
    
    const boardDiv = document.getElementById("board");
    // board.initialiseBoard();

    for (let r = 0; r < size; r ++) {
        for (let c = 0; c < size; c++) {
            const cell = document.createElement("button");
            cell.className = "cell";
            cell.textContent = "p";
            boardDiv.appendChild(cell);
        }
    }
}

initialiseBoard();
