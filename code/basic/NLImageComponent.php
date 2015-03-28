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
					"type" => "Enum('None,Resized,Scaled,Padded,Cropped,ResizeToHeight,ResizeToWidth','None')",
					"description" => "If the image is to be displayed in a different sized area, this determines how it is resized (images on this site only)."
				),
				"Width" => array(
					"name" => "Width",
					"type" => "Int",
					"description" => "If provided, the width of the image in pixels, used for resizing."
				),
				"Height" => array(
					"name" => "Height",
					"type" => "Int",
					"description" => "If provided, the height of the image in pixels, used for resizing."
				)
			)
		);
	}

	function renderContent($context) {
		$v = $this->getBindingValues($context);

		$intImage = $v->InternalImage;
		if ($intImage) {
			// Reference to an internal image.
			return $this->getInternalImage($intImage, $v);
		}

		$url = $v->ExternalURL;
		$altText = $v->AltText;
		if ($altText) $altText = "alt=\"$altText\"";

		return "<img src=\"$url\" $altText />";
	}

	// Render an image on the site. $imageRef is an image object, which we expect will be
	function getInternalImage($image, $values) {
		// Debug::show("image:" . print_r($imageRef, true));

		// $parts = explode(":", $value);
		// Debug::show("parts:" . print_r($parts, true));
		// if (!is_array($parts) || count($parts) != 2 || !ClassInfo::exists($parts[0]) || !is_numeric($parts[1])) {
		// 	// invalid reference
		// 	return "";
		// }

		// // Get this object
		// $image = DataObject::get_by_id($parts[0], $parts[1]);
		// if (!$image) {
		// 	return "";
		// }

		// Ensure this instance is an Image or a descendent. Should always be OK, ORM shouldn't
		// return otherwise.
		if (!($image instanceof Image)) {
			return "";
		}

		// Handle resizing
		$resizeOption = $values->ResizingOption;

		// Get width and height properties, if any
		// @todo get width and height, don't resize if these are absent.
		$width = $values->Width;
		$height = $values->Height;

		switch ($resizeOption) {
			case 'Resized':
				if ($width && $height) {
					$image = $image->ResizedImage($width, $height);
				}
				break;
			case 'Scaled':
				if ($width && $height) {
					$image->resizeRatio($width, $height); // Resizes an image with max width and height
				}
				break;
			case 'Padded':
				if ($width && $height) {
					$image->paddedResize($width, $height); // Adds padding after resizing to width or height.
				}
				break;
			case 'Cropped':
				if ($width && $height) {
					$image->croppedImage($width, $height); // Crops the image from the centre, to given values.
				}
				break;
			case 'ResizeToHeight':
				if ($height) {
					$image->resizeByHeight($height); // Maximum height the image resizes to, keeps proportion
				}
				break;
			case 'ResizeToWidth':
				if ($width) {
					$image->resizeByWidth($width); // Maximum width the image resizes to, keeps proportion 
				}
				break;
			default: // including None
				break;
		}

		// Generate the markup.
		return $image->forTemplate();
	}
}