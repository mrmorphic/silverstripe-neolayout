<?php

/**
 * NLLinkComponent represents a link on a layout. It can be a plain link, or can contain one child component, such as an image.
 * The URL can be explicitly provided, or can be a reference to a page in the site.
 */
class NLLinkComponent extends NLComponent {

	function maxChildren() {
		return "0:1";
	}

	static public function get_metadata() {
		return array(
			"name" => "Link",
			"description" => "Link to this site or another site",
			"imageURL" => null,
			"display" => "inline",
			"properties" => array(
				"ExternalURL" => array(
					"name" => "URL",
					"type" => "Varchar",
					"description" => "If the link is to external website, this contains the URL."
				),
				"InternalPage" => array(
					"name" => "Site page",
					"type" => "NLObjectReference('SiteTree')",
					"description" => "If the link to is a page on this website, this is the selected page."
				),
				"LinkText" => array(
					"name" => "Link text",
					"type" => "Text",
					"description" => "Text to display in the link if no other components are put into the link."
				)
			)
		);
	}

	function renderContent($context) {
		$v = $this->getBindingValues($context);

		$page = $v->InternalPage;
		$url = null;
		if ($page) {
			if ($page->hasMethod("Link")) {
				$url = $page->Link();
			}
		}
		if (!$url) {
			$url = $v->ExternalURL;
		}

		$content = "";
		if (count($this->children) > 0) {
			foreach ($this->children as $child) {
				$content .= $child->render($context);
			}
		} else {
			$content = $v->LinkText;
		}

		return "<a href=\"{$url}\">$content</a>";
	}
}
