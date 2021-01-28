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

class SeatMap
{
	constructor(data)
	{
		this.map = data;
		this.lastMap = null;
		this.lastChanges = null;
	}

	GetSeat(x, y)
	{
		if(typeof this.map[y] !== 'undefined')
			if(typeof this.map[y][x] !== 'undefined')
				return this.map[y][x];
			else
				return null;
		else
			return null;
	}

	GetAdjacentOf(x, y, omitTarget = true)
	{
		if(typeof this.map[y] === 'undefined')
			return null;

		if(typeof this.map[y][x] === 'undefined')
			return null;	

		let adj = [];

		for(let my = y - 1; my <= y + 1; my++)
		{
			let row = [];

			for(let mx = x - 1; mx <= x + 1; mx++)
			{
				if((mx === x && my === y) && omitTarget)
				{
					row.push(null);
				}
				else if(typeof this.map[my] === 'undefined' || 
					typeof this.map[my][mx] === 'undefined')
				{
					row.push(null);
				}
				else
				{
					row.push(this.map[my][mx]);
				}
			}

			adj.push(row);
		}

		return adj;
	}

	GetAdjancedCounts(x, y)
	{
		if(typeof this.map[y] === 'undefined')
			return null;

		if(typeof this.map[y][x] === 'undefined')
			return null;	

		let adj = 
		{
			empty: 0,
			occupied: 0,
			floor: 0
		}

		for(let my = y - 1; my <= y + 1; my++)
		{
			for(let mx = x - 1; mx <= x + 1; mx++)
			{
				if(mx === x && my === y)
				{
					continue;
				}
				else if(typeof this.map[my] === 'undefined' || 
					typeof this.map[my][mx] === 'undefined')
				{
					continue;
				}
				else
				{
					switch(this.map[my][mx])
					{
						case 'L':
							adj.empty++;
							break;
						case '#':
							adj.occupied++;
							break;
						case '.':
							adj.floor++;
							break;
					}
				}
			}
		}

		return adj;
	}

	ScuffedRaycast(x, y, dx, dy)
	{
		var self = this;

		if(typeof this.map[y] === 'undefined')
			return null;

		if(typeof this.map[y][x] === 'undefined')
			return null;	

		let castResult = 
		{
			empty: 0,
			occupied: 0,
			floor: 0
		}

		let castDone = false;

		function Cast(x, y, dx, dy)
		{
			if(castDone)
				return;

			if(typeof self.map[y + dy] === 'undefined' || 
					typeof self.map[y + dy][x + dx] === 'undefined')
			{
				return;
			}
			else if(self.map[y + dy][x + dx] === 'L')
			{
				castResult.empty++;
			}
			else if(self.map[y + dy][x + dx] === '#')
			{
				castResult.occupied++;
			}
			else
			{
				Cast(x + dx, y + dy, dx, dy);
			}
		}

		Cast(x, y, dx, dy);

		return castResult;
	}

	Multicast(x, y)
	{
		let casts = 
		[
			this.ScuffedRaycast(x, y, -1, -1),
			this.ScuffedRaycast(x, y, 0, -1),
			this.ScuffedRaycast(x, y, 1, -1),
			this.ScuffedRaycast(x, y, 1, 0),
			this.ScuffedRaycast(x, y, 1, 1),
			this.ScuffedRaycast(x, y, 0, 1),
			this.ScuffedRaycast(x, y, -1, 1),
			this.ScuffedRaycast(x, y, -1, 0)
		]

		let total = 
		{
			empty: 0,
			occupied: 0,
			floor: 0
		}

		for(let i = 0; i < casts.length; i++)
		{
			let cast = casts[i];

			total.empty += cast.empty;
			total.occupied += cast.occupied;
			total.floor += cast.floor;
		}

		return total;
	}

	EvolveA()
	{
		this.lastMap = JSON.parse(JSON.stringify(this.map));
		let changes = 0;
		let evolvedMap = JSON.parse(JSON.stringify(this.map));

		for(let y = 0; y < this.map.length; y++)
		{
			for(let x = 0; x < this.map[y].length; x++)
			{
				let adjacentCounts = this.GetAdjancedCounts(x, y);

				if(this.map[y][x] === 'L')
				{
					if(adjacentCounts.occupied === 0)
					{
						evolvedMap[y][x] = '#';
						changes++;
					}
				}
				else if(this.map[y][x] === '#')
				{
					if(adjacentCounts.occupied >= 4)
					{
						evolvedMap[y][x] = 'L';
						changes++;
					}
				}
			}
		}

		this.map = evolvedMap;

		this.lastChanges = changes;
		return changes;
	}

	EvolveB()
	{
		this.lastMap = JSON.parse(JSON.stringify(this.map));
		let changes = 0;
		let evolvedMap = JSON.parse(JSON.stringify(this.map));

		for(let y = 0; y < this.map.length; y++)
		{
			for(let x = 0; x < this.map[y].length; x++)
			{
				let adjacentCounts = this.Multicast(x, y);

				if(this.map[y][x] === 'L')
				{
					if(adjacentCounts.occupied === 0)
					{
						evolvedMap[y][x] = '#';
						changes++;
					}
				}
				else if(this.map[y][x] === '#')
				{
					if(adjacentCounts.occupied >= 5)
					{
						evolvedMap[y][x] = 'L';
						changes++;
					}
				}
			}
		}

		this.map = evolvedMap;

		this.lastChanges = changes;
		return changes;
	}

	IsSameMaps()
	{
		let isSame = true;

		if(this.lastMap === null)
			return false;

		for(let y = 0; y < this.map.length; y++)
		{
			for(let x = 0; x < this.map[y].length; x++)
			{
				if(this.map[y][x] === this.lastMap[y][x])
				{
					continue;
				}
				else
				{
					isSame = false;
					break;
				}
			}
		}

		return isSame;
	}

	GetAllCounts()
	{
		let counts = 
		{
			empty: 0,
			occupied: 0,
			floor: 0
		}

		for(let y = 0; y < this.map.length; y++)
		{
			for(let x = 0; x < this.map[y].length; x++)
			{
				switch(this.map[y][x])
				{
					case 'L':
						counts.empty++;
						break;
					case '#':
						counts.occupied++;
						break;
					case '.':
						counts.floor++;
						break;
				}
			}
		}

		return counts;
	}

	Print()
	{
		let s = '';

		for(let y = 0; y < this.map.length; y++)
		{
			for(let x = 0; x < this.map[y].length; x++)
			{
				s += this.map[y][x];
			}

			s += '\n';
		}

		fs.writeFileSync('map.txt', s);
	}

	TestIntegrity()
	{
		console.log('-- DATA INTEGRITY TEST --');
		console.log('Test:');
		console.log(`${this.map[0][4]}${this.map[0][5]}${this.map[0][6]}`);
		console.log(`${this.map[1][4]}${this.map[1][5]}${this.map[1][6]}`);
		console.log(`${this.map[2][4]}${this.map[2][5]}${this.map[2][6]}`);
		console.log('\nReal:');
		console.log(`LLL\nL.L\nL.L`);
		console.log('-------------------------');
	}
}

function solve(data)
{
	data = data.map(x => x.split(''));
	let Seatmap = new SeatMap(data);

	let changes = Seatmap.EvolveB();

	while(changes > 0)
	{
		changes = Seatmap.EvolveB();
		console.log(Seatmap.GetAllCounts());
	}

	Seatmap.Print();
}

main();


//console.dir(groups, { maxArrayLength: null });