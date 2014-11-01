<?php

/**
 * NLImageComponent shows an image in a layout. The source of the image can be via an explicit URL, and can also be a reference
 * to an Image object.
 */
class NLImageComponent extends NLComponent {

	static public function get_metadata() {
		return array(
			"name" => "Image",
			"description" => "An image, from this site or another",
			"imageURL" => null,
			"display" => "inline",
			"properties" => array(
				"ExternalURL" => array(
					"name" => "URL",
					"type" => "Varchar",
					"description" => "If the image is external to site or not in assets, this contains the URL."
				),
				"InternalImage" => array(
					"name" => "Site image",
					"type" => "NLObjectReference('Image')",
					"description" => "If the image is on this site, this is the selected image."
				),
				"AltText" => array(
					"name" => "Alt text",
					"type" => "Text",
					"description" => "Alt text of the image."
				),
				"ResizingOption" => array(
					"name" => "Resizing",
					"type" => "Enum('Resized,Scaled,Padded','Resized')",
					"description" => "If the image is to be displayed in a different sized area, this determines how it is resized (images on this site only)."
				)
			)
		);
	}

	function renderContent($context) {
		$v = $this->getBindingValues($context);

		$intImage = $v->InternalImage;
		if ($intImage) {
			// @todo handle resize etc
			return $intImage;
		}

		$url = $v->ExternalURL;
		$altText = $v->AltText;
		if ($altText) $altText = "alt=\"$altText\"";

		return "<img src=\"$url\" $altText />";
	}
}