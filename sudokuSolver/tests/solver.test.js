(function () {
  const Grid = require("../grid.js").grid;
  const testData = require("./solverTestData.js");

  testData.forEach((thisTest) => {
    test(thisTest.desc, () => {
      var thisGrid = new Grid(thisTest.input);
      if (!thisGrid.isSolved()) thisGrid.findSingleCandidates();
      if (!thisGrid.isSolved()) thisGrid.useHints(thisTest.hints || []);

      var actual = thisGrid.getGridForSimpleDisplay().replace(/[\n ]*/g, "");
      var expected = thisTest.expected.replace(/[\n ]*/g, "");

      expect(actual).toBe(expected);
    });
  });

  test("Test if solution is correct", () => {
    var inputString = `439672815
781395264
562841397
897463521
124957683
653128479
315786942
976234158
248519736`;
    var testGrid = new Grid(inputString);
    expect(testGrid.checkForCorrectness()).toBe(true);
  });

  test("Test isSolved, should be false", () => {
    var inputString = `000000000
080090200
060001007
090060001
000050003
650020070
305000000
070004008
008009030`;
    var testGrid = new Grid(inputString);
    expect(testGrid.isSolved()).toBe(false);
  });

  test("Test isSolved, should be true when using hints", () => {
    var inputString = `000000000
080090200
060001007
090060001
000050003
650020070
305000000
070004008
008009030`;
    var testGrid = new Grid(inputString);
    testGrid.useHints([
      [0, "4"],
      [2, "9"],
    ]);
    expect(testGrid.isSolved()).toBe(true);
  });

  test("Test isSolved, should be true", () => {
    var inputString = `439672815
781395264
562841397
897463521
124957683
653128479
315786942
976234158
248519736`;
    var testGrid = new Grid(inputString);
    expect(testGrid.isSolved()).toBe(true);
  });
})();
