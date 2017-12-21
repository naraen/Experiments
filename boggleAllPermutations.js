const process = require('process');
const generateSequences = require('./lib/enumerateAllPaths.js');

const boggleAdjacentNodes = {
	'0' : '145',
	'1' : '02456',
	'2' : '13567',
	'3' : '267',

	'4' : '01589',
	'5' : '0124689A',
	'6' : '123579AB',
	'7' : '236AB',

	'8' : '459CD',
	'9' : '4568ACDE',
	'A' : '5679BDEF',
	'B' : '67AEF',

	'C' : '89D',
	'D' : '89ACE',
	'E' : '9ABDF',
	'F' : 'ABE'
};

var t = process.hrtime( );

generateSequences(boggleAdjacentNodes, 16, './bogglePossibilities.txt', () => {
	console.log('Completed writing output', process.hrtime(t));
});