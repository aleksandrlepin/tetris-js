let coordX;
let coordY;
let currentShapeState;
let nextShapeState;
let nextShapeField;
let field;
let renderFieldId;
let level;
let gameStarted = false;
let score = 0;

// create matrix with given parameters
const createState = (width = 4, height = 4) => {
  let arr = [];
  for (let i = 0; i < width; i++) {
    let row = [];
    for (let j = 0; j < height; j++) {
      row.push(false);
    }
    arr.push(row);
  }
  return arr;
}

// select DOM element function
const select = (element) => {
  return document.querySelector(element);
}

// return random number
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// array of shapes
const shapes = {
  t: () => {
    let arr = createState(2, 3);
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  square: () => {
    let arr = createState(2, 2);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
  l: () => {
    let arr = createState(2, 3);
    arr[0][0] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  lInverted: () => {
    let arr = createState(2, 3);
    arr[0][2] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  line: () => {
    let arr = createState(1, 4);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[0][2] = true;
    arr[0][3] = true;
    return arr;
  },
  z: () => {
    let arr = createState(2, 3);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  zInverted: () => {
    let arr = createState(2, 3);
    arr[0][1] = true;
    arr[0][2] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
}

// return random shape
const createRandomShape = () => {
  let shapesKeys = Object.keys(shapes);
  let random = getRandomInt(0, shapesKeys.length);
  let currentShape = shapes[shapesKeys[random]]();
  return currentShape;
}

// render game field depending on field array state
const render = (what, where, className) => {
  let shape = '';
  let template;
  let containerWidth;

  for (let i = 0; i < what.length; i++) {
    if(i === 0) {
      containerWidth = what[i].length;
    }
    for (let j = 0; j < what[i].length; j++) {
      if (what[i][j] === true) {
        shape += '<div class="square active"></div>';
      } else if (what[i][j] === false){
        shape += '<div class="square"></div>';
      } else {
        shape += `<div class="square"><p class="letter">${what[i][j]}</p></div>`;
      }
    }
  }

  template = `
    <div class="${className}" style="width: ${containerWidth * 30}px">
        ${shape}
    <div>
  `;

  where.innerHTML = template;
}

// shape rotation
const rotateShape = () => {
  let rotatedState = createState(currentShapeState[0].length, currentShapeState.length);
  currentShapeState.reverse();

  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if(currentShapeState[i][j]) {
        rotatedState[j][i] = currentShapeState[i][j];
      }
    }
  }
  currentShapeState = rotatedState;
}

// checks the ability to rotate a shape
const checkNextRotatedShapeState = (y, x) => {
  if (coordX + currentShapeState.length > 10) {
    coordX = coordX - currentShapeState.length + currentShapeState[0].length;
  }
  let nextRotatedShapeState = true;
  let nextRotatedState = createState(currentShapeState[0].length, currentShapeState.length);
  let nextShapeState = [...currentShapeState];

  nextShapeState.reverse();
  for (let i = 0; i < nextShapeState.length; i++) {
    for (let j = 0; j < nextShapeState[i].length; j++) {
      if(nextShapeState[i][j]) {
        if(field[j + y][i + x]) {
          nextRotatedShapeState = false;
          break;
        }
      }
    }
  }
  return nextRotatedShapeState;
}

// check the ability to move shape across the field
const checkNextShapeState = (y, x) => {
  let nextShapeState = true;

  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        if(field[i + y][j + x]) {
          nextShapeState = false;
          break;
        }
      }
    }
  }
  return nextShapeState;
}

// check field on filled lines and remove if any
const checkFilledLine = () => {
  let filledLines = [];
  for (let i = 0; i < field.length; i++) {
    let result = field[i].every((item) => {
      return item;
    });
    if(result) {
      field.splice(i, 1);
      field.unshift(Array(10).fill(false,));
      score += 100;
      select('#score').textContent = score;
    }
  }
  return filledLines;
}

// add current shape to field array
const pushShapeState = (what, where, y = 0, x = 0) => {
  for (let i = 0; i < what.length; i++) {
    for (let j = 0; j < what[i].length; j++) {
      if (what[i][j]) {
        where[i + y][j + x] = true;
      }
    }
  }
}

// remove current shape from field array
const shiftShapeState = (what, where, y = 0, x = 0) => {
  for (let i = 0; i < what.length; i++) {
    for (let j = 0; j < what[i].length; j++) {
      if (what[i][j]) {
        where[i + y][j + x] = false;
      }
    }
  }
}

// start game handler
const startGame = () => {
  score = 0;
  initialGameRender();
  gameStarted = true;
  level = document.querySelector('#level').value;
  coordX = 4;
  coordY = -1;
  renderFieldState();
  renderFieldId = setInterval(renderFieldState, 1050 - level * 100);
  select('#startBtn').setAttribute('disabled', 'disabled');
  select('#level').setAttribute('disabled', 'disabled');
  window.addEventListener('keydown', moveHandler);
}

// pause game handler
const pauseGame = () => {
  if (renderFieldId === null) {
    renderFieldId = setInterval(renderFieldState, 1050 - level * 100);
    select('#pauseBtn').textContent = 'Pause';
  } else {
    clearInterval(renderFieldId);
    renderFieldId = null;
    select('#pauseBtn').textContent = 'Resume';
  }
}

// render shape in game field
const renderFieldState = () => {
  if(coordY === field.length - currentShapeState.length || !checkNextShapeState(coordY + 1, coordX)) {
    pushShapeState(currentShapeState, field, coordY, coordX);
    render(field, root, 'game__container');
    checkFilledLine();
    currentShapeState = nextShapeState;
    nextShapeState = createRandomShape();
    coordX = 4;
    coordY = -1;
    if(!checkNextShapeState(coordY +1 , coordX)) {
      clearInterval(renderFieldId);
      field[8][3] = 'G';
      field[8][4] = 'A';
      field[8][5] = 'M';
      field[8][6] = 'E';
      field[10][3] = 'O';
      field[10][4] = 'V';
      field[10][5] = 'E';
      field[10][6] = 'R';
      render(field, root, 'game__container');
      window.removeEventListener('keydown', moveHandler);
      select('#startBtn').removeAttribute('disabled');
      select('#level').removeAttribute('disabled');
      gameStarted = false;
    }
  }
  coordY += 1;
  pushShapeState(currentShapeState, field, coordY, coordX);
  pushShapeState(nextShapeState, nextShapeField);
  render(field, root, 'game__container');
  render(nextShapeField, nextShape, 'next-shape');
  shiftShapeState(currentShapeState, field, coordY, coordX);
  shiftShapeState(nextShapeState, nextShapeField);
}

const initialGameRender = () => {
// current & next shape & game fields
currentShapeState = createRandomShape();
nextShapeState = createRandomShape();
nextShapeField = createState(4, 4);
field = createState(22, 10);

// initial game render
render(field, root, 'game__container');
render(nextShapeField, nextShape, 'next-shape');
}

// handlers
const moveHandler = (e) => {
  if(e.code === 'ArrowRight' && coordX < 10 - currentShapeState[0].length && checkNextShapeState(coordY, coordX + 1)) {
    coordX += 1;
  }
  if(e.code === 'ArrowLeft' && coordX > 0 && checkNextShapeState(coordY, coordX - 1)) {
    coordX -= 1;
  }
  if(e.code === 'ArrowUp' && checkNextRotatedShapeState(coordY, coordX)) {
    rotateShape();
  }
  if (e.code === 'ArrowDown' && coordY < field.length - currentShapeState.length && checkNextShapeState(coordY + 1, coordX)) {
    coordY += 1;
  }
  pushShapeState(currentShapeState, field, coordY, coordX);
  render(field, root, 'game__container');
  shiftShapeState(currentShapeState, field, coordY, coordX);
}

select('#startBtn').addEventListener('click', startGame);
select('#pauseBtn').addEventListener('click', pauseGame);

// render game field and next shape field on load
initialGameRender();