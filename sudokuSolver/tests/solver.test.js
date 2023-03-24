(function () {
  const Grid = require("../grid.js");
  const testData = require("./solverTestData.js");

  //  var testData1 = [ testData[1] ]
  testData.forEach((thisTest) => {
    test(thisTest.desc, () => {
      var thisGrid = new Grid();
      thisGrid.initGrid(thisTest.input);
      if (!thisGrid.isSolved()) thisGrid.findSingleCandidates();
      if (!thisGrid.isSolved()) thisGrid.useHints(thisTest.hints || []);

      expect(thisGrid.getGridForSimpleDisplay()).toBe(thisTest.expected);
    });
  });
})();
