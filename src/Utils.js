const ent = require('ent');

export function isCommand (message) {
	return message.charAt(0) === '!';
}


export function extractCommand (message) {
	return message.split(' ')[0].replace('!', '');
}


export function extractTextFromMessagePart(part) {
	if (part.type === 'text') {
		return part.data;
	}
	return part.text;
}

export function flattenBeamMessage (message) {
	let result = '';
	if (message.length !== undefined) {
		if(message.length > 1 ) {
			result = message.reduce(function (previous, current) {
				if (!previous) {
					previous = '';
				}
				return previous + extractTextFromMessagePart(current);
			});
		} else {
			result = extractTextFromMessagePart(message[0]);
		}
	} else {
		console.log('not array');
		result = message;
	}
	return ent.decode(result);
}

export function prepareMessage (message) {
	let typeShortCut = message.type.charAt(0).toUpperCase();
	var result = `[${typeShortCut}](${message.user}): ${message.message}`;
	return result;
}


/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
