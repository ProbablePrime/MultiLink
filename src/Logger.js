const log = require('npmlog');

export class Logger {
	constructor (prefix) {
		const self = this;
		Object.keys(log.levels).forEach(function(lvl){
			self[lvl] = function() {
				return log[lvl](prefix, ...arguments);
			}
		});
	}
}
