"use strict";
import { Cell } from "./Cell.js";

export class Board {
  constructor(size, mineCount) {
    this.size = size;
    this.mineCount = mineCount;
    this.board = [];
  }

  initialiseBoard() {
    for (let r = 0; r < this.size; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.size; c++) {
        this.board[r][c] = new Cell();
      }
    }
  }

  placeMines() {
    let minesPlaced = 0;

    while (minesPlaced < this.mineCount) {
      let r = this.getRandomInt(this.size);
      let c = this.getRandomInt(this.size);

      if (!this.board[r][c].isMine) {
        this.board[r][c].setMine();
        minesPlaced++;
      }
    }
  }

  // for placing mines
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  surroundingMineCount() {
    // 8 possible directions where a mine could be found
    const x = [-1, -1, -1, 0, 0, 1, 1, 1];
    const y = [-1, 0, 1, -1, 1, -1, 0, 1];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c].isMine) {
          continue;
        }

        const mineCount = 0;
        // looping through each direction
        for (let i = 0; i < 8; i++) {
          const newRow = r + x[i];
          const newCol = c + y[i];

          // checking if surrounding cells are in bounds and if there are mines
          if (
            newRow >= 0 &&
            newRow < this.size &&
            newCol >= 0 &&
            newCol < this.size
          ) {
            // if a surrounding cell is a mine, add one to the mine count for the middle cell
            if (this.board[newRow][newCol].isMine) {
              mineCount++;
            }
          }
        }

        this.board[r][c].setSurroundingMines(mineCount);
      }
    }
  }

  revealCell(row, col) {
    // checking bounds of board
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
        return;
    }

    let cell = new Cell();
    cell = this.board[row][col];

    // cells cannot be revealed once they are flagged
    if (cell.isFlagged || cell.isRevealed) {
        return;
    }

    cell.reveal();
    cell.getDisplayValue();

  }

  // method that checks if the cell is in bounds - accessed outside of this script
  isInBounds(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }
}
