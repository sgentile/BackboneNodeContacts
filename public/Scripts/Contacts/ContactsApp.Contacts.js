/******  CONTACTS ******/
ViewSwitcherApp.Contacts = (function (ViewSwitcherApp, Backbone) {
	var Contacts = {};
	Contacts.ContactModel = Backbone.Model.extend({
		defaults: {
			id: null,
			firstname: "",
			lastname: ""
		},
	});
	Contacts.ContactModels = Backbone.Collection.extend({
		model: Contacts.ContactModel,
		url: "Contact"
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
		initialize: function () {
			_.bindAll(this, "render");
			this.collection.bind("change", this.render);
			this.collection.bind("add", this.render);
			this.collection.bind("fetch", this.render);
			this.collection.bind('remove', this.render);

			Contacts.contacts.fetch({ add: true });
		},
		render: function () {
			$(this.el).empty();
			var els = [];
			this.collection.models.forEach(function (contact) {
				var view = new Contacts.ContactView({ model: contact });
				els.push(view.render().el);
			});
			$(this.el).append(els);
			return this;
		}
	});

	Contacts.AddContactView = Backbone.View.extend({
		initialize: function () {
			this.template = $("#add-contact-template");
			this.model = new Contacts.ContactModel();
			//this.model.bind('error', this.handleError);	
			
		},
		//handleError: function(model, errors){
		//	alert(JSON.stringify(errors));
		//},
		render: function () {
			var content = this.template.tmpl();
			$(this.el).html(content);
			Backbone.ModelBinding.bind(this);
			$("#add-contact-form").validate();	
			return this;
		},
		events: {
			"click #addContact_button": "addContact"			
		},
		addContact: function (event) {
			if($("#add-contact-form").valid())
			{
				Contacts.contacts.create(this.model, {
					success: function(model, response){
						ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
					}
				});
			}
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
		render: function () { 
			console.log('render');
		},
		editContact: function (contact) {
			var self = this;
			this.model = contact;
			//var content = this.template.tmpl(modelHolder.toJSON());
			var content = this.template.tmpl(this.model.toJSON());
			$(content)
                .appendTo('body')
                .dialog({
                	modal: true,
                	buttons: {
                		"Update Contact": function () {
                			var $dialog = $(this);
							self.model.set({ 
								firstname: $("#firstName").val(), 
								lastname: $("#lastname").val() 
							});
							console.log(self.model.get("firstname"));
                			self.model.save(self.model, {
                				success: function () {
                					$dialog.dialog('close');
                				}
                			});
                		},
							cancel: function () {
		                		// Close the dialog:
		                		$(this).dialog('close');
		                	}
                	},
					open : function(){
						console.log('open');
					},
					create:function(){
						console.log('create');
						
					},
                	close: function (event, ui) {
                		$(this).remove();
                	}
                });
			console.log('prebind');
			return this;
		},
		close: function () {
			this.remove();
			this.unbind();
			Backbone.ModelBinding.unbind(this);
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
