( function(){
	"use strict";

	function generatePermutations(inputString) {
	  var results = [],
		out = [],
		inputLength = inputString.length;

	  innerPerm(inputString.split(''));
	  return results;

	  function innerPerm(thisInput) {
			var pos = inputLength - thisInput.length ;

			if ( thisInput.length === 0 ) {
				results.push( out.reduce( ( memo, v ) => memo + v, '' ) );
				return;
			}

			for ( var idx=0; idx<thisInput.length; idx++ ) {
				out[pos] = thisInput[idx];
				innerPerm(thisInput.filter( (val, iIdx) => iIdx !== idx  ), out);
			}
	  }
	}

	module.exports = generatePermutations;
}());
