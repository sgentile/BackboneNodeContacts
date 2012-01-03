var soda = require('soda');

var browser = null;

describe("home", function() {

	beforeEach( function() {
		browser = soda.createClient({
				host: 'localhost'
			, port: 4444 
			, url: 'http://localhost:3000'
			, browser: 'firefox'
		});
	});

  it("should provide access to content", function() {
		var expectedid = null;

		browser
			.chain
			.session()
			.open('/')
			.click('id=contacts')
			.waitForElementPresent('id=add-contact-form', 3000)
			.type('firstname', 'Jim')
			.type('lastname', 'Bo')
			.click('addContact_button', 3000)
			.waitForElementPresent('successmessage', 3000)
			.getText('successmessage', function(text) { 
				expectedid = text; 

				browser.assertElementPresent('id=' + expectedid)
			})
			.end(function(err){
				browser.testComplete(function() {
					console.log('done');
					if(err) throw err;
				});
			});
	});
});
