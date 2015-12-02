import {BeamService} from './BeamService.js';
import {TwitchService} from './TwitchService.js';


export class ServiceFactory {
	constructor () {
		this.serviceConstructors = {};

		this.serviceConstructors.beam = BeamService;
		this.serviceConstructors.twitch = TwitchService;
	}
	create (type, options) {
		return new this.serviceConstructors[type](type, options);
	}
}
