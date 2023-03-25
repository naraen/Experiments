(function () {
  const Grid = require("../grid.js");
  const testData = require("./solverTestData.js");

  testData.forEach((thisTest) => {
    test(thisTest.desc, () => {
      var thisGrid = new Grid(thisTest.input);
      if (!thisGrid.isSolved()) thisGrid.findSingleCandidates();
      if (!thisGrid.isSolved()) thisGrid.useHints(thisTest.hints || []);

      expect(thisGrid.getGridForSimpleDisplay()).toBe(thisTest.expected);
    });
  });
})();
