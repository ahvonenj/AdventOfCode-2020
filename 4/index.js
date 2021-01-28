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
	let regex = /([a-z]{3}):([a-zA-Z0-9\#]*)/i;

	const check = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

	let groups = [[]];

	data.forEach(x => 
	{
		if(x === '')
		{
			groups.push([]);
			return;
		}

		let y = x.split(' ');

		y.forEach(z => 
		{
			let match = regex.exec(z);
			groups[groups.length - 1].push({ code: match[1], value: match[2] });
		})
	});

	groups = groups.map(g => g.reduce((obj, item) => Object.assign(obj, { [item.code]: item.value }), { }));

	let validcount = groups.filter(g => check.every(k => Object.keys(g).includes(k)));

	validcount = validcount.filter(g => 
	{
		let conds = 
		[
			(g.byr >= 1920 && g.byr <= 2002),
			(g.iyr >= 2010 && g.iyr <= 2020),
			(g.eyr >= 2020 && g.eyr <= 2030),
			(g.hgt.indexOf('cm') > -1 ? (parseInt(g.hgt) >= 150 && parseInt(g.hgt) <= 193) : (parseInt(g.hgt) >= 59 && parseInt(g.hgt) <= 76)),
			(g.hcl.match(/\#[0-9a-z]{6}/) !== null),
			(g.ecl.match(/(?:amb|blu|brn|gry|grn|hzl|oth)/) !== null),
			(g.pid.match(/\d{9}/) !== null && g.pid.length === 9)
		];

		return !conds.includes(false);
	});

	return validcount.length;
}

main();