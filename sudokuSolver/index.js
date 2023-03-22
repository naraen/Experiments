(function(){
  "use strict";
   var tabLevel=[];


  function Cell ( idx ) {
    var _self = this;

    _self.candidates = '123456789';
    _self.isSolved = false;
    
    _self.setValue = (val) => {
      tabLevel.push('\t')
      _self.setValue_shadow(val);
      tabLevel.pop();
    }

    _self.setValue_shadow = ( val ) => { 
      _self.candidates = val;

      _self.isSolved = (_self.candidates.length === 1);

      if (_self.isSolved)  {
        //console.log(tabLevel.join('') + '*** Solved', idx, val);
        thisGrid.pendingActionList.push(['propagate', idx, val]);
      }
    };
    
    _self.toString = () => {
      return '|' + _self.candidates.toString().replace(/,/g,'');
    }

    _self.removeCandidate= (val) => {
      tabLevel.push('\t')
      _self.removeCandidate_shadow(val);
      tabLevel.pop();
    }

    _self.removeCandidate_shadow = ( val ) => {
      if (_self.candidates == val) {
        //console.log(tabLevel.join(''), '***', val, 'from', idx, 'Problem.  Halting!');
        return;
      }

      if (_self.candidates.indexOf(val) === -1 ){
        //console.log(tabLevel.join(''), '***', val, 'from', idx, 'Already removed. NoOp')
        return;
      }

      if (_self.isSolved) {
        //console.log(tabLevel.join(''), '***', val, 'from', idx, 'Already solved.  Exiting')
        return;
      }

      //console.log(tabLevel.join(''), '***', val, 'from', idx, 'Removing:', _self.candidates, _self.candidates.replace(val,''));
      _self.setValue(_self.candidates.replace(val,''));
    };
  }

  function Grid( ) {
    var _self = this;

    _self.grid = null; 
    _self.pendingActionList = [];
  
    var row_colToBoxIdx = (r, c) => parseInt(r/3) * 3 + parseInt(c/3);
    var row_colToGridIdx = (r, c) => r * 9 + c -1;
    var gridIdxToRowIdx = ( i ) => parseInt(i / 9);
    var gridIdxToColIdx = ( i ) => i % 9;
    var gridIdxToBoxIdx = ( i ) => parseInt ( gridIdxToRowIdx(i) / 3 ) * 3 + parseInt(gridIdxToColIdx(i) / 3);


    _self.rows = [ 
      [0,1,2,3,4,5,6,7,8],
      [9,10,11,12,13,14,15,16,17],
      [18,19,20,21,22,23,24,25,26],
      [27,28,29,30,31,32,33,34,35],
      [36,37,38,39,40,41,42,43,44],
      [45,46,47,48,49,50,51,52,53],
      [54,55,56,57,58,59,60,61,62],
      [63,64,65,66,67,68,69,70,71],
      [72,73,74,75,76,77,78,79,80]
    ];

    _self.cols = [ 
      [0, 9,18,27,36,45,54,63,72],
      [1,10,19,28,37,46,55,64,73],
      [2,11,20,29,38,47,56,65,74],
      [3,12,21,30,39,48,57,66,75],
      [4,13,22,31,40,49,58,67,76],
      [5,14,23,32,41,50,59,68,77],
      [6,15,24,33,42,51,60,69,78],
      [7,16,25,34,43,52,61,70,79],
      [8,17,26,35,44,53,62,71,80]
    ];

    _self.boxs = [ 
      [ 0, 1, 2, 9,10,11,18,19,20],
      [ 3, 4, 5,12,13,14,21,22,23],
      [ 6, 7, 8,15,16,17,24,25,26], 
      [27,28,29,36,37,38,45,46,47],
      [30,31,32,39,40,41,48,49,50],
      [33,34,35,42,43,44,51,52,53],
      [54,55,56,63,64,65,72,73,74],
      [57,58,59,66,67,68,75,76,77],
      [60,61,62,69,70,71,78,79,80]
    ];
    _self.clearGrid = () => {
      _self.grid = [ ]; 
      
      for ( var idx = 0; idx < 81; idx++ ) {
        var cell = new Cell( idx )
        _self.grid.push( cell );
      }
    };

    _self.showGrid = () => {
      var rowVals = '';
      for ( var idx = 0; idx < 81; idx++ ) {
        if ( idx % 9 === 0 ) {
          rowVals += '\n';
        }
        rowVals += _self.grid[ idx ];
      }

      console.log(rowVals);

    };
    
    _self.initGrid = ( input ) => {
      var cleanInput = input
        .replace(/\n/g, '')
        .replace(/ /g, '')
        .split('');
      
      cleanInput
        .forEach( ( val, idx ) =>  { 
          if (val == 0) {
            return;
          }

          _self.grid[ idx ].setValue( val );
        });
    };

    _self.sanitizeCandidates = () => {
      var arrToObject = (arr, idx, acc) =>  {
//        console.log(_self[setList][idx]);

        arr[idx]
        .reduce( (obj, currVal) => {
              obj[currVal] = '';
              return obj;
            }, acc);
      }


      var currList = _self.pendingActionList
        var action = currList.pop();
        while (action != undefined ) {
          if (action[0] == 'propagate') {
            var gridIdx = action[1];
            var cellValue = action[2];

            var rowIdx = gridIdxToRowIdx(gridIdx);
            var colIdx = gridIdxToColIdx(gridIdx);
            var boxIdx = gridIdxToBoxIdx(gridIdx);

            var thisObj = {}; 
            arrToObject(_self['rows'], rowIdx, thisObj);
            arrToObject(_self['cols'], colIdx, thisObj);
            arrToObject(_self['boxs'], boxIdx, thisObj);
            delete thisObj[gridIdx];

            var propagationList = Object.keys(thisObj);
            //console.log(action, ' to ',  propagationList.toString());
            propagationList.forEach( (gridIdx) => _self.grid[gridIdx].removeCandidate( cellValue ) );

          }
          action = currList.pop()
        }

    };
    _self.clearGrid();
  }

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
var input = input2
  thisGrid.initGrid(input);
  //console.log( 'Inititalized grid' );

  /********* Need to convert this into unit tests  */
  //thisGrid.showGrid();
 
//  console.log("\nboxs", thisGrid.boxs.toString());
//  console.log("\nrows", thisGrid.rows.toString());
//  console.log("\ncols", thisGrid.cols.toString());
  /********* Need to convert this into unit tests  */

//  thisGrid.grid[ 72 ].setValue( '5' ) //provide hints

  //propagate solved cells.   DONE
  //TODO: find unique value in set
  //TODO: propagate with shared tuples. 
  thisGrid.sanitizeCandidates();

  thisGrid.showGrid();

}());
