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
		return playSequence
			.reduce( (grid, cellIdx, turnNumber) => {
				grid[cellIdx] = (turnNumber %2 === 0 ? 0 : 1);
				return grid;
			}, new Array(9).fill('_'));
	}


	const winDef = [
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,4,8],
		[2,4,6]
	];

	const winningSequencesByPlayedPosition = winDef.reduce( ( acc, thisSequence, defIdx ) => {
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


	function findWinnerIgnoringOrder( playSequence ) {
		const grid = generateGridForSequence(playSequence);

		for ( var idx=0; idx<winDef.length; idx++ ){
			const [c1, c2, c3] = winDef[idx];			
			const sequence = grid[a] + grid[b] + grid[c];

			if (sequence === '000') {
				return '0';
			}

			if (sequence === '111') {
				return '1';
			}
		}
		return -1;
	}

	function findWinner( playSequence ) {
		const winStates = winDef.map( () => ({ 
			isRuledOut : false, 
			forPlayer : -1, 
			count:0 
		}));
		var winner = -1;

		for ( var idx = 0; idx < 9; idx++ ) {
			var playerNo = idx % 2 === 0 ? 0 : 1;
			var sequencesForThisPlay = winningSequencesByPlayedPosition[ playSequence[idx] ];
			for ( var wIdx = 0; wIdx < sequencesForThisPlay.length; wIdx++ ) {
				var thisWinState = winStates[ sequencesForThisPlay[ wIdx ]];
				if ( thisWinState.isRuledOut ) continue;

				if (thisWinState.count === 0) {
					thisWinState.count++;
					thisWinState.forPlayer = playerNo;
					continue;
				}

				if (thisWinState.forPlayer !== playerNo ) {
					thisWinState.isRuledOut = true;
					continue;
				}

				thisWinState.count++;

				if ( thisWinState.count === 3) {
					winner = playerNo;
					break;
				}
			}
			if ( winner !== -1) break;
		}

		return [ idx===9? 8 : idx,  winner];
	}


	const symmetryTransforms = [
		[], //no change
		[ [0,2], [2,0], [3,5], [5,3], [6,8], [8,6] ], //vertical axis
		[ [0,6], [1,7], [2,8], [6,0], [7,1], [8,2] ], //horizontal axis
		[ [1,3], [3,1], [2,6], [6,2], [5,7], [7,5] ], //LT to RB axis
		[ [0,8], [1,5], [3,7], [5,1], [7,3], [8,0] ], //RT to LB axis
		[ [0,6], [1,3], [2,0], [3,7], [5,1], [6,8], [7,5], [8,2] ], //90 rotation
		[ [0,8], [1,7], [2,6], [3,5], [5,3], [6,2], [7,1], [8,0] ], //180 rotation
		[ [0,2], [1,5], [2,8], [3,1], [5,7], [6,0], [7,3], [8,6] ] //270 rotation
	];
	
	
	function generateSymmetricalSequences( thisSequence ) {
		return symmetryTransforms.map( (e) => {
			return e.reduce( (memo, pair) => {
				memo[pair[0]] = thisSequence[pair[1]];
				return memo;
			}, thisSequence.split(''))
			.join("") ;  
		})
		.sort();
	}
	
	module.exports = {
		generateRandomPlaySequence,
		generateGridForSequence,
		findWinner,
		findWinnerIgnoringOrder,
		generateSymmetricalSequences
	};

}());

