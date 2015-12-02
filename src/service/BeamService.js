const Beam = require('beam-client-node');
import {BeamChannel} from './BeamChannel.js';
import {Service} from './Service.js';

import {flattenBeamMessage, extractCommand} from '../Utils.js';

import {Logger} from '../Logger.js';
const log = new Logger('BeamService');

export class BeamService extends Service {
	constructor (type, options) {
		options.name = 'Beam';
		super(type, options);	

		this.beam = new Beam();

		this.username = options.username || '';
		this.password = options.password || '';

		this.on('channel-added', this.onChannelAdded);
		this.on('channel-removed', this.onChannelRemoved);
		this.on('connected', this.onConnected);

		this.userData = {};
		this.userID = 0;
		this.channelObjects = [];
	}

	getChannelByID (id) {
		return this.channelObjects.find(function(channel){
			if (channel.id === id) {
				return true;
			}
		});
	}

	getChannelNameByID (id) {
		let channel = this.getChannelByID(id);
		if(channel == null) {
			return '';
		}
		return channel.name;
	}

	getWebSocket (channel) {
		return this.channelWebSockets[channel];
	}

	onConnected () {
		this.addChannels(this.options.channels);
	}
// 	{
//   "type":"event",
//   "event":"ChatMessage",
//   "data":{
//     // Channel ID it was sent on
//     "channel":2,
//     // Unique message ID
//     "id":"db10fc70-bc95-11e4-8ddb-9f6d8dc74385",
//     // Information about the sender
//     "user_name":"connor4312",
//     "user_id":2,
//     "user_roles":["Owner"],
//     "message":[
//       { "type":"text", "data":"hello " },
//       { "type": 'emoticon', "text": ':)', "path": 'default/1F604' }
//     ]
//   }
// }
	handleChat (data) {
		if (data.user_name === this.username) return;
		data.channel_name = this.getChannelNameByID(data.channel);
		const message = flattenBeamMessage(data.message.message);

		if (data.channel_name === this.username) {
			if (isCommand(message)) {
				this.emit('command', data.channel_name, data.user_name, extractCommand(message), message);
			}
			return;
		}
		this.emit('message', {channel: data.channel_name, user:data.user_name, message, type: this.type});
	}

	onSocketReady (channel) {
		channel.on('ChatMessage', this.handleChat.bind(this));
	}

	sendMessageToChannel (message, channel) {
		channel.sendMessage(message);
	}

	sendMessage (message) {
		let channels = this.channelObjects;
		if (message.type === this.type) {
			channels = channels.filter(function filterChannels (channel) {
				if (message.channel === channel.name) {
					return false;
				}
				return true;
			});
		}
		channels.forEach(this.sendMessageToChannel.bind(this, message.text));
	}

	onChannelAdded (channelName) {
		const self = this;
		log.info('Adding beam channel ' + channelName);
		const channel = new BeamChannel(channelName, this.beam, this.userID);
		channel.initialize();
		channel.on('socket-ready',self.onSocketReady.bind(this));
		this.channelObjects.push(channel);
	}

	onChannelRemoved (/* channelName */) {

	}

	connect () {
		const self = this;
		log.info('Loggging into beam');
		this.beam.use('password', {
			username: self.username,
			password: self.password,
		}).attempt().then( function onLoggedIn (res) {
			log.info('Successfully logged into beam');
		 	const data = res.body;
			self.userData = data;
			self.userID = data.id;
			self.emit('connected', res);
		});
	}
}
