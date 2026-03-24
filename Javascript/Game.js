"use strict";

import { Board } from "./Board.js";
import { Pokemon } from "./Pokemon.js";
import * as UI from "./UI.js";

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

// game state
let currentBoard = null;
let currentDifficulty = null;
let pokemonList = [];
let flaggedCount = 0;
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("easy")
    .addEventListener("click", () => startGame(DIFFICULTIES.easy));
  document
    .getElementById("medium")
    .addEventListener("click", () => startGame(DIFFICULTIES.medium));
  document
    .getElementById("hard")
    .addEventListener("click", () => startGame(DIFFICULTIES.hard));
  document
    .getElementById("reset-button")
    .addEventListener("click", () => resetGame());
  document
    .getElementById("menu-button")
    .addEventListener("click", () => goToMenu());

  UI.showDifficultyMenu();
  UI.showLoadingMessage("Finding Pokémon in the tall grass...");
});

async function startGame(difficulty) {
  currentDifficulty = difficulty;
  gameOver = false;
  flaggedCount = 0;

  UI.hideDifficultyMenu();

  try {
    const fetcher = new Pokemon(difficulty.mines);
    pokemonList = await fetcher.fetchAll();
  } catch (error) {
    console.error(error);
    UI.renderHUD(difficulty.mines, "Failed to fetch Pokemon, please try again");
    return;
  }

  // intialise board
  currentBoard = new Board(difficulty.rows, difficulty.cols, difficulty.mines);
  currentBoard.initialiseBoard();
  currentBoard.placeMines();
  currentBoard.surroundingMineCount();
  currentBoard.assignPokemon(pokemonList);

  UI.renderBoard(currentBoard, onLeftClick, onRightClick);
  UI.renderHUD(difficulty.mines, "");
}

function onLeftClick(row, col) {
  if (gameOver) {
    return;
  }

  const cell = currentBoard.getCell(row, col);

  if (cell.isFlagged) {
    return;
  }

  if (cell.isMine) {
    cell.reveal();
    currentBoard.revealAllMines();
    UI.renderBoard(currentBoard, onLeftClick, onRightClick);
    UI.renderHUD(
      currentDifficulty.mines - flaggedCount,
      `A wild ${
        cell.pokemon.name.charAt(0).toUpperCase() + cell.pokemon.name.slice(1)
      } appeared! You lose!`
    );
    return;
  }

  currentBoard.revealCell(row, col);

  if (currentBoard.checkWin()) {
    gameOver = true;
    UI.renderBoard(currentBoard, onLeftClick, onRightClick);
    UI.renderHUD(0, "You avoided all the Pokemon! You win!");
    return;
  }

  UI.renderBoard(currentBoard, onLeftClick, onRightClick);
  UI.renderHUD(currentDifficulty.mines - flaggedCount, "");
}

function onRightClick(row, col) {
  if (gameOver) {
    return;
  }

  const cell = currentBoard.getCell(row, col);
  cell.toggleFlag();
  flaggedCount += cell.isFlagged ? 1 : -1;

  UI.renderBoard(currentBoard, onLeftClick, onRightClick);
  UI.renderHUD(currentDifficulty.mines - flaggedCount, "");
}

function resetGame() {
  startGame(currentDifficulty);
}

function goToMenu() {
  currentBoard = null;
  pokemonList = [];
  flaggedCount = 0;
  gameOver = false;
  UI.showDifficultyMenu();
}
