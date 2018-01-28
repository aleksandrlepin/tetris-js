'use strict';

var staticInitialState = function staticInitialState(width, height) {
  var arr = [];
  for (var i = 0; i < 10; i++) {
    var row = [];
    for (var j = 0; j < 20; j++) {
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

var mainState = staticInitialState();
var render = function render(container) {
  var elements = '';

  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 20; j++) {
      var element = mainState[i][j];
      if (element) {
        elements += '<div class="square active"></div>';
      } else {
        elements += '<div class="square"></div>';
      }
    }
  }

  var template = '\n        <div class="container">\n            ' + elements + '\n        <div>\n    ';
  if (1) {
    // Проверить является ли контейнер ДОМ елементом.
    container.innerHTML = template;
  }
};

var renderRandomShape = function renderRandomShape() {
  var shapesKeys = Object.keys(shapes);
  var random = getRandomInt(0, shapesKeys.length);
  mainState = shapes[shapesKeys[random]]();
  // render(document.body);
};

var rotateShape = function rotateShape(state) {
  var rotatedState = staticInitialState();
  state.reverse();
  for (var i = 0; i < state.length; i++) {
    for (var j = 0; j < state[i].length; j++) {
      rotatedState[j][i] = state[i][j];
    }
  }
  mainState = rotatedState;
  render(document.body);
};

render(document.body);
renderRandomShape();
// setInterval(renderRandomShape, 3000);

var rotateHandler = function rotateHandler(e) {
  if (e.code === 'ArrowUp') {
    rotateShape(mainState);
  }
};
window.addEventListener('keydown', rotateHandler);