var moveStrategies = {
  "left": {
    "rowOrder": [1,2,3,4],
    "columnOrder": [2,3,4],
    "rowDelta": 0,
    "columnDelta": -1
  },
  "right": {
    "rowOrder": [1,2,3,4],
    "columnOrder": [3,2,1],
    "rowDelta": 0,
    "columnDelta": 1
  },
  "up": {
    "rowOrder": [2,3,4],
    "columnOrder": [1,2,3,4],
    "rowDelta": -1,
    "columnDelta": 0
  },
  "down": {
    "rowOrder": [3,2,1],
    "columnOrder": [1,2,3,4],
    "rowDelta": 1,
    "columnDelta": 0
  }
};

var boxes = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

var moveScores = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

var score = 0;


const updateDisplay = () => {
  allBoxCoordinates().forEach(coordinate => {
    let value = get(boxes, coordinate.r, coordinate.c);
    let boxSelector = `.b .r${coordinate.r} .c${coordinate.c}`;
    document.querySelector(boxSelector).textContent = (value === 0) ? "" : value;
  });

  document.querySelector(".score-board .score").textContent = score;
};

const resetMoveScores = () => {
  allBoxCoordinates().forEach(coordinate => {
    set(moveScores, coordinate.r, coordinate.c, 0)
  });
};

const sumMoveScores = () => {
  return allBoxCoordinates().reduce((sum, coordinate) => {
    return (sum + get(moveScores, coordinate.r, coordinate.c));
  }, 0);
};

const checkGameOver = () => {
  let empties = emptyBoxes();
  let haveMatchingNeighbor = false

  allBoxCoordinates().forEach(coordinate => {
    adjacentCoordinates(coordinate.r, coordinate.c).forEach(adjCoordinate => {
      if (haveMatchingNeighbor === false) {
        haveMatchingNeighbor = get(boxes, coordinate.r, coordinate.c) === get(boxes, adjCoordinate.r, adjCoordinate.c);
      }
    });
  });

  if (empties.length === 0 && haveMatchingNeighbor === false) {
  	alert("Game Over");
  }
};

const moveBoxes = (strategy) => {
  var moveCount = 0;

  resetMoveScores();
  strategy.rowOrder.forEach(r => {
    strategy.columnOrder.forEach(c => {
      if (get(boxes, r, c) !== 0) {
        moveCount += moveBox(r, c, strategy.rowDelta, strategy.columnDelta);
      }
    });
  });

  if (moveCount > 0) {
    score += sumMoveScores();
    addNewBox();
  }
  updateDisplay();
  checkGameOver();
}

const moveBox = (r1, c1, rowDelta, columnDelta) => {
  let moveCount = 0;
  let r2 = r1 + rowDelta;
  let c2 = c1 + columnDelta;

  if (inBounds(r2, c2) === false) {
    return moveCount;
  }

  let boxValue1 = get(boxes, r1, c1);
  let boxValue2 = get(boxes, r2, c2);

  if (boxValue2 === 0) {
    set(boxes, r2, c2, boxValue1);
    set(boxes, r1, c1, 0);

    moveCount += 1;
    moveCount += moveBox(r2, c2, rowDelta, columnDelta);
  }
  else if (boxValue2 === boxValue1 && get(moveScores, r2, c2) === 0) {
    set(boxes, r1, c1, 0);
    blink(r1, c1);

    set(boxes, r2, c2, boxValue1 + boxValue2);
    blink(r2, c2);

    moveCount += 1;
    set(moveScores, r2, c2, get(moveScores, r2, c2) + get(boxes, r2, c2));
  }

  return moveCount;
};

const blink = (r, c) => {
  let boxSelector = `.b .r${r} .c${c}`;
  document.querySelector(boxSelector).classList.add("change");
  setTimeout(() => {
    document.querySelector(boxSelector).classList.remove("change");
  }, 250);
};

const addNewBox = () => {
  let empties = emptyBoxes();
  var newPos;

  if (empties.length > 0) {
    newPos = sample(empties);
    set(boxes, newPos.r, newPos.c, sample([2,2,2,2,2,2,4]));
  }

  return empties.length > 0;
};

const get = (values, r, c) => inBounds(r, c) ? values[r - 1][c - 1] : -1;

const set = (values, r, c, value) => {
  if (inBounds(r, c)) {
    values[r - 1][c - 1] = value;
  }
};

const emptyBoxes = () => {
  return allBoxCoordinates().filter(coordinate => (get(boxes, coordinate.r, coordinate.c) === 0));
};

const allBoxCoordinates = () => {
  let coordinates = [];
  [1,2,3,4].forEach(row => {
    [1,2,3,4].forEach(col => {
      coordinates.push({r: row, c: col});
    });
  });

  return coordinates;
};

const adjacentCoordinates = (r, c) => {
  const coordinates = [{r: r, c: c - 1}, {r: r, c: c + 1}, {r: r - 1, c: c}, {r: r + 1, c: c}];
  return coordinates.filter(coordinate => inBounds(coordinate.r, coordinate.c));
};

const inBounds = (r, c) => (r >= 1 && r <= 4 && c >= 1 && c <= 4);

const sample = (arr) => {
  let pos = (arr !== undefined && arr.length > 0) ? Math.floor((Math.random() * arr.length) + 1) : -1;
  return (pos === -1) ? undefined : arr[pos - 1];
};
