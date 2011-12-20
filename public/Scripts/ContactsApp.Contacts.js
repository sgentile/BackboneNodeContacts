/******  CONTACTS ******/
ViewSwitcherApp.Contacts = (function (ViewSwitcherApp, Backbone) {
	var Contacts = {};
	Contacts.ContactModel = Backbone.Model.extend({
		defaults: {
			id: null,
			firstname: "",
			lastname: ""
		},
		url: function (type) {
			if (type == "DELETE")
				return "Contact/delete/" + this.get('id');
			return this.isNew() ? "Contact/create" : "Contact/update";
		}
	});
	Contacts.ContactModels = Backbone.Collection.extend({
		model: Contacts.ContactModel,
		url: "Contact/list"
		//url: "http://localhost/Contacts/contact/list"
	});

	Contacts.contacts = new Contacts.ContactModels();

	Contacts.ContactView = Backbone.View.extend({
		tagName: 'li',
		model: Contacts.ContactModel,
		initialize: function () {
			this.template = $("#contact-template");
			_.bindAll(this, "render");
		},
		events: {
			"click span.remove-contact": "remove",
			"click span.edit-contact": "edit"
		},
		render: function () {
			//render the jQuery template
			var content = this.template.tmpl(this.model.toJSON());
			//take the rendered HTML and pop it into the DOM
			$(this.el).html(content);

			return this;
		},
		remove: function () {
			this.model.destroy();
		},
		edit: function () {
			ViewSwitcherApp.vent.trigger("editContact", this.model);
		}
	});

	Contacts.ContactsListView = Backbone.View.extend({
		//el: "#contacts-list",
		//model: Contact,
		initialize: function () {
			_.bindAll(this, "render");
			this.collection.bind("change", this.render);
			this.collection.bind("add", this.render);
			this.collection.bind("fetch", this.render);
			this.collection.bind('remove', this.render);

			Contacts.contacts.fetch({ add: true });
		},
		render: function () {
			//clear out the existing list to avoid "append" duplication
			$(this.el).empty();
			//use an array here rather than firehosing the DOM
			//perf is a bit better
			var els = [];
			//loop the collection...
			this.collection.models.forEach(function (contact) {
				//rendering a view for each model in the collection
				var view = new Contacts.ContactView({ model: contact });
				//adding it to our array
				els.push(view.render().el);
			});
			//push that array into this View's "el"
			$(this.el).append(els);
			return this;
		}
	});

	Contacts.AddContactView = Backbone.View.extend({
		initialize: function () {
			this.template = $("#add-contact-template");
			this.model = new Contacts.ContactModel();
		},
		render: function () {
			var content = this.template.tmpl();
			$(this.el).html(content);
			Backbone.ModelBinding.bind(this);
			return this;
		},
		events: {
			"click #addContact_button": "addContact"
		},
		addContact: function (event) {
			Contacts.contacts.create(this.model);
			ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
		},
		close: function () {
			this.remove();
			this.unbind();
			Backbone.ModelBinding.unbind(this);
		}
	});

	Contacts.EditContactView = Backbone.View.extend({
		initialize: function () {
			this.template = $("#edit-contact-template");
			_.bindAll(this, "editContact");
			ViewSwitcherApp.vent.bind('editContact', this.editContact);
		},
		render: function () { },
		editContact: function (contact) {
			//alert(JSON.stringify(contact));
			this.model = contact;
			var modelHolder = this.model;
			var content = this.template.tmpl(modelHolder.toJSON());
			var self = this;
			$(content)
                .appendTo('body')
                .dialog({
                	modal: true,
                	buttons: {
                		OK: function () {
                			var $dialog = $(this);

                			//                            var fn = this.model.get("firstname");
                			modelHolder.set({ firstname: $("#editFirstName").val(), lastname: $("#editLastName").val() });
                			//var newObject = $dialog.children('form').serializeObject();
                			//alert(newObject);
                			modelHolder.save(contact, {
                				success: function () {
                					$dialog.dialog('close');
                				}
                			});
                		}
                	},
                	Cancel: function () {
                		// Close the dialog:
                		$(this).dialog('close');
                	},
                	close: function (event, ui) {
                		$(this).remove();
                	}
                });
			return this;
		},
		close: function () {
			this.remove();
			this.unbind();
			//Backbone.ModelBinding.unbind(this);
		}
	});

	Contacts.show = function () {
		ViewSwitcherApp.editContactsModalRegion.show(new Contacts.EditContactView());
		ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
		ViewSwitcherApp.contactsRegion.show(new Contacts.ContactsListView({ collection: Contacts.contacts }));
		ViewSwitcherApp.showRoute("");
	};
	return Contacts;
})(ViewSwitcherApp, Backbone);


/******  these are just from initial prototype ******/
/******  VIEWONE ******/
ViewSwitcherApp.ViewOne = (function (ViewSwitcherApp, Backbone) {
	var ViewOne = {};

	ViewOne.SimpleView = Backbone.View.extend({
		template: "#viewone-template"
	});

	ViewOne.show = function () {
		ViewSwitcherApp.mainRegion.show(new ViewOne.SimpleView());
		ViewSwitcherApp.showRoute("viewone");
	};
	return ViewOne;
})(ViewSwitcherApp, Backbone);

/******  VIEWTWO ******/
ViewSwitcherApp.ViewTwo = (function (ViewSwitcherApp, Backbone) {
	var ViewTwo = {};
	ViewTwo.SimpleView = Backbone.View.extend({
		template: "#viewtwo-template"
	});

	ViewTwo.show = function () {
		ViewSwitcherApp.mainRegion.show(new ViewTwo.SimpleView());
		ViewSwitcherApp.showRoute("viewtwo");
	};
	return ViewTwo;
})(ViewSwitcherApp, Backbone);
