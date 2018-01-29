let staticInitialState = (width = 4, height = 4) => {
  let arr = [];
  for (let i = 0; i < width; i++) {
    let row = [];
    for (let j = 0; j < height; j++) {
      row.push(false);
    }
    arr.push(row);
  }
  return arr;
};
console.log('staticInitialState(): ', staticInitialState());

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

let shapes = {
  t: () => {
    let arr = staticInitialState(2, 3);
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  square: () => {
    let arr = staticInitialState(2, 2);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
  l: () => {
    let arr = staticInitialState(3, 2);
    arr[0][0] = true;
    arr[1][0] = true;
    arr[2][0] = true;
    arr[2][1] = true;
    return arr;
  },
  line: () => {
    let arr = staticInitialState(1, 4);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[0][2] = true;
    arr[0][3] = true;
    return arr;
  },
  z: () => {
    let arr = staticInitialState(2, 3);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
};

let createShape = () => {
  let shapesKeys = Object.keys(shapes);
  let random = getRandomInt(0, shapesKeys.length);
  let currentShape = shapes[shapesKeys[random]]();
  return currentShape;
  // renderField(document.body);
};

let currentShapeState = createShape();
console.log('currentShapeState: ', currentShapeState);

let field = staticInitialState(20, 10);
console.log('field: ', field);


let renderField = () => {
  // console.log('redner');
  let shape = '';

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {

      // let cell = currentShapeState[i][j] || false;
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
  if (1) {// Проверить является ли контейнер ДОМ елементом.
    document.body.innerHTML = template;
  }
};


let rotateShape = () => {
  let rotatedState = staticInitialState(currentShapeState[0].length, currentShapeState.length);
  currentShapeState.reverse();
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      rotatedState[j][i] = currentShapeState[i][j];
    }
  }
  currentShapeState = rotatedState;
  // renderField(document.body);
};

// currentShape();
const checkNextShapeState = (y, x) => {
  let nextStateAvailable = true;
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        // console.log('i > ', i, 'i + y > ', i + y);
        if(field[i + y + 1][j + x]) {
          nextStateAvailable = false;
          break;
        }
      }
    }
  }
  return nextStateAvailable;
}

const pushCurrentShapeState = (y, x) => {
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = true;
      }
    }
  }
}

const shiftCurrentShapeState = (y, x) => {
  for (let i = 0; i < currentShapeState.length; i++) {
    for (let j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = false;
      }
    }
  }
}

let coordX = 4;
let coordY = 0;

const renderFieldTick = () => {
  if(coordY === field.length - currentShapeState.length || !checkNextShapeState(coordY, coordX)) {
    pushCurrentShapeState(coordY, coordX);
    currentShapeState = createShape();
    coordX = 5;
    coordY = 0;
  } else {
    pushCurrentShapeState(coordY, coordX);
    renderField();
    shiftCurrentShapeState(coordY, coordX);
    coordY += 1;
  }
}


// pushCurrentShapeState(0, 0);
// renderField();
renderFieldTick();
// const renderFieldId = setInterval(renderField, 1000);
const renderFieldId = setInterval(renderFieldTick, 200);


const moveHandler = (e) => {
  if(e.code === 'ArrowRight' && coordX < 10 - currentShapeState[0].length) {
    coordX += 1;
  }
  if(e.code === 'ArrowLeft' && coordX > 0) {
    coordX -= 1;
  }
  if(e.code === 'ArrowUp') {
    rotateShape(currentShapeState);
  }
  if (e.code === 'ArrowDown' && coordY < field.length - currentShapeState.length) {
    coordY += 1;
  }
  pushCurrentShapeState(coordY, coordX);
  renderField();
  shiftCurrentShapeState(coordY, coordX);
}

let rotateHandler = (e) => {
};

window.addEventListener('keydown', moveHandler)
// window.addEventListener('keydown', rotateHandler)
