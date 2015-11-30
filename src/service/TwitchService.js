import {irc} from 'tmi.js';
import {isCommand, extractCommand} from './Utils.js';

export default class TwitchService extends Service {
	constructor (options) {
		const self = this;
		options.name = 'Twitch';
		super(options);
		// TODO: get these from a file or something
		this.ircOptions = {};
		this.ircOptions.connection = {};
		this.ircOptions.connection.reconnect = true;
		this.ircOptions.connection.random = 'chat';
		this.ircOptions.debug = true;
		// TODO: A file..
		this.ircOptions.identity = {};
		this.ircOptions.identity.username = 'ProbableBot';
		this.ircOptions.identify.password = '';

		/* eslint-disable new-cap */
		this.client = new irc.client(this.ircOptions);
		/* eslint-enable new-cap */

		this.on('channel-added', this.onChannelAdded);
		this.on('channel-removed', this.onChannelRemoved);
		this.client.on('connected', function onClientConnected(){
			self.emit("connected");
		});
		this.on('connected',this.onConnected);
		this.client.on('disconnected', this.onDisconnected);
	}

	send (channel, message) {
		this.client.say(channel, message);
	}

	handleChat (channel, user, message, self) {
		if (self) return;
		if (channel === this.ircOptions.username) {
			if (isCommand(message)) {
				this.emit('command', channel, user, extractCommand(message), message);
			}
			return;
		}
		this.emit('message', channel, user, message);
	}

	onConnected () {
		this.client.on('chat', this.handleChat);
	}

	onChannelAdded (channel) {
		this.client.join(channel);
	}

	onChanneRemoved (channel) {
		this.client.part(channel);
	}

	connect () {
		super();
		this.client.connect();
	}
}
