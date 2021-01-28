import util from 'util';
import fs from 'fs';
const readFile = util.promisify(fs.readFile);
import md5 from 'js-md5';

async function main()
{
	let solution = solve();
}

function solve()
{
	const player1Cards = [38, 1, 28, 32, 43, 21, 42, 29, 18, 13, 39, 41, 49, 31, 19, 26, 27, 40, 35, 14, 3, 36, 12, 16, 45];
	const player2Cards = [34, 15, 47, 20, 23, 2, 11, 9, 8, 7, 25, 50, 48, 24, 46, 44, 10, 6, 22, 5, 33, 30, 4, 17, 37];

	//const player1Cards = [9, 2, 6, 3, 1];
	//const player2Cards = [5, 8, 4, 7, 10];

	//const player1Cards = [43, 19];
	//const player2Cards = [2, 29, 14];

	function Game(p1Cards, p2Cards, p1Previous = [], p2Previous = [])
	{
		while(p1Cards.length > 0 && p2Cards.length > 0)
		{
			let p1CardHash = md5(p1Cards);
			let p2CardHash = md5(p2Cards);

			if(p1Previous.includes(p1CardHash) && p2Previous.includes(p2CardHash))
				return [1, p1Cards];

			p1Previous.push(p1CardHash);
			p2Previous.push(p2CardHash);

			let player1Card = p1Cards.shift();
			let player2Card = p2Cards.shift();

			if(p1Cards.length >= player1Card && p2Cards.length >= player2Card)
			{
				let winner = Game(p1Cards.slice(0, player1Card), p2Cards.slice(0, player2Card));

				if(winner[0] === 1)
				{
					p1Cards.push(player1Card);
					p1Cards.push(player2Card);
				}
				else
				{
					p2Cards.push(player2Card);
					p2Cards.push(player1Card);
				}
			}
			else
			{
				if(player1Card > player2Card)
				{
					p1Cards.push(player1Card);
					p1Cards.push(player2Card);
				}
				else
				{
					p2Cards.push(player2Card);
					p2Cards.push(player1Card);
				}
			}
		}

		if(p2Cards.length === 0)
			return [1, p1Cards];
		else
			return [2, p2Cards];
	}

	let winner = Game(player1Cards, player2Cards);

	console.log(`Winner: ${winner[1]}`);
	console.log(`Sum: ${winner[1].reverse().reduce((a, b, i) => a + b * (i + 1))}`);
}

main();


//console.dir(groups, { maxArrayLength: null });