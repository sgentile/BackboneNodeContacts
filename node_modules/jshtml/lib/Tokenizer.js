/*!
 * Tokenizer
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

var assert = require('assert');
var util = require('./util');

function Tokenizer(tokenCallback, options) {
    var options = util.extend({}, options);
    var tokenizer = this;
    var buffer = '';
	var expressionSet = null;
	
	function write() {
		var argumentCount = arguments.length;
		for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex++){
			var argument = arguments[argumentIndex];
			buffer += util.str(argument);
		}
		flush();
	}

	function end() {
		write.apply(tokenizer, arguments);
	    tokenCallback.call(tokenizer, null, buffer);
	    buffer = '';
	}

    function flush() {
		var token;
        while(token = findToken()) {
	        tokenCallback.call(tokenizer, token, buffer);
			buffer = buffer.substr(token.match.index + token.match[0].length)
		}
    }

    function findToken() {
        var token = null;
        assert.ok(expressionSet, 'no expressionSet');
        for (var category in expressionSet) {
            var expression = expressionSet[category];
            var match = expression.exec(buffer);
            if (match && (!token || match.index < token.match.index)) {
                token = {
                    category: category
                    , match: match
                };
            }
        }
        return token;
    }
    
    function setExpressionSet(value) {
    	expressionSet = value;
    }

	util.extend(this, {
		end: end
		, write: write
		, setExpressionSet: setExpressionSet
	});
}
//exports
module.exports = Tokenizer;

