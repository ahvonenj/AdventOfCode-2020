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
	let rawImages = CameraImageParser.ParseImages(data);

	let cameraImageFragments = rawImages.map(x => 
	{
		return new CameraImageFragment(x[0], x[1]);
	});

	console.log('Frags: ' + cameraImageFragments.length);
	console.log('Side length: ' + Math.sqrt(cameraImageFragments.length));
	console.log('Perimeter: ' + 4 * Math.sqrt(cameraImageFragments.length));

	let cameraImage = new CameraImage(cameraImageFragments);
	
	cameraImage.SeparateFragments();
	cameraImage.ConstructImage3();


}

class CameraImageParser
{
	static ParseImages(data)
	{
		let rawImages = [];
		let rawImage = [];
		let rawImageId = null;

		data.forEach(row => 
		{
			if(row.indexOf('Tile') > -1)
			{
				rawImageId = /Tile (\d*):/.exec(row)[1];
			}
			else if(row.length === 0)
			{
				rawImages.push([parseInt(rawImageId), rawImage]);
				rawImage = [];
				rawImageId = null;
			}
			else
			{
				rawImage.push(row.split(''));
			}
		});

		rawImages.push([rawImageId, rawImage]);

		return rawImages;
	}
}

class CameraImage
{
	constructor(imageFragments)
	{
		this.imageFragments = imageFragments;
		this.fullImage = new Map2D();

		this.cornerFragments = [];
		this.sideFragments = [];
		this.innerFragments = [];

		this.separationDone = false;
	}

	NumConfs(f1)
	{
		let frags = this.imageFragments;
		let confsFound = 0;

		for(let j = 0; j < frags.length; j++)
		{
			let f2 = frags[j];

			if(f1.id === f2.id)
				continue;

			let test = f1.TestConfigurations(f2);

			if(test !== false)
			{
				confsFound++;
			}
		}

		return confsFound;
	}

	FindFragment(id)
	{
		for(let i = 0; i < this.imageFragments.length; i++)
		{
			if(this.imageFragments[i].id === id)
				return this.imageFragments[i];
		}

		return null;
	}

	SeparateFragments()
	{
		var self = this;
		let frags = this.imageFragments;
		let confs = [];

		frags.forEach(x =>
		{
			let n = self.NumConfs(x);

			switch(n)
			{
				case 2:
					self.cornerFragments.push(x);
					break;
				case 3:
					self.sideFragments.push(x);
					break;
				case 4:
					self.innerFragments.push(x);
					break;
				default:
					console.error('Num confs does not make sense!')
					break;
			}
		});

		this.separationDone = true;
		console.log(self.cornerFragments.length);
		console.log(self.sideFragments.length);
		console.log(self.innerFragments.length);

		console.log(self.cornerFragments.map(x => x.id).reduce((a, b) => a*b));
	}

	ConstructImage1()
	{
		var self = this;
		let frags = this.imageFragments;
		let finalImage = new Map2D();
		let visitedIds = [];

		construct(frags[1], 0, 0);

		function construct(f1, x, y)
		{
			visitedIds.push(f1.id);
			finalImage.set(x, y, f1);

			if(!finalImage.has(x, y - 1))
				for(let i = 0; i < frags.length; i++)
				{
					let f2 = frags[i];

					if(!visitedIds.includes(f2.id))
					{
						if(f1.TestConfigurations(f2) !== false)
						{
							construct(f2, x, y - 1);
						}
					}
				}

			if(!finalImage.has(x + 1, y))
				for(let i = 0; i < frags.length; i++)
				{
					let f2 = frags[i];

					if(!visitedIds.includes(f2.id))
					{
						if(f1.TestConfigurations(f2) !== false)
						{
							construct(f2, x + 1, y);
						}
					}
				}

			if(!finalImage.has(x, y + 1))
				for(let i = 0; i < frags.length; i++)
				{
					let f2 = frags[i];

					if(!visitedIds.includes(f2.id))
					{
						if(f1.TestConfigurations(f2) !== false)
						{
							construct(f2, x, y + 1);
						}
					}
				}

			if(!finalImage.has(x - 1, y))
				for(let i = 0; i < frags.length; i++)
				{
					let f2 = frags[i];

					if(!visitedIds.includes(f2.id))
					{
						if(f1.TestConfigurations(f2) !== false)
						{
							construct(f2, x - 1, y);
						}
					}
				}
		}

		console.log(finalImage)
	}

	ConstructImage2()
	{
		var self = this;
		let frags = this.imageFragments;
		let finalImage = new Map2D();
		let testedFragments = new Map2D();
		let visitedIds = [];
		let x = 0;
		let y = 0;
		let i = 0;

		finalImage.set(x, y, frags[i]);
		visitedIds.push(frags[i].id);
		testedFragments.set(x, y, [frags[i].id]);
		x++;

		while(finalImage._maxX < 12 || finalImage._maxY < 12)
		{
			let anyConfFound = false;

			

			for(var j = 0; j < frags.length; j++)
			{
				let f2 = frags[j];

				//console.log(`f1: ${frags[i].id}, f2: ${f2.id}, x: ${x}, y: ${y}, vis: ${visitedIds.length}, i: ${i}`)

				if(frags[i].id === f2.id)
					continue;

				if(frags[i].TestConfigurations(f2, false))
				{
					if(1==1 || !visitedIds.includes(f2.id))
					{
						let test = testedFragments.get(x, y);

						if(typeof test === 'undefined')
							test = [];

						if(!test.includes(f2.id))
						{
							anyConfFound = true;
							finalImage.set(x, y, f2);
							visitedIds.push(parseInt(f2.id));

							if(typeof testedFragments.get(x, y) === 'undefined')
							{
								var ar = [parseInt(f2.id)];
								testedFragments.set(x, y, ar);
							}
							else
							{
								var ar = testedFragments.get(x, y)
								ar.push(parseInt(f2.id));
								testedFragments.set(x, y, ar);
							}

							break;
						}
					}
				}
			}

			if(anyConfFound === false)
			{
				x--;

				if(x < 0)
				{
					x = 12;
					y -= 1;

					if(y < 0)
						y = 0;
				}

				i++;
			}
			else
			{
				x++;

				if(x > 12)
				{
					x = 0;
					y += 1;
				}

				i++;
			}

			if(i >= 144)
				i = 0;
		}

		console.log(finalImage);
	}

	ConstructImage3()
	{
		if(!this.separationDone)
		{
			console.error('Fragments need to be separated first!');
			return;
		}

		var self = this;
		let finalImage = new Map2D();
		let usedFragments = [];

		//this.cornerFragments = [];
		//this.sideFragments = [];
		//this.innerFragments = [];

		function GetPiece(what, compareTo)
		{
			let ret = null;

			if(what === 'CORNER') 
			{
				if(compareTo === null)
				{
					self.cornerFragments.forEach(f =>
					{
						if(!usedFragments.includes(f.id))
						{
							ret = f;
							usedFragments.push(f.id);
							return;
						}
					});
				}
				else
				{
					self.cornerFragments.forEach(f =>
					{
						let test = f.TestConfigurations(compareTo);

						if(test !== false)
						{
							ret = f;
							usedFragments.push(f.id);
							return;
						}
					});
				}
			}
			else if(what === 'SIDE')
			{
				self.sideFragments.forEach(f =>
				{
					let test = f.TestConfigurations(compareTo);

					if(!usedFragments.includes(f.id) && test !== false)
					{
						ret = f;
						usedFragments.push(f.id);
						return;
					}
				});
			}
			else if(what === 'INNER')
			{
				self.innerFragments.forEach(f =>
				{
					let test = f.TestConfigurations(compareTo);

					if(!usedFragments.includes(f.id) && test !== false)
					{
						ret = f;
						usedFragments.push(f.id);
						return;
					}
				});
			}
			else
			{
				console.error('No such piece!');
			}

			if(ret === null)
			{
				console.error('No piece found!');
				return ret;
			}
			else
			{		
				console.log('Returning ' + ret.id)
				return ret;
			}
		}

		for(let y = 0; y < 12; y++)
		{
			for(let x = 0; x < 12; x++)
			{
				if(x > 0)
				{
					var compareTo = finalImage.get(x - 1, y);
					var cmptostr = compareTo.id;
				}
				else if(x === 0 && y === 0)
				{
					var compareTo = null;
					var cmptostr = 'null';
				}
				else
				{
					var compareTo = finalImage.get(x, y - 1);
					var cmptostr = compareTo.id;
				}

				// X-corner
				if(x === 0 || x === 11)
				{
					// XY-corner
					if(y === 0 || y === 11)
					{
						console.log(y, x, 'XY-corner', cmptostr)
						let newPiece = GetPiece('CORNER', compareTo);
						finalImage.set(x, y, newPiece);
					}
					// Y-side
					else if(y > 0 && y < 11)
					{
						console.log(y, x, 'Y-side', cmptostr)
						let newPiece = GetPiece('SIDE', compareTo);
						finalImage.set(x, y, newPiece);
					}
				}
				// X-inner
				else if(x > 0 && x < 11)
				{
					// X-side
					if(y === 0 || y === 11)
					{
						console.log(y, x, 'X-side', cmptostr)
						let newPiece = GetPiece('SIDE', compareTo);
						finalImage.set(x, y, newPiece);
					}
					// XY-inner
					else if(y > 0 && y < 11)
					{
						console.log(y, x, 'XY-inner', cmptostr)
						let newPiece = GetPiece('INNER', compareTo);
						finalImage.set(x, y, newPiece);
					}
				}
			}
		}

		console.log(finalImage)
	}
}

class Map2D
{
	constructor()
	{
		this._map = new Map();
		this._minX = 0;
		this._minY = 0;
		this._maxX = 0;
		this._maxY = 0;
	}

	setMap(newMap2D)
	{
		this._map = newMap2D._map;
		this._minX = newMap2D._minX;
		this._minY = newMap2D._minY;
		this._maxX = newMap2D._maxX;
		this._maxY = newMap2D._maxY;
	}

	get(x, y)
	{
		return this._map.get(`${x},${y}`);
	}

	set(x, y, v)
	{
		if(x < this._minX)
			this._minX = x;

		if(y < this._minY)
			this._minY = y;

		if(x > this._maxX)
			this._maxX = x;

		if(y > this._maxY)
			this._maxY = y;

		this._map.set(`${x},${y}`, v);
	}

	has(x, y)
	{
		return this._map.has(`${x},${y}`);
	}

	forEach(f)
	{
		for(let x = this._minX; x < this._maxX; x++)
		{
			for(let y = this._minY; y < this._maxY; y++)
			{
				if(this.has(x, y))
				{
					f(this.get(x, y), x, y);
				}
			}
		}
	}
}

class CameraImageFragment
{
	constructor(id, imageData, edges = null)
	{
		this.id = id;
		this.imageData = imageData;
		this.originalImageData = imageData.map(x => [...x]);
		this.edges = null;

		if(edges === null)
			this._constructEdges();
		else
			this.edges = edges;
	}

	Configure(identityType)
	{
		let configured = IdentityTypes[identityType].configuration(this._clone());
		this.imageData = configured.imageData;
		this.edges = configured.edges;
	}

	Print(doBreak = true)
	{
		let s = '';
		let b = doBreak ? '\n' : '';

		this._clone().imageData.forEach(x => 
		{
			s += x.join('') + b;
		});

		return s;
	}

	_clone()
	{
		return new CameraImageFragment(this.id, this.imageData.map(x => [...x]), this.edges);
	}

	_restore()
	{
		this.imageData = this.originalImageData.map(x => [...x]);
		this._constructEdges();
	}

	_constructEdges()
	{
		let imageData = this.imageData;
		var self = this;
		let top = imageData[0];
		let right = []
		let bottom = imageData[imageData.length - 1];
		let left = [];

		function HashString(str) 
		{
			let hash = 0;
			let exp = 0;

			str = str.split('').reverse().join('');
			str = str.replace(/\#/g, 1);
			str = str.replace(/\./g, 0);

			for(let i = 0; i < str.length; i++)
			{
				hash += str[i] * Math.pow(2, exp);
				exp++;
			}

			return hash;
		}

		for(let y = 0; y < imageData.length; y++)
		{
			left.push(imageData[y][0]);
			right.push(imageData[y][imageData[y].length - 1]);
		}

		this.edges = {
			top: HashString(top.join('')),
			right: HashString(right.join('')),
			bottom: HashString(bottom.join('')),
			left: HashString(left.join(''))
		}
	}

	CompareEdges(fragmentB)
	{
		if(this.edges.top === fragmentB.edges.top)
			return 0;

		if(this.edges.right === fragmentB.edges.right)
			return 1;

		if(this.edges.bottom === fragmentB.edges.bottom)
			return 2;

		if(this.edges.left === fragmentB.edges.left)
			return 3;

		return -1;
	}

	_flipVertical()
	{
		let tX = this.imageData.length;
		let tY = this.imageData[0].length;

		for(let x = 0; x < tX; x++)
		{
			for(let y = 0; y < tY / 2; y++)
			{
				let tmp = this.imageData[x][tY - y - 1];
				this.imageData[x][tY - y - 1] = this.imageData[x][y];
				this.imageData[x][y] = tmp;
			}
		}

		this._constructEdges();
	}

	_flipHorizontal()
	{
		let tX = this.imageData.length;
		let tY = this.imageData[0].length;

		for(let y = 0; y < tY; y++)
		{
			for(let x = 0; x < tX / 2; x++)
			{
				let tmp = this.imageData[tX - x - 1][y];
				this.imageData[tX - x - 1][y] = this.imageData[x][y];
				this.imageData[x][y] = tmp;
			}
		}

		this._constructEdges();
	}

	_rotateCW() 
	{
		let arr = this.imageData.map(r => [...r]);
		const stride = arr.length;
		const end = stride - 1;
		const half = stride / 2 | 0;
		var y = 0;

		while (y < half) 
		{
			let x = y;
			const ey = end - y;

			while (x < ey) 
			{
				const temp = arr[y][x], ex = end - x;
				arr[y ][x ] = arr[ex][y ];
				arr[ex][y ] = arr[ey][ex];
				arr[ey][ex] = arr[x ][ey];
				arr[x ][ey] = temp;
				x ++;
			}

			y++;
		}

		this.imageData = arr;
		this._constructEdges();
	}

	TestConfigurations(fragmentB)
	{
		let a = this._clone();
		let b = fragmentB._clone();

		a._restore();
		b._restore();

		// Initital
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.A;
		}

		b._rotateCW();

		// 90deg CW
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.B;
		}

		b._rotateCW();

		// 180deg CW
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.C;
		}

		b._rotateCW();

		// 270deg CW
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.D;
		}

		// Restore to initial
		b._restore();

		b._flipVertical();

		// Vertical Flip
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.E;
		}

		// Restore to initial
		b._restore();

		b._flipHorizontal();

		// Horizontal flip
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.F;
		}

		// Restore to initial
		b._restore();

		b._flipHorizontal();
		b._rotateCW();
		b._rotateCW();
		b._rotateCW();
		

		// fh + r3
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.G;
		}

		// Restore to initial
		b._restore();

		b._rotateCW();
		b._rotateCW();
		b._rotateCW();
		b._flipHorizontal();
		

		// r_3 + fh
		if(a.CompareEdges(b) > -1)
		{
			return IdentityTypes.H;
		}

		return false;
	}
}

const IdentityTypes = 
{
	A: 
	{ 
		typeId: 1,
		typeC: 'A',
		configuration: function(f)
		{
			f._restore();
			return f;
		}
	},

	B: 
	{ 
		typeId: 2, 
		typeC: 'B',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._rotateCW();

			return fc;
		}
	},

	C: 
	{ 
		typeId: 3,
		typeC: 'C',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._rotateCW();
			fc._rotateCW();

			return fc;
		}
	},

	D: 
	{ 
		typeId: 4, 
		typeC: 'D',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._rotateCW();
			fc._rotateCW();
			fc._rotateCW();

			return fc;
		}
	},

	E: 
	{ 
		typeId: 5, 
		typeC: 'E',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._flipVertical();

			return fc;
		}
	},

	F: 
	{ 
		typeId: 6, 
		typeC: 'F',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._flipHorizontal();

			return fc;
		}
	},

	G: 
	{ 
		typeId: 7, 
		typeC: 'G',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();

			fc._flipHorizontal();
			fc._rotateCW();
			fc._rotateCW();
			fc._rotateCW();

			return fc;
		}
	},

	H: 
	{ 
		typeId: 8, 
		typeC: 'H',
		configuration: function(f)
		{
			let fc = f._clone();
			fc._restore();
	
			fc._rotateCW();
			fc._rotateCW();
			fc._rotateCW();
			fc._flipHorizontal();

			return fc;
		}
	}
}

main();


//console.dir(groups, { maxArrayLength: null });