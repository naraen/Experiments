(function(){
  "use strict";

  function Cell ( idx ) {
    var _self = this;
    
    _self.value = 0;
    _self.candidates = [1,2,3,4,5,6,7,8,9];
    
    _self.setValue = ( val ) => { 
      _self.value = val;
    };
    
    _self.removeCandidate = ( val ) => {
      if ( _self.value !== 0 ) {
        throw new Error('Halting! Assigned cell value is not removable.', idx, val);

      }

      if ( _self.candidates[val] !== -1 ) {
        console.log('Warning! Duplicate call to remove candidate', idx, val);
        return;
      }

      _self.candidates[ val ] = -1;
      var leftOver = _self.candidates.filter( ( v ) => v != -1 );

      if ( leftOver.length === 1 ) {
        _self.value = leftOver[0];
        console.log('Assigning! ', idx, _self.value );
      }
    };
  }

  function Grid( ) {
    var _self = this;

    _self.grid = null; 
  
    var row_colToBoxIdx = (r, c) => parseInt(r/3) * 3 + parseInt(c/3);
    var row_colToGridIdx = (r, c) => r * 9 + c -1;
    var gridIdxToRowIdx = ( i ) => parseInt(i / 9);
    var gridIdxToColIdx = ( i ) => i % 9;
    var gridIdxToBoxIdx = ( i ) => parseInt ( gridIdxToRowIdx(i) / 3 ) * 3 + parseInt(gridIdxToColIdx(i) / 3);

    _self.rows = [ 
      [0,1,2,3,4,5,6,7,8],
      [9,10,11,12,13,14,15,16,17],
      [18,19,20,21,22,23,24,25,26],
      [27,28,29,30,30,32,33,34,35],
      [36,37,38,39,40,41,42,43,44],
      [45,46,47,48,49,50,51,52,53],
      [54,55,56,57,58,59,60,61,62],
      [63,64,65,66,67,68,69,70,71],
      [72,73,74,75,76,77,78,79,80]
    ];
    _self.cols = [ 
      [0,9,18,27,36,54,63,72],
      [1,10,19,28,37,55,64,73],
      [2,11,20,29,38,56,65,74],
      [3,12,21,30,39,57,66,75],
      [4,13,22,31,40,58,67,76],
      [5,14,23,32,41,59,68,77],
      [6,15,24,33,42,60,69,78],
      [7,16,25,34,43,61,70,79],
      [8,17,26,35,44,62,71,80]
    ];
    _self.boxs = [ 
      [0,1,2,9,10,11,18,19,20],
      [3,4,5,12,13,14,21,22,23],
      [6,7,8,15,16,17,24,25,26], 
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
          _self.grid.push( new Cell( idx ) );
      }
    };

    _self.showGrid = () => {
      var rowVals = '';
      for ( var idx = 0; idx < 81; idx++ ) {
        if ( idx % 9 === 0 ) {
          rowVals += '\n';
        }
        rowVals += _self.grid[ idx ].value;
      }

      console.log(rowVals);

    };
    
    _self.initGrid = ( input ) => {
      var cleanInput = input
        .replace(/\n/g, '')
        .replace(/ /g, '')
        .split('');
      
      cleanInput
        .forEach( ( val, idx ) => _self.grid[ idx ].setValue( val ) );
    };

    _self.sanitizeCandidates = () => {
      for ( var idx = 0; idx < 81; idx++ ) {
        
      }
    };
    _self.clearGrid();
  }

  var thisGrid = new Grid();

  var input = `
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

  console.log( 'Clean grid' );
  thisGrid.showGrid();

  thisGrid.initGrid(input);
  console.log( 'Inititalized grid' );

  thisGrid.showGrid();


}());
