/******  CONTACTS ******/
ViewSwitcherApp.Contacts = (function (ViewSwitcherApp, Backbone) {
	var Contacts = {};
	Contacts.PhoneNumber = Backbone.Model.extend({
		defaults:{
			id: null,
			number : ""
		}
	});
	Contacts.PhoneNumbers = Backbone.Collection.extend({
		model: Contacts.PhoneNumber
	});
	
	Contacts.ContactModel = Backbone.Model.extend({
		urlRoot: "Contact",
		defaults: {
			id: null,
			firstname: "",
			lastname: "",
			phonenumbers : new Contacts.PhoneNumbers()
		},
		initialize: function(){
			this.phonenumbers = new Contacts.PhoneNumbers()
			var memento = new Backbone.Memento(this);
		    _.extend(this, memento);
		},
		addPhoneNumber : function(number){
			var pn = this.get('phonenumbers');
			var phoneNumber = new Contacts.PhoneNumber({number:"222-222-2222"});
			pn.add(phoneNumber);
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
			_.bindAll(this, "render");
		},
		events: {
			"click span.contact-details" : "details",
			"click span.remove-contact": "remove",
			"click span.edit-contact": "edit"
		},
		render: function () {
			//render the jQuery template
			//var content = this.template.tmpl(this.model.toJSON());
			//take the rendered HTML and pop it into the DOM
			var path = "/template/Contacts/Contact";
			var self = this;
			console.log(path);
			$.get(path, function(markup) {
				$.template( "contacttemplate", markup );
				var content = $.tmpl("contacttemplate", self.model.toJSON());

				$(self.el).html(content);
			});


			return this;
		},
		details: function(){
			ViewSwitcherApp.mainRegion.show(new Contacts.ContactDetailsView({model:this.model}));
			ViewSwitcherApp.showRoute("details/" + this.model.id);
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
		render: function () {
			var path = "/template/Contacts/AddContact";
			var self = this;
			console.log(path);
			$.get(path, function(markup) {
				$.template( "addcontacttemplate", markup );
				var content = $.tmpl("addcontacttemplate", this.model);

				$(self.el).html(content);
				$("#add-contact-form").validate();
				Backbone.ModelBinding.bind(self);
			});

			return this;
		},
		events: {
			"click #addContact_button": "addContact"			
		},
		addContact: function (event) {
			if($("#add-contact-form").valid())
			{
				this.model.addPhoneNumber("222-222-2222");
				
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
	
	Contacts.ContactDetailsView = Backbone.View.extend({
		initialize: function () {
			this.template = $("#contact-details-template");
			//this.model.bind("change", this.render);
		},
		render: function () {
			var path = "/template/Contacts/ContactDetails";
			var self = this;
			console.log(path);
			$.get(path, function(markup) {
				$.template( "contactdetailstemplate", markup );
				var content = $.tmpl("contactdetailstemplate", self.model.toJSON());

				$(self.el).html(content);
			});

			return this;
		}
	});

	Contacts.EditContactView = Backbone.View.extend({
        initialize: function () {
			this.template = $("#edit-contact-template");
			//_.bindAll(this, "editContact");
			//ViewSwitcherApp.vent.bind('editContact', this.editContact);
		},
        onShow: function(){
            var self = this;
            var content = this.template.tmpl();
            $(this.el).html(content);
            Backbone.ModelBinding.bind(this);
			self.model.store();
            $("#edit-contact-form").validate();

            $(this.el).dialog({
                modal: true,
                buttons:{
                    "Update Contact": function(){
                    	if($("#edit-contact-form").valid()) {
							self.model.save(self.model, {
	                            success: function () {
	                                $(this).dialog('close');
	                                self.close();
	                            }
	                        });
						}
                    },
                    cancel: function () {
                        // Close the dialog:
                        self.model.restore();
                        $(this).dialog('close');
                        self.close();
                    }
                },
                close: function(event, ui) {
                    	if(!$("#edit-contact-form").valid()){                    		
							self.model.restore();
						}
						if(!self.model.hasChanges){
							self.model.restore();
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
	var init = false;
	Contacts.show = function (id) {
		//ViewSwitcherApp.editContactsModalRegion.show(new Contacts.EditContactView());
		if(id){
			var contactDetail = new Contacts.ContactModel({id: id});
			contactDetail.fetch({
					 success: function(model, response){						
						 ViewSwitcherApp.mainRegion.show(new Contacts.ContactDetailsView({model:model}));
						 //ViewSwitcherApp.showRoute("details/" + model.id);
					 }
			});
		}else{
			ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
			//ViewSwitcherApp.showRoute("contacts");
		}
		if(!init){
			ViewSwitcherApp.contactsRegion.show(new Contacts.ContactsListView({ collection: Contacts.contacts }));
			init = true;
		}
	};
	return Contacts;
})(ViewSwitcherApp, Backbone);
