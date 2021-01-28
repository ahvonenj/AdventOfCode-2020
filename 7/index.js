import util from 'util';
import fs from 'fs'
import traverse from 'traverse'
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
	let initialRegex = /([a-z ]*) bags contain (.*)/i;
	let regex1 = /(\d{1}) ([a-z ]*) bags{0,1}/i;
	let stage1 = [];
	let stage2 = {};

	// Top level bag collection
	data.forEach(x => 
	{
		let m = initialRegex.exec(x);

		stage1.push([m[1], m[2].slice(0, -1).split(', ')]);
	});

	// Process sub-bags under top level bags
	stage1.forEach(x =>
	{
		let bags;

		if(x[1].length === 1 && x[1][0] === 'no other bags')
		{
			bags = null;
		}
		else
		{
			bags = { };

			x[1].forEach(y =>
			{
				let m = regex1.exec(y);

				bags[m[2]] = m[1];
			});
		}

		stage2[x[0]] = bags;
	});

	let topLevelGoldOriginal = JSON.parse(JSON.stringify(stage2['shiny gold']));
	let topLevelGold = JSON.parse(JSON.stringify(stage2['shiny gold']));
	let bagsArray = [];

	traverse(topLevelGold).forEach(function(x)
	{
		if(this.isLeaf)
		{
			bagsArray.push([this.key, (x === null ? 1 : parseInt(x)), this.level])
			this.update(stage2[this.key])
		}
	});

	/*bagsArray = 
	[
		[null, 2, 1],
		[null, 2, 2],
		[null, 2, 3],
		[null, 2, 4],
		[null, 2, 5],
		[null, 2, 6], 
		[null, 1, 7]
	]*/

	/*let bagsTotal = 0;

	for(let i = 0; i < pathArray.length; i++)
	{
		let path = pathArray[i][0];
		let bags = pathArray[i][1];

		let n = traverse(topLevelGold).get(path);

		console.log(n)
	}*/

	let prevLevel = 0;
	let calc = 0;
	let lastBags = 0;

	bagsArray.forEach(function(x)
	{
		let bags = x[1];
		let currentLevel = x[2];

		if(bags === 1)
			return;

		if(currentLevel > prevLevel)
		{
			if(lastBags > 0)
			{
				lastBags *= bags;
				calc = calc + lastBags;
				
			}
			else
			{
				calc += bags;
				lastBags = bags;
			}
		}
		else if(currentLevel === prevLevel)
		{
			calc = calc + lastBags;
		}
		else if(currentLevel < prevLevel)
		{
			calc += bags;
			lastBags = 0;
		}

		prevLevel = currentLevel;
		
	});

	console.log(calc)

	/*let canContainGoldBag = 0;

	for(let topLevelBag in stage2)
	{
		let hasGold = traverse(stage2[topLevelBag]).reduce(function(acc, x)
		{
			if(this.key === 'shiny gold')
				acc++;
			return acc;
		}, 0);

		if(hasGold > 0)
			canContainGoldBag++;
	}

	console.log(canContainGoldBag);*/

	/*let golds = traverse(stage2).reduce(function(a, x)
	{
		if(this.key === 'shiny gold')
			a += 1;
		return a;
	}, 0);

	console.log(golds)*/

	//let topLevelGoldBag = stage2['shiny gold'];

	//traverse(topLevelGoldBag).reduce

	//console.dir(stage2, { maxArrayLength: null });
	//console.log(util.inspect(topLevelGold, {showHidden: false, depth: null}))
	//console.log(util.inspect(topLevelGoldOriginal, {showHidden: false, depth: null}))
}

main();