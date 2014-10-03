(function($) {

	/**
	 * Load folder detail view via controller methods
	 * rather than built-in GridField view (which is only geared towards showing files).
	 */
	$('.NLEditor').entwine({
		onmatch: function() {
			this.start(this.attr("id"));
		},

		// parsed model is stored here on init to make manipulations easy.
		// This should be able to be serialised to json at any point.
		Model: null,

		AllocID: 0,

		// Start the layout editor given the form ID.
		start: function(id) {
			s = $(".markup input", this).val();

			var model = eval(s);
			this.allocateIDs(model);
			console.log(model);
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
			if (componentRoot.ClassName != "NLBoxLayout" ||
				this.componentBinding(componentRoot, "Orientation") != "Vertical") {
				alert("Editor can only handle a layout where the outer container is a vertical box layout component");
				return;
			}

			this.html(this.html() + this.buildMarkup(componentRoot));
		},

		// build markup for a component. Because we basically present blocks, we don't need to know how the components will
		// present on the front end, we just need to build the blocks
		buildMarkup: function(component) {
			if (component == null) return "";
			switch(component.ClassName) {
				case "NLBoxLayout":
					return this.buildMarkupBox(component);
				default:
					return this.buildMarkupGeneric(component);
			}
		},

		buildMarkupBox: function(component) {
			s = this.buildBoxTools(component);
			for (var i = 0; i < component.children.length; i++) {
				s += this.buildMarkup(component.children[i]);
			}

			var classes = this.componentBinding(component, "Orientation") == "Horizontal" ? "nl-editor-box-horizontal" : "nl-editor-box-vertical";
			classes += " nl-component-editor";
			s = this.newEl("div", s, {class: classes, "data-component-id": component.id});

			return s;
		},

		buildBoxTools: function(component) {
			var s = "";
			s += this.newToolButton('add', 'Add');
			s += this.newToolButton('edit', 'Edit');
			// s += this.addToolButton('remove', 'Remove');  // @todo nested may have it
			s = this.newEl("div", s, {class: "component-toolbox"});
			return s;
		},

		buildGenericTools: function(component) {
			var s = "";
			s += this.newToolButton('edit', 'Edit');
			s += this.newToolButton('remove', 'Remove');

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

		buildMarkupGeneric: function(component) {
			var s = this.buildGenericTools(component);
			s += this.splitCamelName(component.ClassName);

			s = this.newEl("div", s);
			s = this.newEl("div", s, {class: "nl-editor-generic nl-component-editor", "data-component-id": component.id});
			return s;
		},

		// Helper function that given a name in camel caps will split with spaces. If prefixed 'NL', that prefix will be removed.
		splitCamelName: function(s) {
			if (s.substr(0, 2) == "NL") s = s.substr(2);
			return s.replace(/([A-Z])/g, " $1").trim();
		},

		componentBinding: function(component, name) {
			if (!component) return null;
			if (!component.bindings) return null;
			if (!component.bindings[name]) return null;
			if (!component.bindings[name].value) return null;
			return component.bindings[name].value;
		},

		// Show the dialog
		showDialog: function(content) {
			$(".popup .popup-inner", this).html(content);
			var w = this.width();
			$(".popup", this).width((w - 30) + "px").attr("left", "15px");
			$(".popup", this).addClass("visible");
		},

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

		showEditDialog: function($component) {
			var self = this;
			var s = this.newEl("h2", "Edit");
			var componentID = $component.attr("data-component-id");
			var url = this.attr("data-view-controller-url") + "/EditForm/" + componentID;
			$.ajax({
				url: url,
				success: function(data, textStatus, xhr) {
					s += data;
					s += self.newEl("div", self.newToolButton("save", "Save") + self.newToolButton("cancel", "Cancel"));

					self.showDialog(s);
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


		// Called whenever the model is changed, this updates the json representation of the model so a save
		// will send this serialised form to where it is persisted.
		modelChanged: function() {
			var s = JSON.stringify(this.getModel());
			$(".markup input", this).val(s);
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

	// Handle adding a component to a vertical toolbox
	$('.nl-editor-box-vertical > .component-toolbox .tool-button.action-add').entwine({
		onclick: function() {
			var self = this;
			this.closest(".NLEditor").showAddDialog({
				onselection: function(selected) {
					self.closest(".nl-editor-box-vertical").addComponentByType(selected);
				}
			});
			return false;
		}
	});

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