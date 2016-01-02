const log = require('debug');

export default class Logger {
	constructor (prefix) {
		this.levels = [
			'warn',
			'info',
			'error',
			'log'
		];
		const self = this;
		this.levels.forEach( function _bindLevel (lvl) {
			self[lvl] = log(prefix+':'+lvl);
			self[lvl].log = console[lvl].bind(console);
		});
	}
}
