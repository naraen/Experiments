(function(){
  "use strict";

  const Grid = require('./grid.js');

  var thisGrid = new Grid();

  var input1 = `
  005094002
  908057030
  000310500
  600040000
  000583000
  000060001
  004025000
  090800705
  500470600
  `;

var input2 = `
200680000
006020015
004579600
090038050
430916087
080050060
008263500
920040800
000097002
  `;

var input3 = `
064093710
270800096
001675000
000050820
700030009
049080000
000528100
150009074
026410950
`

var input4=`000000200
  000020030
  205190006
  000014063
  030000070
  420930000
  100062509
  060050000
  004000000
  `
var input5 = `
042060000
000489020
800020700
100000300
250070041
008000002
007090003
080216000
000040910
`
var input = input2
  thisGrid.initGrid(input);
  //console.log( 'Inititalized grid' );

  /********* Need to convert this into unit tests  */
  //thisGrid.showGrid();
 
//  console.log("\nboxs", thisGrid.boxs.toString());
//  console.log("\nrows", thisGrid.rows.toString());
//  console.log("\ncols", thisGrid.cols.toString());
  /********* Need to convert this into unit tests  */

  //provide hints
  [
    //[7, '3'], [6, '1']
    //[53, '9']
    [53, '9']
  ].forEach( (h) => thisGrid.grid[h[0]].setValue(h[1]));

  

  //propagate solved cells.   DONE
  //TODO: stop visiting solved cells.
  //TODO: find unique value in set
  //TODO: propagate with shared tuples. 
  thisGrid.sanitizeCandidates();

  var solvedGrid = thisGrid.getGridForDisplay();
  var isCorrect = thisGrid.checkForCorrectness();
  console.log(solvedGrid);
  console.log (isCorrect? "Correct" : "Not Correct");


}());
