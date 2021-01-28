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
	let myTime = parseInt(data[0]);

	// Solution 1
	//let initialBuses1 = data[1].split(',').filter(x => x !== 'x').map(x => { return parseInt(x); });
	//let busStation1 = new BusStation(initialBuses1.map(x => new Bus(x)));
	//busStation1.CalcDistanceMyTime(myTime);
	//console.log(busStation1.GetSolution1())

	// Solution 2
	let initialBuses2 = data[1].split(',').map(x => 
	{
		if(x === 'x')
			return x;
		else
			return parseInt(x);
	});

	let size = initialBuses2.filter(x => x !== 'x').length;

	let busStation2 = new BusStation(9);
	//let initialT = initialBuses2.find(x => Number.isInteger(x));
	let i = 0;

	initialBuses2.forEach(x => 
	{
		if(x === 'x')
		{
			i++;
			return;
		}
		else
		{
			busStation2.AddBus(new Bus(x, i));
			i++;
		}
	});

	console.log(busStation2.GetOrderedBuses('OFFSET'));

	busStation2.GetSolution2();
}

class Bus
{
	constructor(id, offset = 0)
	{
		this.id = id;
		this.timeDist = 0;
		this.offset = offset;
	}
}

class BusStation
{
	constructor(size)
	{
		this.buses = new Array(size);
	}

	AddBus(bus)
	{
		this.buses.push(bus);
	}

	GetOrderedBuses(orderType = 'ID')
	{
		switch(orderType)
		{
			case 'ID':
				return this.buses.sort((a, b) => a.id - b.id);
				break;
			case 'OFFSET':
				return this.buses.sort((a, b) => a.offset - b.offset);
				break;
		}
	}

	CalcDistanceMyTime(myTime)
	{
		this.buses.forEach(x =>
		{
			x.timeDist = x.id - (myTime % x.id);
		});
	}

	GetSolution1()
	{
		let bus = null;

		this.buses.forEach(x =>
		{
			if(bus === null || x.timeDist < bus.timeDist)
				bus = x;
		});

		return bus.id * bus.timeDist;
	}

	GetSolution2()
	{
		let buses = this.GetOrderedBuses('OFFSET');
		let anchorBus = buses[0];
		let lastBus = buses[buses.length - 1];
		let highestOffset = lastBus.offset;

		console.log(buses)

		console.log('--- LOOKING FOR SET 1 ---');

		let setFound = false;
		let time = 0;

		while(!setFound)
		{
			let magicNumbers = [1];

			if(time % anchorBus.id === 0 && 
				(time + lastBus.offset) % lastBus.id === 0)
			{
				let subsetFound = true;

				for(var i = 1; i < buses.length; i++)
				{
					if((time + buses[i].offset) % buses[i].id !== 0)
					{
						subsetFound = false;
						//break;
					}
					else
					{
						magicNumbers.push(buses[i].id);
					}
				}

				if(subsetFound)
				{
					console.log(`Found @ ${time}`)
					setFound = true
				}
				
			}

			//if(magicNumbers.length > 1)
				//console.log(time, magicNumbers, magicNumbers.reduce((a, b) => a * b))

			time += magicNumbers.reduce((a, b) => a * b);
		}
	}
}

main();


//console.dir(groups, { maxArrayLength: null });