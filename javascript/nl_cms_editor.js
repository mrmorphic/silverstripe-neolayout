(function($) {
	/**
	 * nl_cms_editor.js is the main editing component for Neolayout views. Each such editor (there may
	 * be multiple editors on a single page or data object) has a parent .NLEditor dom element rendered
	 * by the CMS, from which this editor code bootstraps.
	 *
	 * Unlike most CMS editors, the editing behaviour of the layout is performed entirely in javascript, including
	 * the property editor form; the server side doesn't have the unsaved editing context to be able to do it.
	 *
	 * Property editing is done using a third party form library. Interfacing to that is done using nl_cms_form.js,
	 * which is a required companion to this file.
	 *
	 * On load, this is initialised with metadata about the types of components, as well as the initial layout state
	 * passed in as a json string (the internal representation for layouts). On start up, this is stored in the Model
	 * property of this editor, a native javascript object of the same structure. This object is manipulated by the editor,
	 * and it's textual representation (json) is saved back to the form element from which it was loaded. In this way, when the
	 * user clicks Save or Save and Publish on the containing page, the updated json representation of the layout gets saved back.
	 * Note that the CMS on the server really does nothing in the way of manipulating the layout; it passed it between storage
	 * and this javascript.
	 */

	$('.NLEditor').entwine({
		onmatch: function() {
			this.start(this.attr("id"));
		},

		// parsed model is stored here on init to make manipulations easy.
		// This should be able to be serialised to json at any point.
		Model: null,

		// These hold metadata we get from the server
		ComponentMetadata: null,
		ContextMetadata: null,


		AllocID: 0,

		// Start the layout editor given the form ID.
		start: function(id) {
			s = $(".markup input", this).val();

			var metadataRaw = $(".metadata", this).text();

			var metadata = $.parseJSON($('<div />').html(metadataRaw).text());

			this.setComponentMetadata(metadata.components);
			this.setContextMetadata(metadata.context);

			console.log('metadata:', metadata);

			var model = eval(s);
			this.allocateIDs(model);
			this.setModel(model);

			this.initialiseUI(this.getModel());
		},

		// assign a unique ID to each component in the model. These just facilitate getting from
		// DOM to component and vice versa. These IDs are not intended to be persisted or use in rendering,
		// just transiently in editing.
		allocateIDs: function(model) {
			model.id = this.getID();
			if (model.children && model.children.length > 0) {
				for (var i = 0; i < model.children.length; i++) {
					this.allocateIDs(model.children[i]);
				}
			}
		},

		getID: function() {
			var i = this.getAllocID() + 1;
			this.setAllocID(i);
			return i;
		},

		initialiseUI: function(componentRoot) {
			if (componentRoot.ClassName != "NLVerticalBoxLayout") {
				alert("Editor can only handle a layout where the outer container is a vertical box layout component");
				return;
			}

			$('.editor-area', this).html(this.buildMarkup(componentRoot, true));
			this.buildAvailableComponents();			
		},

		// build markup for a component. Because we basically present blocks, we don't need to know how the components will
		// present on the front end, we just need to build the blocks. This function is called recursively to build
		// markup for sub-components.
		buildMarkup: function(component, root) {
			if (component == null) {
				return '';
			}

			var metadata = this.getMetadataForComponent(component),
				tools = this.buildTools(component, root),
				label = this.splitCamelName(component.ClassName);

			// structure:
			// 	div.nl-component-editor
			//		div.centered
			//	 		div.component-toolbox
			//			div.info (not shown for boxes)
			//				img
			//				div.name
			//			div.content

			var name = this.newEl('span', label, { class: 'name'});

			var children = '';
			if (component.children) {
				for (var i = 0; i < component.children.length; i++) {
					children += this.buildMarkup(component.children[i]);
				}
			}

			var content = this.newEl('div', children, {class: 'content'});
			var img = this.newEl('img', '', {src: metadata.imageURL, class: 'component-icon'});
			var info = '';
			if (!root) {
				var info = this.newEl('div', img + name, {class:'info'});
			}
			var centered = this.newEl('div', tools + info + content, {class:'centered'});

			var properties = {
				'class': 'nl-component-editor',
				'data-component-id': component.id,
				'data-component-type': component.ClassName
			};

			return this.newEl("div", centered, properties);
			// return s;
			// switch(component.ClassName) {
			// 	case "NLVerticalBoxLayout":
			// 		return this.buildMarkupBox(component, true);
			// 	default:
			// 		return this.buildMarkupGeneric(component);
			// }
		},

		buildAvailableComponents: function() {
			var componentMetadata = this.getComponentMetadata(),
				s = '';

			// @todo filter to only those that can be added in this view.
			for (var i = 0; i < componentMetadata.length; i++) {
				var image = this.newEl('img', '', { src: componentMetadata[i].imageURL });
				var name = this.newEl('span', componentMetadata[i].name, { class: 'name' });
				var thumbnail = this.newEl('div', image + name, { class: 'thumbnail' });
				var description = this.newEl('div', '(large description of component)', { class: 'description' });
				s += this.newEl('div', thumbnail + description, { class: 'component' });
			}

			$('.available-components', this).html(s);
		},

		// Build markup to represent a box.
		// buildMarkupBox: function(component, root) {
		// 	s = this.buildTools(component, root);
		// 	for (var i = 0; i < component.children.length; i++) {
		// 		s += this.buildMarkup(component.children[i]);
		// 	}

		// 	var classes = this.componentBinding(component, "Orientation") == "Horizontal" ? "nl-editor-box-horizontal" : "nl-editor-box-vertical";
		// 	classes += " nl-component-editor";
		// 	s = this.newEl("div", s, {class: classes, "data-component-id": component.id});

		// 	return s;
		// },

		buildTools: function(component, root) {
			var s = "";
			s += this.newToolButton('edit', 'Edit');
			if (!root) {
				// can't delete root item, but can nested boxes can be deleted.
				s += this.newToolButton('remove', 'Remove');
			}
			s = this.newEl("div", s, {class: "component-toolbox"});
			return s;
		},

		newToolButton: function(action, caption) {
			return this.newEl(
				"span",
				this.newEl("a", caption, {href: "#"}),
				{class:"tool-button action-" + action}
			);
			return s;
		},

		// Helper function that given a name in camel caps will split with spaces. If prefixed 'NL', that prefix will be removed.
		// If suffixed 'Component', that suffix will be removed.
		splitCamelName: function(s) {
			s = s.replace(/^NL/, '');
			s = s.replace(/Component$/, '');
			return s.replace(/([A-Z])/g, " $1").trim();
		},

		componentBinding: function(component, name) {
			if (!component) return null;
			if (!component.bindings) return null;
			if (!component.bindings[name]) return null;
			if (!component.bindings[name].value) return null;
			return component.bindings[name].value;
		},

		// Show a modal dialog with the specified content.
		showDialog: function(content) {
			$(".popup .popup-inner", this).html(content);
			var w = this.width();
			$(".popup", this).width((w - 30) + "px").attr("left", "15px");
			$(".popup", this).addClass("visible");
		},

		// Hide the modal dialog.
		hideDialog: function() {
			$(".popup", this).removeClass("visible");
		},

		AddSelectionCallback :  null,

		// Show dialog for adding components.
		showAddDialog: function(options) {
			var s = this.newEl("h2", "Add a component");
			s += this.newEl("div", "Click on a component in the list below to add it to your layout");

			s += $(".component-types", this).html();

			s += this.newEl("div", this.newToolButton("cancel", "Cancel"));

			this.setAddSelectionCallback((options && options.onselection) ? options.onselection : null);

			this.showDialog(s);
		},

		addComponentCallback: function (type) {
			var fn = this.getAddSelectionCallback();
			if (fn) fn(type);
			this.hideDialog();
		},

		// Show dialog for editing components. The dialog is constructed programmatically using metadata about the
		// type of component, and the component's actual bound values.
		showEditDialog: function($component) {
			var self = this;
			var s = this.newEl('h2', 'Edit');
			s += this.newEl('div', '', { class: 'form property-editor'});

			// Show the dialog first without the form. loadPropertyEditor will inject the form.
			this.showDialog(s);

			var componentID = $component.attr("data-component-id");
			var component = this.findComponentInModel(componentID)

			this.loadPropertyEditor({
				element: $('.popup .form'),
				component: component,
				callback: function(saved) {
					if (saved) {
						self.modelChanged();
					}
					self.hideDialog();
				}
			});
		},

		// helper to return markup for a new element
		newEl: function(element, content, options) {
			var s = '<' + element;
			for (var prop in options) s += ' ' + prop + '="' + options[prop] + '"';
			s += '>' + content + '</' + element + '>';
			return s;
		},

		newComponent: function(type) {
			var o = {
				ClassName: type,
				id: this.getID()
			};
			return o;
		},

		// Given an ID, return the model object with that id.
		findComponentInModel: function(id) {
			return this.findComponentInModelSubtree(this.getModel(), id); // just search whole tree
		},

		findComponentInModelSubtree: function(tree, id) {
			if (tree.id && tree.id == id) return tree;
			if (!tree.children) return null;
			for (var i = 0; i < tree.children.length; i++) {
				var r = this.findComponentInModelSubtree(tree.children[i], id);
				if (r) return r;
			}
			return null;
		},

		// find parent of child with specified id
		findParentInModel: function(id) {
			return this.findParentInModelSubtree(this.getModel(), id);
		},

		findParentInModelSubtree: function (tree, id) {
			if (!tree.children || tree.children.length == 0) return null; // not a parent

			// if any direct children have that id, we're the parent
			for (var i = 0; i < tree.children.length; i++) {
				var child = tree.children[i];
				if (child.id && child.id == id) return tree;
			}

			// otherwise recurse into the children
			for (var i = 0; i < tree.children.length; i++) {
				var r = findParentInModelSubtree(tree.children[i], id);
				if (r != null) return r;
			}

			return null;
		},

		addComponentChild: function(modelParent, modelChild) {
			if (!modelParent.children) modelParent.children = [];
			modelParent.children.push(modelChild);

			this.modelChanged();
		},

		removeComponentByID: function(id) {
			var parent = this.findParentInModel(id);
			if (parent == null || !parent.children) return;  // not much we can do here
			var i = 0;
			while (i < parent.children.length && parent.children[i].id != id) i++;
			if (i < parent.children.length) {
				parent.children = parent.children.splice(i, 1);
			}

			this.modelChanged();
		},

		// Given a component, return the component type's metadata object, as injected by the form editor.
		getMetadataForComponent: function(component) {
			var m = this.getComponentMetadata();
			console.log('getMetadataForComponent looking at:', m);

			for (var i = 0; i < m.length; i++) {
				if (m[i].componentType && m[i].componentType === component.ClassName) {
					return m[i];
				}
			}

			return null;
		},

		// Called whenever the model is changed, this updates the json representation of the model so a save
		// will send this serialised form to where it is persisted.
		modelChanged: function() {
			var s = JSON.stringify(this.getModel());
			$(".markup input", this).val(s);
		}
	});

	$('.NLEditor .nl-component-editor').entwine({
		onmouseover: function(e) {
			this.addClass('hover');
			$('>div >.component-toolbox', this).addClass('visible');
			return false;
		},

		onmouseout: function(e) {
			this.removeClass('hover');
			$('>div >.component-toolbox', this).removeClass('visible');
		}

	});

	$('.nl-editor-box-vertical').entwine({
		addComponentByType: function(type) {
			alert("vertical box adding " + type);
			// construct a component
			var editor = this.closest(".NLEditor");
			var component = editor.newComponent(type);

			// find model for the vertical box, and add the new component.
			var parent = editor.findComponentInModel($(this).attr("data-component-id"));
			editor.addComponentChild(parent, component);

			// re-render this vertical box and replace it's HTML
			var s = editor.buildMarkup(parent);
			this.html(s);
		}
	});

	// // Handle adding a component to a vertical toolbox
	// $('.nl-editor-box-vertical > .component-toolbox .tool-button.action-add').entwine({
	// 	onclick: function() {
	// 		var self = this;
	// 		this.closest(".NLEditor").showAddDialog({
	// 			onselection: function(selected) {
	// 				self.closest(".nl-editor-box-vertical").addComponentByType(selected);
	// 			}
	// 		});
	// 		return false;
	// 	}
	// });

	$('.NLEditor .tool-button.action-edit').entwine({
		onclick: function() {
			var component = this.closest(".nl-component-editor");
			this.closest(".NLEditor").showEditDialog(component);
			return false;
		}
	});

	$('.NLEditor .tool-button.action-remove').entwine({
		onclick: function() {
			var editor = this.closest(".NLEditor");
			var comp = this.closest(".nl-component-editor");
			editor.removeComponentByID(comp.attr("data-component-id"));
			comp.remove();
			return false;
		}
	});

	$('.NLEditor .popup .tool-button.action-cancel').entwine({
		onclick: function() {
			this.closest(".NLEditor").hideDialog();
			return false;
		}
	});

	$('.NLEditor .popup .component-definition').entwine({
		onclick: function() {
			var type = this.attr("data-component-type");
			this.closest(".NLEditor").addComponentCallback(type);
			return false;
		}
	});
})(jQuery);