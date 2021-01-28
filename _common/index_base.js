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
	return data;
}

main();


//console.dir(groups, { maxArrayLength: null });