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
	data = data.map(x => x.split(''));

	let space = new Space();
	space.ParsePlane(data);

	console.time('Update 1');
	space.Update();
	console.timeEnd('Update 1');

	console.time('Update 2');
	space.Update();
	console.timeEnd('Update 2');

	console.time('Update 3');
	space.Update();
	console.timeEnd('Update 3');

	console.time('Update 4');
	space.Update();
	console.timeEnd('Update 4');

	console.time('Update 5');
	space.Update();
	console.timeEnd('Update 5');

	console.time('Update 6');
	space.Update();
	console.timeEnd('Update 6');


	const itr = space._space[Symbol.iterator]();
	let active = 0;

	for(const spaceItem of itr)
	{
		if(spaceItem[1].state)
			active++;
	}

	console.log(active)
}

class Space
{
	constructor()
	{
		this._space = new Map();
		this.spaceSize = 25;
		this.spaceSize2 = 10;
	}

	ParsePlane(plane)
	{
		for(let y = -this.spaceSize; y < this.spaceSize; y++)
		{
			for(let x = -this.spaceSize; x < this.spaceSize; x++)
			{
				for(let z = -this.spaceSize2; z < this.spaceSize2; z++)
				{
					for(let w = -this.spaceSize2; w < this.spaceSize2; w++)
					{
						if(typeof plane[y] !== 'undefined' && typeof plane[y][x] !== 'undefined' && z === 0 && w === 0)
						{
							this._space.set(`${x}|${y}|0|0`, new Cube(new Point(x, y, 0, 0), plane[y][x]));
						}
						else
						{
							this._space.set(`${x}|${y}|${z}|${w}`, new Cube(new Point(x, y, z, w), false));
						}
					}
				}
			}
		}
	}

	HashCoordinates(p)
	{
		return `${p.x}|${p.y}|${p.z}|${p.w}`;
	}

	Update()
	{
		var self = this;

		const itr = this._space[Symbol.iterator]();
		let newSpace = new Map();

		for(const spaceItem of itr)
		{
			let cube = spaceItem[1];
			let neighbors = cube.GetNeighborPoints();
			let activeNeighbors = 0;

			neighbors.forEach(n => 
			{
				let cube = self.GetCube(n.x, n.y, n.z, n.w);

				if(cube && cube.state)
					activeNeighbors++;
			});

			if(cube.state)
			{
				if(activeNeighbors === 2 || activeNeighbors === 3)
				{
					newSpace.set(
						self.HashCoordinates(cube.pos), 
						new Cube(cube.pos, true)
					);
				}
				else
				{
					newSpace.set(
						self.HashCoordinates(cube.pos), 
						new Cube(cube.pos, false)
					);
				}
			}
			else
			{
				if(activeNeighbors === 3)
				{
					newSpace.set(
						self.HashCoordinates(cube.pos), 
						new Cube(cube.pos, true)
					);
				}
				else
				{
					newSpace.set(
						self.HashCoordinates(cube.pos), 
						new Cube(cube.pos, false)
					);
				}
			}
		}

		this._space = newSpace;
	}

	GetCube(x, y, z, w)
	{
		let mapHash = this.HashCoordinates(new Point(x, y, z, w));

		if(this._space.has(mapHash))
			return this._space.get(mapHash);
		else
			return null;
	}
}

class Cube
{
	constructor(pos, state = true)
	{
		if(pos instanceof Point)
			this.pos = pos;
		else
			console.error('Cube position not instanceof Point!');
		
		if(state === '#' || state === true)
			this.state = true;
		else if(state === '.' || state === false)
			this.state = false;
		else
			console.error(`Invalid state ${state} for cube!`);
	}

	GetNeighborPoints(excludeSelf = true)
	{
		const pointMask = 
		[
			new Point(-1, -1, -1, -1),
			new Point(0, -1, -1, -1),
			new Point(1, -1, -1, -1),
			new Point(-1, -1, -1, 0),
			new Point(0, -1, -1, 0),
			new Point(1, -1, -1, 0),
			new Point(-1, -1, -1, 1),
			new Point(0, -1, -1, 1),
			new Point(1, -1, -1, 1),
			new Point(-1, 0, -1, -1),
			new Point(0, 0, -1, -1),
			new Point(1, 0, -1, -1),
			new Point(-1, 0, -1, 0),
			new Point(0, 0, -1, 0),
			new Point(1, 0, -1, 0),
			new Point(-1, 0, -1, 1),
			new Point(0, 0, -1, 1),
			new Point(1, 0, -1, 1),
			new Point(-1, 1, -1, -1),
			new Point(0, 1, -1, -1),
			new Point(1, 1, -1, -1),
			new Point(-1, 1, -1, 0),
			new Point(0, 1, -1, 0),
			new Point(1, 1, -1, 0),
			new Point(-1, 1, -1, 1),
			new Point(0, 1, -1, 1),
			new Point(1, 1, -1, 1),
			new Point(-1, -1, 0, -1),
			new Point(0, -1, 0, -1),
			new Point(1, -1, 0, -1),
			new Point(-1, -1, 0, 0),
			new Point(0, -1, 0, 0),
			new Point(1, -1, 0, 0),
			new Point(-1, -1, 0, 1),
			new Point(0, -1, 0, 1),
			new Point(1, -1, 0, 1),
			new Point(-1, 0, 0, -1),
			new Point(0, 0, 0, -1),
			new Point(1, 0, 0, -1),
			new Point(-1, 0, 0, 0),
			new Point(1, 0, 0, 0),
			new Point(-1, 0, 0, 1),
			new Point(0, 0, 0, 1),
			new Point(1, 0, 0, 1),
			new Point(-1, 1, 0, -1),
			new Point(0, 1, 0, -1),
			new Point(1, 1, 0, -1),
			new Point(-1, 1, 0, 0),
			new Point(0, 1, 0, 0),
			new Point(1, 1, 0, 0),
			new Point(-1, 1, 0, 1),
			new Point(0, 1, 0, 1),
			new Point(1, 1, 0, 1),
			new Point(-1, -1, 1, -1),
			new Point(0, -1, 1, -1),
			new Point(1, -1, 1, -1),
			new Point(-1, -1, 1, 0),
			new Point(0, -1, 1, 0),
			new Point(1, -1, 1, 0),
			new Point(-1, -1, 1, 1),
			new Point(0, -1, 1, 1),
			new Point(1, -1, 1, 1),
			new Point(-1, 0, 1, -1),
			new Point(0, 0, 1, -1),
			new Point(1, 0, 1, -1),
			new Point(-1, 0, 1, 0),
			new Point(0, 0, 1, 0),
			new Point(1, 0, 1, 0),
			new Point(-1, 0, 1, 1),
			new Point(0, 0, 1, 1),
			new Point(1, 0, 1, 1),
			new Point(-1, 1, 1, -1),
			new Point(0, 1, 1, -1),
			new Point(1, 1, 1, -1),
			new Point(-1, 1, 1, 0),
			new Point(0, 1, 1, 0),
			new Point(1, 1, 1, 0),
			new Point(-1, 1, 1, 1),
			new Point(0, 1, 1, 1),
			new Point(1, 1, 1, 1)
		];

		if(!excludeSelf)
		{
			pointMask.push(new Point(0, 0, 0, 0));
		}

		let neighbors = [];

		pointMask.forEach(x => 
		{
			neighbors.push(this.pos.Add(x));
		});

		return neighbors;
	}
}

class Point
{
	constructor(x, y, z, w)
	{
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.z = parseInt(z);
		this.w = parseInt(w);
	}

	Add(p2)
	{
		return new Point(this.x + p2.x, this.y + p2.y, this.z + p2.z, this.w + p2.w);
	}
}

main();







//console.dir(groups, { maxArrayLength: null });