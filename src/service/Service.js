import {EventEmitter} from 'events';

export class Service extends EventEmitter {
	constructor (type, options) {
		super();
		this.options = options || {};
		this.type = type;
		this.name = this.options.name || 'BaseService';
		this.channels = [];
	}

	addChannels (channelsArray) {
		channelsArray.forEach(this.addChannel.bind(this));
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

	sendMessage () {

	}
}
