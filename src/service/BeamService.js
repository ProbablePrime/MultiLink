import {Service} from './Service.js';
import {isCommand, extractCommand} from '../Utils.js';

const BeamClient = require('beam-wrapper');

import Logger from '../Logger.js';
const log = new Logger('TwitchService');

export class BeamService extends Service {
	constructor (type, options) {
		options.name = 'Beam';
		super(type, options);

		const self = this;
		// TODO: get these from a file or something
		
		this.clientOpts = {};
		this.clientOpts.identity = {};
		this.clientOpts.identity.username = options.username || '';
		this.clientOpts.identity.password = options.password || '';

		this.username = options.username;

		/* eslint-disable new-cap */
		this.client = new BeamClient(this.clientOpts);
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
		if (channel === this.username) {
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
