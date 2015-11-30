export function isCommand (message) {
	return message.charAt(0) === '!';
}


export function extractCommand (message) {
	return message.split(' ')[0].replace('!', '');
}

export function flattenBeamMessage (message) {
	
}
