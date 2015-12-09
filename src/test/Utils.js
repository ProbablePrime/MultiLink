import test from 'tape';
import * as beamUtils from '../Utils.js';



test('Extract Text From Message Part', t => {
	t.plan(7);

	let part1 = { type:"text", data:"Hello" };
	t.equal(beamUtils.extractTextFromMessagePart(part1), 'Hello', 'Text');

	let part2 = { "type": 'emoticon', "text": ':)', "path": 'default/1F604' };
	t.equal(beamUtils.extractTextFromMessagePart(part2), ' :)', 'Emote');

	let part3;
	t.equal(beamUtils.extractTextFromMessagePart(part3),'','Undefined');

	let part4 = null;
	t.equal(beamUtils.extractTextFromMessagePart(part4),'','Null');

	let part5 = '';
	t.equal(beamUtils.extractTextFromMessagePart(part5),'','Empty string');


	let part6 = 'Hello';
	t.equal(beamUtils.extractTextFromMessagePart(part6),'Hello','String');

	let part7 = {};
	t.equal(beamUtils.extractTextFromMessagePart(part7), '', 'Empty Object');

});


test('Flatten Beam Message', t => {
	t.plan(4);

	let message = [
		{ 
			type:"text", 
			data:"Hello " 
		},
	];

	t.equal(beamUtils.flattenBeamMessage(message), 'Hello ', 'One Part');

	message.push({ 
			type:"text", 
			data:"World!" 
	});

	t.equal(beamUtils.flattenBeamMessage(message), 'Hello World!', 'Two Parts');

	message.push({ "type": 'emoticon', "text": ':)', "path": 'default/1F604' });

	t.equal(beamUtils.flattenBeamMessage(message), 'Hello World! :)', 'Emotes');

	message = [];
	t.equal(beamUtils.flattenBeamMessage(message), '', 'No parts');
	
});

