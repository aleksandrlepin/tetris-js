// coordinates of the current shape in the field
let coordX = 4;
let coordY = 0;

// create matrix with given parameters
let createState = (width = 4, height = 4) => {
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

// return random number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// array of shapes
let shapes = {
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
let createRandomShape = () => {
  let shapesKeys = Object.keys(shapes);
  let random = getRandomInt(0, shapesKeys.length);
  let currentShape = shapes[shapesKeys[random]]();
  return currentShape;
}

// current shape & game field
let currentShapeState = createRandomShape();
let field = createState(20, 10);


// render game field depending on field array state
let renderField = () => {
  let shape = '';

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j]) {
          shape += '<div class="square active"></div>';
        } else {
          shape += '<div class="square"></div>';
      }
    }
  }

  let template = `
        <div class="container">
            ${shape}
        <div>
  `;

  document.body.innerHTML = template;
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
    }
  }
  return filledLines;
}

// add current shape to field array
const pushCurrentShapeState = (y, x) => {
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = true;
      }
    }
  }
}

// remove current shape from field array
const shiftCurrentShapeState = (y, x) => {
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = false;
      }
    }
  }
}

// render shape in game field
const renderFieldState = () => {
  if(coordY === field.length - currentShapeState.length || !checkNextShapeState(coordY + 1, coordX)) {
    pushCurrentShapeState(coordY, coordX);
    renderField();
    checkFilledLine();
    currentShapeState = createRandomShape();
    coordX = 4;
    coordY = 0;
  } else {
    pushCurrentShapeState(coordY, coordX);
    renderField();
    shiftCurrentShapeState(coordY, coordX);
    coordY += 1;
  }
}

// initial game render and render interval
renderFieldState();
const renderFieldId = setInterval(renderFieldState, 500);

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
  pushCurrentShapeState(coordY, coordX);
  renderField();
  shiftCurrentShapeState(coordY, coordX);
}

window.addEventListener('keydown', moveHandler);
