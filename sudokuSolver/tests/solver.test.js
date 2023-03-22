(function(){
  const Grid = require('../grid.js');
  const testData = require('./solverTestData.js');

  testData.forEach ( (thisTest) => {

    test(thisTest.desc, () => {

    var thisGrid = new Grid();
      thisGrid.initGrid(thisTest.input);

      (thisTest.hints || [] )
      	.forEach( (h) => {
          thisGrid.grid[h[0]].setValue(h[1])
      	  });

      thisGrid.sanitizeCandidates();

      expect(thisGrid.getGridForSimpleDisplay()).toBe(thisTest.expected);
    });

  });

}());