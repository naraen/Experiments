(function(){
	"use strict";

//The winning # of moves calculation seems to be incorrect
	var thisSet;
		
	function makeBagOfChoices() {
		var bag = {};
		for (var idx=0; idx<9; idx++){
			bag[idx] = idx;
		}	

		return bag;
	}	


	function generateRandomPlaySequence() {
		var thisSet = new Array(9);
		var bagOfChoices = makeBagOfChoices();
		for (var idx = 0; idx <9; idx++){
			thisSet[idx] = pickRandomAvailableCell( bagOfChoices, idx );
		}
		return thisSet;
	}


	function pickRandomAvailableCell( bagOfChoices, idx ) {
		var availableChoices = Object.keys(bagOfChoices);
		var randomIndex =  Math.round(Math.random() * ( 8 - idx ) );
		var elementAtIndex = availableChoices[ randomIndex ];
		var pickedCell = bagOfChoices[ elementAtIndex ];
		delete bagOfChoices[ pickedCell ];
		
		return pickedCell;
	}


	function generateGridForSequence( playSequence ){
		var grid = new Array(9).fill('_');
		for ( var idx=0; idx<9; idx++) {
			var cellIdx = playSequence[ idx ];		
			grid[ cellIdx ] = ( idx % 2 == 0) ? 0 : 1;
		}
		return grid;
	}


	var winDef = [
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,4,8],
		[2,4,6]
	];

	var winDef2 = winDef.reduce( ( acc, thisSequence, defIdx ) => {
		for (var idx=0; idx<3; idx++) {
			var thisCell = thisSequence[ idx ];
			if ( acc[thisCell] === undefined ) {
				acc[thisCell] = [ defIdx ];
			} else {
				acc[ thisCell ].push(defIdx);
			}
		}
		return acc;
	}, {});


	function findWinner( playSequence ) {
		var winStates = ['','','','','','','',''];
		var winner = -1;

		for ( var idx = 0; idx < 9; idx++ ) {
			var playerNo = idx % 2 === 0 ? 0 : 1;
			var winDef2Elem = winDef2[ playSequence[idx] ];
			for ( var wIdx = 0; wIdx < winDef2Elem.length; wIdx++ ) {
				winStates[ winDef2Elem[ wIdx] ] = winStates[ winDef2Elem[ wIdx] ] + playerNo;
				
				var newState = winStates[ winDef2Elem[ wIdx] ];
				
				if ( newState === '000' || newState === '111') {
					winner = playerNo;
					break;
				}
			}
			if ( winner !== -1) break;
		}

		return [ idx,  winner];
	}

	module.exports = {
		generateRandomPlaySequence,
		generateGridForSequence,
		findWinner
	};

}());

