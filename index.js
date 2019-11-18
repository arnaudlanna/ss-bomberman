const reader = require("readline-sync");

const gameInstance = {};
gameInstance.grid = [];

function getInput() {
  const firstLine = reader.question();
  const gameVariables = firstLine.split(" ");
  gameInstance.lines = gameVariables[0];
  gameInstance.columns = gameVariables[1];
  gameInstance.seconds = gameVariables[2];

  for (let i = 0; i < gameInstance.lines; i++) {
    const newLine = reader.question();
    const lineCells = newLine.split("");
    lineCellsToPush = lineCells.map(cell => {
      switch (cell) {
        case "O":
          return { type: "Bomb", creationTick: 0 };
        case ".":
          return null;
        case "X":
          return { type: "Wall" };
      }
    });
    gameInstance.grid.push(lineCellsToPush);
  }
}

function printGame() {
  gameInstance.grid.forEach(line => {
    lineToPrint = line
      .map(cell => {
        if (!cell) return ".";
        else if (cell.type === "Bomb") return "O";
        else return "X";
      })
      .join("");
    console.log(lineToPrint);
  });
}

function plantBombs(currentTick) {
  bombsToDetonate = [];
  gameInstance.grid.forEach((line, i) => {
    const newLine = line.map((cell, j) => {
      if (!cell) return { type: "Bomb", creationTick: currentTick };
      else return cell;
    });
    gameInstance.grid[i] = newLine;
  });
}

function detonateBombs(currentTick) {
  bombsToDetonate = [];
  gameInstance.grid.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (
        cell &&
        cell.type == "Bomb" &&
        currentTick - cell.creationTick === 3
      ) {
        bombsToDetonate.push({ i, j });
      }
    });
  });
  bombsToDetonate.forEach(bombToDetonate => {
    for (let i = bombToDetonate.i; i < gameInstance.lines; i++) {
      if (detonateCell(i, bombToDetonate.j) === -1) break;
    }
    for (let i = bombToDetonate.i; i >= 0; i--) {
      if (detonateCell(i, bombToDetonate.j) === -1) break;
    }
    for (let j = bombToDetonate.j; j < gameInstance.columns; j++) {
      if (detonateCell(bombToDetonate.i, j) === -1) break;
    }
    for (let j = bombToDetonate.j; j >= 0; j--) {
      if (detonateCell(bombToDetonate.i, j) === -1) break;
    }
  });
}

function detonateCell(i, j) {
  if (!gameInstance.grid[i][j]) {
  } else if (gameInstance.grid[i][j].type !== "Wall") {
    gameInstance.grid[i][j] = null;
  } else if (gameInstance.grid[i][j].type === "Wall") {
    return -1;
  }
}

function doTick(currentTick) {
  detonateBombs(currentTick);
  if (currentTick % 2 === 0) {
    plantBombs(currentTick);
  }
}

async function entrypoint() {
  await getInput();
  for (let i = 2; i <= gameInstance.seconds; i++) {
    await doTick(i);
  }
  await printGame();
}

entrypoint();
