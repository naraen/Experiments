(function(){
  const Grid = require('../grid.js');
  const testData = require('./solverTestData.js');

  testData.forEach ( (thisTest) => {

    test(thisTest.desc, () => {

    var thisGrid = new Grid();
      thisGrid.initGrid(thisTest.input);
      thisGrid.sanitizeCandidates();

      expect(thisGrid.getGridForDisplay()).toBe(thisTest.expected);
    });

  });

}());