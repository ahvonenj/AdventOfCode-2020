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
	let foods = FoodBuilder.BuildFoods(data);
	let allAllergens = [...new Set(foods.map(x => x.allergens).flat(1))]

	//console.log(allAllergens);

	foods.forEach(f => f.CalculateAllergenProbabilitiesForIngredients(allAllergens));

	// Bundle up individual probabilities
	let probabilities = foods.map(f => f.probabilityMapping);

	// Calculate total probabilities
	let totals = { };
	probabilities.forEach(ingredientProbabilities =>
	{
		for(let ingredient in ingredientProbabilities)
		{
			let allergens = ingredientProbabilities[ingredient];

			if(!(ingredient in totals))
			{
				totals[ingredient] = {};

				for(let allergen in allergens)
				{
					totals[ingredient][allergen] = allergens[allergen]
				}
			}
			else
			{
				for(let allergen in allergens)
				{
					if(!(allergen in totals[ingredient]))
						totals[ingredient][allergen] = allergens[allergen]
					else
						totals[ingredient][allergen] += allergens[allergen];
				}
			}
		}
	})

	let highests_tot = {};

	for(let ingredient1 in totals)
	{
		let allergens = totals[ingredient1];
		let highests = [];

		for(let allergen1 in allergens)
		{
			let p1 = allergens[allergen1];
			let isHighest = true;

			for(let ingredient2 in totals)
			{
				if(totals[ingredient2][allergen1] > p1)
				{
					isHighest = false;
					break;
				}
			}

			if(isHighest)
			{
				highests.push(allergen1);
			}
		}

		highests_tot[ingredient1] = highests;
	}

	let unprobables = {};

	for(let ingredient in highests_tot)
	{
		if(highests_tot[ingredient].length === 0)
			unprobables[ingredient] = 0;
	}

	let allIngredients = foods.map(x => x.ingredients.map(y => y.sig)).flat(1);

	allIngredients.forEach(x => 
	{
		if(x in unprobables)
			unprobables[x]++;
	})

	//console.log(Object.values(unprobables).reduce((a, b) => a + b));

	let filtered_highests = {};

	for(let ingredient in highests_tot)
	{
		if(highests_tot[ingredient].length > 0)
			filtered_highests[ingredient] = highests_tot[ingredient];
	}

	let filtered_totals = { };

	for(let ingredient in filtered_highests)
	{
		let tots = totals[ingredient];

		filtered_totals[ingredient] = {};

		filtered_highests[ingredient].forEach(x =>
		{
			if(x in tots)
			{
				
				filtered_totals[ingredient][x] = tots[x];
			}
		});
	}

	console.log(filtered_totals)


	// part2 ntft,nhx,kfxr,xmhsbd,rrjb,xzhxj,chbtp,cqvc
}

class Ingredient
{
	constructor(signature)
	{
		this.sig = signature;
	}
}

class Food
{
	constructor(id, ingredients, allergens)
	{
		this.id = id;
		this.ingredients = ingredients;
		this.allergens = allergens;

		this.probabilityMapping = { };
	}

	CalculateAllergenProbabilitiesForIngredients(allAllergens)
	{
		let denominator = this.ingredients.length;
		let strAllergens = this.allergens.map(a => a.name);

		for(let i = 0; i < this.ingredients.length; i++)
		{
			let ingredient = this.ingredients[i];
			let probabilities = { };

			for(let j = 0; j < allAllergens.length; j++)
			{
				let allergen = allAllergens[j];

				if(strAllergens.includes(allergen.name))
					probabilities[allergen.name] = 1 / denominator;
				else
					probabilities[allergen.name] = 0;
			}

			this.probabilityMapping[ingredient.sig] = probabilities;
		}
	}
}

class FoodBuilder
{
	static BuildFoods(data)
	{
		let i = 0;
		let foods = [];

		data.forEach(row => 
		{
			let ingredientsStr = row.substring(0, row.indexOf('(') - 1)
			let allergensStr = row.substring(row.indexOf('(contains') + 10, row.indexOf(')'));

			let rawIngredients = ingredientsStr.split(' ');
			let rawAllergens = allergensStr.split(', ');

			let ingredients = rawIngredients.map(x => new Ingredient(x))
			let allergens = rawAllergens.map(x => new Allergen(x))

			foods.push(new Food(i, ingredients, allergens));

			i++;
		});

		return foods;
	}
}

class Allergen
{
	constructor(name)
	{
		this.name = name;
	}
}

main();


//console.dir(groups, { maxArrayLength: null });