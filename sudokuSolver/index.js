(function () {
  "use strict";

  const testData = require("./tests/solverTestData.js");

  const Grid = require("./grid.js").grid;
  var gridSetLogLevel = require("./grid.js").setLogLevel;
  //  var testHelper = require("./grid.js").testThings;

  //  testHelper();

  //return;
  //propagate solved cells.   Done
  //TODO: stop visiting solved cells. Done
  //TODO: find unique value in set.  Done
  //TODO: propagate with shared tuples.
  //TODO : use brute force. - Done
  //TODO: emit hints - Done

  var inputs = [];

  gridSetLogLevel("No Op" /* No Op, Debug*/);
  inputs = testData;

  inputs.forEach((thisTest) => {
    console.log("*******", thisTest.desc, "*********");
    var thisGrid = new Grid(thisTest.input);

    if (!thisGrid.isSolved()) {
      console.log("Not solved.  Trying to identify single candidates");
      thisGrid.findSingleCandidates();
    }

    if (!thisGrid.isSolved()) {
      console.log("Not solved.  Trying with hints");
      thisGrid.useHints(thisTest.hints || []);
    }

    if (!thisGrid.isSolved()) {
      console.log("Not solved.  Using Brute force");
      var hints = thisGrid.useBruteForce();
      console.log("Found hints", JSON.stringify(hints));
    }

    var solvedGrid = thisGrid.getGridForSimpleDisplay();
    var isCorrect = thisGrid.checkForCorrectness();

    console.log(solvedGrid);
    console.log(isCorrect ? "Correct" : "Not Correct");

    console.log("*******", thisTest.desc, "*********");
  });
})();
