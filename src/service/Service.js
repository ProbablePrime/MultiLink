import {EventEmitter} from 'events';

export default class Service extends EventEmitter {
	constructor (options) {
		super();
		this.options = options || {};
		this.key = this.options.key;
		this.name = this.options.name || 'BaseService';
		this.channel = this.options.channel || '';
		this.username = this.options.username || '';
		this.channels = [];
	}

	addChannel (channel) {
		this.channels.push(channel);
		this.emit('channel-added', channel);
	}

	removeChannel (channel) {
		this.channels = this.channels.filter(function filterChannels (internalChannel) {
			return channel === internalChannel;
		});
		this.emit('channel-removed', channel);
	}

	connect () {
	}
}
