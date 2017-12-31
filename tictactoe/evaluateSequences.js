(function(){
	"use strict";

	/*
	One liner equivalent
	const t = process.hrtime(); require('../lib/permutations.js')('012345678').forEach((play) => require('./tictactoe.js').findWinner(play.split('')));console.log(process.hrtime(t))
	const t = process.hrtime(); require('../lib/permutations.js')('012345678').forEach((play) => require('./tictactoe.js').findWinnerIgnoringOrder(play.split('')));console.log(process.hrtime(t))
	*/

	require('../lib/permutations.js')('012345678')
		.forEach((play) => {
			const winner = require('./tictactoe.js').findWinner(play.split(''));
			const grid = play.split('').reduce( (memo,v,idx) => {
				memo[v] = idx > winner[0] ? '_' : (idx % 2 === 0 ? 'O' : 'X' ); 
				return memo;
			}, new Array(9)).join('');


			console.log([
				play, 
				winner[0]+1, 
				['D','O','X'][winner[1] + 1],
				require('./ticTacToe.js').generateSymmetricalSequences(grid)[0],
				grid, 
			].join(','));
		});
}());

