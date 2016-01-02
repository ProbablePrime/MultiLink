import {Service} from './Service.js';
import {isCommand, extractCommand} from '../Utils.js';

const irc = require('tmi.js');

import Logger from '../Logger.js';
const log = new Logger('TwitchService');

export class TwitchService extends Service {
	constructor (type, options) {
		options.name = 'Twitch';
		super(type, options);

		const self = this;
		// TODO: get these from a file or something
		this.ircOptions = {};
		this.ircOptions.connection = {};
		this.ircOptions.connection.reconnect = true;
		this.ircOptions.connection.random = 'chat';
		this.ircOptions.debug = true;
		// TODO: A file..
		this.ircOptions.identity = {};
		this.ircOptions.identity.username = options.username || '';
		this.ircOptions.identity.password = options.password || '';

		/* eslint-disable new-cap */
		this.client = new irc.client(this.ircOptions);
		/* eslint-enable new-cap */

		this.on('channel-added', this.onChannelAdded);
		this.on('channel-removed', this.onChannelRemoved);
		this.client.on('connected', function onClientConnected () {
			self.emit('connected');
		});
		this.on('connected', this.onConnected);
		this.client.on('disconnected', this.onDisconnected);

	}

	sendMessage (message) {
		let channels = this.channels;
		if (message.type === this.type) {
			channels = channels.filter(function filterChannels (channel) {
				if (message.channel.toLowerCase() === channel.toLowerCase()) {
					return false;
				}
				return true;
			});
		}
		channels.forEach(this.sendMessageToChannel.bind(this, message.text));
	}

	sendMessageToChannel (message, channel) {
		this.client.say(channel, message);
	}

	handleChat (channel, user, message, self) {
		if (self) return;
		if (channel === this.ircOptions.identity.username) {
			if (isCommand(message)) {
				this.emit('command', channel, user, extractCommand(message), message);
			}
			return;
		}
		this.emit('message', {channel: channel.replace('#',''), user:user['display-name'], message, type: this.type});
	}

	onConnected () {
		log.info('connected');
		this.addChannels(this.options.channels);
		this.client.on('chat', this.handleChat.bind(this));
	}

	onDisconnected () {

	}

	onChannelAdded (channel) {
		log.info('Joining ' + channel);
		this.client.join(channel);
	}

	onChannelRemoved (channel) {
		this.client.part(channel);
	}

	connect () {
		log.info('connecting to twitch');
		super.connect();
		this.client.connect();
	}
}
