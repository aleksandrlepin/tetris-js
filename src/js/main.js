let staticInitialState = (width, height) => {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    let row = [];
    for (let j = 0; j < 20; j++) {
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
    let arr = staticInitialState();
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
  square: () => {
    let arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][0] = true;
    arr[1][1] = true;
    return arr;
  },
  l: () => {
    let arr = staticInitialState();
    arr[0][0] = true;
    arr[1][0] = true;
    arr[2][0] = true;
    arr[2][1] = true;
    return arr;
  },
  line: () => {
    let arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[0][2] = true;
    arr[0][3] = true;
    return arr;
  },
  z: () => {
    let arr = staticInitialState();
    arr[0][0] = true;
    arr[0][1] = true;
    arr[1][1] = true;
    arr[1][2] = true;
    return arr;
  },
};

let mainState = staticInitialState();
let render = (container) => {
  let elements = '';

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 20; j++) {
      let element = mainState[i][j];
      if (element) {
        elements += '<div class="square active"></div>';
      } else {
        elements += '<div class="square"></div>';
      }
    }
  }

  let template = `
        <div class="container">
            ${elements}
        <div>
    `;
  if (1) {// Проверить является ли контейнер ДОМ елементом.
    container.innerHTML = template;
  }
};

let renderRandomShape = () => {
  let shapesKeys = Object.keys(shapes);
  let random = getRandomInt(0, shapesKeys.length);
  mainState = shapes[shapesKeys[random]]();
  // render(document.body);
};

let rotateShape = (state) => {
  let rotatedState = staticInitialState();
  state.reverse();
  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      rotatedState[j][i] = state[i][j];
    }
  }
  mainState = rotatedState;
  render(document.body);
};

render(document.body);
renderRandomShape();
// setInterval(renderRandomShape, 3000);

let rotateHandler = (e) => {
  if (e.code === 'ArrowUp') {
    rotateShape(mainState);
  }
};
window.addEventListener('keydown', rotateHandler)
