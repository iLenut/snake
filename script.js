const board_border = 'black';
const board_background = "lightgreen";
const snake_col = 'green';
const snake_border = 'black';
const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");
var difficulty = 100;
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]
let score = 0;
let changing_direction = false;
let dx = 10;
let dy = 0;

function start() {
  $('#buttonStart').empty();
  main();
  gen_food();
}

function restart() {
  $('#buttonRestart').empty();
  snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
  ]
  score = 0;
  changing_direction = false;
  dx = 10;
  dy = 0;
  document.getElementById('score').innerHTML = 0;
  $('#difficulty').append(`
    <div id = "difficulty">
      <button type="button" class="btn btn-secondary" onclick="chooseDifficultyButtons();">Select difficulty</button>
    </div>
  `);
}

document.addEventListener("keydown", change_direction);

function main() {
  if (has_game_ended()) {
    document.getElementById('score').innerHTML = "GAME OVER!";
    $('#buttonRestart').append(`
      <button type="button" class="btn btn-danger" onclick="restart();">Restart</button>
    `);
    return;
  }
  changing_direction = false;
  setTimeout(function onTick() {
    clear_board();
    drawFood();
    drawSnake();
    move_snake();
    main();
  }, difficulty)
}

function clear_board() {
  snakeboard_ctx.fillStyle = board_background;
  snakeboard_ctx.strokestyle = board_border;
  snakeboard_ctx.lineWidth = 3;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
  snake.forEach(drawSnakePart)
}

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = snake_col;
  snakeboard_ctx.strokestyle = snake_border;
  snakeboard_ctx.shadowColor = "black";
  snakeboard_ctx.lineWidth = 5;
  snakeboard_ctx.shadowBlur = 30;
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
}

function drawFood() {
  snakeboard_ctx.fillStyle = 'darkred';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall ||  hitRightWall || hitToptWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
  food_x = random_food(0, snakeboard.width - 10);
  food_y = random_food(0, snakeboard.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) {
      gen_food();
    }
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changing_direction) {
    return;
  }

  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function move_snake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += 10;
    snake.unshift(head);
    document.getElementById('score').innerHTML = score;
    gen_food();
  } else {
    snake.pop();
  }
}

function chooseDifficultyButtons() {
  $('#chooseDifficultyButtons').append(`
    <div class="container">
      <br>
      <button type="button" class="btn btn-light" onclick="difficultyEasy();">Easy</button>
      <br>
      <br>
      <button type="button" class="btn btn-info" onclick="difficultyMedium();">Medium</button>
      <br>
      <br>
      <button type="button" class="btn btn-warning" onclick="difficultyHard();">High</button>
      <br>
      <br>
      <button type="button" class="btn btn-danger" onclick="difficultyInsane();">Insane</button>
    </div>
  `);
}

function difficultyEasy() {
  difficulty = 200;
  $('#chooseDifficultyButtons').empty();
  $('#difficulty').empty();
  $('#buttonStart').append(`
    <button type="button" class="btn btn-danger" onclick="start();">Start</button>
  `);
}

function difficultyMedium() {
  difficulty = 100;
  $('#chooseDifficultyButtons').empty();
  $('#difficulty').empty();
  $('#buttonStart').append(`
    <button type="button" class="btn btn-danger" onclick="start();">Start</button>
  `);
}

function difficultyHard() {
  difficulty = 70;
  $('#chooseDifficultyButtons').empty();
  $('#difficulty').empty();
  $('#buttonStart').append(`
    <button type="button" class="btn btn-danger" onclick="start();">Start</button>
  `);
}

function difficultyInsane() {
  difficulty = 20;
  $('#chooseDifficultyButtons').empty();
  $('#difficulty').empty();
  $('#buttonStart').append(`
    <button type="button" class="btn btn-danger" onclick="start();">Start</button>
  `);
}
