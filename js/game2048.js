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



function updateDisplay() {
  var displayVal;

  _.each([1,2,3,4], function(r) {
    _.each([1,2,3,4], function(c) {
      displayVal = boxes[r-1][c-1] == 0 ? "" : boxes[r-1][c-1];
      $(`.b .r${r} .c${c}`).text(displayVal);
    });
  });

  $(".score-board .score").text(score);
}

function resetMoveScores() {
  _.each([1,2,3,4], function(r) {
    _.each([1,2,3,4], function(c) {
      moveScores[r-1][c-1] = 0;
    });
  });
}

function sumMoveScores() {
  var sum = 0;

  _.each([1,2,3,4], function(r) {
    _.each([1,2,3,4], function(c) {
      sum += moveScores[r-1][c-1];
    });
  });

  return sum;
}

function checkGameOver() {
  var haveEmptyBox = false;
  var haveMatchingNeighbor = false

  _.each([1,2,3,4], function(r) {
    _.each([1,2,3,4], function(c) {
      // check for empty box
      if (boxes[r-1][c-1] == 0) {
        haveEmptyBox = true;
      }

      // check for matching neighbor
      _.each([[r,c-1], [r-1,c], [r,c+1], [r+1,c]], function(neighbor) {
        if (haveMatchingNeighbor == false && _.contains([1,2,3,4], neighbor[0]) && _.contains([1,2,3,4], neighbor[1])) {
          haveMatchingNeighbor = (boxes[r-1][c-1] == boxes[neighbor[0]-1][neighbor[1]-1]);
        }
      });
    });
  });

  if (haveEmptyBox == false && haveMatchingNeighbor == false) {
  	alert("Game Over");
  }
}

function moveBoxes(strategy) {
  var moveCount = 0;

  resetMoveScores();
  _.each(strategy.rowOrder, function(r) {
    _.each(strategy.columnOrder, function(c) {
      if (boxes[r-1][c-1] != 0) {
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

function moveBox(r1, c1, rowDelta, columnDelta) {
  var r2, c2, num1, num2;
  var moveCount = 0;

  r2 = r1 + rowDelta;
  c2 = c1 + columnDelta;

  if (r2 >= 1 && r2 <= 4 && c2 >= 1 && c2 <= 4) {
    num1 = boxes[r1-1][c1-1];
    num2 = boxes[r2-1][c2-1];
    if (num2 == 0) {
      boxes[r2-1][c2-1] = num1;
      boxes[r1-1][c1-1] = 0;

      moveCount += 1;
      moveCount += moveBox(r2, c2, rowDelta, columnDelta);
    }
    else if (num2 == num1 && moveScores[r2-1][c2-1] == 0) {
      boxes[r2-1][c2-1] = num1 + num2;
      boxes[r1-1][c1-1] = 0;

      moveCount += 1;
      moveScores[r2-1][c2-1] += boxes[r2-1][c2-1];
    }
  }

  return moveCount;
}

function addNewBox() {
  var emptyBoxes = [];
  var newPos;

  _.each([1,2,3,4], function(r) {
    _.each([1,2,3,4], function(c) {
      if (boxes[r-1][c-1] == 0) {
        emptyBoxes.push({r:r, c:c});
      }
    });
  });

  if (_.size(emptyBoxes) > 0) {
    newPos = _.sample(emptyBoxes);
    boxes[newPos.r-1][newPos.c-1] = _.sample([2,2,2,2,2,2,4]);
  }

  return _.size(emptyBoxes) > 0;
}
