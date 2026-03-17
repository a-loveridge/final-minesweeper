"use strict";

export class Cell {
  constructor() {
    this.isMine = false;
    this.surroundingMines = 0;
    this.isRevealed = false;
    this.isFlagged = false;
  }

  setMine() {
    this.isMine = true;
  }

  setSurroundingMines(count) {
    this.surroundingMines = count;
  }

  reveal() {
    this.isRevealed = true;
  }

  toggleFlag() {
    if (!this.isRevealed) {
        this.isFlagged = !this.isFlagged;
    }
    
  }

  getDisplayValue() {
    if (this.isFlagged) {
      return "🚩";
    }

    if (!this.isRevealed) {
      return "";
    }

    if (this.isMine) {
      return "*";
    }

    if (this.surroundingMines > 0) {
      return this.surroundingMines.toString();
    }

    return "";
  }
}
