function addCommaGrouping(n){
	"use strict";

	var nAsString = n.toString();
	var result = [];

	var nextLeftComma = nAsString.length % 3;
	var noOfCommas = parseInt(nAsString / 3);

	if ( nextLeftComma === 0) {
		nextLeftComma = 3 - 1;
		noOfCommas -= 1;
	} else {
		nextLeftComma -= 1;
	}

	for (var idx=0;idx<nAsString.length;idx++){
		result.push( nAsString[ idx ] );
		if ( idx === nAsString.length -1) {
			break;
		}

		if (  idx === nextLeftComma) {
			result.push(',')
			nextLeftComma += 3;
		}
	}

	return result.join('');
}

module.exports = addCommaGrouping