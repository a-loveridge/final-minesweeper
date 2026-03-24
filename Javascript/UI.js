"use strict";

// shows difficulty selection menu and hides the game
export function showDifficultyMenu() {
  document.querySelector(".game-select").style.display = "block";
  document.querySelector(".game-section").style.display = "none";
}

// shows game and hides board select
export function hideDifficultyMenu() {
  document.querySelector(".game-select").style.display = "none";
  document.querySelector(".game-section").style.display = "block";
}

export function showLoadingMessage(message) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.textContent = message;
}

// renders the board - called every time game state changes
export function renderBoard(board, onLeftClick, onRightClick) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  // set grid columns dynamically based on board width
  boardDiv.style.gridTemplateColumns = `repeat(${board.cols}, 40px)`;

  for (let r = 0; r < board.rows; r++) {
    for (let c = 0; c < board.cols; c++) {
      const cell = board.getCell(r, c);
      const displayValue = cell.getDisplayValue();

      // making cells as buttons
      const button = document.createElement("button");
      button.className = "cell";

      if (displayValue === "grass") {
        // unrevealed cell
        const img = createImg("../Images/grass.png", "grass");
        button.appendChild(img);
      } else if (displayValue === "pokeball") {
        // flagged cell
        const img = createImg("../Images/pokeball.png", "pokeball");
        button.appendChild(img);
      } else if (displayValue === "pokemon") {
        // revealed mine
        const img = createImg(cell.pokemon.sprite, cell.pokemon.name);
        const nameLabel = document.createElement("span");
        nameLabel.textContent = cell.pokemon.name;
        nameLabel.className = "pokemon-name";
        button.appendChild(img);
        button.appendChild(nameLabel);
        button.classList.add("revealed-mine");
      } else {
        // revealed safe cell - show number or blank if 0
        button.textContent = displayValue;

        // adds a class for each number so CSS can colour them based on value
        const num = parseInt(displayValue);
        if (!isNaN(num) && num > 0) {
          button.classList.add(`number-${num}`);
        }
      }

      // revealed cells are styled and disabled
      if (cell.isRevealed) {
        button.classList.add("revealed");
        button.disabled = true;
      }

      // left click to reveal
      button.addEventListener("click", () => onLeftClick(r, c));

      // right click to flag
      button.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        onRightClick(r, c);
      });

      boardDiv.appendChild(button);
    }
  }
}

// updates the mines remaining counter and status message in the HUD
export function renderHUD(minesLeft, status) {
  document.querySelector(".minesLeft").textContent = `Mines: ${minesLeft}`;
  document.querySelector(".status").textContent = status;
}

// helper to create an img element cleanly
function createImg(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = "cell-image";
  return img;
}
