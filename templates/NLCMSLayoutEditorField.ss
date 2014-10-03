<div id="$EditorID" class="NLEditor" data-view-controller-url="$ViewControllerURL">
	<div class="popup">
		<div class="popup-inner">
			This is some content in the popup
		</div>
	</div>
	<div class="component-types">
		<% loop ComponentTypes %>
			<div class="component-definition" data-component-type="$componentType">
				<img src="$imageURL" class="preview"/>
				<div class="name">$name</div>
				<div class="description">$description</div>
			</div>
		<% end_loop %>
	</div>
	<div class="markup">$Field</div>
</div>
