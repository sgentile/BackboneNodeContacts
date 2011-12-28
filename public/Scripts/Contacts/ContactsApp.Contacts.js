/******  CONTACTS ******/
ViewSwitcherApp.Contacts = (function (ViewSwitcherApp, Backbone) {
	var Contacts = {};
	Contacts.ContactModel = Backbone.Model.extend({
		defaults: {
			id: null,
			firstname: "",
			lastname: ""
		}
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
			//ViewSwitcherApp.vent.trigger("editContact", this.model);
            ViewSwitcherApp.editContactsModalRegion.show(new Contacts.EditContactView({model:this.model}));
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
			//_.bindAll(this, "editContact");
			//ViewSwitcherApp.vent.bind('editContact', this.editContact);
		},
        onShow: function(){
            //var self = this;
            //var content = this.template.tmpl(self.model.toJSON());
            var self = this;
            var content = this.template.tmpl();
            $(this.el).html(content);
            Backbone.ModelBinding.bind(this);

            $("#edit-contact-form").validate();

            $(this.el).dialog({
                modal: true,
                buttons:{
                    "Update Contact": function(){
                        self.model.save(self.model, {
                            success: function () {
                                $(this).dialog('close');
                                self.close();
                            }
                        });
                    },
                    cancel: function () {
                        // Close the dialog:
                        $(this).dialog('close');
                        self.close();
                    }
                }
            });
        },
		render: function () { 
			console.log('render');
		},
		close: function () {
			this.remove();
			this.unbind();
			Backbone.ModelBinding.unbind(this);
		}
	});

	Contacts.show = function () {
		//ViewSwitcherApp.editContactsModalRegion.show(new Contacts.EditContactView());
		ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
		ViewSwitcherApp.contactsRegion.show(new Contacts.ContactsListView({ collection: Contacts.contacts }));
		ViewSwitcherApp.showRoute("");
	};
	return Contacts;
})(ViewSwitcherApp, Backbone);