"use strict";
import { Cell } from "./Cell.js";

export class Board {
  constructor(rows, cols, mineCount) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
    this.board = [];
    this.revealedCount = 0;
  }

  initialiseBoard() {
    for (let r = 0; r < this.rows; r++) {
      this.board[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.board[r][c] = new Cell();
      }
    }
  }

  placeMines() {
    let minesPlaced = 0;

    while (minesPlaced < this.mineCount) {
      let r = this.getRandomInt(this.rows);
      let c = this.getRandomInt(this.cols);

      if (!this.board[r][c].isMine) {
        this.board[r][c].setMine();
        minesPlaced++;
      }
    }
  }

  assignPokemon(pokemonList) {
    let pokemonIndex = 0;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let cell = this.board[r][c];
        if (cell.isMine) {
          cell.setPokemon(pokemonList[pokemonIndex]);
          pokemonIndex++; // this way each mine gets a unique pokemon set to it
        }
      }
    }
  }

  // for placing mines
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  surroundingMineCount() {
    // 8 possible directions where a mine could be found
    const directions = [
      [-1,-1], [-1,0], [-1,1],
      [0,-1],          [0,1],
      [1,-1], [1, 0], [1,1]
    ];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].isMine) {
          continue;
        }

        let mineCount = 0;
        // looping through each direction
        for (const [dr,dc] of directions) {
          const newRow = r + dr;
          const newCol = c + dc;
          if (this.isInBounds(newRow, newCol) && this.board[newRow][newCol].isMine) {
            mineCount++;
          }
        }
        this.board[r][c].setSurroundingMines(mineCount);
      }
    }
  }

  revealCell(row, col) {
    // checking bounds of board
    if (!this.isInBounds(row, col)) {
      return;
    }

    const cell = this.board[row][col];

    // cells cannot be revealed once they are flagged
    if (cell.isFlagged || cell.isRevealed) {
      return;
    }

    cell.reveal();
    this.revealedCount++;

    // flood/recursive fill: if no surrounding mines, reveal all 8 spaces
    if (!cell.isMine && cell.surroundingMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];

      for (const [dr,dc] of directions) {
        const neighborRow = row + dr;
        const neighborCol = col + dc;
        if (this.isInBounds(neighborRow, neighborCol) && !this.board[neighborRow][neighborCol].isMine) {
          this.revealCell(neighborRow, neighborCol);
        }
      }
    }
  }

  // for states in the game when the board is revealed
  revealAllMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].isMine) {
          this.board[r][c].reveal();
        }
      }
    }
  }

  // win condition
  checkWin() {
    const totalCells = this.rows * this.cols;
    return this.revealedCount === totalCells - this.mineCount;
  }

  // method that checks if the cell is in bounds - accessed in and out of this script
  isInBounds(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  // convenience getter used by other scripts
  getCell(row, col) {
    return this.board[row][col];
  }
}
