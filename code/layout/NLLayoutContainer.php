<?php

/**
 * layout container component, which logically acts the top-level container for a layout. 
 * When an NLView is constructed, this component is always at the top of the hierarchy,
 * It should not be removed, and new instances should not be added as childen.
 */
class NLLayoutContainer extends NLLayoutComponent
{

    public static function get_metadata()
    {
        return array(
            "name" => "Layout container",
            "description" => "Top-level container for a layout area",
            "imageURL" => null
        );
    }

    public function renderContent($context)
    {
        $content = "";
        if ($this->children) {
            foreach ($this->children as $child) {
                $content .= $child->render($context);
            }
        }
        return $content;
    }
}
