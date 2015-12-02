// import {Beam} from 'beam-client-node';
const ChatService = require('../../node_modules/beam-client-node/lib/services/chat');
const BeamSocket = require('../../node_modules/beam-client-node/lib/ws');
import {EventEmitter} from 'events';

import {Logger} from '../Logger.js';

let log = null;

export class BeamChannel extends EventEmitter {
	constructor (name, client, userID) {
		super();
		this.name = name;
		log = new Logger('BeamChannel - '+this.name);
		this.socket = null;
		this.endPointData = {};
		this.client = client;

		this.data = {};
		this.endPointData = null;

		this.channelService = null;


		this.socket = null;
		this.userID = userID;
	}

	sendMessage (message) {
		const opts = [];
		opts.push(message);
		this.socket.call('msg', opts);
	}

	createWebSocket () {
		const self = this;
		if (!this.endPointData || !this.endPointData.endpoints) {
			throw new Error("No Endpoints to use");
		}
		log.info('spinning up socket');
		this.socket = new BeamSocket(this.endPointData.endpoints).boot();
		this.socket.call('auth', [this.id, this.userID, this.endPointData.authkey])
		.then(function onSocketAuthenticated () {
			log.info('authenticated');
			self.emit('authenticated', self);
			self.emit('socket-ready', self.socket);
		});
	}

	onEndPointData (response) {
		this.endPointData = response.body;
		this.createWebSocket();
	}

	onChannelData (response) {
		const data = response.body;
		this.data = data;
		this.id = data.id;

		this.emit('id-available', this.name, this.id);
		log.info('attemping to join');
		this.channelService = new ChatService(this.client).join(this.id).then(this.onEndPointData.bind(this));
	}

	getChannelData () {
		log.info('Requesting channel data');
		this.client.request('get', '/channels/' + this.name).bind(this).then(this.onChannelData.bind(this));
	}

	initialize () {
		this.getChannelData();
	}

}
