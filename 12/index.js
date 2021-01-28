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
	let ship = new Ship(/([a-zA-Z]{1})(\d*)/, data, 'E', { x: 0, y: 0 }, { x: 10, y: 1 });



	//ship.ExecuteInstructions();
	//
	//console.log(ship.position);
	//console.log(ship.facing);
	//console.log(ship.ManhattanDistance());

	ship.ExecuteInstructions2();
	console.log(ship.position);
	console.log(ship.facing);
	console.log(ship.ManhattanDistance());
}

class Ship
{
	constructor(instructionParseRegex, instructionSet, initialFacing = 'E', initialPosition = { x: 0, y: 0 }, wpInitialPosition = { x: 0, y: 0 })
	{
		this.regex = instructionParseRegex;

		this.instructionSet = instructionSet.map(x => 
		{
			let match = this.regex.exec(x);
			return [match[1], parseInt(match[2])];
		});

		this.facing = initialFacing;
		this.startPosition = initialPosition;
		this.position = 
		{
			x: initialPosition.x,
			y: initialPosition.y
		}

		this.wpStartPosition = wpInitialPosition;
		this.wpPosition = 
		{
			x: wpInitialPosition.x,
			y: wpInitialPosition.y
		}
	}

	ExecuteInstructions()
	{
		for(let i = 0; i < this.instructionSet.length; i++)
		{
			let instruction = this.instructionSet[i];
			this.ProcessInstruction(instruction);
		}
	}

	ProcessInstruction(instruction)
	{
		let facings = ['N', 'E', 'S', 'W'];
		let dir = instruction[0];
		let val = instruction[1];

		switch(dir)
		{
			case 'N':
				this.position.y += val;
				break;
			case 'S':
				this.position.y -= val;
				break;
			case 'E':
				this.position.x += val;
				break;
			case 'W':
				this.position.x -= val;
				break;
			case 'L':
				var changes = val / 90;
				var i1 = facings.indexOf(this.facing);
				var i2 = (i1 - changes);
				var newFacing = facings[(i2 % facings.length + facings.length) % facings.length];
				this.facing = newFacing;
				break;
			case 'R':
				var changes = val / 90;
				var i1 = facings.indexOf(this.facing);
				var i2 = (i1 + changes);
				var newFacing = facings[(i2 % facings.length + facings.length) % facings.length];
				this.facing = newFacing;
				break;
			case 'F':
				this.ProcessInstruction([this.facing, val]);
				break;
		}
	}

	ExecuteInstructions2()
	{
		for(let i = 0; i < this.instructionSet.length; i++)
		{
			let instruction = this.instructionSet[i];
			this.ProcessInstruction2(instruction);
		}
	}

	ProcessInstruction2(instruction)
	{
		let facings = ['N', 'E', 'S', 'W'];
		let dir = instruction[0];
		let val = instruction[1];

		switch(dir)
		{
			case 'N':
				this.wpPosition.y += val;
				break;
			case 'S':
				this.wpPosition.y -= val;
				break;
			case 'E':
				this.wpPosition.x += val;
				break;
			case 'W':
				this.wpPosition.x -= val;
				break;
			case 'L':
				this.RotateWpAroundShipCCW(val);
				break;
			case 'R':
				this.RotateWpAroundShipCW(val);
				break;
			case 'F':
				this.position.x = this.position.x + this.wpPosition.x * val;
				this.position.y = this.position.y + this.wpPosition.y * val;
				break;
		}

		console.log(dir, val, this.position, this.wpPosition)
	}

	RotateWpAroundShipCW(angle)
	{
		if(angle === 0)
			return;

		var a = this.wpPosition.x;
		var b = this.wpPosition.y;
		this.wpPosition.x = b;
		this.wpPosition.y = a * -1;

		this.RotateWpAroundShipCW(angle - 90);
	}

	RotateWpAroundShipCCW(angle)
	{
		if(angle === 0)
			return;

		var a = this.wpPosition.x;
		var b = this.wpPosition.y;
		this.wpPosition.x = b * -1;
		this.wpPosition.y = a;

		this.RotateWpAroundShipCCW(angle - 90);
	}

	GetInstructionset()
	{
		return this.instructionSet;
	}

	ManhattanDistance()
	{
		return Math.abs(this.position.x) + Math.abs(this.position.y);
	}
}

main();


//console.dir(groups, { maxArrayLength: null });