import util from 'util';
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');
	const procData = data.map(x => [x.slice(0, 3), parseInt(x.slice(4, x.length))]);


	for(let i = 0; i < data.length; i++)
	{
		let currentProg = JSON.parse(JSON.stringify(procData));

		if(currentProg[i][0] === 'jmp')
		{
			currentProg[i][0] = 'nop';
		}
		else if(currentProg[i][1] === 'nop')
		{
			currentProg[i][0] = 'jmp';
		}
		else
		{
			continue;
		}

		let solution = solve(currentProg);
		
		if(solution[0] === 0)
		{
			console.log(solution[0], solution[1])
		}
	}
}

function solve(data)
{
	let halt = 1;
	let idx = 0;
	let acc = 0;
	let burntIdx = [];

	function execute(op, value)
	{
		switch(op)
		{
			case 'jmp':
				idx += value;
				break;
			case 'acc':
				acc += value;
				idx++;
				break;

			case 'nop':
				idx++;
				break;
		}
	}

	while(halt > 0)
	{
		if(idx > data.length - 1)
		{
			halt = 0;
			break;
		}

		let curOp = data[idx][0];
		let curVal = data[idx][1];

		if(burntIdx.includes(idx))
		{
			halt = -1;
		}

		burntIdx.push(idx);
		execute(curOp, curVal);
	}

	return [halt, acc];
}

main();


//console.dir(groups, { maxArrayLength: null });