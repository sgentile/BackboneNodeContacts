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
			this.phonenumbers = new Contacts.PhoneNumbers();
			var memento = new Backbone.Memento(this);
		    _.extend(this, memento);
		},
		addPhoneNumber : function(number){
			//this.phonenumbers.reset(this.get('phonenumbers'));
			var phoneNumber = new Contacts.PhoneNumber({number:number});
			this.phonenumbers.add(phoneNumber);
		}
	});
	
	Contacts.ContactModels = Backbone.Collection.extend({
		model: Contacts.ContactModel,
		url: "Contact"
	});

	Contacts.contacts = new Contacts.ContactModels();

	Contacts.ContactView = Backbone.View.extend({
		tagName: 'dd',
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
			if(confirm("Are you sure you want to delete this contact?")){
				this.model.destroy();
				Contacts.show();
			}
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
			Contacts.contacts.reset();
			Contacts.contacts.fetch({ add: true });			
		},
		render: function () {
			$(this.el).empty();
			var els = [];
			this.collection.models.forEach(function (contact) {
				var view = new Contacts.ContactView({ model: contact });
				var newel = view.render().el;
				els.push(newel);
				$(newel).attr('id', contact.get('id'));
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
				$('#status').empty();
				
				Contacts.contacts.create(this.model, {
					success: function(model, response){
						var successel = $("<div id='successmessage'></div>");
						successel.text(model.get('id'));
						$('#status').append(successel);

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
			//this.model.bind('change', this.render);
		},
		events:{
			"click #add-phone-number" : "showAddPhoneNumber",
			"click .remove-number" : "removePhoneNumber"
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
		},
		showAddPhoneNumber : function(){
			ViewSwitcherApp.addPhoneNumberRegion.show(new Contacts.AddPhoneNumberView({model:this.model}));
		},
		removePhoneNumber : function(item){
			if(confirm("Remove this phone number?")){
				var phoneId = $(item.currentTarget).data("pn");
	
				var phoneNumber = _.find(this.model.get("phonenumbers"), function(number){
					return number.id === phoneId;
				});
				//var pn = this.model.get("phonenumbers");
				var updatedNumbers = _.without(this.model.get("phonenumbers"), phoneNumber);
				this.model.set({phonenumbers:updatedNumbers});
				//this.model.set("phonenumbers", phoneNumbers)
				console.log(JSON.stringify(this.model));
				this.model.save();	
				ViewSwitcherApp.mainRegion.show(new Contacts.ContactDetailsView({model:this.model}));
			}
		}
	});
	
	Contacts.AddPhoneNumberView = Backbone.View.extend({
		el: "#addPhoneNumberRegion",
		render: function(){
			var path = "/template/Contacts/AddPhoneNumber";
			var self = this;
			console.log(path);
			$.get(path, function(markup) {
				$.template( "addphonenumbertemplate", markup );
				var content = $.tmpl("addphonenumbertemplate", self.model.toJSON());

				$(self.el).html(content);
			});

			return this;
		}, 
		events:{
			"click #add-new-phonenumber" : "addPhoneNumber"		
		},
		addPhoneNumber : function(){
			var pn = this.model.get("phonenumbers");
			pn.push(new Contacts.PhoneNumber({number:$("#phonenumber").val()}));
			this.model.save();
			ViewSwitcherApp.mainRegion.show(new Contacts.ContactDetailsView({model:this.model}));	
		}
	});

	Contacts.EditContactView = Backbone.View.extend({
        initialize: function () {
			this.template = $("#edit-contact-template");
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
					 	model.parse(response);
					 	ViewSwitcherApp.mainRegion.show(new Contacts.ContactDetailsView({model:model}));
						 //ViewSwitcherApp.showRoute("details/" + model.id);
					 },
					 error: function() {
                		alert("error");
            		}
			});
		}else{
			ViewSwitcherApp.mainRegion.show(new Contacts.AddContactView());
			ViewSwitcherApp.showRoute("contacts");
		}
		//if(!init){
			ViewSwitcherApp.contactsRegion.show(new Contacts.ContactsListView({ collection: Contacts.contacts }));
		//	init = true;
		//}
	};
	return Contacts;
})(ViewSwitcherApp, Backbone);
