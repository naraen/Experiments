"use strict";
//https://www.katacoda.com/courses/nodejs/playground

var input_old = `530070000
600195000
098000060
800060003
400803001
700020006
060000280
000419005
000080079`;

var input_easy14 = `500010004
274000600
080904000
810460302
002030100
706091058
000503010
005000927
100020003
`

var input_easy2=`000260701
680070090
190004500
820100040
004602900
050003028
009300074
040050036
703018000
`

var input_70=`950000600
000085097
800020100
009032060
020050010
040860200
003070001
470190000
008000076
`;

var hints_70 = [
  [69,6],
  [73,5]
]

//easy solve
var input_90=`007000000
500001004
324860090
000000438
600020710
835000900
710003562
903500841
000000000
`;

var inputWithHints_64= {
  input : `041020006
700056010
020310900
080040000
000801000
000070090
005093040
060780009
200060830
`, 
  hints :[
    [1,3], //3,5
    [76,1], //15
  ]
};

var medium_81 = {
  input : `000304000
406900000
025080000
002030004
040607200
100040038
030008460
009010500
000200070
  `,
  hints: [
    [1,9], //79
    [73,5] //58
  ]
}
var x =`
871345926
[359][3459][59]72[169][458][13458][1348]
[2359][3459]6[89][189][19][458]7[1348]
[1239][1389][289][49][379][379]6[13489]5
[359][3589][589]1[3679]2[478][3489][34789]
764[59][39]82[139][139]
[159][1589][5789]6[1789][179]3[4589][24789]
42[5789][89][13789][1379][578][5689][789]
[69][89]3[289]541[689][2789]
`

var hard_98 = {
  input : `870045020
000720000
006000070
000000605
000102000
764008000
000600300
420000000
003054100
`,
  hints : [
    [17,5],
    [29,3],
    [62,4]
  ]
}
var inputWithHints = hard_98//medium_81;
var input = inputWithHints.input;
var hints =inputWithHints.hints;


/* setup */
const availableNumbers = '123456789';
const availableNumbersAsArray = availableNumbers.split("");
const cells = [...Array(81).keys()];
const rows=[], cols=[], boxes=[];
const setForEachCell = generateSetForEachCell();
const constraintSets = generateConstraintSets();
//console.log("End of setup", rows, cols, boxes, constraintSets);
/* end setup */

var workingSet2 = createWorkingSet2();
//console.log(workingSet2);
//console.log(JSON.stringify(workingSet2, null, 2))
var workingSet = loadInputIntoWorkingSet(input);

iterate();

var output = formatWorkingSetForDisplay();
console.log(output);

function generateSetForEachCell() {
  return cells.map( (c) => {
    var row = Math.floor((c)/9); 
    var col = (c) % 9;

    var boxRow = Math.floor(row/3);
    var boxCol = Math.floor(col/3);
    var box = boxRow * 3 +  boxCol;

    return { row, col, box};
  });
}

function generateConstraintSets() {
  var constraintSetsTemp={};

  cells.forEach( (c) => {
    var row = setForEachCell[c].row;
    if (rows[row] === undefined) {
        rows[row] = [c];
    } else {
        rows[row].push(c);
    }
    
    var col = setForEachCell[c].col;
    if (cols[col] === undefined){
      cols[col] = [c]
    } else {
      cols[col].push(c);
    }

    var box = setForEachCell[c].box;
    if (boxes[box] === undefined){
      boxes[box] = [c]
    } else {
      boxes[box].push(c);
    }

    constraintSetsTemp[c]  = [ rows[row], cols[col], boxes[box]];
  })

  return convertArrayToObject(
    cells, 
    (cellIdx/*, arrIdx*/) => {
      var thisConstraintSet = constraintSetsTemp[cellIdx];
      var flattenedArrayOfAllIndices = [].concat(thisConstraintSet[0], thisConstraintSet[1], thisConstraintSet[2])//flatten
          .filter((d) => d !== cellIdx );  //exclude current cell index

      return Object.keys(convertArrayToObject(flattenedArrayOfAllIndices)) //Dedupe the array using dictionary a
    }
  ); 
}

function loadInputIntoWorkingSet(thisInput) {
  /* prepare input */
  return thisInput
    .split("")
    .filter( (c) => c !== '\n' && c!== ' ')
//    .map( (c) => c==='0' ? availableNumbers.split("").reduce( (memo, d) => {memo[d]=""; return memo }, {}) : c);
    .map( (c) => c==='0' ? convertArrayToObject(availableNumbersAsArray, ()=>"") : c);

  //console.log("workingSet ", input);
  /* end prepare input */
}


function iterate() {
  var hintsAvailable=true;
  var solvedCells = [];

  cells.forEach( (c) => {
    var thisValue = workingSet[c];

    if (typeof thisValue === 'string') {
      solvedCells.push(c);  
    }
  });
  

  console.log("Propagate ", solvedCells.join(","))
  var solvedCount=solvedCells.length;

  var c=solvedCells.pop();
  var iterationCount=0;
  var bContinue=true;

  while (c !== undefined && solvedCount < 81 && bContinue) {
    //if (c > 0) return;
    var thisValue = workingSet[c];

    //console.log("cell ", c, typeof thisValue);
    if (typeof thisValue !== 'string') {
      console.log("This should never happen, because we should only be propagating solved values")

      //TODO : Should we continue or abort? Continuing for now.
      c=solvedCells.pop();
      continue;
    }


    //console.log('****** here', thisValue, constraintSets[c].join(","));
    constraintSets[c].forEach( (cs) => {
      if (!bContinue) return;

      ++iterationCount;
       //console.log("here 86", cs)
      if (typeof workingSet[cs] === 'string' ) {
        if (workingSet[cs] === thisValue){
          console.log("**** Conflict !!!");
          bContinue=false;
        }
        return;
      }

      //console.log("here 90", thisValue, Object.keys(workingSet[cs]).join(""))
      if (workingSet[cs][thisValue] === undefined) {
        return;
      }

      //console.log("   *** Deleting ", thisValue, " from cell ", cs, " because of cell ", c);
      delete workingSet[cs][thisValue];
      if (Object.keys(workingSet[cs]).length ===1) {
        //console.log("Solved", cs, workingSet[cs])
        workingSet[cs] = Object.keys(workingSet[cs])[0];
        solvedCells.push(cs);
        solvedCount++;
      }
    });

    c=solvedCells.pop();
    if (c === undefined && hintsAvailable) {
      hintsAvailable = false;

      hints.forEach( (h) => {
        workingSet[h[0]-1]=h[1].toString();
        solvedCells.push(h[0]-1);
        solvedCount++;
      })
      c=solvedCells.pop();
    }
  }
  console.log(107, solvedCount, solvedCells.length, iterationCount);
}

function convertArrayToObject(arr, valFunc, idxFunc, initialObject) {
  if (valFunc === undefined) {
    valFunc = (val, idx) => undefined;
  }

  if (idxFunc === undefined) {
    idxFunc = (val, idx) => val;
  }

  if (initialObject === undefined ){
    initialObject = {};
  }

  return arr.reduce( (memo, val, idx) => {
        memo[ idxFunc(val, idx) ] = valFunc(val, idx);
        return memo;
      }, initialObject );
}

function createWorkingSet2() {
  var thisSetFunc = (cellIndices) => convertArrayToObject(
    availableNumbersAsArray, 
    () => convertArrayToObject(cellIndices)
  );

  var workingSet2 = {};
  
  workingSet2 = convertArrayToObject(rows, thisSetFunc, (val, idx) => "r" + idx, workingSet2 );

  //workingSet2 = convertArrayToObject(cols, thisSetFunc, (val, idx) => "c" + idx, workingSet2 );

  //workingSet2 = convertArrayToObject(boxes, thisSetFunc, (val, idx) => "b" + idx, workingSet2 );

  workingSet2['r8']['1']['72'] = "hello"

//  console.log(workingSet2);
  return workingSet2;
}

function formatWorkingSetForDisplay() {
  var col=0;
  var row=1;
  const intendedCellWidth = 10;
  const rowWidth = 104;

  return workingSet.reduce((memo, c) => {
    col++;
    if (col === 1) {
      memo += "||";
    }

    var displayVal = (typeof c === 'string') ? c : Object.keys(c).join('');

    var spaces = Math.round(( intendedCellWidth - displayVal.length)/2);
    displayVal = " ".repeat(spaces) + displayVal + " ".repeat(spaces - 1);
    displayVal += (displayVal.length !== intendedCellWidth ) ? " " : ""
    displayVal += (col === 3 || col === 6 || col === 9)  ? "||" : "|";


    memo += displayVal;

    if (col === 9) {
      memo+= '\n';
      row++;
      col=0;
      memo += ( row === 4 || row === 7 || row === 10 ) ? "=".repeat(rowWidth) + "\n" : "" ;
    }

    return memo;
  }, "=".repeat(rowWidth) + "\n");
}
