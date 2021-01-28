import util from 'util';
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');

	let solution = solve2(data.map(x => { return parseInt(x); }));
	console.log(solution);
}

function solve(data)
{
	data = data.sort((a, b) => a - b);

	let currentJoltRating = 0;
	let oneDiffs = 0;
	let twoDiffs = 0;
	let threeDiffs = 0;

	console.log(data)

	for(let i = 0; i < data.length; i++)
	{
		let nextJoltage = getNextJoltageIndex(data, currentJoltRating, 1);

		
		if(nextJoltage === null)
			break;

		switch(nextJoltage[1])
		{
			case 1:
				oneDiffs++;
				break;

			case 2:
				twoDiffs++;
				break;

			case 3:
				threeDiffs++;
				break;
		}

		currentJoltRating += nextJoltage[1];
		data[nextJoltage[0]] = -9999;
	}

	threeDiffs++;

	console.log(`oneDiffs: ${oneDiffs}, twoDiffs: ${twoDiffs}, threeDiffs: ${threeDiffs}`)

	function getNextJoltageIndex(jolts, currentJoltRating, diffToFind)
	{
		let index = null;

		if(diffToFind > 3)
			return null;

		for(let i = 0; i < jolts.length; i++)
		{
			let jolt = jolts[i];

			if(Math.abs(jolt - currentJoltRating) === diffToFind)
			{
				index = i;
				break;
			}
		}

		if(index === null)
			return getNextJoltageIndex(jolts, currentJoltRating, diffToFind + 1);
		else
			return [index, diffToFind];
	}
}

function solve(data)
{
	data = data.sort((a, b) => a - b);

	let currentJoltRating = 0;

	function treeJolts(data, joltRating, diff)
	{
		
	}

	for(let i = 0; i < data.length; i++)
	{
		let nextJoltage = getNextJoltageIndex(data, currentJoltRating, 1);

		
		if(nextJoltage === null)
			break;

		switch(nextJoltage[1])
		{
			case 1:
				oneDiffs++;
				break;

			case 2:
				twoDiffs++;
				break;

			case 3:
				threeDiffs++;
				break;
		}

		currentJoltRating += nextJoltage[1];
		data[nextJoltage[0]] = -9999;
	}

	function getNextJoltageIndex(jolts, currentJoltRating, diffToFind)
	{
		let index = null;

		for(let i = 0; i < jolts.length; i++)
		{
			let jolt = jolts[i];

			if(Math.abs(jolt - currentJoltRating) === diffToFind)
			{
				index = i;
				break;
			}
		}

		if(index === null)
			return null;
		else
			return [index, diffToFind];
	}
}

main();


//console.dir(groups, { maxArrayLength: null });