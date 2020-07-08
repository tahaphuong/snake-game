const INIT_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// NOTICE: [y, x] [row, column]
const INIT_SNAKE = [
  [8, 8],
  [9, 8],
  [10, 8]
]

const LEFT_CODE = 37
const UP_CODE = 38
const RIGHT_CODE = 39
const DOWN_CODE = 40
const keysVertical = [
  UP_CODE,
  DOWN_CODE,
]
const keysHorizontal = [
  LEFT_CODE,
  RIGHT_CODE,
]

const framesPerSecond = 25

function goLeft(snake) {
  snake.pop()
  let x = snake[0][1] - 1 < 0 ? INIT_BOARD[0].length - 1 : snake[0][1] - 1
  snake.unshift([snake[0][0], x])
  return snake
}

function goUp(snake) {
  snake.pop()
  let y = snake[0][0] - 1 < 0 ? INIT_BOARD.length - 1 : snake[0][0] - 1
  snake.unshift([y, snake[0][1]])
  return snake
}

function goRight(snake) {
  snake.pop()
  let x = snake[0][1] + 1 > INIT_BOARD[0].length - 1 ? 0 : snake[0][1] + 1
  snake.unshift([snake[0][0], x])
  return snake
}

function goDown(snake) {
  snake.pop()
  let y = snake[0][0] + 1 > INIT_BOARD.length - 1 ? 0 : snake[0][0] + 1
  snake.unshift([y, snake[0][1]])
  return snake
}

function applePosition(runningSnake) {
  let x = Math.floor(Math.random() * INIT_BOARD[0].length)
  let y = Math.floor(Math.random() * INIT_BOARD.length)
  for (let chunk of runningSnake) {
    if (chunk[1] == x && chunk[0] == y) {
      console.log("overlapped")
      return applePosition(runningSnake)
    } else {
      return [y, x]
    }
  } 
}

window.onload = init()

function init() {
  let game = document.getElementById("game")
  game.style.gridTemplateColumns = `repeat(${INIT_BOARD[0].length}, 20px)`
  game.style.gridTemplateRows = `repeat(${INIT_BOARD.length}, 20px)`
  let startButton = document.getElementById("start-button")
  let currentScoreDiv = document.getElementById("current-score")
  let highScoreDiv = document.getElementById("high-score")
  let currentScore = 0
  let highScore = 0

  let stringBoard = JSON.stringify(INIT_BOARD)
  let stringSnake = JSON.stringify(INIT_SNAKE)
  let currentBoard = JSON.parse(stringBoard)
  let runningSnake = JSON.parse(stringSnake)
  let apple = applePosition(runningSnake)

  // if snake eats apple -> push a new chunk here
  let pendingChunks = []

  // chunk which is ready to be added to the snake
  let readyChunk = null

  // set snake UI
  for (let i=0; i<runningSnake.length; i++) {
    let chunk = runningSnake[i]
    currentBoard[chunk[0]][chunk[1]] = i==0 ? 1.5 : 1
  }
  // set apple UI
  currentBoard[apple[0]][apple[1]] = 2

  // interval
  let runningInterval
  let gameIsRunning = false
  let command = UP_CODE

  startButton.onclick = checkGame
  function checkGame() {
    gameIsRunning = !gameIsRunning
    if (gameIsRunning) {
      startButton.innerText = "Pause"
      if (currentScore > highScore) {
        highScore = currentScore
      }
      currentScore = 0
      currentScoreDiv.innerText = currentScore
      highScoreDiv.innerText = highScore
      startGame()
    } else {
      pauseGame()
      startButton.innerText = "Play" 
    }
  }
  // init game
  renderBoard()

  // ISSUE: when down and right keys are pressed at the nearest time => go to the opposite side
  document.addEventListener("keydown", event => {
    if (gameIsRunning) {
      if((keysVertical.includes(command) && keysHorizontal.includes(event.keyCode))
      || (keysHorizontal.includes(command) && keysVertical.includes(event.keyCode))
      // ) {setTimeout(()=>{command = event.keyCode}, 50)}
      ) {command = event.keyCode}
    }
  })

  function startGame() {
    runningInterval = setInterval(() => {
      // set to empty board
      currentBoard = JSON.parse(stringBoard)
      // set snake
      for (let i=0; i<runningSnake.length; i++) {
        let chunk = runningSnake[i]
        currentBoard[chunk[0]][chunk[1]] = i==0 ? 1.5 : 1
      }
      // set apple
      currentBoard[apple[0]][apple[1]] = 2
      switch (command) {
        case LEFT_CODE:
          runningSnake = goLeft(runningSnake)
        break
        case UP_CODE:
          runningSnake = goUp(runningSnake)
        break
        case RIGHT_CODE:
          runningSnake = goRight(runningSnake)
        break
        case DOWN_CODE:
          runningSnake = goDown(runningSnake)
        break
      }
      if (readyChunk != null) {
        runningSnake.push(readyChunk)
        readyChunk = null
      }

      // render after 1000/FPS miliseconds
      renderBoard()

      // if snake eats 1 apple
      if (runningSnake[0][0] == apple[0] && runningSnake[0][1] == apple[1]) {
        currentBoard[apple[0]][apple[1]] = 0
        pendingChunks.push(apple)
        apple = applePosition(runningSnake)        
        currentScore += 1
        currentScoreDiv.innerText = currentScore
      }

      // snake ate (multiple) apples, length will be extended
      if (pendingChunks.length) {
        let chunk = pendingChunks[0]
        let len = runningSnake.length
        if (runningSnake[len-1][0] == chunk[0] && runningSnake[len-1][1] == chunk[1]) {
          pendingChunks.shift()
          readyChunk = chunk
        }
      }

      // if snake eat itself
      for (let i=1; i<runningSnake.length; i++) {
        let chunk = runningSnake[i]
        let head = runningSnake[0]
        if ((head[0] == chunk[0]) && (head[1] == chunk[1])) {
          gameIsRunning = !gameIsRunning
          pauseGame()
          startButton.innerText = "Play again"
          
          // reset game
          currentBoard = JSON.parse(stringBoard)
          runningSnake = JSON.parse(stringSnake)
          apple = applePosition(runningSnake)

          pendingChunks = []
          readyChunk = null
          for (let i=0; i<runningSnake.length; i++) {
            let chunk = runningSnake[i]
            currentBoard[chunk[0]][chunk[1]] = i==0 ? 1.5 : 1
          }
          currentBoard[apple[0]][apple[1]] = 2
          command = UP_CODE
        }
      }
    }, 1000 / framesPerSecond)
  }

  function pauseGame() {
    clearInterval(runningInterval)
  }

  function renderBoard() {
    game.innerHTML = ``
    for (let row of currentBoard) {
      for (let box of row) {
        let gameBlock = document.createElement("div")
        let nameOfClass = "field"
        switch(box) {
          case 0:
            nameOfClass = "field"
          break
          case 1: 
            nameOfClass = "snake-chunk"
          break
          case 1.5: 
            nameOfClass = "snake-head"
          break
          case 2: 
            nameOfClass = "apple"
          break
          default:
            nameOfClass = "field"
          break
        }
        gameBlock.setAttribute("class", nameOfClass)
        game.append(gameBlock)
      }
    }
  }
}
