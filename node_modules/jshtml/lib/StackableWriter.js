/*!
 * StackableWriter
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var assert = require('assert');
var util = require('./util');

function StackableWriter(writeCallback, options, state) {
	var writer = this;
	var options = util.extend({
		streaming: true
		, writeFilter: function(data, state) {return data;}
		, flushFilter: function(data, state) {return data;}
	}, options);
	var buffer = '';

	function write() {
		var argumentCount = arguments.length;
		for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++){
			var argument = arguments[argumentIndex];
			call(writer, options.writeFilter(util.str(argument), state));
		}
	}
	
	function flush() {
		if(buffer)	{
			writeCallback.call(writer, options.flushFilter(buffer, state));
			buffer = '';
		}
	}
	
	function end() {
		write.apply(this, arguments);
		flush();
		util.extend(this, {
			end: readerEnded
			, write: readerEnded
			, setOptions: readerEnded
			, call: readerEnded
		});
	}
	
	function setOptions(value){
		util.extend(options, value);
	}

	function call(writer, data) {
		buffer += util.str(data);
		options.streaming && flush();
	}

	function readerEnded() {
		throw 'writer has ended';
	}

	util.extend(this, {
		end: end
		, write: write
		, setOptions: setOptions
		, call: call
	});
}


// exports
module.exports = StackableWriter;

