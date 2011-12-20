/// <reference path="backbone.js" />
ModelBase = Backbone.Model.extend({
    defaults: {
        id: null
    },
    url: function (type) {
        //expecting the following conventions on the server:
        //urlRoot should be the controller : controller/
        //create → POST   /action
        //read → GET   /action[/id]
        //update → PUT   /action/id
        //delete → DELETE   /action/id
        var fqUrl = this.urlRoot;
        switch (type) {
            case "POST":
                fqUrl += "create";
                break;
            case "PUT":
                fqUrl += "update";
                break;
            case "DELETE":
                fqUrl += "delete/" + this.get('id');
                break;
            case "GET":
                fqUrl += "read/" + this.get('id');
                break;
        }
        return fqUrl;
    }
});

var methodMap = {
	'create': 'POST',
	'update': 'PUT',
	'delete': 'DELETE',
	'read': 'GET'
};

// Helper function to get a URL from a Model or Collection as a property
// or as a function.
var getUrl = function (object) {
	if (!(object && object.url)) return null;
	return _.isFunction(object.url) ? object.url() : object.url;
};

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
	throw new Error('A "url" property or function must be specified');
};

Backbone.sync = function (method, model, options) {
	var type = methodMap[method];

	options.url = _.isString(this.url) ? this.url : this.url(type);
    
	// Default JSON-request options.
	var params = _.extend({
		type: type,
		dataType: 'json'
	}, options);

	// Ensure that we have a URL.
	if (!params.url) {
		params.url = getUrl(model) || urlError();
	}

	// Ensure that we have the appropriate request data.
	if (!params.data && model && (method == 'create' || method == 'update')) {
		params.contentType = 'application/json';
		params.data = JSON.stringify(model.toJSON());
	}

	// For older servers, emulate JSON by encoding the request into an HTML-form.
	if (Backbone.emulateJSON) {
		params.contentType = 'application/x-www-form-urlencoded';
		params.data = params.data ? { model: params.data} : {};
	}

	// For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	// And an `X-HTTP-Method-Override` header.
	if (Backbone.emulateHTTP) {
		if (type === 'PUT' || type === 'DELETE') {
			if (Backbone.emulateJSON) params.data._method = type;
			params.type = 'POST';
			params.beforeSend = function (xhr) {
				xhr.setRequestHeader('X-HTTP-Method-Override', type);
			};
		}
	}

	// Don't process data on a non-GET request.
	if (params.type !== 'GET' && !Backbone.emulateJSON) {
		params.processData = false;
	}

	// Make the request.
	return $.ajax(params);
};