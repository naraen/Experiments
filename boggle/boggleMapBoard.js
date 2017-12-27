"use strict";

var process = require('process');
var fs = require('fs');

var getRandomNo = require('./lib/randomIntBetween.js');
var choices = 'abcdefghijklmnopqrstuvwxyz';

var cellIdx = {
	'0': 0,
	'1': 1,
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'A': 10,
	'B': 11,
	'C': 12,
	'D': 13,
	'E': 14,
	'F': 15
};


function solve( thisBoard ) {
	var boggleSequences = require('./bogglePerms.json')
	console.error('Time taken to load', process.hrtime(t));
	boggleSequences.forEach( (thisSequence) => {
		output.write( thisSequence.split('').map( (i) => board[ cellIdx[i] ] ).join('') );
	});
}

function generateBoard() {
	var board = [];
	var choices = 'abcdefghijklmnopqrstuvwxyz';

	for ( var idx=0; idx<16; idx++) {
		board.push( choices[getRandomNo(0,25)] );
	}
	return board;
}

var board = generateBoard();


console.error(board.join(''))

var t = process.hrtime();
var output = fs.createWriteStream('output1.txt');

output.on('finish', () => {
	console.error('Time taken map board', process.hrtime(t));
});

solve( board );

output.end();


