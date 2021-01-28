import util from 'util';
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

async function main()
{
	let data = await readFile('input.txt', 'utf-8');
	data = data.split('\n');

	let solution = solve(data);
	//console.log(solution);
}

function solve(data)
{
	let fieldRows = data.slice(0, 20);
	let myTicketRow = data.slice(22, 23)[0];
	let nearbyTicketRows = data.slice(25);
	let myTicket = myTicketRow.split(',');

	let fields = [];
	let fieldRegex = /(.*): (\d*)-(\d*) or (\d*)-(\d*)/;

	let nearbyTickets = [];

	fieldRows.forEach(x => 
	{
		let match = fieldRegex.exec(x);

		fields.push(
		{
			field: match[1],
			min1: parseInt(match[2]),
			max1: parseInt(match[3]),
			min2: parseInt(match[4]),
			max2: parseInt(match[5])
		});
	});

	nearbyTicketRows.forEach(x =>
	{
		nearbyTickets.push(x.split(','))
	});

	let invalids = [];

	for(let i = 0; i < nearbyTickets.length; i++)
	{
		for(let j = 0; j < nearbyTickets[i].length; j++)
		{
			let ticket = parseInt(nearbyTickets[i][j]);
			let valid = false;

			for(var k = 0; k < fields.length; k++)
			{
				let fieldMin1 = parseInt(fields[k].min1);
				let fieldMax1 = parseInt(fields[k].max1);
				let fieldMin2 = parseInt(fields[k].min2);
				let fieldMax2 = parseInt(fields[k].max2);

				if(ticket >= fieldMin1 && ticket <= fieldMax1)
				{
					valid = true;
					break;
				}
				else if(ticket >= fieldMin2 && ticket <= fieldMax2)
				{
					valid = true;
					break;
				}
			}

			if(!valid)
				invalids.push(i);
		}
	}

	invalids.forEach(x => 
	{
		nearbyTickets.splice(x, 1);
	});

	console.log(nearbyTickets.length)

	for(let t = 0; t < fields.length; t++)
	{
		let field = fields[t];

		for(let x = 0; x < 20; x++)
		{
			let validForThisX = true;

			for(let y = 0; y < nearbyTickets.length; y++)
			{
				let currentTicket = parseInt(nearbyTickets[y][x]);

				if(currentTicket >= field.min1 && currentTicket <= field.max1)
				{
					validForThisX = true;
				}
				else
				{
					validForThisX = false;
					break;
				}

				if(currentTicket >= field.min2 && currentTicket <= field.max2)
				{
					validForThisX = true;
				}
				else
				{
					validForThisX = false;
					break;
				}
			}

			if(validForThisX)
			{
				fields[t].idx = x;
				break;
			}
		}
	}

	console.dir(fields, { maxArrayLength: null });
}

main();


//console.dir(groups, { maxArrayLength: null });