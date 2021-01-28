class WtfArray {
	constructor(initialArray, size) {
		var self = this;
		this._lastIndexCache = new Array(size);
		this._secondToLastIndexCache = new Array(size);
		this._existenceCache = new Array(size).fill(0);
		this._mainIterator = 0;
		this._lastItem = null;

		initialArray.forEach(x => { self.push(x); });
	}

	contains(item) {
		if(item in this._existenceCache)
			if(this._existenceCache[item] > 1)
				return true;
			else
				return false;
		else
			return false;
	}

	push(item) {
		this._lastItem = item;

		if(item in this._lastIndexCache)
			this._secondToLastIndexCache[item] = this._lastIndexCache[item];
		
		this._lastIndexCache[item] = this._mainIterator - 1;
		this._existenceCache[item]++;
		this._mainIterator++;
	}

	getLastIndexOf(n) {
		return this._lastIndexCache[n];
	}

	getSecondToLastIndexOf(n) {
		return this._secondToLastIndexCache[n];
	}
}

console.time('Solve');
let wtfArray = new WtfArray([7, 12, 1, 0, 16, 2], 29999994);
let iter = 0;

while(iter < 29999994) {
	let lastNumber = wtfArray._lastItem;

	if(wtfArray.contains(lastNumber)) {
		let a = wtfArray.getLastIndexOf(lastNumber) + 1;
		let b = wtfArray.getSecondToLastIndexOf(lastNumber) + 1;
		let c = a - b;

		wtfArray.push(c);
	}
	else {
		wtfArray.push(0);
	}

	iter++;
}

console.timeEnd('Solve');
console.log(`SOLUTION: ${wtfArray._lastItem}`);