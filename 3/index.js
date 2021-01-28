import util from 'util'
import fs from 'fs'

const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input2.txt', 'utf-8');
	data = data.split('\n');

	let solution1 = solve(data, 1, 1);
	let solution2 = solve(data, 3, 1);
	let solution3 = solve(data, 5, 1);
	let solution4 = solve(data, 7, 1);
	let solution5 = solve(data, 1, 2);

	console.log(solution1 * solution2 * solution3 * solution4 * solution5);
}

function solve(data, cx, cy)
{
	data = data.map(x => x.split(''));

	let incx = cx;
	let incy = cy;

	let trees = 0;

	for(let i = 0; i < data.length; i++)
	{
		if(typeof data[cy] !== 'undefined' && typeof data[cy][cx] !== 'undefined')
		{
			if(data[cy][cx] === '#')
			{
				trees++;
			}
		}
		else
		{
			break;
		}

		cx += incx;
		cy += incy;
	}

	return trees;
}

main();