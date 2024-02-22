// komentar na zacatku
dead.style.display = "none";
gameboard.style.display = "none";
coinzz.style.display = "none";
let handler;
let secondhand;
let game_board;
let score = 0;
let dhis = true;
const board = document.getElementById("gameboard");
let rows = Math.round(Math.random() * 2 + 10);
let cols = Math.round(Math.random() * 2 + 10);
const circle = document.createElement("div");
circle.classList.add("circle");
let lvl = 1;
let xp = 0;
let yp = 0;
let x_npc = Math.round(Math.random() * (cols - 1)/2 + (cols - 1)/2);
let y_npc = Math.round(Math.random() * (rows - 1)/2 + (rows - 1)/2);
let killed = false;
let win = false;
const npc = document.createElement("div");
const coinSound = new Audio('mp3/coin.m4a');
const speedAlert = new Audio('mp3/3coins.m4a');
const fanfare = new Audio('mp3/trumpet.m4a');
const killSound = new Audio('mp3/deathSound.m4a');
const newLevel = new Audio('mp3/trumpet2.m4a');
const levelOne = new Audio('mp3/level1.m4a');
const levelTwo = new Audio('mp3/level2.m4a');
const levelThree = new Audio('mp3/level3.m4a');
coinSound.volume = 0.7;
speedAlert.volume = 1;
fanfare.volume = 0.85;
killSound.volume = 0.9;
newLevel.volume = 0.9;
levelOne.volume = 0.73;
levelTwo.volume = 0.62;
levelThree.volume = 0.78;


// Create the game board
function createBoard() {
  // Initialize a 10x10 array with consecutive numbers
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
       if (Math.floor(Math.random() * (Math.sqrt(rows * cols) - (Math.sqrt(rows + cols) / 2))) == 0 && !(i == 0 || j == 0 || i == Math.round(rows - 1) || j == Math.round(cols - 1))) {
         row.push(1);
       } else {
         row.push(0);
       }
    }
    game_board.push(row);
  }
  // Set coin positions
  console.log(Math.round(Math.sqrt(((rows + cols) / 2) ** 3) / 10));
  for (let i = 0; i < Math.round(Math.sqrt(((rows + cols) / 2) ** 3) / 10); i++) {
    let cY = Math.round(Math.random() * (rows - 1));
    let cX = Math.round(Math.random() * (cols - 1));
    if(game_board[cY][cX] == 0){
      game_board[cY][cX] = 2;
    } else {
      i--
    }
  }
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("td");
      row.appendChild(cell);
      if (game_board[i][j] == 1) {
        // Create a square element
        const square = document.createElement("div");
        square.classList.add("square");
        cell.appendChild(square);
      }
      if (game_board[i][j] == 2) {
        // Create a coin element
        const coin = document.createElement("div");
        coin.classList.add("coin");
        cell.appendChild(coin);
      }
    }
    board.appendChild(row);
  }
  while (game_board[y_npc][x_npc] != 0){
    x_npc = Math.round(Math.random() * (cols - 1)/2 + (cols - 1)/2);
    y_npc = Math.round(Math.random() * (rows - 1)/2 + (rows - 1)/2);
  }
  // Add the circle to the starting position
  board.rows[yp].cells[xp].appendChild(circle);
  board.rows[y_npc].cells[x_npc].appendChild(npc);
}


// Function to move the circle
function moveCircle(event) {
  // Remove the circle from the current position

  let newX = xp;
  let newY = yp;


  switch (event.key) {
    case "n":
      win = false;
      handler = setInterval(pathfind, 1000);
      gameboard.style.display = "block";
      coinzz.style.display = "block";
      sound.style.display = "none";
      next.style.display = "none";
      npc.classList.add("npc");
      dhis = true;
      score = 0;
      newLevel.play(0);
      if (lvl == 1){
        levelOne.play(0);
        document.getElementById("next").innerHTML = "LEVEL 2<br/><br/>Start by pressing \"N\"";
      } else if (lvl == 2){
        levelTwo.play(0);
        rows = Math.round(Math.random() * 3 + 13);
        cols = Math.round(Math.random() * 3 + 13);
        document.getElementById("next").innerHTML = "LEVEL 3<br/><br/>Start by pressing \"N\"";
      } else if (lvl == 3){
        levelThree.play(0);
        rows = Math.round(Math.random() * 3 + 17);
        cols = Math.round(Math.random() * 3 + 17);
        document.getElementById("next").innerHTML = "You win!";
      }
      board.innerHTML = "";
      game_board = [];
      createBoard();
      lvl++;
      break;
    case "ArrowUp":
      if (yp > 0 && !killed) {
        newY = yp - 1;
      }
      break;
    case "ArrowDown":
      if (yp < rows - 1 && !killed) {
        newY = yp + 1;
      }
      break;
    case "ArrowLeft":
      if (xp > 0 && !killed) {
        newX = xp - 1;
      }
      break;
    case "ArrowRight":
      if (xp < cols - 1 && !killed) {
        newX = xp + 1;
      }
      break;
    case "w":
      if (yp > 0 && !killed) {
        newY = yp - 1;
      }
      break;
    case "s":
      if (yp < rows - 1 && !killed) {
        newY = yp + 1;
      }
      break;
    case "a":
      if (xp > 0 && !killed) {
        newX = xp - 1;
      }
      break;
    case "d":
      if (xp < cols - 1 && !killed) {
        newX = xp + 1;
      }
      break;
  }
  checkKill();


  // Update the circle's position only if it's a valid move
  if (!board.rows[newY].cells[newX].querySelector('.square')) {
    xp = newX;
    yp = newY;
  }

  // Add the circle to the new position
  board.rows[yp].cells[xp].appendChild(circle);

  if (board.rows[yp].cells[xp].querySelector('.coin')) {
    game_board[yp][xp] = 0;
    let bloin = board.rows[yp].cells[xp].querySelector('.coin')
    bloin.remove()
    coinSound.play(0);
    score++;
    console.log(score);
    console.log(Math.round(Math.sqrt(((rows + cols) / 2) ** 3) / 10));
    document.getElementById("coinzz").innerHTML = "Coins: " + score;
    if (score >= Math.round((rows + cols) / 6 - 1.2) && dhis){
      secondhand = setInterval(pathfind, 666);
      speedAlert.play(0);
      dhis = false;
    }
    if (score >= Math.round(Math.sqrt(((rows + cols) / 2) ** 3) / 10)){
      clearInterval(handler);
      clearInterval(secondhand);
      dead.style.display = "none";
      gameboard.style.display = "none";
      coinzz.style.display = "none";
      next.style.display = "block";
      npc.classList.remove("npc");
      win = true;
      next.style.display = "block";
      fanfare.play(0);
    }  
  }
}

function shortestPathSearch(game_board, y_npc, x_npc, yp, xp) {
  const numRows = game_board.length;
  const numCols = game_board[0].length;

  // Define movement directions (up, down, left, right)
  const dx = [-1, 1, 0, 0];
  const dy = [0, 0, -1, 1];

  // Create a 2D array to mark visited cells and store parent cells
  const visited = Array(numRows)
    .fill(false)
    .map(() => Array(numCols).fill(false));
  const parent = Array(numRows)
    .fill(null)
    .map(() => Array(numCols).fill(null));

  // Create a queue for BFS
  const queue = [];

  // Push the NPC's position into the queue
  queue.push([y_npc, x_npc]);
  visited[y_npc][x_npc] = true;

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x === yp && y === xp) {
      // Found the player's position, reconstruct the path
      const path = [];
      let curX = yp;
      let curY = xp;
      while (curX !== y_npc || curY !== x_npc) {
        path.push([curX, curY]);
        const [prevX, prevY] = parent[curX][curY];
        curX = prevX;
        curY = prevY;
      }
      path.push([y_npc, x_npc]);
      path.reverse(); // Reverse the path to start from player's position
      return path;
    }

    // Explore adjacent cells
    for (let i = 0; i < 4; i++) {
      const newX = x + dx[i];
      const newY = y + dy[i];

      if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols && game_board[newX][newY] === 0 && !visited[newX][newY]) {
        queue.push([newX, newY]);
        visited[newX][newY] = true;
        parent[newX][newY] = [x, y];
      }
    }
  }

  // If no path is found, return an empty array
  return [];
}

function pathfind() {
  if(!killed && !win){
    const shortestPath = shortestPathSearch(game_board, y_npc, x_npc, yp, xp);
    if(x_npc != xp || y_npc != yp){
      y_npc = shortestPath[1][0];
      x_npc = shortestPath[1][1];
    }
    board.rows[y_npc].cells[x_npc].appendChild(npc);
    checkKill();
  }
}

function checkKill(){
  if(x_npc == xp && y_npc == yp && !killed){
    circle.classList.remove("circle");
    killSound.play(0);
    killed = true;
    dead.style.display = "block";
    gameboard.style.display = "none";
    coinzz.style.display = "none";
  }
}

// Listen for keyboard events
document.addEventListener("keydown", moveCircle);
// Stepan tvori konflikty