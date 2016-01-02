import {ServiceFactory} from './service/ServiceFactory.js';

import {prepareMessage} from './Utils.js';

const config = require('yaml-config');

import Logger from './Logger.js';
const log = new Logger('MAIN');

export class Main {
	constructor (configFile) {
		configFile = configFile || './config/default.yaml';
		if (!configFile) {
			throw new Error('Please pass a config file in');
		}
		this.settings = config.readConfig(configFile, 'default');
		this.services = [];
		this.serviceFactory = new ServiceFactory();
	}

	handleMessage (message) {
		message.text = prepareMessage(message);
		log.info(message.text);
		Object.keys(this.services).forEach(function doService (serviceType) {
			this.services[serviceType].sendMessage(message);
		}, this);
	}

	registerEvents (serviceType, service) {
		service.on('message', this.handleMessage.bind(this));
	}

	initializeService (serviceType, options) {
		log.info('Initializing %s', serviceType);
		this.services[serviceType] = this.serviceFactory.create(serviceType, options);
		this.registerEvents(serviceType, this.services[serviceType]);

		this.services[serviceType].connect();
	}

	initializeServices (services) {
		const self = this;
		Object.keys(services).forEach(function servicePreInit (serviceType) {
			const service = services[serviceType];
			if (!service.enabled) {
				log.info('Serivice: %s is not enabled', serviceType);
				return;
			}
			self.initializeService(serviceType, service);
		}, self);
	}

	go () {
		this.initializeServices(this.settings.services);
	}
}
