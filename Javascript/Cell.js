"use strict";

export class Cell {
  constructor() {
    this.isMine = false;
    this.surroundingMines = 0;
    this.isRevealed = false;
    this.isFlagged = false;
    this.pokemon = null;
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

  setPokemon(pokemonObj) {
    this.pokemon = pokemonObj;
  }

  getDisplayValue() {
    if (this.isFlagged) {
      return "pokeball"; // placeholder image
    }

    if (!this.isRevealed) {
      return "grass"; // grass placeholder
    }

    if (this.isMine) {
      return "pokemon";
    }

    if (this.surroundingMines > 0) {
      return this.surroundingMines.toString();
    }

    return "";
  }
}
