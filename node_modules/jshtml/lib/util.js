/*!
 * util
 * Copyright(c) 2011 Elmer Bulthuis <elmerbulthuis@gmail.com>
 * MIT Licensed
 */

function extend(o) {
    var argumentCount = arguments.length;
    for (var argumentIndex = 1; argumentIndex < argumentCount; argumentIndex++) {
        var argument = arguments[argumentIndex];
        if(!argument) continue;
        for (var argumentKey in argument) {
            o[argumentKey] = argument[argumentKey];
        }
    }
    return o;
}

function map(o) {
	var r = {};
	var argumentCount = arguments.length;
	for(var argumentIndex = 1; argumentIndex < argumentCount; argumentIndex++) {
		var argument = arguments[argumentIndex];
		r[argument] = o[argument];
	}
	return r;
}

function str() {
	var buffer = '';
	var argumentCount = arguments.length;
	for(var argumentIndex = 0; argumentIndex < argumentCount; argumentIndex ++) {
		var argument = arguments[argumentIndex];
		if(typeof argument == 'undefined') continue;
		if(argument === null) continue;
		buffer += argument.toString();
	}
	return buffer;
}
	
const htmlSpecial = {
    34: '&quot;',
    38: '&amp;',
    //39: '&apos;',
    60: '&lt;',
    62: '&gt;',
    160: '&nbsp;'
};
function htmlEncode(value) {
	if(typeof value == 'object') return htmlAttributeEncode(value);
	else return htmlLiteralEncode(value);
}
function htmlLiteralEncode(value) {
    var buffer = '';
    var charList = str(value);
    var charCount = charList.length;
    for (var charIndex = 0; charIndex < charCount; charIndex++) {
        var charCode = charList.charCodeAt(charIndex);
        if (charCode in htmlSpecial) {
            buffer += htmlSpecial[charCode];
        }
        else {
            //if (charCode < 32) continue;
            if (charCode > 127) buffer += '&#' + charCode.toString() + ';';
            else buffer += String.fromCharCode(charCode);
        }
    }
    return buffer;
}
function htmlAttributeEncode(attributeSet) {
    var attributeList = [];
    for (var attributeName in attributeSet) {
        var attributeValue = attributeSet[attributeName];
        switch (attributeValue) {
	        case true:
            attributeList.push('' + attributeName + '="' + attributeName + '"');
            break;

    	    case false:
            break;

	        default:
            attributeList.push('' + attributeName + '="' + htmlLiteralEncode(attributeValue) + '"');
        }
    }
    return attributeList.join(' ');
}


//exports
exports.extend = extend;
exports.map = map;
exports.str = str;
exports.htmlEncode = htmlEncode;
exports.htmlLiteralEncode = htmlLiteralEncode;
exports.htmlAttributeEncode = htmlAttributeEncode;



