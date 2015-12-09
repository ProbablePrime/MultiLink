const log = require('npmlog');

export class Logger {
	constructor (prefix) {
		const self = this;
		Object.keys(log.levels).forEach( function _bindLevel (lvl) {
			self[lvl] = function _recast () {
				return log[lvl](prefix, ...arguments);
			};
		});
	}
}
