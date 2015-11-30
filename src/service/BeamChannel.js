import {Beam,'lib/services/chat' as ChatService, 'lib/ws' as BeamSocket} from 'beam-client-node';

export default class BeamChannel extends EventEmitter {
	constructor (name, client, userID) {
		this.name = name;
		this.websocket = null;
		this.endPointData = {};
		this.client = client;

		this.data = {};
		this.endPointData = null;

		this.channelService = null;

		this.socket = null;
		this.userID = id;
	}

	get id () {
		return this.id;
	}
	set id (id) {
		this.id = id;
	}

	set name (name) {
		this.name = name;
	}

	get name () {
		return this.name;
	}

	set websocket (ws) {
		this.ws = ws;
	}

	get websocket () {
		return this.websocket;
	}

	createWebSocket () {
		const self = this;
		this.socket = new BeamSocket(this.endPointData.endpoints).boot();
		socket.call('auth', [this.id, this.userID, this.endPointData.authkey]).then(function(){
			self.emit('authenticated',self);
			self.emit('socket-ready', channel, socket);
		});
	}

	onEndPointData (data) {
		this.endPointData = data;
		this.createWebSocket();
	}

	onChannelData (data) {
		this.data = data;
		this.id = data.id;
		this.emit('id-available',this.name,this.id);
		this.channelService = new ChatService(this.client).join(this.id).then(this.onEndPointData);
	}

	getChannelData () {
		this.client.request('get','/channels/'+channel).bind(this).then(this.onChannelData);
	}
	
}
