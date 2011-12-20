/*!
 * ContextualParser
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var assert = require('assert');
var Tokenizer = require('./Tokenizer');
var util = require('./util');

function ContextualParser(parseCallback, rootContext, options) {
	var parser = this;
	var currentContext = rootContext;
	var contextStack = [currentContext];
	var tokenizer = new Tokenizer(onToken, options);
	tokenizer.setExpressionSet(currentContext.expressionSet);

	function onToken(token, buffer) {
		if (token) {
			if (token.match) {
				currentContext.writer.write(buffer.substr(0, token.match.index));
			}
	        parseCallback.call(parser, token);
		} 
		else {
			currentContext.writer.write(buffer);
		}
	}

	function pushContext(expressionSet, writer,	state)	{
		//console.log(arguments.callee, contextStack.length, state);
		currentContext = {
			expressionSet:	expressionSet
			, writer:	writer
			, state:	state
		};
		contextStack.unshift(currentContext);
		tokenizer.setExpressionSet(currentContext.expressionSet);
	}

	function popContext() {
		currentContext.writer.end();
		contextStack.shift();
		currentContext = contextStack[0];
		tokenizer.setExpressionSet(currentContext.expressionSet);
		//console.log(arguments.callee, contextStack.length);
	}
	
	function end() {
		tokenizer.end.apply(parser, arguments);
		assert.equal(1, contextStack.length, 'Parse error (stack = ' + contextStack.length + ')');
		currentContext.writer.end();
	}

	function getExpressionSet(){
		return currentContext.expressionSet;
	}
	function getWriter(){
		return currentContext.writer;
	}
	function getState(){
		return currentContext.state;
	}

	util.extend(this, tokenizer, {
		end: end
		, getExpressionSet: getExpressionSet
		, getWriter: getWriter
		, getState: getState
		, pushContext: pushContext
		, popContext: popContext
	});
}

// exports
module.exports = ContextualParser;



