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
	function FBLR(token, range)
	{
		if(Math.abs(range[0] - range[1]) === 1)
		{
			switch(token)
			{
				case 'F':
				case 'L':
					return range[0];
					break;
				case 'B':
				case 'R':
					return range[1];
					break;
			}
		}
		else
		{
			switch(token)
			{
				case 'F':
				case 'L':
					return [range[0], Math.floor((range[0] + range[1]) / 2)]
					break;
				case 'B':
				case 'R':
					return [Math.ceil((range[0] + range[1]) / 2), range[1]]
					break;
			}
		}
	}

	let result = data.map(d => d.split('')).map(d => { return (d.slice(0, -3).reduce((a, b) => { return FBLR(b, a) }, [0, 127]) * 8) + d.slice(-3).reduce((a, b) => { return FBLR(b, a) }, [0, 7]) });

	// Part 2
	result = result.sort((a, b) => a - b);

	let s = 0;
	let f = null;

	result.forEach(x => 
	{
		if(s === 0)
		{
			s = x;
			return;
		}

		if(x - s !== 1)
			f = x - 1;

		s = x;
	});

	return f;
}

main();