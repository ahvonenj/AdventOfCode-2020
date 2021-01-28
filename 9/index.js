import util from 'util';
import fs from 'fs'
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
	data = data.map(x => { return parseInt(x); });
	let preamble = data.slice(0, 25);

	for(let i = 25; i < data.length; i++)
	{
		let v = data[i];

		let sumFound = findSumFor(v, preamble);

		if(!sumFound)
			console.log(i, v, preamble)

		preamble.shift();
		preamble.push(v);
	}

	function findSumFor(n, p)
	{
		for(let i = 0; i < p.length; i++)
		{
			let a = p[i];

			for(let j = i + 1; j < p.length; j++)
			{
				let b = p[j];

				if(a + b === n && a !== b)
					return true;
			}
		}

		return false;
	}
}

function solve2(data)
{
	data = data.map(x => { return parseInt(x); });
	let target = 373803594;
	let range = [];

	for(let i = 0; i < data.length; i++)
	{
		let a = data[i];
		let rangeStart = i;
		let rangeNums = [a];

		for(let j = i + 1; j < data.length; j++)
		{
			let b = data[j];

			rangeNums.push(b);

			if(rangeNums.reduce((a, b) => a + b) === target)
			{
				console.log('Range found!');
				rangeNums = rangeNums.sort((a, b) => a - b);
				console.log('Range is: ');
				console.log(rangeNums);
				console.log(`Sum of min and max is: ${rangeNums[0] + rangeNums[rangeNums.length - 1]}`)
			}
		}
	}
}

main();


//console.dir(groups, { maxArrayLength: null });