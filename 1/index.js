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
	data = data.map(x => parseInt(x));

	for(let i = 0; i < data.length; i++)
	{
		let v1 = data[i];

		for(let j = i + 1; j < data.length; j++)
		{
			var v2 = data[j];

			if(v1 + v2 === 2020)
				return (v1 * v2);
		}
	}
}

function solve2(data)
{
	data = data.map(x => parseInt(x));

	for(let i = 0; i < data.length; i++)
	{
		let v1 = data[i];

		for(let j = i + 1; j < data.length; j++)
		{
			var v2 = data[j];

			for(let k = j + 1; k < data.length; k++)
			{
				var v3 = data[k];

				if(v1 + v2 + v3 === 2020)
					return (v1 * v2 * v3);
			}
		}
	}
}

main();