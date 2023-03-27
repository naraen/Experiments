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
  const row_colTocellIdx = (r, c) => r * 9 + c - 1;
  const cellIdxToRowIdx = (i) => parseInt(i / 9);
  const cellIdxToColIdx = (i) => i % 9;
  const cellIdxToBoxIdx = (i) =>
    parseInt(cellIdxToRowIdx(i) / 3) * 3 + parseInt(cellIdxToColIdx(i) / 3);
  const arrToObject = (arr, acc) =>
    arr.reduce((obj, currVal) => {
      obj[currVal] = "";
      return obj;
    }, acc);

  var isDebugLogging = false;
  var isHalted = false;
  var cellValue = Array(81).fill(123456789);
  var unsolvedSets = null;
  var tabLevel = [];
  var solvedCellCount = 0;

  function configLogLevel(logLevel) {
    isDebugLogging = logLevel === "Debug";
  }

  function cellGetValueAsString(cellIdx) {
    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    return cellValue[cellIdx].toString();
  }

  function cellIsSolved(cellIdx) {
    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    return cellValue[cellIdx] < 10 && cellValue[cellIdx] > 0;
  }

  function cellIsValueACandidate(cellIdx, candidateValue) {
    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    if (isNaN(candidateValue))
      throw new Error(
        `candidateValue: Expected number, was ${typeof candidateValue}`
      );

    return (
      cellGetValueAsString(cellIdx).toString().indexOf(candidateValue) !== -1
    );
  }

  function cellRemoveCandidate(cellIdx, valueToRemove) {
    tabLevel.push("\t");
    const diagInfo = `${tabLevel.join(
      ""
    )} cellRemoveCandidate( cellIdx=${cellIdx}, value=${valueToRemove} )`;
    isDebugLogging &&
      console.log(diagInfo, `Entering.  Current value  ${cellValue[cellIdx]}`);

    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    if (isNaN(valueToRemove))
      throw new Error(
        `valueToRemove: Expected number, was ${typeof valueToRemove}`
      );

    if (cellValue[cellIdx] == parseInt(valueToRemove)) {
      isDebugLogging && console.log(diagInfo, `Problem. Halting!`);
      isHalted = true;
      tabLevel.pop();
      return;
    }

    if (!cellIsValueACandidate(cellIdx, valueToRemove)) {
      isDebugLogging && console.log(diagInfo, "Already removed. NoOp");
      tabLevel.pop();
      return;
    }

    if (cellIsSolved(cellIdx)) {
      isDebugLogging && console.log(diagInfo, "Already solved.  Exiting");
      tabLevel.pop();
      return;
    }

    var cellValuesAfterRemoval = parseInt(
      cellGetValueAsString(cellIdx).replace(valueToRemove, "")
    );
    isDebugLogging &&
      console.log(
        diagInfo,
        `new value ${cellGetValueAsString(cellIdx).replace(valueToRemove, "")}`
      );

    cellSetValue(cellIdx, parseInt(cellValuesAfterRemoval));

    tabLevel.pop();
  }

  function cellSetValue(cellIdx, value) {
    var diagInfo = `cellSetValue ${cellIdx} = ${value}`;

    if (isNaN(cellIdx) || cellIdx == undefined)
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    if (isNaN(value) || value == undefined)
      throw new Error(`value: Expected number, was ${typeof value}`);

    isDebugLogging &&
      console.log(diagInfo, `Entering current=${cellValue[cellIdx]}`);
    if (isHalted || cellIsSolved(cellIdx)) return;

    cellValue[cellIdx] = parseInt(value);
    isDebugLogging && console.log(diagInfo, "new value", cellValue[cellIdx]);

    if (!cellIsSolved(cellIdx)) return;

    solvedCellCount++;
    gridDropCellFromUnsolvedSets(cellIdx);
    gridPropagateCellValueToUnsolvedSets(cellIdx, value);
  }

  function Grid(input) {
    console.log("isLoggingEnabled", isDebugLogging);
    var _self = this;

    _self.checkForCorrectness = gridCheckForCorrectness;
    _self.getGridForDisplay = gridSerializeForDisplay;
    _self.getGridForSimpleDisplay = gridSerializeForSimpleDisplay;
    _self.isSolved = gridIsSolved;
    _self.unsolvedCount = gridUnsolvedCount;
    _self.useHints = gridUseHints;

    _self.useBruteForce = gridUseBruteForce;
    _self.findSingleCandidates = setsFindSingleCandidates;

    gridInit(input);
  }

  function gridCheckForCorrectness() {
    const diagInfo = "checkForCorrectness";
    var allSets = setsGetAll();

    var isCorrect = true;
    allSets.forEach((thisSet, setIdx) => {
      var thisSum = thisSet.reduce(
        (sum, cellIdx) => sum + parseInt(cellValue[cellIdx]),
        0
      );
      if (thisSum !== 45) {
        isDebugLogging &&
          console.log(diagInfo, `sum of set[${setIdx}]=${thisSum}`);
        isCorrect = false;
      }
    });

    return isCorrect;
  }

  function gridDropCellFromUnsolvedSets(cellIdx) {
    const diagInfo = `gridDropCellFromUnsolvedSets ( ${cellIdx} )`;
    isDebugLogging && console.log(diagInfo, "Entering");

    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);

    isDebugLogging &&
      console.log(
        diagInfo,
        "Dropping from sets",
        gridGetSetsWithCellAsMember(cellIdx)
      );

    gridGetSetsWithCellAsMember(cellIdx).forEach((setIdx) => {
      setsDropCellFromSet(setIdx, cellIdx);
    });
    isDebugLogging && console.log(diagInfo, "Exiting");
  }

  function gridGetSetsWithCellAsMember(cellIdx) {
    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    return new Array(
      cellIdxToRowIdx(cellIdx),
      cellIdxToColIdx(cellIdx) + 9,
      cellIdxToBoxIdx(cellIdx) + 18
    );
  }

  function gridInit(input) {
    gridSetupEmpty();

    var cleanInput = input.replace(/[\n\t \|]/g, "").split("");

    cleanInput.forEach((val, idx) => {
      if (isHalted) return;
      if (val == 0) return;
      isDebugLogging && console.log(`Initializing cell ${idx} to ${val}`);
      cellSetValue(idx, val);
    });
  }

  function gridIsSolved() {
    return solvedCellCount === 81;
  }

  function gridPropagateCellValueToUnsolvedSets(cellIdx, cellValue) {
    const diagInfo = `gridPropagateCellValueToUnsolvedSets(${cellIdx}, ${cellValue}):`;
    isDebugLogging && console.log(diagInfo, "Entering");
    if (isHalted) {
      isDebugLogging && console.log(diagInfo, "Halted.  Not propagating");
    }

    if (isNaN(cellIdx))
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);
    if (isNaN(cellValue))
      throw new Error(`cellValue: Expected number, was ${typeof cellValue}`);

    var setIdxs = gridGetSetsWithCellAsMember(cellIdx);
    isDebugLogging &&
      console.log(diagInfo, "Indexes of sets containing this cell", setIdxs);
    var thisObj = {};
    arrToObject(unsolvedSets[setIdxs[0]], thisObj);
    arrToObject(unsolvedSets[setIdxs[1]], thisObj);
    arrToObject(unsolvedSets[setIdxs[2]], thisObj);

    var propagationList = Object.keys(thisObj);
    isDebugLogging &&
      console.log(diagInfo, "Unsolved cells", propagationList.toString());
    propagationList.forEach(
      (cellIdx) =>
        !isHalted && cellRemoveCandidate(parseInt(cellIdx), cellValue)
    );
  }

  function gridSerialize() {
    return cellValue.reduce(
      (acc, cellValue, cellIdx) =>
        acc + (!cellIsSolved(cellIdx) ? 0 : cellGetValueAsString(cellIdx)),
      ""
    );
  }

  function gridSerializeForDisplay() {
    var rowVals = "";
    for (var idx = 0; idx < 81; idx++) {
      rowVals += `${idx % 27 === 0 ? "\n" + "=".repeat(96) : ""}`;
      rowVals += `${idx % 9 === 0 ? "\n||" : ""}`;
      rowVals +=
        " ".repeat(9 - cellGetValueAsString(idx).length) + cellValue[idx];
      rowVals += idx % 3 === 2 ? "||" : "|";
    }
    rowVals += `\n${"=".repeat(96)}`;

    return rowVals;
  }

  function gridSerializeForSimpleDisplay() {
    var rowVals = "";
    for (var idx = 0; idx < 81; idx++) {
      if (idx % 9 === 0) {
        rowVals += "\n";
      }

      rowVals += "|";
      rowVals += cellGetValueAsString(idx);
    }
    return rowVals;
  }

  function gridSetupEmpty() {
    isHalted = false;
    unsolvedSets = setsGetAll();
    solvedCellCount = 0;

    cellValue = Array(81).fill(123456789);
  }

  function gridUnsolvedCount() {
    return 81 - solvedCellCount;
  }

  function gridUseBruteForce() {
    var stash = [];
    var thisState = null;
    var firstUnsolvedPosition = null;

    thisState = gridSerialize();
    firstUnsolvedPosition = thisState.indexOf(0);
    cellGetValueAsString(firstUnsolvedPosition)
      .split("")
      .forEach((num) => {
        var valueToTry = {
          cellIdx: firstUnsolvedPosition,
          number: num,
          state: thisState,
          hints: [[firstUnsolvedPosition, num]],
          tabLevel: "",
        };
        stash.push(valueToTry);
      });

    var loopCount = 50;
    var hint = null;
    while (!isSolved() && stash.length > 0 && loopCount > 0) {
      loopCount--;
      hint = stash.pop();
      isDebugLogging && console.log("Trying :", JSON.stringify(hint.hints));

      gridInit(hint.state);
      cellSetValue(hint.cellIdx, hint.number);
      setsFindSingleCandidates();

      if (!isSolved() && !isHalted) {
        thisState = gridSerialize();
        firstUnsolvedPosition = thisState.indexOf(0);
        cellGetValueAsString(firstUnsolvedPosition)
          .split("")
          .forEach((num) => {
            var valueToTry = {
              cellIdx: firstUnsolvedPosition,
              number: num,
              state: thisState,
              hints: [...hint.hints, [firstUnsolvedPosition, num]],
              tabLevel: hint.tabLevel + "\t",
            };
            stash.push(valueToTry);
          });
      }
    }

    isDebugLogging &&
      console.log(
        "Hints :",
        isSolved() ? hint.hints : "Couldn't generate hints"
      );
    return isSolved() ? hint.hints : [];
  }

  function gridUseHints(hints) {
    hints.forEach((h) => {
      cellSetValue(h[0], h[1]);
      setsFindSingleCandidates();
    });
  }

  function setsDropCellFromSet(setIdx, cellIdx) {
    const diagInfo = `setsDropCellFromSet(setIdx=${setIdx}, cellIdx=${cellIdx})`;
    isDebugLogging && console.log(diagInfo, `Entering`);

    if (isNaN(setIdx) || setIdx == undefined)
      throw new Error(`setIdx: Expected number, was ${typeof setIdx}`);
    if (isNaN(cellIdx) || cellIdx == undefined)
      throw new Error(`cellIdx: Expected number, was ${typeof cellIdx}`);

    const set = unsolvedSets[setIdx];
    isDebugLogging && console.log(diagInfo, `Set is ${JSON.stringify(set)}`);
    var posInSet = set.indexOf(cellIdx);
    if (posInSet === -1) {
      isDebugLogging &&
        console.log(diagInfo, "Cell index not in set. Nothing to remove");
      return;
    }

    set.splice(posInSet, 1);
    isDebugLogging &&
      console.log(diagInfo, `Exiting.  Modified set is ${JSON.stringify(set)}`);
  }

  function setsFindSingleCandidates() {
    var shouldContinue = true;

    while (shouldContinue && !isHalted && !gridIsSolved()) {
      isDebugLogging && console.log("setsFindSingleCandidates");
      var solvedList = [];
      isDebugLogging && console.log(gridSerializeForDisplay());
      unsolvedSets.forEach((set, idx) => {
        var candidates = setsGroupCellsByUnsolvedNumbers(set);
        isDebugLogging && console.log(`${idx}  ${JSON.stringify(candidates)}`);
        Object.keys(candidates).forEach((key) => {
          if (candidates[key].length === 1) {
            var cellIdx = candidates[key][0];
            solvedList.push({ cellIdx, key });
          }
        });
      });

      solvedList.forEach((solve) => {
        isDebugLogging &&
          console.log(`      Setting cell ${solve.cellIdx} to ${solve.key}`);
        cellSetValue(solve.cellIdx, solve.key);
      });
      shouldContinue = solvedList.length > 0;
    }
    isDebugLogging && console.log("Unsolved ", gridUnsolvedCount());
  }

  function setsGetAll() {
    var allSets = [].concat(rowSet).concat(colSet).concat(boxSet);
    var cloneOfAllSets = JSON.parse(JSON.stringify(allSets));
    return cloneOfAllSets;
  }

  function setsGroupCellsByUnsolvedNumbers(set) {
    return set.reduce((acc, cellIdx) => {
      cellGetValueAsString(cellIdx)
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

  function testThings() {
    testIfCorrect();
  }

  function testIfCorrect() {
    var inputString = `439672815
781395264
562841397
897463521
124957683
653128479
315786942
976234158
248519736`;
    isDebugLogging = true;
    var testGrid = new Grid(inputString);
    console.log(testGrid.gridSerializeForDisplay());
    console.log(
      "Test if correct",
      inputString,
      solvedCellCount,
      testGrid.checkForCorrectness()
    );
  }

  module.exports = { grid: Grid, setLogLevel: configLogLevel, testThings };
})();
