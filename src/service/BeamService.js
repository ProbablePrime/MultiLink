import {Beam, 'lib/services/chat' as ChatService, 'lib/ws' as BeamSocket} from 'beam-client-node';
import {BeamChannel} from './BeamChannel.js';


export default class BeamService extends Service {
	constructor (options) {
		options.name = 'Beam';
		super(options);

		this.beam = new Beam();

		this.username = '';
		this.passsword = '';

		this.on('channel-added', this.onChannelAdded);
		this.on('channel-removed', this.onChannelRemoved);
		this.on('connected',this.onConnected);
		this.userData = {};
		this.userID = 0;
		this.channels = {};
	}

	getWebSocket (channel) {
		return this.channelWebSockets[channel];
	}

	onConnected () {

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
	this.handleChat (data) {
		if (data.user_name === this.username) return;
		if (channel === this.ircOptions.username) {
			if (isCommand(message)) {
				this.emit('command', channel, user, extractCommand(message), message);
			}
			return;
		}
		this.emit('message', channel.name, user, message);
	}

	onSocketReady (channel) {
		channel.on("ChatMessage",this.handleChat);
	}

	onChannelAdded (channelName) {
		var channel = new BeamChannel(channelName,this.client,this.userID).initialize();
		channel.on('authenticated',this.onSocketReady);
		this.channels[channelName] = channel;
	}

	onChannelRemoved (channelName) {

	}

	connect () {
		let self = this;
		//Todo use config
		beam.use('password', {
			username: self.username,
			password: self.password
		}).attempt().then(function(res) {
			this.userData = res;
			this.userID = res.id;
			self.emit('connected',res);
		});
	}
}
