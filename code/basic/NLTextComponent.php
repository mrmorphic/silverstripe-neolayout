<?php

/**
 * Represent a component with a piece of text.
 */
class NLTextComponent extends NLComponent
{

    public static function get_metadata()
    {
        return array(
            "name" => "Text",
            "description" => "Rich text",
            "imageURL" => null,
            "display" => "inline",
            "properties" => array(
                "Text" => array(
                    "name" => "Text",
                    "type" => "Text|Varchar|HTMLText",
                    "description" => "The text that will display"
                )
            )
        );
    }

    public function renderContent($context)
    {
        $v = $this->getBindingValues($context);
        return $v->Text;
    }
}
