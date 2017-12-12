( function(){	 
	"use strict";
	// node --max-old-space-size=4096 yourFile.js

	const process = require('process');
	const fs = require('fs');

	function nextIteration( inputGraph, currResults ) {
		var newResults = [];
		var nextNavAvailable = 0;
		var sequenceCount = 0;

		for (var idz = 0; idz < currResults.length; idz++) {
			var sequence = currResults[idz];
			var visited = sequence.split('').reduce( (memo, v) => {
				memo[ v ] = '';
				return memo;
			}, {});

			var filterVisited = ( v ) => ( visited[ v ] === undefined );

			var currNode = sequence.length === 0 ? 'start' : sequence[  sequence.length - 1 ];
			var availableNodes =  inputGraph[ currNode ].filter( filterVisited );

			if ( availableNodes.length === 0 ) {
				continue;
			}

			for ( var idn=0; idn<availableNodes.length; idn++) {
				var thisNode = availableNodes[idn];
				var nextSequence = sequence + thisNode ;

				output.write( nextSequence + '\n' );
				sequenceCount++;

				var nextAvailableNodes = inputGraph[ thisNode ].filter( filterVisited );

				if ( nextAvailableNodes.length === 0 ) {
					continue;
				}

				nextNavAvailable += nextAvailableNodes.length;

				newResults.push( nextSequence );
			}
		}

		return [ sequenceCount, newResults, nextNavAvailable ];
	}

	var output;

	function enumeratePaths(inputGraph, maxIterations, outputFile, callback) {
		var inputNodes = {
			'start' : Object.keys( inputGraph )
		};

		inputNodes = Object.keys( inputGraph ).reduce( (memo, n) => {
			memo[n] = inputGraph[n].split('');
			return memo;
		}, inputNodes);

		output = fs.createWriteStream( outputFile );
		var result = [ -1, [  '' ], -1 ];
		if (callback) output.on('finish', ( err, data) => callback(err, data) );

		for ( var idr = 0; idr < maxIterations; idr++ ) {
			var t = process.hrtime();
			//output = fs.createWriteStream( outputFile + '_' +  (idr < 10 ? '0' : '' ) + idr );

			result  = nextIteration(inputNodes, result[1] );
			if ( result[0] === 0) {
				break;
			}
			console.log(idr, ' ...', process.hrtime(t));
			//console.error('******', idr, result[0], result[1].length, result[2], process.hrtime(t));
		}

		output.end();
	} 

	module.exports = enumeratePaths;
}());