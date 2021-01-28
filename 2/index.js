const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');

	let solution = solve2(data);
	console.log(solution);
}

function solve(data)
{
	const regex = /(\d{1,2})-(\d{1,2}) ([a-z]{1})\: (.*)/;

	let valid = 0;

	for(let i = 0; i < data.length; i++)
	{
		let line = regex.exec(data[i]);
		var [ min, max, c, str ] = [line[1], line[2], line[3], line[4]];

		let count = (str.match(new RegExp(c, 'g')) || []).length;

		if(count >= min && count <= max)
			valid++;
	}

	return valid;
}

function solve2(data)
{
	const regex = /(\d{1,2})-(\d{1,2}) ([a-z]{1})\: (.*)/;

	let valid = 0;

	for(let i = 0; i < data.length; i++)
	{
		let line = regex.exec(data[i]);
		var [ min, max, c, str ] = [parseInt(line[1]), parseInt(line[2]), line[3], line[4]];

		let indexes = str.split('').map((x, i) => { if(x === c) return (i + 1); }).filter(x => typeof x !== 'undefined').map(x => parseInt(x));

		var valids = indexes.filter(x => ((x === min || x === max) && !(x === min && x === max)));

		if(valids.length === 1)
			valid++;
	}

	return valid;
}

main();