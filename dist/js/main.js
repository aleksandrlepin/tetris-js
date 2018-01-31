'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// coordinates of the current shape in the field
var coordX = 4;
var coordY = 0;

// create matrix with given parameters
var createState = function createState() {
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

// return random number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// array of shapes
var shapes = {
  t: function t() {
    var arr = createState(2, 3);
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  square: function square() {
    var arr = createState(2, 2);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
  l: function l() {
    var arr = createState(2, 3);
    arr[0][0] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  lInverted: function lInverted() {
    var arr = createState(2, 3);
    arr[0][2] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  line: function line() {
    var arr = createState(1, 4);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[0][2] = true;
    arr[0][3] = true;
    return arr;
  },
  z: function z() {
    var arr = createState(2, 3);
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  zInverted: function zInverted() {
    var arr = createState(2, 3);
    arr[0][1] = true;
    arr[0][2] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  }

  // return random shape
};var createRandomShape = function createRandomShape() {
  var shapesKeys = Object.keys(shapes);
  var random = getRandomInt(0, shapesKeys.length);
  var currentShape = shapes[shapesKeys[random]]();
  return currentShape;
};

// current shape & game field
var currentShapeState = createRandomShape();
var field = createState(20, 10);

// render game field depending on field array state
var renderField = function renderField() {
  var shape = '';

  for (var i = 0; i < field.length; i++) {
    for (var j = 0; j < field[i].length; j++) {
      if (field[i][j] === true) {
        shape += '<div class="square active"></div>';
      } else if (field[i][j] === false) {
        shape += '<div class="square"></div>';
      } else {
        shape += '<div class="square"><p class="letter">' + field[i][j] + '</p></div>';
      }
    }
  }

  var template = '\n        <div class="container">\n            ' + shape + '\n        <div>\n  ';

  document.body.innerHTML = template;
};

// shape rotation
var rotateShape = function rotateShape() {
  var rotatedState = createState(currentShapeState[0].length, currentShapeState.length);
  currentShapeState.reverse();

  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        rotatedState[j][i] = currentShapeState[i][j];
      }
    }
  }
  currentShapeState = rotatedState;
};

// checks the ability to rotate a shape
var checkNextRotatedShapeState = function checkNextRotatedShapeState(y, x) {
  if (coordX + currentShapeState.length > 10) {
    coordX = coordX - currentShapeState.length + currentShapeState[0].length;
  }
  var nextRotatedShapeState = true;
  var nextRotatedState = createState(currentShapeState[0].length, currentShapeState.length);
  var nextShapeState = [].concat(_toConsumableArray(currentShapeState));

  nextShapeState.reverse();
  for (var i = 0; i < nextShapeState.length; i++) {
    for (var j = 0; j < nextShapeState[i].length; j++) {
      if (nextShapeState[i][j]) {
        if (field[j + y][i + x]) {
          nextRotatedShapeState = false;
          break;
        }
      }
    }
  }
  return nextRotatedShapeState;
};

// check the ability to move shape across the field
var checkNextShapeState = function checkNextShapeState(y, x) {
  var nextShapeState = true;

  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        if (field[i + y][j + x]) {
          nextShapeState = false;
          break;
        }
      }
    }
  }
  return nextShapeState;
};

// check field on filled lines and remove if any
var checkFilledLine = function checkFilledLine() {
  var filledLines = [];
  for (var i = 0; i < field.length; i++) {
    var result = field[i].every(function (item) {
      return item;
    });
    if (result) {
      field.splice(i, 1);
      field.unshift(Array(10).fill(false));
    }
  }
  return filledLines;
};

// add current shape to field array
var pushCurrentShapeState = function pushCurrentShapeState(y, x) {
  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = true;
      }
    }
  }
};

// remove current shape from field array
var shiftCurrentShapeState = function shiftCurrentShapeState(y, x) {
  for (var i = 0; i < currentShapeState.length; i++) {
    for (var j = 0; j < currentShapeState[i].length; j++) {
      if (currentShapeState[i][j]) {
        field[i + y][j + x] = false;
      }
    }
  }
};

// render shape in game field
var renderFieldState = function renderFieldState() {
  if (coordY === field.length - currentShapeState.length || !checkNextShapeState(coordY + 1, coordX)) {
    pushCurrentShapeState(coordY, coordX);
    renderField();
    checkFilledLine();
    currentShapeState = createRandomShape();
    coordX = 4;
    coordY = 0;
    if (!checkNextShapeState(coordY, coordX)) {
      clearInterval(renderFieldId);
      field[8][3] = 'G';
      field[8][4] = 'A';
      field[8][5] = 'M';
      field[8][6] = 'E';
      field[10][3] = 'O';
      field[10][4] = 'V';
      field[10][5] = 'E';
      field[10][6] = 'R';
      renderField();
      window.removeEventListener('keydown', moveHandler);
    }
  } else {
    pushCurrentShapeState(coordY, coordX);
    renderField();
    shiftCurrentShapeState(coordY, coordX);
    coordY += 1;
  }
};

// initial game render and render interval
renderFieldState();
var renderFieldId = setInterval(renderFieldState, 500);

// handlers
var moveHandler = function moveHandler(e) {
  if (e.code === 'ArrowRight' && coordX < 10 - currentShapeState[0].length && checkNextShapeState(coordY, coordX + 1)) {
    coordX += 1;
  }
  if (e.code === 'ArrowLeft' && coordX > 0 && checkNextShapeState(coordY, coordX - 1)) {
    coordX -= 1;
  }
  if (e.code === 'ArrowUp' && checkNextRotatedShapeState(coordY, coordX)) {
    rotateShape();
  }
  if (e.code === 'ArrowDown' && coordY < field.length - currentShapeState.length && checkNextShapeState(coordY + 1, coordX)) {
    coordY += 1;
  }
  pushCurrentShapeState(coordY, coordX);
  renderField();
  shiftCurrentShapeState(coordY, coordX);
};

window.addEventListener('keydown', moveHandler);