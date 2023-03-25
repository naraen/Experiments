(function () {
  "use strict";
  const rowSet = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
  ];

  const colSet = [
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 48, 57, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80],
  ];

  const boxSet = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
  ];

  const row_colToBoxIdx = (r, c) => parseInt(r / 3) * 3 + parseInt(c / 3);
  const row_colToGridIdx = (r, c) => r * 9 + c - 1;
  const gridIdxToRowIdx = (i) => parseInt(i / 9);
  const gridIdxToColIdx = (i) => i % 9;
  const gridIdxToBoxIdx = (i) =>
    parseInt(gridIdxToRowIdx(i) / 3) * 3 + parseInt(gridIdxToColIdx(i) / 3);
  const arrToObject = (arr, acc) =>
    arr.reduce((obj, currVal) => {
      obj[currVal] = "";
      return obj;
    }, acc);

  var isHalted = false;

  function Cell(gridIdx, grid) {
    var _self = this;

    _self.candidates = 123456789;
    _self.isSolved = false;

    _self.setValue = (val) => {
      if (isHalted) return;

      tabLevel.push("\t");
      setValue_shadow(val);
      tabLevel.pop();
    };

    function setValue_shadow(val) {
      if (_self.isSolved) {
        return;
      }

      _self.candidates = parseInt(val);

      _self.isSolved = _self.candidates.toString().length === 1;

      if (_self.isSolved) {
        //console.log(tabLevel.join('') + '*** Solved', gridIdx, val);
        grid.dropSolvedCellFromUnsolvedSets(gridIdx);
        solvedCellCount++;
        grid.propagate(gridIdx, val);
      }
    }

    _self.toString = () => {
      return _self.candidates.toString();
    };

    _self.removeCandidate = (val) => {
      tabLevel.push("\t");
      removeCandidate_shadow(val);
      tabLevel.pop();
    };

    function removeCandidate_shadow(val) {
      if (_self.candidates == parseInt(val)) {
        console.log(
          `${tabLevel.join("")}***${val} from ${gridIdx}. Problem. Halting!`
        );
        isHalted = true;
        return;
      }

      if (_self.candidates.toString().indexOf(val) === -1) {
        //console.log(tabLevel.join(''), '***', val, 'from', gridIdx, 'Already removed. NoOp')
        return;
      }

      if (_self.isSolved) {
        //console.log(tabLevel.join(''), '***', val, 'from', gridIdx, 'Already solved.  Exiting')
        return;
      }

      //console.log(tabLevel.join(''), '***', val, 'from', gridIdx, 'Removing:', _self.candidates, _self.candidates.replace(val,''));
      _self.setValue(_self.candidates.toString().replace(val, ""));
    }
  }

  function Grid(input) {
    var _self = this;

    var thisGrid = null;
    _self.unsolvedSets = null;

    function displayUnsolvedSets() {
      console.log("  [");
      _self.unsolvedSets.forEach((set, idx) => {
        var candidates = getCellsGroupedByUnsolvedNumbers(set);
        console.log(
          `    ${idx + JSON.stringify(set)}  ||  ${JSON.stringify(candidates)} `
        );
      });
      console.log("  ]");
    }

    function getAllSets() {
      var allSets = [].concat(rowSet).concat(colSet).concat(boxSet);
      var cloneOfAllSets = JSON.parse(JSON.stringify(allSets));
      return cloneOfAllSets;
    }

    function getCellsGroupedByUnsolvedNumbers(set) {
      return set.reduce((acc, cellIdx) => {
        thisGrid[cellIdx].candidates
          .toString()
          .split("")
          .forEach((n) => {
            if (acc[n] === undefined) {
              acc[n] = [];
            }
            acc[n].push(cellIdx);
          });
        return acc;
      }, {});
    }

    function getSetsContainingACell(gridIdx) {
      return new Array(
        gridIdxToRowIdx(gridIdx),
        gridIdxToColIdx(gridIdx) + 9,
        gridIdxToBoxIdx(gridIdx) + 18
      );
    }

    function setupEmptyGrid() {
      thisGrid = [];
      isHalted = false;
      _self.unsolvedSets = getAllSets();
      solvedCellCount = 0;

      for (var idx = 0; idx < 81; idx++) {
        var cell = new Cell(idx, _self);
        thisGrid.push(cell);
      }
    }

    function removeCellFromSet(set, cellIdx) {
      var posInSet = set.indexOf(cellIdx);
      if (posInSet === -1) return;

      set.splice(posInSet, 1);
    }

    _self.checkForCorrectness = (isDebug) => {
      var allSets = getAllSets();

      var isCorrect = true;
      allSets.forEach((thisSet, setIdx) => {
        var thisSum = thisSet.reduce(
          (sum, gridIdx) => sum + thisGrid[gridIdx].candidates,
          0
        );
        if (thisSum !== 45) {
          isDebug && console.log(setIdx, thisSum);
          isCorrect = false;
        }
      });

      return isCorrect;
    };

    _self.dropSolvedCellFromUnsolvedSets = (cellIdx) => {
      //console.log('Dropping cell', cellIdx, getSetsContainingACell(cellIdx));
      getSetsContainingACell(cellIdx).forEach((setIdx) => {
        removeCellFromSet(_self.unsolvedSets[setIdx], cellIdx);
      });
    };

    _self.getGridForDisplay = () => {
      var rowVals = "";
      for (var idx = 0; idx < 81; idx++) {
        if (idx % 27 === 0) {
          rowVals += `\n${"=".repeat(87)}`;
        }
        if (idx % 9 === 0) {
          rowVals += "\n|| ";
        }

        rowVals +=
          " ".repeat(8 - thisGrid[idx].toString().length) + thisGrid[idx];
        rowVals += idx % 3 === 2 ? "||" : "|";
      }
      rowVals += `\n${"=".repeat(87)}`;

      return rowVals;
    };

    _self.getGridForSimpleDisplay = () => {
      var rowVals = "";
      for (var idx = 0; idx < 81; idx++) {
        if (idx % 9 === 0) {
          rowVals += "\n";
        }

        rowVals += "|";
        rowVals += thisGrid[idx];
      }
      return rowVals;
    };

    function initGrid(input) {
      setupEmptyGrid();

      var cleanInput = input.replace(/[\n\t ]/g, "").split("");

      cleanInput.forEach((val, idx) => {
        if (val == 0) {
          return;
        }

        thisGrid[idx].setValue(val);
      });
    }

    _self.isSolved = () => solvedCellCount === 81;

    _self.unsolvedCount = () => 81 - solvedCellCount;

    _self.useHints = (hints) =>
      hints.forEach((h) => {
        thisGrid[h[0]].setValue(h[1]);
        _self.findSingleCandidates();
      });

    function getGridToStash() {
      return thisGrid.reduce(
        (acc, cell) => acc + (!cell.isSolved ? 0 : cell.candidates),
        ""
      );
    }

    _self.useBruteForce = (isDebug) => {
      var stash = [];
      var thisState = null;
      var firstUnsolvedPosition = null;

      thisState = getGridToStash();
      firstUnsolvedPosition = thisState.indexOf(0);
      thisGrid[firstUnsolvedPosition].candidates
        .toString()
        .split("")
        .forEach((num) => {
          var valueToTry = {
            gridIdx: firstUnsolvedPosition,
            number: num,
            state: thisState,
            hints: [[firstUnsolvedPosition, num]],
            tabLevel: "",
          };
          stash.push(valueToTry);
        });

      var loopCount = 50;
      var hint = null;
      while (!_self.isSolved() && stash.length > 0 && loopCount > 0) {
        loopCount--;
        hint = stash.pop();
        isDebug && console.log("Trying :", JSON.stringify(hint.hints));

        initGrid(hint.state);
        thisGrid[hint.gridIdx].setValue(hint.number);
        _self.findSingleCandidates();

        if (!_self.isSolved() && !isHalted) {
          thisState = getGridToStash();
          firstUnsolvedPosition = thisState.indexOf(0);
          thisGrid[firstUnsolvedPosition].candidates
            .toString()
            .split("")
            .forEach((num) => {
              var valueToTry = {
                gridIdx: firstUnsolvedPosition,
                number: num,
                state: thisState,
                hints: [...hint.hints, [firstUnsolvedPosition, num]],
                tabLevel: hint.tabLevel + "\t",
              };
              stash.push(valueToTry);
            });
        }
      }

      isDebug &&
        console.log(
          "Hints :",
          _self.isSolved() ? hint.hints : "Couldn't generate hints"
        );
      return _self.isSolved() ? hint.hints : [];
    };

    _self.findSingleCandidates = (isDebug) => {
      var shouldContinue = true;

      while (shouldContinue && !isHalted && !_self.isSolved()) {
        isDebug && console.log("findSingleCandidates");
        var solvedList = [];
        isDebug && console.log(_self.getGridForDisplay());
        _self.unsolvedSets.forEach((set, idx) => {
          var candidates = getCellsGroupedByUnsolvedNumbers(set);
          isDebug && console.log(idx, "  ", JSON.stringify(candidates));
          Object.keys(candidates).forEach((key) => {
            isDebug &&
              candidates[key].length === 1 &&
              console.log(
                "       ****",
                key,
                candidates[key],
                candidates[key].length === 1
              );
            if (candidates[key].length === 1) {
              var gridIdx = candidates[key][0];
              solvedList.push({ gridIdx, key });
            }
          });
        });

        solvedList.forEach((solve) => {
          isDebug &&
            console.log(
              "    ",
              "    ",
              "**** Setting cell ",
              solve.gridIdx,
              " to ",
              solve.key
            );
          thisGrid[solve.gridIdx].setValue(solve.key);
        });
        shouldContinue = solvedList.length > 0;
      }
      isDebug && console.log("Unsolved ", _self.unsolvedCount());
    };

    _self.propagate = (gridIdx, cellValue) => {
      if (isHalted) return;
      var setIdxs = getSetsContainingACell(gridIdx);

      var thisObj = {};
      arrToObject(_self.unsolvedSets[setIdxs[0]], thisObj);
      arrToObject(_self.unsolvedSets[setIdxs[1]], thisObj);
      arrToObject(_self.unsolvedSets[setIdxs[2]], thisObj);

      var propagationList = Object.keys(thisObj);
      //console.log(action, ' to ',  propagationList.toString());
      propagationList.forEach(
        (gridIdx) => !isHalted && thisGrid[gridIdx].removeCandidate(cellValue)
      );
    };
    initGrid(input);
  }

  var tabLevel = [];
  var solvedCellCount = 0;

  module.exports = Grid;
})();
