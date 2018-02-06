'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var coordX = void 0;
var coordY = void 0;
var currentShapeState = void 0;
var nextShapeState = void 0;
var nextShapeField = void 0;
var field = void 0;
var renderFieldId = void 0;
var level = void 0;
var gameStarted = false;
var score = 0;

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

// select DOM element function
var select = function select(element) {
  return document.querySelector(element);
};

// return random number
var getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

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

// render game field depending on field array state
var render = function render(what, where, className) {
  var shape = '';
  var template = void 0;
  var containerWidth = void 0;

  for (var i = 0; i < what.length; i++) {
    if (i === 0) {
      containerWidth = what[i].length;
    }
    for (var j = 0; j < what[i].length; j++) {
      if (what[i][j] === true) {
        shape += '<div class="square active"></div>';
      } else if (what[i][j] === false) {
        shape += '<div class="square"></div>';
      } else {
        shape += '<div class="square"><p class="letter">' + what[i][j] + '</p></div>';
      }
    }
  }

  template = '\n    <div class="' + className + '" style="width: ' + containerWidth * 30 + 'px">\n        ' + shape + '\n    <div>\n  ';

  where.innerHTML = template;
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
  var lineCount = 0;
  for (var i = 0; i < field.length; i++) {
    var result = field[i].every(function (item) {
      return item;
    });
    if (result) {
      field.splice(i, 1);
      field.unshift(Array(10).fill(false));
      lineCount++;
    }
  }
  score += lineCount * lineCount * 100;
  select('#score').textContent = score;
  return filledLines;
};

// add current shape to field array
var pushShapeState = function pushShapeState(what, where) {
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var x = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  for (var i = 0; i < what.length; i++) {
    for (var j = 0; j < what[i].length; j++) {
      if (what[i][j]) {
        where[i + y][j + x] = true;
      }
    }
  }
};

// remove current shape from field array
var shiftShapeState = function shiftShapeState(what, where) {
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var x = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  for (var i = 0; i < what.length; i++) {
    for (var j = 0; j < what[i].length; j++) {
      if (what[i][j]) {
        where[i + y][j + x] = false;
      }
    }
  }
};

// start game handler
var startGame = function startGame() {
  score = 0;
  initialGameRender();
  gameStarted = true;
  level = document.querySelector('#level').value;
  coordX = 4;
  coordY = -1;
  renderFieldState();
  renderFieldId = setInterval(renderFieldState, 1050 - level * 100);
  select('#startBtn').setAttribute('disabled', true);
  select('#level').setAttribute('disabled', true);
  window.addEventListener('keydown', moveHandler);
  select('#pauseBtn').focus();
};

// pause game handler
var pauseGame = function pauseGame() {
  if (renderFieldId === null) {
    renderFieldId = setInterval(renderFieldState, 1050 - level * 100);
    window.addEventListener('keydown', moveHandler);
    select('#pauseBtn').textContent = 'Pause';
  } else {
    clearInterval(renderFieldId);
    renderFieldId = null;
    window.removeEventListener('keydown', moveHandler);
    select('#pauseBtn').textContent = 'Resume';
  }
};

// render shape in game field
var renderFieldState = function renderFieldState() {
  if (coordY === field.length - currentShapeState.length || !checkNextShapeState(coordY + 1, coordX)) {
    pushShapeState(currentShapeState, field, coordY, coordX);
    render(field, root, 'game__container');
    checkFilledLine();
    currentShapeState = nextShapeState;
    nextShapeState = createRandomShape();
    coordX = 4;
    coordY = -1;
    if (!checkNextShapeState(coordY + 1, coordX)) {
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
};

var initialGameRender = function initialGameRender() {
  // current & next shape & game fields
  currentShapeState = createRandomShape();
  nextShapeState = createRandomShape();
  nextShapeField = createState(4, 4);
  field = createState(22, 10);

  // initial game render
  render(field, root, 'game__container');
  render(nextShapeField, nextShape, 'next-shape');
};

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
  pushShapeState(currentShapeState, field, coordY, coordX);
  render(field, root, 'game__container');
  shiftShapeState(currentShapeState, field, coordY, coordX);
};

select('#startBtn').addEventListener('click', startGame);
select('#pauseBtn').addEventListener('click', pauseGame);

// render game field and next shape field on load
initialGameRender();