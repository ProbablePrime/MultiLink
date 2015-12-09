const ent = require('ent');

export function isCommand (message) {
	return message.charAt(0) === '!';
}


export function extractCommand (message) {
	return message.split(' ')[0].replace('!', '');
}


export function extractTextFromMessagePart(part) {
	if (part == undefined) {
		return '';
	}
	if (typeof part === "object") {
		if (part.type != null && part.type === 'text') {
			return part.data;
		}

		if(part.text != null) {
			return ' ' + part.text;
		}

		return '';
	}
	return part;
}

export function flattenBeamMessage (message) {
	let result = '';
	if (message.length !== undefined) {
		if(message.length > 1 ) {
			result = message.reduce(function (previous, current) {
				if (!previous) {
					previous = '';
				}
				if (typeof previous === 'object') {
					previous = extractTextFromMessagePart(previous);
				}
				return previous + extractTextFromMessagePart(current);
			});
		} else if(message.length === 1) {
			result = extractTextFromMessagePart(message[0]);
		} else {
			return '';
		}
	} else {
		result = message;
	}
	return ent.decode(result);
}

export function prepareMessage (message) {
	let typeShortCut = message.type.charAt(0).toUpperCase();
	var result = `[${typeShortCut}](${message.user}): ${message.message}`;
	return result;
}

export default {
	prepareMessage,
	flattenBeamMessage,
	extractTextFromMessagePart,
	extractCommand,
	isCommand,
}


/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
