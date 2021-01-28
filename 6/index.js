import util from 'util';
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');

	let solution = solve(data);
	console.log(solution);
}

function solve(data)
{
	let groups = [[]];

	data.forEach(x => 
	{
		if(x === '')
		{
			groups.push([]);
			return;
		}

		groups[groups.length - 1].push(x);
	});

	// Part 1
	//groups = groups.map(g => g.join('').split('').filter((v, i, s) => s.indexOf(v) === i)).reduce((a, b) => a + b.length, 0);
	
	// Part 2
	groups = groups.map(g => g.map(h => h.split('')).reduce((a, b) => a.filter(c => b.includes(c))).reduce((a, b) => a + b.length, 0)).reduce((a, b) => a + b, 0);

	return groups;
}

main();