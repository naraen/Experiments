function uptoNFactorial(n) {
	"use strict";
	var total=0;
	var fact=1;

	for ( var idx=n; idx>0; idx--){
		fact *= idx;

		total += fact;
//		console.log(10, 16-idx+1, idx, fact, total)
	}	
	return total;
}


module.exports = uptoNFactorial;