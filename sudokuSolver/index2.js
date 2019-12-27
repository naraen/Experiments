
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

var input_1 = `500010004
274000600
080904000
810460302
002030100
706091058
000503010
005000927
100020003
`

var input_2 = `950000600
000085097
800020100
009032060
020050010
040860200
003070001
470190000
008000076
`;

var input_34 = `986900000
010006000
040305800
400000210
090500000
050040306
029000008
004690173
000001004
`;

input_34 = `986900500
010006000
040305800
400000210
090500000
050040306
029000008
004690173
000001054
`;


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

var input_bak=`950000600
000085097
800020100
009032060
020050010
040860200
003070001
470190000
008000076
`;


var input=`950000600
000085097
800020100
009032060
020050010
040860200
003070001
470190000
008000076
`;

var hints = [
  //[51,1],
  //[12,1],
  [10,2],
  //[4,3],
  [56,9]
]
/* setup */

var cells = [...Array(81).keys()]

var rows=[], cols=[], boxes=[], constraintSetsTemp={};

cells.forEach( (c) => {

  var row = Math.floor((c)/9)  
  if (rows[row] === undefined) {
      rows[row] = [c];
  } else {
      rows[row].push(c);
  }
  
  var col = (c) % 9
  if (cols[col] === undefined){
    cols[col] = [c]
  }else {
    cols[col].push(c);
  }

  var boxRow = Math.floor(row/3);
  var boxCol = Math.floor(col/3);
  var box = boxRow * 3 +  boxCol;

  if (boxes[box] === undefined){
    boxes[box] = [c]
  }else {
    boxes[box].push(c);
  }

  constraintSetsTemp[c]  = [ rows[row], cols[col], boxes[box]]

})

var constraintSets = cells.reduce( (memo, c) => {
  var thisConstraintSet = constraintSetsTemp[c];
  memo[c] = Object.keys([]
    .concat(thisConstraintSet[0], thisConstraintSet[1], thisConstraintSet[2])
    .filter((d) => d!==c)  //remove current element
    .reduce( (memo, val) => { //dedupe by using associative array
      memo[val]="";
      return memo;
    }, {}));
  return memo;
}, {})

//console.log("End of setup", rows, cols, boxes, constraintSets);
/* end setup */

/* prepare input */
var workingSet = input
  .split("")
  .filter( (c) => c!== '\n')
  .map( (c) => c==='0' ? '123456789'.split("").reduce( (memo, d) => {memo[d]=""; return memo }, {}) : c);

//console.log("workingSet ", input);
/* end prepare input */
hints.forEach( (h) => {
  workingSet[h[0]-1]=h[1].toString();
})
//console.log("workingSet ", input);
iterate();

var col=0;
var output = workingSet.reduce((memo, c) => {
  col++;
  memo += (typeof c === 'string') ? c : '[' + Object.keys(c).join('') + ']';
  if (col === 9) {
    memo+= '\n';
    col=0;
  }
  return memo;
},"");

//console.log(workingSet.join("").match(/.{1,9}/g));
console.log(output);

/* iteration #1 */
function iterate(){
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
  while (c !== undefined && solvedCount < 81) {
  //if (c > 0) return;
    var thisValue = workingSet[c];
    //console.log("cell ", c, typeof thisValue);
    if (typeof thisValue !== 'string') {
      console.log("This should never happen")
      c=solvedCells.pop();
      continue;
    }

    //console.log('****** here', thisValue, constraintSets[c].join(","));
    constraintSets[c].forEach( (cs) => {
      ++iterationCount;
       //console.log("here 86", cs)
      if (typeof workingSet[cs] === 'string' ) {
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

    //console.log(workingSet);
    c=solvedCells.pop();
  }
  console.log(107, solvedCount, solvedCells.length, iterationCount);
}
/* end iteration #1 */
