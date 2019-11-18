const reader = require("readline-sync");

const gameInstance = {};
gameInstance.grid = [];

// Método para popular a instância do "jogo" com o grid e os parâmetros.
function getInput() {
  const firstLine = reader.question();
  const gameParameters = firstLine.split(" ");
  gameInstance.lines = gameParameters[0];
  gameInstance.columns = gameParameters[1];
  gameInstance.seconds = gameParameters[2];

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

// Imprime o grid no formato esperado.
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

// Método para colocar bombas em todas as células vazias do grid.
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

// Método que procura as bombas do grid que estão prestes a explodir e as "explode".
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
  // Para cada bomba presente no grid, filtrada previamente, limpa todas as direções atẽ encontrar uma parede.
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

// Métoto para "explodir" a célula, retorna -1 caso encontre uma parede.
function detonateCell(i, j) {
  if (!gameInstance.grid[i][j]) {
  } else if (gameInstance.grid[i][j].type !== "Wall") {
    gameInstance.grid[i][j] = null;
  } else if (gameInstance.grid[i][j].type === "Wall") {
    return -1;
  }
}

// Processa cada tick (segundo) do jogo.
function doTick(currentTick) {
  detonateBombs(currentTick);
  // Caso o segundo seja par, o bomberman planta bombas em todas as células.
  if (currentTick % 2 === 0) {
    plantBombs(currentTick);
  }
}

async function entrypoint() {
  await getInput(); // Popula a instância do jogo com o grid e parâmetros.
  for (let i = 2; i <= gameInstance.seconds; i++) { // Para cada segundo, a partir do segundo, processa a rodada (tick).
    await doTick(i);
  }
  await printGame();
}

entrypoint();
