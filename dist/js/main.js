'use strict';

var staticInitialState = function staticInitialState() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  var arr = [];
  for (var i = 0; i < width; i++) {
    var row = [];
    for (var j = 0; j < height; j++) {
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

var shapes = {
  t: function t() {
    var arr = staticInitialState();
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  square: function square() {
    var arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
  l: function l() {
    var arr = staticInitialState();
    arr[0][0] = true;
    arr[1][0] = true;
    arr[2][0] = true;
    arr[2][1] = true;
    return arr;
  },
  line: function line() {
    var arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[0][2] = true;
    arr[0][3] = true;
    return arr;
  },
  z: function z() {
    var arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  }
};

var createShape = function createShape() {
  var shapesKeys = Object.keys(shapes);
  var random = getRandomInt(0, shapesKeys.length);
  var currentShape = shapes[shapesKeys[random]]();
  return currentShape;
  // renderField(document.body);
};

var currentShapeState = createShape();
console.log('currentShapeState: ', currentShapeState);

var field = staticInitialState(20, 10);
console.log('field: ', field);

var renderField = function renderField() {
  console.log('redner');
  var shape = '';

  for (var i = 0; i < field.length; i++) {
    for (var j = 0; j < field[i].length; j++) {

      // let cell = currentShapeState[i][j] || false;
      if (field[i][j]) {
        shape += '<div class="square active"></div>';
      } else {
        shape += '<div class="square"></div>';
      }
    }
  }

  var template = '\n        <div class="container">\n            ' + shape + '\n        <div>\n    ';
  if (1) {
    // Проверить является ли контейнер ДОМ елементом.
    document.body.innerHTML = template;
  }
};

// let rotateShape = (state) => {
//   let rotatedState = staticInitialState();
//   state.reverse();
//   for (let i = 0; i < state.length; i++) {
//     for (let j = 0; j < state[i].length; j++) {
//       rotatedState[j][i] = state[i][j];
//     }
//   }
//   currentShapeState = rotatedState;
//   renderField(document.body);
// };

// currentShape();
var pushCurrentShapeState = function pushCurrentShapeState(x, y) {
  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + x][j + y] = true;
      }
    }
  }
};

var shiftCurrentShapeState = function shiftCurrentShapeState(x, y) {
  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + x][j + y] = false;
      }
    }
  }
};

var coordX = 0;
var coordY = 0;

var renderFieldTick = function renderFieldTick() {
  coordY += 1;
  pushCurrentShapeState(coordY, coordX);
  renderField();
  shiftCurrentShapeState(coordY, coordX);
};

var moveHandler = function moveHandler(e) {
  if (e.code === 'ArrowRight') {
    coordX += 1;
  }
  if (e.code === 'ArrowLeft' && coordX > 0) {
    coordX -= 1;
  }
  pushCurrentShapeState(coordY, coordX);
  renderField();
  shiftCurrentShapeState(coordY, coordX);
};
window.addEventListener('keydown', moveHandler);
// pushCurrentShapeState(0, 0);
// renderField();
renderFieldTick();
var renderFieldId = setInterval(renderFieldTick, 1000);

// setInterval(currentShape, 3000);

// let rotateHandler = (e) => {
//   if (e.code === 'ArrowUp') {
//     rotateShape(currentShapeState);
//   }
// };
// window.addEventListener('keydown', rotateHandler)