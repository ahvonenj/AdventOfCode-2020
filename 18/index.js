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
	//let tokens = Tokenizer.Tokenize(data[1]);
	//console.log(tokens)

	//let expression = Tokenizer.ShuntingYard(tokens);
	//console.log(expression)

	//console.log(`Original Expression: ${data[1]}`)
	//console.log(`Precedence aware: ${expression.Print()}`);
	//expression.Evaluate()
	//console.log(`Evaluated: ${expression.Evaluate()}`);

	let sum = 0;

	for(var i = 0; i < data.length; i++)
	{
		let expressionString = data[i];
		let tokens = Tokenizer.Tokenize(expressionString);
		let expression = Tokenizer.ShuntingYard(tokens);
		let evaluation = expression.Evaluate();

		console.log(`${expressionString.replace(/\s/g, '')} -> ${expression.Print()} = ${evaluation}\n`);

		sum += evaluation;
	}

	console.log(`Sum is: ${sum}`);
}

const TokenType =
{
	NUMBER: 0,
	ADD: 1,
	MULT: 2,
	OPEN_PAR: 3,
	CLOSE_PAR: 4
}

class Token
{
	constructor(token, left, right)
	{
		this.token = token;
		this.left = left || null;
		this.right = right || null;
		this.type = null;

		switch(token)
		{
			case '+':
				this.type = TokenType.ADD;
				break;

			case '*':
				this.type = TokenType.MULT;
				break;

			case '(':
				this.type = TokenType.OPEN_PAR;
				break;

			case ')':
				this.type = TokenType.CLOSE_PAR;
				break;

			default:
				this.type = TokenType.NUMBER;
				break;
		}
	}
}

class ExpressionOperator
{
	constructor(type, left, right)
	{
		this.type = type;
		this.left = left;
		this.right = right;
	}
}

class ExpressionConstant
{
	constructor(v)
	{
		this.type = TokenType.NUMBER;
		this.value = v;
	}
}

class Expression
{
	constructor(rootToken)
	{
		this.root = rootToken;
	}

	Print()
	{
		return p(this.root);

		function p(expr)
		{
			switch(expr.type)
			{
				case TokenType.NUMBER:
					return expr.value;
				break;

				case TokenType.ADD:
					return '(' + p(expr.left) + '+' + p(expr.right) + ')';
				break;

				case TokenType.MULT:
					return '(' + p(expr.left) + '*' + p(expr.right) + ')';
				break;
			}
		}

		
	}

	Evaluate()
	{
		return ev(this.root);

		function ev(expr)
		{
			let left = expr.left;
			let right = expr.right;

			switch(expr.type)
			{
				case TokenType.NUMBER:
					return expr.value;
				break;

				case TokenType.ADD:
					return ev(left) + ev(right)
				break;

				case TokenType.MULT:
					return ev(left) * ev(right)
				break;
			}
		}
	}
}

class Tokenizer
{
	static Tokenize(stringExpression)
	{
		let expArr = stringExpression.replace(/\s/g, '').split('');

		let tokens = [];

		for(let i = 0; i < expArr.length; i++)
		{
			let c = expArr[i];
			tokens.push(new Token(c, null, null));
		}

		return tokens;
	}

	static ShuntingYard(tokens)
	{
		let precedence = { };
		precedence[TokenType.ADD] = 2;
		precedence[TokenType.MULT] = 1;

		let operators = [];
		let operands = [];

		for(var i = 0; i < tokens.length; i++)
		{
			let token = tokens[i];
			let type = token.type;

			switch(type)
			{
				case TokenType.NUMBER:
					operands.push(new ExpressionConstant(parseInt(token.token)));
					break;

				case TokenType.ADD:
				case TokenType.MULT:
					while(operators.length > 0 && precedence[operators[operators.length - 1].type] >= precedence[token.type])
					{
						var right = operands.pop();
						var left = operands.pop();
						operands.push(new ExpressionOperator(operators.pop().type, left, right));
					}
					operators.push(token);
					break;

				case TokenType.OPEN_PAR:
					operators.push(token);
					break;

				case TokenType.CLOSE_PAR:
					while(operators[operators.length - 1].type !== TokenType.OPEN_PAR)
					{
						var right = operands.pop();
						var left = operands.pop();
						operands.push(new ExpressionOperator(operators.pop().type, left, right));
					}
					operators.pop();
					break;
			}
		}

		while(operators.length > 0)
		{
			var right = operands.pop();
			var left = operands.pop();
			operands.push(new ExpressionOperator(operators.pop().type, left, right));
		}

		return new Expression(operands[0]);
	}
}

main();


//console.dir(groups, { maxArrayLength: null });