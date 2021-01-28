import util from 'util';
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');

	let solution = solve(data);
}

function solve(data)
{
	let maskRegex = /mask = (.*)/;
	let memRegex = /mem\[(\d*)\] = (\d*)/;
	let initializationBlocks = [];
	let initializationBlock = null;

	data.forEach(x => 
	{
		if(maskRegex.exec(x) !== null)
		{
			if(initializationBlock !== null)
				initializationBlocks.push(initializationBlock);

			initializationBlock = 
			{
				mask: maskRegex.exec(x)[1],
				ops: []
			}
		}
		else if(memRegex.exec(x) !== null)
		{
			let rResult = memRegex.exec(x);
			let mem = rResult[1];
			let decVal = parseInt(rResult[2]);
			let bVal = parseInt(rResult[2]).toString(2);
			bVal = bVal.padStart(36, '0');
			initializationBlock.ops.push([mem, decVal, bVal]);
		}
		else
		{
			console.log('Nothing to parse', x);
		}
	});

	initializationBlocks.push(initializationBlock);
	//console.log(JSON.stringify(initializationBlocks));

	let mem = [];

	for(let i = 0; i < initializationBlocks.length; i++)
	{
		let block = initializationBlocks[i];
		let mask = block.mask.split('');
		let ops = block.ops;

		for(let j = 0; j < ops.length; j++)
		{
			let op = ops[j];
			let addr = op[0];
			let dec = op[1];
			let bin = op[2].split('');
			let final = [];

			for(let k = 0; k < mask.length; k++)
			{
				if(mask[k] === bin[k])
					final[k] = mask[k];
				else if(mask[k] === 'X')
					final[k] = bin[k];
				else
					final[k] = mask[k];
			}

			mem[addr] = parseInt(final.join(''), 2);
		}
	}

	mem = mem.filter(x => typeof(x) !== 'undefined')

	//console.dir(mem, { maxArrayLength: null });

	console.log(mem.reduce((a, b) => a + b));

	function getFluctuations(addr, mask)
	{
		let flucts = [];
		let fluct = [];
		let floats = [];

		for(let i = 0; i < mask.length; i++)
		{
			if(mask[i] === '0')
			{
				fluct[i] === addr[i];
			}
			else if(mask[i] === '1')
			{
				fluct[i] === '1';
			}
			else
			{
				floats.push(i);
			}
		}

		for(let i = 0; i < floats.length; i++)
		{
			let fixed_idx = floats[i];
			let perm = [...fluct];

			perm[fixed_idx] = '0';

			for(let j = 0; j < floats.length; j++)
			{
				if(floats[j] !== fixed_idx)
				{
					let subfixed_idx = floats[j];
					perm[floats[j]] = '0';

					for(let k = 0; k < floats.length; k++)
					{
						if(floats[k] !== fixed_idx && floats[k] !== subfixed_idx)
						{
							perm[floats[k]] = '0';
						}
					}

					

					perm[floats[j]] = '0';

					for(let k = 0; k < floats.length; k++)
					{
						if(floats[k] !== fixed_idx && floats[k] !== subfixed_idx)
						{
							perm[floats[k]] = '0';
						}
					}
				}
			}
		}
	}
}

main();


//console.dir(groups, { maxArrayLength: null });