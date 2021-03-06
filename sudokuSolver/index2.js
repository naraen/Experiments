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

var input_70= {
  input : `950000600
000085097
800020100
009032060
020050010
040860200
003070001
470190000
008000076
`, hints : [

]
};

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
//    [1,3], //3,5
//    [76,1], //15
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
//    [1,9], //79
//    [73,5] //58
  ]
}


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
  ]
}

var level5_127 = {
  input : `023060000
  000010603
  500042900
  000036450
  800070006
  064590000
  001620004
  302050000
  000080530
`,
  hints : [
  ]
}

var hard_128 = {
  input : `000000200
  000020030
  205190006
  000014063
  030000070
  420930000
  100062509
  060050000
  004000000
  `,
  hints : []
}
var inputWithHints = hard_128;//medium_81;
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


var workingSet = createWorkingSet();
var workingSet2 = createWorkingSet2();
var solvedCells = convertInputIntoSolveArray(input);

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
  var constraintSetsTemp = {};

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

function createWorkingSet() {
  return cells
    .map( (c) => convertArrayToObject(availableNumbersAsArray, ()=>"") );
}

function createWorkingSet2() {
  var thisSetFunc = (cellIndices) => convertArrayToObject(
    availableNumbersAsArray, 
    () => convertArrayToObject(cellIndices, ()=> "")
  );

  var workingSet2 = {};

  workingSet2 = convertArrayToObject(rows, thisSetFunc, (val, idx) => "r" + idx, workingSet2 );

  workingSet2 = convertArrayToObject(cols, thisSetFunc, (val, idx) => "c" + idx, workingSet2 );

  workingSet2 = convertArrayToObject(boxes, thisSetFunc, (val, idx) => "b" + idx, workingSet2 );

  return workingSet2;
}

function convertInputIntoSolveArray(thisInput){
  return thisInput
    .split("")
    .filter( (c) => c !== '\n' && c!== ' ')
    .map( (c, idx) => [idx, c, "is"])
    .filter( (v) => v[1] != '0');
}

function processExclusion(cs, thisValue) {
  if (typeof workingSet[cs] !== 'string') {
    delete workingSet[cs][thisValue];

    if (Object.keys(workingSet[cs]).length ===1) {
      addToSolves(cs, Object.keys(workingSet[cs])[0], "is");
      solvedCount++;
    }
  }

  var theseSets = [].concat(
    "r" + setForEachCell[cs].row,
    "c" + setForEachCell[cs].col,
    "b" + setForEachCell[cs].box,
    ).forEach( (thisSet) => {
      var tempObj = workingSet2[thisSet][thisValue];
      delete tempObj[cs];

      if (Object.keys(tempObj).length === 1) {
        addToSolves(Object.keys(tempObj)[0], thisValue, "is")
      }
    });
}


function getNextSolve() {
  return (solvedCells.pop() || [undefined, undefined, undefined]);
}

function addToSolves(cellIdx, v, isOrNot){
  if (v == 0) {
    throw "Something went wrong";
  }

  if (typeof workingSet[cellIdx] !== 'string' ) {
    solvedCells.push([cellIdx, v, isOrNot])
  }
}

var solvedCount=0;
function iterate() {
  var hintsAvailable=true;

  solvedCount=solvedCells.length;

  var [c, thisValue, isOrNot]=solvedCells.pop();
  var iterationCount=0;
  var bAbort=false;

  while (c !== undefined && solvedCount < 81 && !bAbort) {
    if (isOrNot !== "is" ) {
      processExclusion(c, thisValue);
      [c, thisValue, isOrNot ] = getNextSolve();;
      continue;
    }

    if (typeof workingSet[c] !== 'string' ) {
      var currentValue = workingSet[c];
//      console.log(268, currentValue);
      Object.keys(currentValue).forEach( (v) => {
        addToSolves(c, v, "is not");
      } );
    }
    workingSet[c] = thisValue;

    if (typeof thisValue !== 'string') {
      console.log("This should never happen, because we should only be propagating solved values");
      //TODO : Should we continue or abort? Continuing for now.
      [c, thisValue, isOrNot ] = getNextSolve();
      continue;
    }

    constraintSets[c].forEach( (cs) => {
      if (bAbort) return;

      ++iterationCount;

      if (typeof workingSet[cs] === 'string' ) {
        if (workingSet[cs] === thisValue){
          console.log("**** Conflict !!!", c, thisValue, cs);
          bAbort=false;
        }
        return;
      }

      if (workingSet[cs][thisValue] === undefined) {
        return;
      }

      addToSolves(cs, thisValue, "is not");
    });

    [c, thisValue, isOrNot] = getNextSolve();
    
    if (c === undefined && hintsAvailable) {
      hintsAvailable = false;

      hints.forEach( (h) => {
        addToSolves ( (h[0]-1).toString(), h[1].toString(), "is" );
        solvedCount++;
      });
      [c, thisValue, isOrNot] = getNextSolve();
    }
    
  }
  console.log(107, solvedCount, solvedCells.length, iterationCount);
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
